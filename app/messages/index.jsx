import React, { useState } from 'react';
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
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useMessaging } from '../../context/MessagingContext';
import { useNavigation } from 'expo-router';

const MessageList = () => {
  const navigation = useNavigation();
  const { 
    conversations, 
    selectedConversation, 
    setSelectedConversation,
    starConversation,
    filter,
    setFilter,
    sort,
    setSort,
    searchQuery,
    setSearchQuery,
    isLoading,
    error,
    markAsRead,
    deleteConversation
  } = useMessaging();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const renderConversation = ({ item }) => {
    const lastMessage = item.messages[item.messages.length - 1];
    const unreadCount = item.messages.filter(
      msg => !msg.read && msg.sender !== 'currentUser@company.com'
    ).length;
    
    return (
      <TouchableOpacity 
        style={[
          styles.conversationItem,
          selectedConversation?.id === item.id && styles.selectedConversation
        ]}
        onPress={() => {
          setSelectedConversation(item);
          markAsRead(item.id);
          navigation.push('messages/[id]', { 
            id: item.id,
            title: item.subject
          });
        }}
        onLongPress={() => deleteConversation(item.id)}
      >
        <View style={styles.conversationHeader}>
          <TouchableOpacity 
            style={styles.starButton}
            onPress={() => starConversation(item.id)}
          >
            <Icon 
              name={item.starred ? "star" : "star-outline"} 
              size={24} 
              color={item.starred ? "#FFD700" : "#666"} 
            />
          </TouchableOpacity>
          
          <View style={styles.conversationContent}>
            <Text style={styles.subjectText} numberOfLines={1}>{item.subject}</Text>
            <Text style={styles.timeText}>
              {new Date(lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        </View>
        
        <Text 
          style={[
            styles.previewText,
            unreadCount > 0 && styles.unreadPreview
          ]}
          numberOfLines={2}
        >
          {lastMessage.content}
        </Text>
        
        <View style={styles.conversationFooter}>
          <Text style={styles.participantsText} numberOfLines={1}>
            {item.participants.filter(p => p !== 'currentUser@company.com').join(', ')}
          </Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search messages..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>
      
      <View style={styles.filterBar}>
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
          onPress={() => setFilter('all')}
        >
          <Text style={styles.filterButtonText}>All</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'unread' && styles.activeFilter]}
          onPress={() => setFilter('unread')}
        >
          <View style={styles.filterButtonContent}>
            <Text style={styles.filterButtonText}>Unread</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'starred' && styles.activeFilter]}
          onPress={() => setFilter('starred')}
        >
          <Icon name="star" size={16} color={filter === 'starred' ? '#007bff' : '#666'} />
          <Text style={styles.filterButtonText}>Starred</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={conversations}
        renderItem={renderConversation}
        keyExtractor={item => item.id}
        style={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007bff']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="email" size={50} color="#ccc" />
            <Text style={styles.emptyText}>No messages found</Text>
          </View>
        }
      />
      
      <TouchableOpacity 
        style={styles.composeButton}
        onPress={() => navigation.push('messages/compose')}
      >
        <Icon name="edit" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 16,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 15,
    marginBottom: 10,
  },
  filterButton: {
    padding: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeFilter: {
    backgroundColor: '#e3f2fd',
  },
  filterButtonText: {
    color: '#333',
    marginLeft: 5,
  },
  filterButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  list: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
  },
  emptyText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  conversationItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    marginHorizontal: 15,
    borderRadius: 10,
    elevation: 1,
  },
  selectedConversation: {
    backgroundColor: '#e3f2fd',
  },
  conversationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  starButton: {
    marginRight: 10,
  },
  conversationContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subjectText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  timeText: {
    color: '#666',
    fontSize: 12,
    marginLeft: 10,
  },
  previewText: {
    color: '#666',
    marginBottom: 5,
    fontSize: 14,
  },
  unreadPreview: {
    fontWeight: 'bold',
    color: '#333',
  },
  conversationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  participantsText: {
    color: '#666',
    fontSize: 12,
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: '#007bff',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  unreadBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  composeButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007bff',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
});

export default MessageList;