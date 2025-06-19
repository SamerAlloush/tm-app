import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  TextInput,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { useMessaging } from '../../context/MessagingContext';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, Layout } from 'react-native-reanimated';

const ConversationList = () => {
  const router = useRouter();
  const { 
    conversations, 
    loading, 
    setCurrentConversation,
    refreshConversations,
    loadMessages
  } = useMessaging();
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [processedConversations, setProcessedConversations] = useState([]);

  useEffect(() => {
    const processConversations = async () => {
      const updated = await Promise.all(conversations.map(async convo => {
        const participantNames = await Promise.all(
          convo.participants
            .filter(id => !currentUser || id !== currentUser.uid)
            .map(async userId => {
              const response = await fetch(`${apiUrl}/users/${userId}`);
              const userData = await response.json();
              return userData.displayName;
            })
        );

        return {
          ...convo,
          participantNames,
          lastMessage: convo.lastMessage 
            ? convo.lastMessage.length > 30 
              ? `${convo.lastMessage.substring(0, 30)}...` 
              : convo.lastMessage
            : 'No messages yet',
          unreadCount: convo.unreadCount || 0
        };
      }));
      setProcessedConversations(updated);
    };

    if (conversations.length > 0) {
      processConversations();
    }
  }, [conversations, currentUser?.uid]);

  const filteredConversations = processedConversations.filter(convo => 
    convo.participantNames?.some(name => 
      name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshConversations();
    setRefreshing(false);
  };

  const handleConversationPress = async (conversation) => {
    if (!conversation?.id) return;
    
    setCurrentConversation(conversation);
    const unsubscribe = await loadMessages(conversation.id);
    
    if (typeof unsubscribe !== 'function') {
      console.error('Failed to get unsubscribe function');
      return;
    }

    router.push({
      pathname: `/messages/${conversation.id}`,
      params: { title: conversation.participantNames?.join(', ') || 'Chat' }
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <TouchableOpacity 
          style={styles.newMessageButton}
          onPress={() => router.push('/messages/compose')}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search conversations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#666"
          clearButtonMode="while-editing"
        />
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1e90ff" />
        </View>
      ) : (
        <FlatList
          data={filteredConversations}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Animated.View
              entering={FadeIn.duration(300)}
              layout={Layout.duration(300)}
            >
              <TouchableOpacity 
                style={[
                  styles.conversationItem,
                  item.unreadCount > 0 && styles.unreadConversation
                ]}
                onPress={() => handleConversationPress(item)}
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {item.participantNames?.[0]?.charAt(0)?.toUpperCase() || '?'}
                  </Text>
                  {item.unreadCount > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>
                        {item.unreadCount > 9 ? '9+' : item.unreadCount}
                      </Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.conversationInfo}>
                  <View style={styles.infoHeader}>
                    <Text style={styles.conversationName} numberOfLines={1}>
                      {item.participantNames?.join(', ') || 'Group Chat'}
                    </Text>
                    <Text style={styles.time}>
                      {item.lastUpdated?.toDate()?.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </Text>
                  </View>
                  <Text 
                    style={[
                      styles.lastMessage,
                      item.unreadCount > 0 && styles.unreadMessage
                    ]} 
                    numberOfLines={1}
                  >
                    {item.lastMessage}
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#1e90ff"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubbles" size={50} color="#ccc" />
              <Text style={styles.emptyTitle}>No conversations</Text>
              <Text style={styles.emptyText}>
                Start a new conversation by tapping the + button
              </Text>
              <TouchableOpacity
                style={styles.startChatButton}
                onPress={() => router.push('/messages/compose')}
              >
                <Text style={styles.startChatText}>Start Chatting</Text>
              </TouchableOpacity>
            </View>
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  newMessageButton: {
    backgroundColor: '#1e90ff',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginVertical: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    height: 40,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  unreadConversation: {
    backgroundColor: '#f0f8ff',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1e90ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    position: 'relative',
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  unreadBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  conversationInfo: {
    flex: 1,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
  unreadMessage: {
    fontWeight: 'bold',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  startChatButton: {
    backgroundColor: '#1e90ff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  startChatText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContent: {
    flexGrow: 1,
  },
});

export default ConversationList;