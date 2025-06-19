// // // // import React, { useState } from 'react';
// // // // import {
// // // //   View,
// // // //   Text,
// // // //   FlatList,
// // // //   TouchableOpacity,
// // // //   StyleSheet,
// // // //   TextInput,
// // // //   ActivityIndicator,
// // // //   RefreshControl
// // // // } from 'react-native';
// // // // import Icon from 'react-native-vector-icons/MaterialIcons';
// // // // import { useMessaging } from '../../context/MessagingContext';
// // // // import { useNavigation } from 'expo-router';

// // // // const MessageList = () => {
// // // //   const navigation = useNavigation();
// // // //   const {
// // // //     conversations,
// // // //     selectedConversation,
// // // //     setSelectedConversation,
// // // //     starConversation,
// // // //     filter,
// // // //     setFilter,
// // // //     sort,
// // // //     setSort,
// // // //     searchQuery,
// // // //     setSearchQuery,
// // // //     isLoading,
// // // //     error,
// // // //     markAsRead,
// // // //     deleteConversation
// // // //   } = useMessaging();

// // // //   const [refreshing, setRefreshing] = useState(false);

// // // //   const onRefresh = React.useCallback(() => {
// // // //     setRefreshing(true);
// // // //     setTimeout(() => setRefreshing(false), 1000);
// // // //   }, []);

// // // //   const renderConversation = ({ item }) => {
// // // //     const lastMessage = item.messages[item.messages.length - 1];
// // // //     const unreadCount = item.messages.filter(
// // // //       msg => !msg.read && msg.sender !== 'currentUser@company.com'
// // // //     ).length;
    
// // // //     return (
// // // //       <TouchableOpacity
// // // //         style={[
// // // //           styles.conversationItem,
// // // //           selectedConversation?.id === item.id && styles.selectedConversation
// // // //         ]}
// // // //         onPress={() => {
// // // //           setSelectedConversation(item);
// // // //           markAsRead(item.id);
// // // //           navigation.push('messages/[id]', {
// // // //             id: item.id,
// // // //             title: item.subject
// // // //           });
// // // //         }}
// // // //         onLongPress={() => deleteConversation(item.id)}
// // // //       >
// // // //         <View style={styles.conversationHeader}>
// // // //           <TouchableOpacity
// // // //             style={styles.starButton}
// // // //             onPress={() => starConversation(item.id)}
// // // //           >
// // // //             <Icon
// // // //               name={item.starred ? "star" : "star-outline"}
// // // //               size={24}
// // // //               color={item.starred ? "#FFD700" : "#666"}
// // // //             />
// // // //           </TouchableOpacity>
          
// // // //           <View style={styles.conversationContent}>
// // // //             <Text style={styles.subjectText} numberOfLines={1}>{item.subject}</Text>
// // // //             <Text style={styles.timeText}>
// // // //               {new Date(lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
// // // //             </Text>
// // // //           </View>
// // // //         </View>
        
// // // //         <Text
// // // //           style={[
// // // //             styles.previewText,
// // // //             unreadCount > 0 && styles.unreadPreview
// // // //           ]}
// // // //           numberOfLines={2}
// // // //         >
// // // //           {lastMessage.content}
// // // //         </Text>
        
// // // //         <View style={styles.conversationFooter}>
// // // //           <Text style={styles.participantsText} numberOfLines={1}>
// // // //             {item.participants.filter(p => p !== 'currentUser@company.com').join(', ')}
// // // //           </Text>
// // // //           {unreadCount > 0 && (
// // // //             <View style={styles.unreadBadge}>
// // // //               <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
// // // //             </View>
// // // //           )}
// // // //         </View>
// // // //       </TouchableOpacity>
// // // //     );
// // // //   };

// // // //   if (isLoading) {
// // // //     return (
// // // //       <View style={styles.loadingContainer}>
// // // //         <ActivityIndicator size="large" color="#007bff" />
// // // //       </View>
// // // //     );
// // // //   }

// // // //   if (error) {
// // // //     return (
// // // //       <View style={styles.errorContainer}>
// // // //         <Text style={styles.errorText}>{error}</Text>
// // // //       </View>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <View style={styles.container}>
// // // //       <View style={styles.searchContainer}>
// // // //         <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
// // // //         <TextInput
// // // //           style={styles.searchInput}
// // // //           placeholder="Search messages..."
// // // //           value={searchQuery}
// // // //           onChangeText={setSearchQuery}
// // // //           clearButtonMode="while-editing"
// // // //         />
// // // //       </View>
      
// // // //       <View style={styles.filterBar}>
// // // //         <TouchableOpacity
// // // //           style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
// // // //           onPress={() => setFilter('all')}
// // // //         >
// // // //           <Text style={styles.filterButtonText}>All</Text>
// // // //         </TouchableOpacity>
        
// // // //         <TouchableOpacity
// // // //           style={[styles.filterButton, filter === 'unread' && styles.activeFilter]}
// // // //           onPress={() => setFilter('unread')}
// // // //         >
// // // //           <View style={styles.filterButtonContent}>
// // // //             <Text style={styles.filterButtonText}>Unread</Text>
// // // //           </View>
// // // //         </TouchableOpacity>
        
// // // //         <TouchableOpacity
// // // //           style={[styles.filterButton, filter === 'starred' && styles.activeFilter]}
// // // //           onPress={() => setFilter('starred')}
// // // //         >
// // // //           <Icon name="star" size={16} color={filter === 'starred' ? '#007bff' : '#666'} />
// // // //           <Text style={styles.filterButtonText}>Starred</Text>
// // // //         </TouchableOpacity>
// // // //       </View>
      
// // // //       <FlatList
// // // //         data={conversations}
// // // //         renderItem={renderConversation}
// // // //         keyExtractor={item => item.id}
// // // //         style={styles.list}
// // // //         refreshControl={
// // // //           <RefreshControl
// // // //             refreshing={refreshing}
// // // //             onRefresh={onRefresh}
// // // //             colors={['#007bff']}
// // // //           />
// // // //         }
// // // //         ListEmptyComponent={
// // // //           <View style={styles.emptyContainer}>
// // // //             <Icon name="email" size={50} color="#ccc" />
// // // //             <Text style={styles.emptyText}>No messages found</Text>
// // // //           </View>
// // // //         }
// // // //       />
      
// // // //       <TouchableOpacity
// // // //         style={styles.composeButton}
// // // //         onPress={() => navigation.push('messages/compose')}
// // // //       >
// // // //         <Icon name="edit" size={24} color="#fff" />
// // // //       </TouchableOpacity>
// // // //     </View>
// // // //   );
// // // // };

// // // // const styles = StyleSheet.create({
// // // //   container: {
// // // //     flex: 1,
// // // //     backgroundColor: '#f5f5f5',
// // // //   },
// // // //   loadingContainer: {
// // // //     flex: 1,
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //   },
// // // //   errorContainer: {
// // // //     flex: 1,
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     padding: 20,
// // // //   },
// // // //   errorText: {
// // // //     color: '#e74c3c',
// // // //     fontSize: 16,
// // // //     textAlign: 'center',
// // // //   },
// // // //   searchContainer: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     backgroundColor: '#fff',
// // // //     borderRadius: 10,
// // // //     margin: 15,
// // // //     paddingHorizontal: 15,
// // // //     paddingVertical: 10,
// // // //     elevation: 2,
// // // //   },
// // // //   searchIcon: {
// // // //     marginRight: 10,
// // // //   },
// // // //   searchInput: {
// // // //     flex: 1,
// // // //     fontSize: 16,
// // // //   },
// // // //   filterBar: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-around',
// // // //     marginHorizontal: 15,
// // // //     marginBottom: 10,
// // // //   },
// // // //   filterButton: {
// // // //     padding: 10,
// // // //     borderRadius: 20,
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //   },
// // // //   activeFilter: {
// // // //     backgroundColor: '#e3f2fd',
// // // //   },
// // // //   filterButtonText: {
// // // //     color: '#333',
// // // //     marginLeft: 5,
// // // //   },
// // // //   filterButtonContent: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //   },
// // // //   list: {
// // // //     flex: 1,
// // // //   },
// // // //   emptyContainer: {
// // // //     flex: 1,
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     padding: 50,
// // // //   },
// // // //   emptyText: {
// // // //     marginTop: 10,
// // // //     color: '#666',
// // // //     fontSize: 16,
// // // //   },
// // // //   conversationItem: {
// // // //     backgroundColor: '#fff',
// // // //     padding: 15,
// // // //     marginBottom: 10,
// // // //     marginHorizontal: 15,
// // // //     borderRadius: 10,
// // // //     elevation: 1,
// // // //   },
// // // //   selectedConversation: {
// // // //     backgroundColor: '#e3f2fd',
// // // //   },
// // // //   conversationHeader: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     marginBottom: 5,
// // // //   },
// // // //   starButton: {
// // // //     marginRight: 10,
// // // //   },
// // // //   conversationContent: {
// // // //     flex: 1,
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //   },
// // // //   subjectText: {
// // // //     fontWeight: 'bold',
// // // //     fontSize: 16,
// // // //     color: '#333',
// // // //     flex: 1,
// // // //   },
// // // //   timeText: {
// // // //     color: '#666',
// // // //     fontSize: 12,
// // // //     marginLeft: 10,
// // // //   },
// // // //   previewText: {
// // // //     color: '#666',
// // // //     marginBottom: 5,
// // // //     fontSize: 14,
// // // //   },
// // // //   unreadPreview: {
// // // //     fontWeight: 'bold',
// // // //     color: '#333',
// // // //   },
// // // //   conversationFooter: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     alignItems: 'center',
// // // //   },
// // // //   participantsText: {
// // // //     color: '#666',
// // // //     fontSize: 12,
// // // //     flex: 1,
// // // //   },
// // // //   unreadBadge: {
// // // //     backgroundColor: '#007bff',
// // // //     borderRadius: 10,
// // // //     minWidth: 20,
// // // //     height: 20,
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     paddingHorizontal: 5,
// // // //   },
// // // //   unreadBadgeText: {
// // // //     color: '#fff',
// // // //     fontSize: 12,
// // // //     fontWeight: 'bold',
// // // //   },
// // // //   composeButton: {
// // // //     position: 'absolute',
// // // //     bottom: 20,
// // // //     right: 20,
// // // //     backgroundColor: '#007bff',
// // // //     width: 56,
// // // //     height: 56,
// // // //     borderRadius: 28,
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     elevation: 5,
// // // //   },
// // // // });

// // // // export default MessageList;
// // // import React, { useState } from 'react';
// // // import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
// // // import { Ionicons } from '@expo/vector-icons';
// // // import { useMessaging } from '../../context/MessagingContext';
// // // import { useRouter } from 'expo-router';
// // // import Animated, { FadeIn, Layout } from 'react-native-reanimated';

// // // const ConversationList = () => {
// // //   const router = useRouter();
// // //   const { conversations, loading, error, setSelectedConversation } = useMessaging();
// // //   const [searchQuery, setSearchQuery] = useState('');

// // //   const filteredConversations = conversations.filter(convo =>
// // //     convo.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
// // //     convo.participants.some(p =>
// // //       p.toString().toLowerCase().includes(searchQuery.toLowerCase())
// // //     )
// // //   );

// // //   const handleSelectConversation = (conversation) => {
// // //     setSelectedConversation(conversation);
// // //     router.push({
// // //       pathname: `/messages/${conversation.id}`,
// // //       params: { title: conversation.subject }
// // //     });
// // //   };

// // //   const renderItem = ({ item }) => (
// // //     <Animated.View
// // //       layout={Layout.duration(300)}
// // //       entering={FadeIn.duration(300)}
// // //       style={styles.conversationItem}
// // //     >
// // //       <TouchableOpacity onPress={() => handleSelectConversation(item)}>
// // //         <Text style={styles.subject}>{item.subject}</Text>
// // //         <Text style={styles.preview} numberOfLines={1}>{item.lastMessage}</Text>
// // //         <Text style={styles.time}>
// // //           {new Date(item.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
// // //         </Text>
// // //       </TouchableOpacity>
// // //     </Animated.View>
// // //   );

// // //   if (loading) return <ActivityIndicator style={styles.loader} size="large" />;
// // //   if (error) return <Text style={styles.error}>{error}</Text>;

// // //   return (
// // //     <View style={styles.container}>
// // //       <View style={styles.searchContainer}>
// // //         <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
// // //         <TextInput
// // //           style={styles.searchInput}
// // //           placeholder="Search messages..."
// // //           value={searchQuery}
// // //           onChangeText={setSearchQuery}
// // //         />
// // //       </View>

// // //       <FlatList
// // //         data={filteredConversations}
// // //         renderItem={renderItem}
// // //         keyExtractor={item => item.id}
// // //         contentContainerStyle={styles.listContent}
// // //         ListEmptyComponent={
// // //           <View style={styles.empty}>
// // //             <Ionicons name="mail-open-outline" size={48} color="#ccc" />
// // //             <Text style={styles.emptyText}>No conversations</Text>
// // //           </View>
// // //         }
// // //       />

// // //       <TouchableOpacity
// // //         style={styles.composeButton}
// // //         onPress={() => router.push('/messages/compose')}
// // //       >
// // //         <Ionicons name="create-outline" size={24} color="#fff" />
// // //       </TouchableOpacity>
// // //     </View>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     backgroundColor: '#f8f9fa',
// // //   },
// // //   searchContainer: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     padding: 15,
// // //     backgroundColor: '#fff',
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#eee',
// // //   },
// // //   searchIcon: {
// // //     marginRight: 10,
// // //   },
// // //   searchInput: {
// // //     flex: 1,
// // //     fontSize: 16,
// // //   },
// // //   listContent: {
// // //     padding: 15,
// // //   },
// // //   conversationItem: {
// // //     backgroundColor: '#fff',
// // //     borderRadius: 10,
// // //     padding: 15,
// // //     marginBottom: 10,
// // //     elevation: 1,
// // //   },
// // //   subject: {
// // //     fontWeight: 'bold',
// // //     fontSize: 16,
// // //     marginBottom: 5,
// // //   },
// // //   preview: {
// // //     color: '#666',
// // //     marginBottom: 5,
// // //   },
// // //   time: {
// // //     color: '#999',
// // //     fontSize: 12,
// // //     alignSelf: 'flex-end',
// // //   },
// // //   composeButton: {
// // //     position: 'absolute',
// // //     bottom: 20,
// // //     right: 20,
// // //     backgroundColor: '#007bff',
// // //     width: 56,
// // //     height: 56,
// // //     borderRadius: 28,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     elevation: 5,
// // //   },
// // //   empty: {
// // //     flex: 1,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     padding: 40,
// // //   },
// // //   emptyText: {
// // //     marginTop: 10,
// // //     color: '#666',
// // //   },
// // //   loader: {
// // //     flex: 1,
// // //     justifyContent: 'center',
// // //   },
// // //   error: {
// // //     flex: 1,
// // //     justifyContent: 'center',
// // //     padding: 20,
// // //     color: 'red',
// // //     textAlign: 'center',
// // //   },
// // // });

// // // export default ConversationList;
// // import React, { useState } from 'react';
// // import {
// //   View,
// //   Text,
// //   FlatList,
// //   TouchableOpacity,
// //   StyleSheet,
// //   TextInput,
// //   ActivityIndicator,
// //   Image
// // } from 'react-native';
// // import { Ionicons } from '@expo/vector-icons';
// // import { useMessaging } from '../../context/MessagingContext';
// // import { useRouter } from 'expo-router';
// // import Animated, { FadeIn, Layout } from 'react-native-reanimated';

// // const ConversationList = () => {
// //   const router = useRouter();
// //   const { conversations, loading, error, setSelectedConversation } = useMessaging();
// //   const [searchQuery, setSearchQuery] = useState('');

// //   const filteredConversations = conversations.filter(convo =>
// //     convo.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //     convo.participants.some(p =>
// //       p.toString().toLowerCase().includes(searchQuery.toLowerCase())
// //     )
// //   );

// //   const handleSelectConversation = (conversation) => {
// //     setSelectedConversation(conversation);
// //     router.push({
// //       pathname: `/messages/${conversation.id}`,
// //       params: { title: conversation.subject }
// //     });
// //   };

// //   const renderItem = ({ item }) => (
// //     <Animated.View
// //       layout={Layout.duration(300)}
// //       entering={FadeIn.duration(300)}
// //       style={styles.conversationItem}
// //     >
// //       <TouchableOpacity onPress={() => handleSelectConversation(item)}>
// //         <Text style={styles.subject}>{item.subject}</Text>
// //         <Text style={styles.preview} numberOfLines={1}>{item.lastMessage}</Text>
// //         <Text style={styles.time}>
// //           {new Date(item.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
// //         </Text>
// //       </TouchableOpacity>
// //     </Animated.View>
// //   );

// //   if (loading) return (
// //     <View style={styles.loader}>
// //       <ActivityIndicator size="large" />
// //     </View>
// //   );
  
// //   if (error) return (
// //     <View style={styles.errorContainer}>
// //       <Text style={styles.errorText}>{error}</Text>
// //     </View>
// //   );

// //   return (
// //     <View style={styles.container}>
// //       <View style={styles.searchContainer}>
// //         <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
// //         <TextInput
// //           style={styles.searchInput}
// //           placeholder="Search messages..."
// //           value={searchQuery}
// //           onChangeText={setSearchQuery}
// //         />
// //       </View>

// //       <FlatList
// //         data={filteredConversations}
// //         renderItem={renderItem}
// //         keyExtractor={item => item.id}
// //         contentContainerStyle={styles.listContent}
// //         ListEmptyComponent={
// //           <View style={styles.empty}>
// //             <Ionicons name="mail-open-outline" size={48} color="#ccc" />
// //             <Text style={styles.emptyText}>No conversations</Text>
// //           </View>
// //         }
// //       />

// //       <TouchableOpacity
// //         style={styles.composeButton}
// //         onPress={() => router.push('/messages/compose')}
// //       >
// //         <Ionicons name="create-outline" size={24} color="#fff" />
// //       </TouchableOpacity>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#f8f9fa',
// //   },
// //   searchContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     padding: 15,
// //     backgroundColor: '#fff',
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#eee',
// //   },
// //   searchIcon: {
// //     marginRight: 10,
// //   },
// //   searchInput: {
// //     flex: 1,
// //     fontSize: 16,
// //   },
// //   listContent: {
// //     padding: 15,
// //   },
// //   conversationItem: {
// //     backgroundColor: '#fff',
// //     borderRadius: 10,
// //     padding: 15,
// //     marginBottom: 10,
// //     elevation: 1,
// //   },
// //   subject: {
// //     fontWeight: 'bold',
// //     fontSize: 16,
// //     marginBottom: 5,
// //   },
// //   preview: {
// //     color: '#666',
// //     marginBottom: 5,
// //   },
// //   time: {
// //     color: '#999',
// //     fontSize: 12,
// //     alignSelf: 'flex-end',
// //   },
// //   composeButton: {
// //     position: 'absolute',
// //     bottom: 20,
// //     right: 20,
// //     backgroundColor: '#007bff',
// //     width: 56,
// //     height: 56,
// //     borderRadius: 28,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     elevation: 5,
// //   },
// //   empty: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     padding: 40,
// //   },
// //   emptyText: {
// //     marginTop: 10,
// //     color: '#666',
// //   },
// //   loader: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   errorContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     padding: 20,
// //   },
// //   errorText: {
// //     color: 'red',
// //     textAlign: 'center',
// //   },
// // });

// // export default ConversationList;
// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   TextInput,
//   ActivityIndicator,
//   RefreshControl,
//   Image
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useMessaging } from '../../context/MessagingContext';
// import { useRouter } from 'expo-router';
// import Animated, { FadeIn, Layout } from 'react-native-reanimated';

// const ConversationList = () => {
//   const router = useRouter();
//   const {
//     conversations,
//     loading,
//     loadingMore,
//     allConversationsLoaded,
//     error,
//     setSelectedConversation,
//     loadMessages,
//     loadMoreConversations
//   } = useMessaging();
  
//   const [searchQuery, setSearchQuery] = useState('');
//   const [refreshing, setRefreshing] = useState(false);

//   const filteredConversations = conversations.filter(convo =>
//     convo.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     convo.participants.some(p =>
//       p.toString().toLowerCase().includes(searchQuery.toLowerCase())
//     )
//   );

//   const handleSelectConversation = (conversation) => {
//     setSelectedConversation(conversation);
//     loadMessages(conversation.id);
//     router.push({
//       pathname: `/messages/${conversation.id}`,
//       params: { title: conversation.subject }
//     });
//   };

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await loadConversations();
//     setRefreshing(false);
//   };

//   const handleLoadMore = () => {
//     if (!loadingMore && !allConversationsLoaded) {
//       loadMoreConversations();
//     }
//   };

//   const renderItem = ({ item }) => (
//     <Animated.View
//       layout={Layout.duration(300)}
//       entering={FadeIn.duration(300)}
//       style={styles.conversationItem}
//     >
//       <TouchableOpacity onPress={() => handleSelectConversation(item)}>
//         <Text style={styles.subject}>{item.subject}</Text>
//         <Text style={styles.preview} numberOfLines={1}>{item.lastMessage}</Text>
//         <Text style={styles.time}>
//           {new Date(item.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//         </Text>
//       </TouchableOpacity>
//     </Animated.View>
//   );

//   const renderFooter = () => {
//     if (!loadingMore) return null;
//     return (
//       <View style={styles.footer}>
//         <ActivityIndicator size="small" />
//       </View>
//     );
//   };

//   if (loading && !refreshing) {
//     return (
//       <View style={styles.loader}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>{error}</Text>
//         <TouchableOpacity
//           style={styles.retryButton}
//           onPress={loadConversations}
//         >
//           <Text style={styles.retryText}>Retry</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.searchContainer}>
//         <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search messages..."
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//         />
//       </View>

//       <FlatList
//         data={filteredConversations}
//         renderItem={renderItem}
//         keyExtractor={item => item.id}
//         contentContainerStyle={styles.listContent}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//           />
//         }
//         ListFooterComponent={renderFooter}
//         onEndReached={handleLoadMore}
//         onEndReachedThreshold={0.5}
//         ListEmptyComponent={
//           <View style={styles.empty}>
//             <Ionicons name="mail-open-outline" size={48} color="#ccc" />
//             <Text style={styles.emptyText}>No conversations found</Text>
//           </View>
//         }
//       />

//       <TouchableOpacity
//         style={styles.composeButton}
//         onPress={() => router.push('/messages/compose')}
//       >
//         <Ionicons name="create-outline" size={24} color="#fff" />
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 15,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   searchIcon: {
//     marginRight: 10,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 16,
//   },
//   listContent: {
//     padding: 15,
//   },
//   conversationItem: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 10,
//     elevation: 1,
//   },
//   subject: {
//     fontWeight: 'bold',
//     fontSize: 16,
//     marginBottom: 5,
//   },
//   preview: {
//     color: '#666',
//     marginBottom: 5,
//   },
//   time: {
//     color: '#999',
//     fontSize: 12,
//     alignSelf: 'flex-end',
//   },
//   composeButton: {
//     position: 'absolute',
//     bottom: 20,
//     right: 20,
//     backgroundColor: '#007bff',
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 5,
//   },
//   empty: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 40,
//   },
//   emptyText: {
//     marginTop: 10,
//     color: '#666',
//   },
//   loader: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   errorText: {
//     color: 'red',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   retryButton: {
//     backgroundColor: '#007bff',
//     padding: 10,
//     borderRadius: 5,
//   },
//   retryText: {
//     color: '#fff',
//   },
//   footer: {
//     padding: 10,
//     alignItems: 'center',
//   },
// });

// export default ConversationList;
import React from 'react';
import { View, StyleSheet } from 'react-native';
import ConversationList from './ConversationList';

const MessagesScreen = () => {
  return (
    <View style={styles.container}>
      <ConversationList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default MessagesScreen;