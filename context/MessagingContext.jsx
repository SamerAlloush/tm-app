import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, auth } from '../firebase/firebaseConfig';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  onSnapshot,
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';

const MessagingContext = createContext();

export function MessagingProvider({ children }) {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  // Get all conversations for the current user
  useEffect(() => {
    if (!auth.currentUser) {
      setConversations([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', auth.currentUser.uid),
      orderBy('lastUpdated', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const convos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setConversations(convos);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching conversations:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Get all users (for creating new conversations)
  useEffect(() => {
    if (!auth.currentUser) {
      setUsers([]);
      return;
    }

    const q = query(collection(db, 'users'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(userList.filter(user => user.id !== auth.currentUser?.uid));
    }, (error) => {
      console.error("Error fetching users:", error);
    });

    return unsubscribe;
  }, []);

  // Load messages for current conversation
  useEffect(() => {
    if (!currentConversation || !auth.currentUser) return;

    const q = query(
      collection(db, 'conversations', currentConversation.id, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      }));
      setMessages(msgs);
    }, (error) => {
      console.error("Error fetching messages:", error);
    });

    return unsubscribe;
  }, [currentConversation]);

  const startConversation = async (participantIds) => {
    if (!auth.currentUser) {
      console.error("Cannot start conversation: User not authenticated");
      return null;
    }

    const participants = [...participantIds, auth.currentUser.uid];
    
    // Check if conversation already exists
    const existingConvo = conversations.find(convo => 
      convo.participants.length === participants.length &&
      convo.participants.every(id => participants.includes(id))
    );
    
    if (existingConvo) {
      setCurrentConversation(existingConvo);
      return existingConvo;
    }

    // Create new conversation
    const newConvo = {
      participants,
      lastUpdated: serverTimestamp(),
      createdBy: auth.currentUser.uid
    };

    try {
      const docRef = await addDoc(collection(db, 'conversations'), newConvo);
      const convoWithId = { id: docRef.id, ...newConvo };
      setCurrentConversation(convoWithId);
      return convoWithId;
    } catch (error) {
      console.error("Error creating conversation:", error);
      return null;
    }
  };

  const sendMessage = async (text) => {
    if (!currentConversation || !text.trim() || !auth.currentUser) return;

    const message = {
      text,
      sender: auth.currentUser.uid,
      timestamp: serverTimestamp(),
      read: false
    };

    try {
      await addDoc(
        collection(db, 'conversations', currentConversation.id, 'messages'),
        message
      );

      // Update conversation lastUpdated
      await setDoc(
        doc(db, 'conversations', currentConversation.id),
        { lastUpdated: serverTimestamp() },
        { merge: true }
      );
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const refreshConversations = async () => {
    if (!auth.currentUser) {
      setConversations([]);
      return;
    }
    
    setLoading(true);
    // The onSnapshot listener will update the conversations
    // when the data changes, so we just need to set loading to false
    setTimeout(() => setLoading(false), 1000);
  };

  const value = {
    conversations,
    currentConversation,
    messages,
    users,
    loading,
    startConversation,
    sendMessage,
    setCurrentConversation,
    refreshConversations
  };

  return (
    <MessagingContext.Provider value={value}>
      {children}
    </MessagingContext.Provider>
  );
}

export function useMessaging() {
  return useContext(MessagingContext);
}