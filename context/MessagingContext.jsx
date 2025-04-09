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
    if (!auth.currentUser) return;

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
    });

    return unsubscribe;
  }, []);

  // Get all users (for creating new conversations)
  useEffect(() => {
    const q = query(collection(db, 'users'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(userList.filter(user => user.id !== auth.currentUser?.uid));
    });

    return unsubscribe;
  }, []);

  // Load messages for current conversation
  useEffect(() => {
    if (!currentConversation) return;

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
    });

    return unsubscribe;
  }, [currentConversation]);

  const startConversation = async (participantIds) => {
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

    const docRef = await addDoc(collection(db, 'conversations'), newConvo);
    const convoWithId = { id: docRef.id, ...newConvo };
    setCurrentConversation(convoWithId);
    return convoWithId;
  };

  const sendMessage = async (text) => {
    if (!currentConversation || !text.trim()) return;

    const message = {
      text,
      sender: auth.currentUser.uid,
      timestamp: serverTimestamp(),
      read: false
    };

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
  };

  const value = {
    conversations,
    currentConversation,
    messages,
    users,
    loading,
    startConversation,
    sendMessage,
    setCurrentConversation
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