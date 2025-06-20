import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMessaging } from '../../context/MessagingContext';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { uploadFile } from '../../utils/storage';
import { VideoView } from 'expo-video';

const ComposeMessage = () => {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { createConversation, isSendingMessage } = useMessaging();
  
  const [recipients, setRecipients] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);

  const pickMedia = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'We need access to your media library to attach files');
      return;
    }

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

  const handleSend = async () => {
    if (!recipients.trim()) {
      Alert.alert('Error', 'Please enter at least one recipient');
      return;
    }

    if (!subject.trim()) {
      Alert.alert('Error', 'Please enter a subject');
      return;
    }

    if (!content.trim() && attachments.length === 0) {
      Alert.alert('Error', 'Please enter a message or attach a file');
      return;
    }

    try {
      setUploading(true);
      const recipientIds = recipients.split(',').map(r => r.trim());
      
      // Upload attachments first
      const uploadedAttachments = await Promise.all(
        attachments.map(async (attachment) => {
          const downloadUrl = await uploadFile(
            `messages/${Date.now()}_${attachment.name}`,
            attachment.uri
          );
          return {
            uri: downloadUrl,
            type: attachment.type
          };
        })
      );

      const conversationId = await createConversation(
        recipientIds,
        subject,
        content,
        uploadedAttachments
      );
      
      router.replace({
        pathname: `/messages/${conversationId}`,
        params: { title: subject }
      });
    } catch (error) {
      console.error('Send error:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>To:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter recipient IDs (comma separated)"
          value={recipients}
          onChangeText={setRecipients}
          editable={!uploading}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Subject:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter subject"
          value={subject}
          onChangeText={setSubject}
          editable={!uploading}
        />
      </View>

      <TextInput
        style={[styles.input, styles.messageInput]}
        placeholder="Type your message..."
        multiline
        value={content}
        onChangeText={setContent}
        editable={!uploading}
      />

      <TouchableOpacity 
        style={styles.attachButton}
        onPress={pickMedia}
        disabled={uploading}
      >
        <Ionicons name="attach" size={24} color="#666" />
        <Text style={styles.attachText}>Attach files</Text>
      </TouchableOpacity>

      {attachments.length > 0 && (
        <View style={styles.attachmentsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {attachments.map((att, index) => (
              <View key={index} style={styles.attachmentItem}>
                {att.type === 'image' ? (
                  <Image source={{ uri: att.uri }} style={styles.attachmentImage} />
                ) : (
                  <VideoView
                    source={{ uri: att.uri }}
                    style={styles.attachmentImage}
                    contentFit="cover"
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
        </View>
      )}

      <TouchableOpacity
        style={[styles.sendButton, (uploading || isSendingMessage) && styles.disabledButton]}
        onPress={handleSend}
        disabled={uploading || isSendingMessage}
      >
        {uploading || isSendingMessage ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.sendText}>Send Message</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  messageInput: {
    minHeight: 150,
    textAlignVertical: 'top',
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 20,
  },
  attachText: {
    marginLeft: 10,
    color: '#666',
  },
  attachmentsContainer: {
    marginBottom: 20,
  },
  attachmentItem: {
    position: 'relative',
    marginRight: 10,
  },
  attachmentImage: {
    width: 100,
    height: 100,
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
  sendButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  sendText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ComposeMessage;