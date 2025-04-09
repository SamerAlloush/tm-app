import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMessaging } from '../../context/MessagingContext';
import { useAuth } from '../../context/AuthContext';
import { NewConversation } from './NewConversation';
import { ConversationList } from '../../components/ConversationList';

const MessagingInbox = () => {
  const navigation = useNavigation();
  const { conversations, isLoading } = useMessaging();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [isNewMessageModalVisible, setIsNewMessageModalVisible] = useState(false);

  const filteredConversations = conversations
    .filter(conv => {
      const participantNames = conv.participants
        .filter(p => p.id !== user.id)
        .map(p => p.name.toLowerCase());
      return participantNames.some(name =>
        name.includes(searchQuery.toLowerCase())
      );
    })
    .filter(conv => {
      if (filter === 'unread') return conv.unreadCount > 0;
      return true;
    })
    .sort((a, b) => {
      if (!a.lastMessage) return 1;
      if (!b.lastMessage) return -1;
      return b.lastMessage.timestamp - a.lastMessage.timestamp;
    });

  const handleConversationPress = (conversationId) => {
    navigation.navigate('messagerie/chat', { id: conversationId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <TouchableOpacity
          style={styles.newMessageButton}
          onPress={() => setIsNewMessageModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search conversations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
            onPress={() => setFilter('all')}
          >
            <Text style={styles.filterText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'unread' && styles.activeFilter]}
            onPress={() => setFilter('unread')}
          >
            <Text style={styles.filterText}>Unread</Text>
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : (
        <FlatList
          data={filteredConversations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ConversationList
              conversation={item}
              onPress={() => handleConversationPress(item.id)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No conversations found</Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
        />
      )}

      <NewConversation
        visible={isNewMessageModalVisible}
        onClose={() => setIsNewMessageModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  newMessageButton: {
    backgroundColor: '#007bff',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 8,
  },
  filterContainer: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#e0e0e0',
  },
  activeFilter: {
    backgroundColor: '#007bff',
  },
  filterText: {
    color: '#333',
  },
  listContent: {
    paddingBottom: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
});

export default MessagingInbox;