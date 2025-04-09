import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';

const Conversation = ({ conversation, onPress }) => {
  const { user } = useAuth();
  const otherParticipant = conversation.participants.find(p => p.id !== user.id);
  const lastMessage = conversation.lastMessage;
  const isUnread = conversation.unreadCount > 0 && lastMessage?.sender !== user.id;

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.avatar}>
        <Ionicons name="person" size={24} color="#555" />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text 
            style={[styles.name, isUnread && styles.unread]} 
            numberOfLines={1}
          >
            {otherParticipant?.name || 'Unknown'}
          </Text>
          {lastMessage && (
            <Text style={styles.time}>
              {lastMessage.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          )}
        </View>

        <Text 
          style={[styles.preview, isUnread && styles.unread]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {lastMessage 
            ? `${lastMessage.sender === user.id ? 'You: ' : ''}${lastMessage.text}`
            : 'No messages yet'}
        </Text>
      </View>

      {isUnread && <View style={styles.unreadBadge} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flexShrink: 1,
  },
  time: {
    fontSize: 12,
    color: '#888',
    marginLeft: 8,
  },
  preview: {
    fontSize: 14,
    color: '#666',
  },
  unread: {
    fontWeight: 'bold',
    color: '#000',
  },
  unreadBadge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007bff',
    marginLeft: 8,
  },
});

export default React.memo(Conversation);