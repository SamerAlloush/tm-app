import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  KeyboardAvoidingView,
  Platform, 
  ActivityIndicator,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMessaging } from '../../context/MessagingContext';
import { useAuth } from '../../context/AuthContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import { uploadFile } from '../../utils/storage';

const MessageDetail = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { currentUser } = useAuth();
  const { 
    selectedConversation, 
    sendMessage,
    markMessagesAsRead,
    loadMessages,
    isSendingMessage
  } = useMessaging();
  
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    if (!id) return;

    const unsubscribe = loadMessages(id);
    if (typeof unsubscribe !== 'function') {
      console.error('loadMessages did not return an unsubscribe function');
      return;
    }

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [id, loadMessages]);

  useEffect(() => {
    if (!selectedConversation || selectedConversation.id !== id) return;
    const unreadIds = selectedConversation.messages
      ?.filter(m => !m.read && (!currentUser || m.sender !== currentUser.uid))
      ?.map(m => m.id) || [];
    if (unreadIds.length > 0) {
      markMessagesAsRead(id, unreadIds);
    }
  }, [selectedConversation, id, currentUser?.uid, markMessagesAsRead]);

  const pickMedia = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 0.8,
      allowsMultipleSelection: true
    });

    if (!result.canceled) {
      setAttachments(prev => [
        ...prev,
        ...result.assets.map(a => ({
          uri: a.uri,
          type: a.type === 'video' ? 'video' : 'image',
          name: a.fileName || `${a.type}_${Date.now()}.${a.type === 'video' ? 'mp4' : 'jpg'}`
        }))
      ]);
    }
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const sendNewMessage = async () => {
    if (!message.trim() && attachments.length === 0) return;
    
    try {
      setUploading(true);
      
      const uploadedAttachments = await Promise.all(
        attachments.map(async (attachment) => {
          const downloadUrl = await uploadFile(
            `messages/${id}/${Date.now()}_${attachment.name}`,
            attachment.uri
          );
          return {
            uri: downloadUrl,
            type: attachment.type
          };
        })
      );

      await sendMessage(id, message, uploadedAttachments);
      setMessage('');
      setAttachments([]);
      
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 300);
    } catch (error) {
      console.error('Send error:', error);
    } finally {
      setUploading(false);
    }
  };

  if (!selectedConversation || selectedConversation.id !== id) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
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
        ref={scrollRef}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {selectedConversation.messages?.map(msg => (
          <Animated.View
            key={msg.id}
            layout={Layout.duration(300)}
            entering={FadeIn.duration(300)}
            style={[
              styles.messageBubble,
              (!currentUser || msg.sender === currentUser?.uid) ? styles.sentBubble : styles.receivedBubble
            ]}
          >
            {msg.content && <Text style={styles.messageText}>{msg.content}</Text>}
            
            {msg.attachments?.map((attachment, index) => (
              <View key={index} style={styles.attachmentContainer}>
                {attachment.type === 'image' ? (
                  <Image 
                    source={{ uri: attachment.uri }} 
                    style={styles.media} 
                    resizeMode="contain"
                  />
                ) : (
                  <Video
                    source={{ uri: attachment.uri }}
                    style={styles.media}
                    resizeMode="contain"
                    useNativeControls
                    isLooping
                  />
                )}
              </View>
            ))}
            
            <Text style={styles.timeText}>
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </Animated.View>
        ))}
      </ScrollView>

      {attachments.length > 0 && (
        <Animated.View 
          entering={FadeIn}
          exiting={FadeOut}
          style={styles.attachmentsContainer}
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {attachments.map((att, index) => (
              <View key={index} style={styles.attachmentItem}>
                {att.type === 'image' ? (
                  <Image source={{ uri: att.uri }} style={styles.attachmentImage} />
                ) : (
                  <Video
                    source={{ uri: att.uri }}
                    style={styles.attachmentImage}
                    resizeMode="cover"
                    shouldPlay={false}
                  />
                )}
                <TouchableOpacity 
                  style={styles.removeAttachment}
                  onPress={() => removeAttachment(index)}
                >
                  <Ionicons name="close" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </Animated.View>
      )}

      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={pickMedia} style={styles.attachButton}>
          <Ionicons name="attach" size={24} color="#666" />
        </TouchableOpacity>
        
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
          multiline
          editable={!uploading}
        />
        
        <TouchableOpacity 
          onPress={sendNewMessage}
          disabled={uploading || isSendingMessage || (!message.trim() && attachments.length === 0)}
          style={styles.sendButton}
        >
          {uploading || isSendingMessage ? (
            <ActivityIndicator size="small" color="#007bff" />
          ) : (
            <Ionicons 
              name="send" 
              size={24} 
              color={!message.trim() && attachments.length === 0 ? '#ccc' : '#007bff'} 
            />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    padding: 15,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  sentBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#dcf8c6',
    borderTopRightRadius: 0,
  },
  receivedBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderTopLeftRadius: 0,
    elevation: 1,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 8,
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  attachmentContainer: {
    marginBottom: 8,
  },
  media: {
    width: 250,
    height: 200,
    borderRadius: 8,
  },
  attachmentsContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  attachmentItem: {
    position: 'relative',
    marginRight: 10,
  },
  attachmentImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeAttachment: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  attachButton: {
    padding: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    padding: 10,
    maxHeight: 120,
    marginHorizontal: 5,
  },
  sendButton: {
    padding: 10,
  },
});

export default MessageDetail;