import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useMessaging } from './MessagingContext';
import { useAuth } from './AuthContext';

const ComposeMessageModal = ({ visible, onClose }) => {
  const [recipients, setRecipients] = useState([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { users, startConversation, sendMessage } = useMessaging();
  const { currentUser } = useAuth();
  const messageInputRef = useRef();

  const filteredUsers = users.filter(user => 
    user.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !recipients.some(r => r.id === user.id)
  );

  const addRecipient = (user) => {
    setRecipients([...recipients, user]);
    setSearchQuery('');
    messageInputRef.current?.focus();
  };

  const removeRecipient = (userId) => {
    setRecipients(recipients.filter(r => r.id !== userId));
  };

  const handleSend = async () => {
    if (recipients.length === 0 || !message.trim()) return;

    const participantIds = recipients.map(r => r.id);
    const conversation = await startConversation(participantIds);
    await sendMessage(message, conversation.id);
    
    // Reset form
    setRecipients([]);
    setSubject('');
    setMessage('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={24} color="#1e90ff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Message</Text>
          <TouchableOpacity onPress={handleSend}>
            <Text style={styles.sendButton}>Send</Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
          keyboardVerticalOffset={90}
        >
          <ScrollView style={styles.scrollContainer}>
            <View style={styles.recipientsContainer}>
              <Text style={styles.label}>To:</Text>
              <View style={styles.recipientsList}>
                {recipients.map(user => (
                  <View key={user.id} style={styles.recipientTag}>
                    <Text style={styles.recipientName}>{user.displayName}</Text>
                    <TouchableOpacity onPress={() => removeRecipient(user.id)}>
                      <Icon name="close" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}
                <TextInput
                  style={styles.recipientInput}
                  placeholder={recipients.length === 0 ? "Enter name or email" : ""}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            {searchQuery && filteredUsers.length > 0 && (
              <View style={styles.suggestionsContainer}>
                {filteredUsers.map(user => (
                  <TouchableOpacity
                    key={user.id}
                    style={styles.suggestionItem}
                    onPress={() => addRecipient(user)}
                  >
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {user.displayName?.charAt(0) || '?'}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.suggestionName}>{user.displayName}</Text>
                      <Text style={styles.suggestionEmail}>{user.email}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <TextInput
              style={styles.subjectInput}
              placeholder="Subject (optional)"
              value={subject}
              onChangeText={setSubject}
              placeholderTextColor="#999"
            />

            <TextInput
              ref={messageInputRef}
              style={styles.messageInput}
              placeholder="Write your message..."
              value={message}
              onChangeText={setMessage}
              placeholderTextColor="#999"
              multiline
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  sendButton: {
    color: '#1e90ff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    padding: 15,
  },
  recipientsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginRight: 10,
    marginTop: 5,
  },
  recipientsList: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  recipientTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e90ff',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 5,
    marginBottom: 5,
  },
  recipientName: {
    color: '#fff',
    fontSize: 14,
    marginRight: 5,
  },
  recipientInput: {
    flex: 1,
    minWidth: 100,
    fontSize: 16,
    padding: 0,
    margin: 0,
  },
  suggestionsContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 15,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1e90ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  suggestionName: {
    fontSize: 16,
    color: '#333',
  },
  suggestionEmail: {
    fontSize: 14,
    color: '#666',
  },
  subjectInput: {
    fontSize: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 15,
  },
  messageInput: {
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
});

export default ComposeMessageModal;