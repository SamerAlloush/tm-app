// // services/messagingService.js
// import {
//     collection,
//     addDoc,
//     onSnapshot,
//     query,
//     where,
//     orderBy,
//     doc,
//     setDoc,
//     serverTimestamp,
//     updateDoc,
//     arrayUnion,
//     arrayRemove
//   } from 'firebase/firestore';
//   import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
//   import { db, storage } from '../firebase/firebaseConfig';
  
//   // Conversation functions
//   export const createConversation = async (participants, name = null) => {
//     try {
//       const conversationRef = await addDoc(collection(db, 'conversations'), {
//         participants: participants.map(p => p.id),
//         name: name || participants.map(p => p.name).join(', '),
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//       });
      
//       // Add conversation reference to each participant
//       await Promise.all(participants.map(async (participant) => {
//         if (participant.type === 'user') {
//           const userRef = doc(db, 'users', participant.id);
//           await updateDoc(userRef, {
//             conversations: arrayUnion(conversationRef.id)
//           });
//         }
//       }));
      
//       return conversationRef.id;
//     } catch (error) {
//       console.error('Error creating conversation:', error);
//       throw error;
//     }
//   };
  
//   export const getConversation = async (conversationId) => {
//     try {
//       const conversationRef = doc(db, 'conversations', conversationId);
//       const q = query(conversationRef);
//       const snapshot = await getDoc(q);
//       return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
//     } catch (error) {
//       console.error('Error getting conversation:', error);
//       throw error;
//     }
//   };
  
//   export const subscribeToConversations = (userId, callback) => {
//     const conversationsRef = collection(db, 'conversations');
//     const q = query(
//       conversationsRef,
//       where('participants', 'array-contains', userId),
//       orderBy('updatedAt', 'desc')
//     );
    
//     return onSnapshot(q, (snapshot) => {
//       const conversations = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data(),
//         updatedAt: doc.data().updatedAt?.toDate(),
//         createdAt: doc.data().createdAt?.toDate(),
//       }));
//       callback(conversations);
//     });
//   };
  
//   // Message functions
//   export const sendMessage = async (conversationId, message, senderId, attachments = []) => {
//     try {
//       // Upload attachments if any
//       const uploadedAttachments = await Promise.all(
//         attachments.map(async (attachment) => {
//           if (attachment.uri.startsWith('file://')) {
//             const response = await fetch(attachment.uri);
//             const blob = await response.blob();
//             const storageRef = ref(storage, `attachments/${conversationId}/${Date.now()}_${attachment.name || 'file'}`);
//             await uploadBytes(storageRef, blob);
//             const downloadURL = await getDownloadURL(storageRef);
//             return {
//               type: attachment.type,
//               url: downloadURL,
//               name: attachment.name,
//             };
//           }
//           return attachment;
//         })
//       );
  
//       // Add message to conversation
//       const messageRef = await addDoc(
//         collection(db, 'conversations', conversationId, 'messages'),
//         {
//           text: message,
//           sender: senderId,
//           attachments: uploadedAttachments,
//           createdAt: serverTimestamp(),
//         }
//       );
  
//       // Update conversation last updated time
//       await updateDoc(doc(db, 'conversations', conversationId), {
//         updatedAt: serverTimestamp(),
//         lastMessage: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
//       });
  
//       return messageRef.id;
//     } catch (error) {
//       console.error('Error sending message:', error);
//       throw error;
//     }
//   };
  
//   export const subscribeToMessages = (conversationId, callback) => {
//     const messagesRef = collection(db, 'conversations', conversationId, 'messages');
//     const q = query(messagesRef, orderBy('createdAt', 'asc'));
    
//     return onSnapshot(q, (snapshot) => {
//       const messages = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data(),
//         createdAt: doc.data().createdAt?.toDate(),
//       }));
//       callback(messages);
//     });
//   };
  
//   // User functions
//   export const getUser = async (userId) => {
//     try {
//       const userRef = doc(db, 'users', userId);
//       const snapshot = await getDoc(userRef);
//       return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
//     } catch (error) {
//       console.error('Error getting user:', error);
//       throw error;
//     }
//   };
  
//   export const searchUsers = async (searchTerm) => {
//     try {
//       const usersRef = collection(db, 'users');
//       const q = query(
//         usersRef,
//         where('name', '>=', searchTerm),
//         where('name', '<=', searchTerm + '\uf8ff'),
//         limit(20)
//       );
//       const snapshot = await getDocs(q);
//       return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//     } catch (error) {
//       console.error('Error searching users:', error);
//       throw error;
//     }
//   };
  
//   // Typing indicators
//   export const setTypingStatus = async (conversationId, userId, isTyping) => {
//     try {
//       const typingRef = doc(db, 'conversations', conversationId, 'typing', userId);
//       if (isTyping) {
//         await setDoc(typingRef, {
//           userId,
//           isTyping,
//           lastUpdated: serverTimestamp(),
//         }, { merge: true });
//       } else {
//         await deleteDoc(typingRef);
//       }
//     } catch (error) {
//       console.error('Error setting typing status:', error);
//       throw error;
//     }
//   };
  
//   export const subscribeToTypingStatus = (conversationId, callback) => {
//     const typingRef = collection(db, 'conversations', conversationId, 'typing');
    
//     return onSnapshot(typingRef, (snapshot) => {
//       const typingUsers = snapshot.docs
//         .filter(doc => doc.data().isTyping)
//         .map(doc => doc.id);
//       callback(typingUsers);
//     });
//   };
// services/messagingService.js
import { 
    collection, 
    addDoc, 
    onSnapshot, 
    query, 
    where, 
    orderBy, 
    doc, 
    setDoc,
    getDoc,
    serverTimestamp,
    updateDoc,
    arrayUnion,
    deleteDoc,
    getDocs,
    limit
  } from 'firebase/firestore';
  import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
  import { db, storage } from './firebaseConfig';
  
  // Conversation functions
  export const createConversation = async (participants, name = null) => {
    try {
      const conversationRef = await addDoc(collection(db, 'conversations'), {
        participants: participants.map(p => p.id),
        participantData: participants.reduce((acc, participant) => {
          acc[participant.id] = {
            name: participant.name,
            avatar: participant.avatar,
            role: participant.role
          };
          return acc;
        }, {}),
        name: name || participants.map(p => p.name).join(', '),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastMessage: '',
        lastMessageSender: '',
        unreadCount: {}
      });
      
      // Initialize unread counts for all participants
      const unreadUpdates = {};
      participants.forEach(p => {
        unreadUpdates[`unreadCount.${p.id}`] = 0;
      });
      
      await updateDoc(conversationRef, unreadUpdates);
      
      return conversationRef.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  };
  
  export const getConversation = async (conversationId) => {
    try {
      const conversationRef = doc(db, 'conversations', conversationId);
      const snapshot = await getDoc(conversationRef);
      return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
    } catch (error) {
      console.error('Error getting conversation:', error);
      throw error;
    }
  };
  
  export const subscribeToConversations = (userId, callback) => {
    const conversationsRef = collection(db, 'conversations');
    const q = query(
      conversationsRef,
      where('participants', 'array-contains', userId),
      orderBy('updatedAt', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const conversations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        updatedAt: doc.data().updatedAt?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
      }));
      callback(conversations);
    });
  };
  
  // Message functions
  export const sendMessage = async (conversationId, message, senderId, attachments = []) => {
    try {
      // Upload attachments if any
      const uploadedAttachments = await Promise.all(
        attachments.map(async (attachment) => {
          if (attachment.uri.startsWith('file://')) {
            const response = await fetch(attachment.uri);
            const blob = await response.blob();
            const storageRef = ref(storage, `attachments/${conversationId}/${Date.now()}_${attachment.name || 'file'}`);
            await uploadBytes(storageRef, blob);
            const downloadURL = await getDownloadURL(storageRef);
            return {
              type: attachment.type,
              url: downloadURL,
              name: attachment.name,
            };
          }
          return attachment;
        })
      );
  
      // Add message to conversation
      const messageRef = await addDoc(
        collection(db, 'conversations', conversationId, 'messages'), 
        {
          text: message,
          sender: senderId,
          attachments: uploadedAttachments,
          createdAt: serverTimestamp(),
          readBy: [senderId]
        }
      );
  
      // Update conversation last updated time and last message
      const conversationRef = doc(db, 'conversations', conversationId);
      await updateDoc(conversationRef, {
        updatedAt: serverTimestamp(),
        lastMessage: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        lastMessageSender: senderId,
      });
  
      // Increment unread count for all participants except sender
      const conversation = await getConversation(conversationId);
      const unreadUpdates = {};
      conversation.participants.forEach(participantId => {
        if (participantId !== senderId) {
          unreadUpdates[`unreadCount.${participantId}`] = (conversation.unreadCount?.[participantId] || 0) + 1;
        }
      });
      
      if (Object.keys(unreadUpdates).length > 0) {
        await updateDoc(conversationRef, unreadUpdates);
      }
  
      return messageRef.id;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };
  
  export const markMessagesAsRead = async (conversationId, userId) => {
    try {
      const conversationRef = doc(db, 'conversations', conversationId);
      await updateDoc(conversationRef, {
        [`unreadCount.${userId}`]: 0
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };
  
  export const subscribeToMessages = (conversationId, callback) => {
    const messagesRef = collection(db, 'conversations', conversationId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));
    
    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      }));
      callback(messages);
    });
  };
  
  // User functions
  export const getUser = async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      const snapshot = await getDoc(userRef);
      return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  };
  
  export const searchUsers = async (searchTerm, currentUserId) => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        where('name', '>=', searchTerm),
        where('name', '<=', searchTerm + '\uf8ff'),
        limit(20)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(user => user.id !== currentUserId);
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  };
  
  // Typing indicators
  export const setTypingStatus = async (conversationId, userId, isTyping) => {
    try {
      const typingRef = doc(db, 'conversations', conversationId, 'typing', userId);
      if (isTyping) {
        await setDoc(typingRef, {
          userId,
          isTyping,
          lastUpdated: serverTimestamp(),
        }, { merge: true });
      } else {
        await deleteDoc(typingRef);
      }
    } catch (error) {
      console.error('Error setting typing status:', error);
      throw error;
    }
  };
  
  export const subscribeToTypingStatus = (conversationId, callback) => {
    const typingRef = collection(db, 'conversations', conversationId, 'typing');
    
    return onSnapshot(typingRef, (snapshot) => {
      const typingUsers = snapshot.docs
        .filter(doc => doc.data().isTyping)
        .map(doc => doc.id);
      callback(typingUsers);
    });
  };