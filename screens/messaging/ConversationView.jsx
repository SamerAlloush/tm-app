import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView } from 'react-native';
import { Message } from '../../app/messagerie';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useAuth, useMessaging } from '../../contexts';

const ConversationView = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { getConversation, messages, sendMessage } = useMessaging();
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    const conversation = getConversation(id);
    if (conversation) {
      const otherParticipant = conversation.participants.find(p => p.id !== user.id);
      navigation.setOptions({ title: otherParticipant?.name || 'Chat' });
    }
  }, [id, getConversation, user]);

  const handleSend = async () => {
    if (messageText.trim()) {
      await sendMessage(id, messageText);
      setMessageText('');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Message 
            message={item} 
            isCurrentUser={item.sender === user.id} 
          />
        )}
        contentContainerStyle={styles.messagesContainer}
        inverted
      />

      {/* Message input component would go here */}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesContainer: {
    padding: 16,
  },
});

export default ConversationView;