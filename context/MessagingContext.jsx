import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';

const MessagingContext = createContext();

export const MessagingProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulate loading conversations from API
  useEffect(() => {
    const loadConversations = async () => {
      try {
        // Replace with actual API call
        const mockConversations = [
          {
            id: '1',
            subject: 'Project Update',
            participants: ['team@company.com', 'manager@company.com'],
            messages: [
              {
                id: '1-1',
                sender: 'team@company.com',
                content: 'The project is on track for completion next week.',
                timestamp: '2023-05-15T10:30:00Z',
                read: true,
                attachments: []
              },
              {
                id: '1-2',
                sender: 'manager@company.com',
                content: 'Great to hear! Any issues we should know about?',
                timestamp: '2023-05-15T11:15:00Z',
                read: true,
                attachments: []
              }
            ],
            starred: false,
            lastUpdated: '2023-05-15T11:15:00Z'
          },
          // Add more mock conversations
        ];
        
        setConversations(mockConversations);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    loadConversations();
  }, []);

  const filteredConversations = useCallback(() => {
    let result = [...conversations];
    
    // Apply filter
    switch (filter) {
      case 'unread':
        result = result.filter(conv => 
          conv.messages.some(msg => 
            !msg.read && msg.sender !== 'currentUser@company.com'
          )
        );
        break;
      case 'starred':
        result = result.filter(conv => conv.starred);
        break;
      default:
        // 'all' - no filter
        break;
    }
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(conv => 
        conv.subject.toLowerCase().includes(query) ||
        conv.participants.some(p => p.toLowerCase().includes(query)) ||
        conv.messages.some(msg => msg.content.toLowerCase().includes(query))
      );
    }
    
    // Apply sort
    switch (sort) {
      case 'newest':
        result.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.lastUpdated) - new Date(b.lastUpdated));
        break;
      default:
        break;
    }
    
    return result;
  }, [conversations, filter, searchQuery, sort]);

  const starConversation = (conversationId) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, starred: !conv.starred } 
          : conv
      )
    );
  };

  const createNewMessage = (recipients, subject, content, attachments = []) => {
    const newMessage = {
      id: Date.now().toString(),
      sender: 'currentUser@company.com',
      content,
      timestamp: new Date().toISOString(),
      read: true,
      attachments
    };

    // Check if conversation with these recipients already exists
    const existingConv = conversations.find(conv => 
      conv.participants.every(p => 
        [...recipients, 'currentUser@company.com'].includes(p)
      ) && 
      conv.subject === subject
    );

    if (existingConv) {
      // Add to existing conversation
      setConversations(prev => 
        prev.map(conv => 
          conv.id === existingConv.id
            ? {
                ...conv,
                messages: [...conv.messages, newMessage],
                lastUpdated: new Date().toISOString()
              }
            : conv
        )
      );
    } else {
      // Create new conversation
      const newConversation = {
        id: Date.now().toString(),
        subject,
        participants: [...recipients, 'currentUser@company.com'],
        messages: [newMessage],
        starred: false,
        lastUpdated: new Date().toISOString()
      };
      setConversations(prev => [newConversation, ...prev]);
    }
  };

  const markAsRead = (conversationId) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId
          ? {
              ...conv,
              messages: conv.messages.map(msg => 
                !msg.read && msg.sender !== 'currentUser@company.com'
                  ? { ...msg, read: true }
                  : msg
              )
            }
          : conv
      )
    );
  };

  const deleteConversation = (conversationId) => {
    Alert.alert(
      "Delete Conversation",
      "Are you sure you want to delete this conversation?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            setConversations(prev => prev.filter(conv => conv.id !== conversationId));
            if (selectedConversation?.id === conversationId) {
              setSelectedConversation(null);
            }
          }
        }
      ]
    );
  };

  return (
    <MessagingContext.Provider
      value={{
        conversations: filteredConversations(),
        selectedConversation,
        setSelectedConversation,
        starConversation,
        filter,
        setFilter,
        sort,
        setSort,
        searchQuery,
        setSearchQuery,
        createNewMessage,
        markAsRead,
        deleteConversation,
        isLoading,
        error
      }}
    >
      {children}
    </MessagingContext.Provider>
  );
};

export const useMessaging = () => {
  const context = useContext(MessagingContext);
  if (!context) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
};