// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   TextInput
// } from 'react-native';
// import { useMessaging } from './MessagingContext';
// import { useNavigation } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// const NewConversation = () => {
//   const { users, startConversation } = useMessaging();
//   const navigation = useNavigation();
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedUsers, setSelectedUsers] = useState([]);

//   const filteredUsers = users.filter(user =>
//     user.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const toggleUserSelection = (userId) => {
//     setSelectedUsers(prev =>
//       prev.includes(userId)
//         ? prev.filter(id => id !== userId)
//         : [...prev, userId]
//     );
//   };

//   const createNewConversation = async () => {
//     if (selectedUsers.length === 0) return;
    
//     const conversation = await startConversation(selectedUsers);
//     navigation.navigate('Chat', { conversationId: conversation.id });
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>New Conversation</Text>
//       </View>
      
//       <View style={styles.searchContainer}>
//         <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search users..."
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//           placeholderTextColor="#666"
//         />
//       </View>

//       <FlatList
//         data={filteredUsers}
//         keyExtractor={item => item.id}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.userItem}
//             onPress={() => toggleUserSelection(item.id)}
//           >
//             <View style={styles.userInfo}>
//               <View style={styles.avatar}>
//                 <Text style={styles.avatarText}>
//                   {item.displayName?.charAt(0) || '?'}
//                 </Text>
//               </View>
//               <Text style={styles.userName}>{item.displayName || 'Unknown User'}</Text>
//             </View>
//             <View style={[
//               styles.checkbox,
//               selectedUsers.includes(item.id) && styles.checkboxSelected
//             ]}>
//               {selectedUsers.includes(item.id) && (
//                 <Icon name="check" size={16} color="#fff" />
//               )}
//             </View>
//           </TouchableOpacity>
//         )}
//       />

//       {selectedUsers.length > 0 && (
//         <TouchableOpacity
//           style={styles.createButton}
//           onPress={createNewConversation}
//         >
//           <Text style={styles.createButtonText}>
//             Start Conversation ({selectedUsers.length})
//           </Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   header: {
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 15,
//     marginVertical: 10,
//     backgroundColor: '#f5f5f5',
//     borderRadius: 20,
//     height: 40,
//   },
//   searchIcon: {
//     marginRight: 10,
//   },
//   searchInput: {
//     flex: 1,
//     height: '100%',
//     fontSize: 16,
//   },
//   userItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f5f5f5',
//   },
//   userInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   avatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#1e90ff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 15,
//   },
//   avatarText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   userName: {
//     fontSize: 16,
//     color: '#333',
//   },
//   checkbox: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: '#ccc',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   checkboxSelected: {
//     backgroundColor: '#1e90ff',
//     borderColor: '#1e90ff',
//   },
//   createButton: {
//     backgroundColor: '#1e90ff',
//     padding: 15,
//     margin: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   createButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default NewConversation;
import { Stack } from 'expo-router';
import NewConversationComponent from '../messagerie/NewConversation';

export default function NewConversationScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <NewConversationComponent />
    </>
  );
}