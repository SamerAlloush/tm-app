import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useMessaging } from '../../context/MessagingContext';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useLocalSearchParams } from 'expo-router';

const MessageDetail = () => {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const { 
    selectedConversation, 
    createNewMessage,
    markAsRead,
    deleteConversation,
    getConversationById
  } = useMessaging();
  
  const [replyText, setReplyText] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const scrollViewRef = useRef();

  useEffect(() => {
    if (id) {
      const conversation = getConversationById(id);
      if (conversation) {
        markAsRead(conversation.id);
      }
    }
  }, [id, getConversationById, markAsRead]);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "We need access to your photos to attach images."
      );
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        setAttachments([...attachments, ...result.assets.map(asset => ({
          uri: asset.uri,
          type: 'image',
          name: asset.fileName || `image_${Date.now()}.jpg`
        }))]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSendReply = async () => {
    if (replyText.trim() === '' && attachments.length === 0) return;
    
    try {
      setIsSending(true);
      
      await createNewMessage(
        selectedConversation.participants.filter(p => p !== 'currentUser@company.com'),
        selectedConversation.subject,
        replyText,
        attachments
      );
      
      setReplyText('');
      setAttachments([]);
      
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      Alert.alert("Error", "Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteConversation = () => {
    Alert.alert(
      "Delete Conversation",
      "Are you sure you want to delete this conversation?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            deleteConversation(selectedConversation.id);
            navigation.goBack();
          }
        }
      ]
    );
  };

  if (!selectedConversation) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="email" size={50} color="#ccc" />
        <Text style={styles.emptyText}>Select a conversation to view messages</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={90}
    >
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {selectedConversation.messages.map((message) => (
          <View 
            key={message.id} 
            style={[
              styles.messageBubble,
              message.sender === 'currentUser@company.com' 
                ? styles.sentMessage 
                : styles.receivedMessage
            ]}
          >
            <View style={styles.messageHeader}>
              <Text style={styles.senderText}>
                {message.sender === 'currentUser@company.com' ? 'You' : message.sender}
              </Text>
              <Text style={styles.timeText}>
                {new Date(message.timestamp).toLocaleString()}
              </Text>
            </View>
            
            <Text style={styles.messageText}>{message.content}</Text>
            
            {message.attachments && message.attachments.length > 0 && (
              <View style={styles.attachmentsContainer}>
                {message.attachments.map((attachment, idx) => (
                  <Image
                    key={idx}
                    source={{ uri: attachment.uri }}
                    style={styles.attachmentImage}
                    resizeMode="contain"
                  />
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
      
      {attachments.length > 0 && (
        <ScrollView 
          horizontal 
          style={styles.attachmentsPreview}
          contentContainerStyle={styles.attachmentsPreviewContent}
        >
          {attachments.map((attachment, index) => (
            <View key={index} style={styles.attachmentPreview}>
              <Image
                source={{ uri: attachment.uri }}
                style={styles.previewImage}
              />
              <TouchableOpacity 
                style={styles.removeAttachmentButton}
                onPress={() => removeAttachment(index)}
              >
                <Icon name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
      
      <View style={styles.replyContainer}>
        <View style={styles.replyInputContainer}>
          <TouchableOpacity 
            style={styles.attachmentButton}
            onPress={pickImage}
            disabled={isSending}
          >
            <Icon name="attach-file" size={24} color="#666" />
          </TouchableOpacity>
          
          <TextInput
            style={styles.replyInput}
            placeholder="Type your reply..."
            multiline
            value={replyText}
            onChangeText={setReplyText}
            editable={!isSending}
          />
          
          <TouchableOpacity 
            style={styles.sendButton}
            onPress={handleSendReply}
            disabled={(replyText.trim() === '' && attachments.length === 0) || isSending}
          >
            {isSending ? (
              <ActivityIndicator size="small" color="#007bff" />
            ) : (
              <Icon 
                name="send" 
                size={24} 
                color={
                  (replyText.trim() === '' && attachments.length === 0) || isSending 
                    ? '#ccc' 
                    : '#007bff'
                } 
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 15,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#dcf8c6',
    borderTopRightRadius: 0,
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderTopLeftRadius: 0,
    elevation: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  senderText: {
    fontWeight: 'bold',
    color: '#333',
  },
  timeText: {
    color: '#666',
    fontSize: 12,
    marginLeft: 10,
  },
  messageText: {
    color: '#333',
    fontSize: 16,
  },
  attachmentsContainer: {
    marginTop: 8,
  },
  attachmentImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 8,
  },
  replyContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
    padding: 10,
  },
  attachmentsPreview: {
    maxHeight: 100,
    marginBottom: 5,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  attachmentsPreviewContent: {
    flexDirection: 'row',
    padding: 10,
  },
  attachmentPreview: {
    position: 'relative',
    marginRight: 10,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  removeAttachmentButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  replyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attachmentButton: {
    padding: 8,
  },
  replyInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    padding: 10,
    marginHorizontal: 5,
    maxHeight: 120,
    fontSize: 16,
  },
  sendButton: {
    padding: 8,
  },
});

export default MessageDetail;