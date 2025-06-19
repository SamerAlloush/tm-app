import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

const MessagingContext = createContext();

export const MessagingProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL;

  // Fetch all conversations for the current user
  const fetchConversations = useCallback(async () => {
    setLoading(true);
    try {
      let response;
      if (currentUser?.id) {
        response = await fetch(`${apiUrl}/users/${currentUser.id}/conversations`);
      } else {
        // Fetch all conversations or empty array for guests
        response = await fetch(`${apiUrl}/conversations`);
      }
      if (!response.ok) throw new Error('Failed to fetch conversations');
      const data = await response.json();
      setConversations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentUser, apiUrl]);

  // Fetch messages for a conversation
  const loadMessages = useCallback(async (conversationId) => {
    if (!conversationId) return;
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/conversations/${conversationId}/messages`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      const messages = await response.json();
      setSelectedConversation(prev => ({ ...prev, messages }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  // Create a new conversation
  const createConversation = useCallback(async (participants, subject) => {
    try {
      const response = await fetch(`${apiUrl}/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participants, subject }),
      });
      if (!response.ok) throw new Error('Failed to create conversation');
      const data = await response.json();
      return data.id;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [apiUrl]);

  // Send a message in a conversation
  const sendMessage = useCallback(async (conversationId, content, attachments = []) => {
    try {
      const sender = currentUser?.id || 'Guest';
      const response = await fetch(`${apiUrl}/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, attachments, sender }),
      });
      if (!response.ok) throw new Error('Failed to send message');
      // Optionally refresh messages
      await loadMessages(conversationId);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [apiUrl, loadMessages, currentUser]);

  // Mark messages as read (if supported by backend)
  const markMessagesAsRead = useCallback(async (conversationId, messageIds) => {
    try {
      await fetch(`${apiUrl}/conversations/${conversationId}/messages/read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageIds }),
      });
    } catch (err) {
      setError(err.message);
    }
  }, [apiUrl]);

  return (
    <MessagingContext.Provider value={{
      conversations,
      selectedConversation,
      setSelectedConversation,
      fetchConversations,
      createConversation,
      sendMessage,
      markMessagesAsRead,
      loadMessages,
      loading,
      error
    }}>
      {children}
    </MessagingContext.Provider>
  );
};

export const useMessaging = () => useContext(MessagingContext);