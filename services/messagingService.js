// services/messagingService.js
const apiUrl = process.env.REACT_APP_API_URL;

// Conversation functions
export const createConversation = async (participants, name = null) => {
  try {
    const response = await fetch(`${apiUrl}/conversations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ participants, name }),
    });
    if (!response.ok) throw new Error('Failed to create conversation');
    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
};

export const getConversation = async (conversationId) => {
  try {
    const response = await fetch(`${apiUrl}/conversations/${conversationId}`);
    if (!response.ok) throw new Error('Failed to get conversation');
    return await response.json();
  } catch (error) {
    console.error('Error getting conversation:', error);
    throw error;
  }
};

export const getUserConversations = async (userId) => {
  try {
    const response = await fetch(`${apiUrl}/users/${userId}/conversations`);
    if (!response.ok) throw new Error('Failed to get conversations');
    return await response.json();
  } catch (error) {
    console.error('Error getting user conversations:', error);
    throw error;
  }
};

// Message functions
export const sendMessage = async (conversationId, message, senderId, attachments = []) => {
  try {
    const response = await fetch(`${apiUrl}/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, senderId, attachments }),
    });
    if (!response.ok) throw new Error('Failed to send message');
    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const getMessages = async (conversationId) => {
  try {
    const response = await fetch(`${apiUrl}/conversations/${conversationId}/messages`);
    if (!response.ok) throw new Error('Failed to get messages');
    return await response.json();
  } catch (error) {
    console.error('Error getting messages:', error);
    throw error;
  }
};

// User functions
export const getUser = async (userId) => {
  try {
    const response = await fetch(`${apiUrl}/users/${userId}`);
    if (!response.ok) throw new Error('Failed to get user');
    return await response.json();
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

export const searchUsers = async (searchTerm) => {
  try {
    const response = await fetch(`${apiUrl}/users?search=${encodeURIComponent(searchTerm)}`);
    if (!response.ok) throw new Error('Failed to search users');
    return await response.json();
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};

// Typing indicators
export const setTypingStatus = async (conversationId, userId, isTyping) => {
  try {
    await fetch(`${apiUrl}/conversations/${conversationId}/typing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, isTyping }),
    });
  } catch (error) {
    console.error('Error setting typing status:', error);
    throw error;
  }
};

export const getTypingStatus = async (conversationId) => {
  try {
    const response = await fetch(`${apiUrl}/conversations/${conversationId}/typing`);
    if (!response.ok) throw new Error('Failed to get typing status');
    return await response.json();
  } catch (error) {
    console.error('Error getting typing status:', error);
    throw error;
  }
};