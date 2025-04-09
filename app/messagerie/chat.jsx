// import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TextInput,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   Platform,
//   Image,
//   ScrollView,
//   Alert,
//   Keyboard
// } from 'react-native';
// import { useLocalSearchParams, useNavigation } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import { useMessaging, useAuth } from '../../context/MessagingContext';

// import { Message } from '../components/Messaging/Message';
// const ConversationView = () => {
//     const { id } = useLocalSearchParams();
//     const navigation = useNavigation();
//     const { user } = useAuth();
//     const { getConversation, sendMessage, markAsRead, pickAttachment, pickImage } = useMessaging();
    
//     const [messageText, setMessageText] = useState('');
//     const [attachments, setAttachments] = useState([]);
//     const [conversation, setConversation] = useState(null);
//     const [messages, setMessages] = useState([]);
//     const [keyboardHeight, setKeyboardHeight] = useState(0);
//     const flatListRef = useRef(null);

//     useEffect(() => {
//         const conv = getConversation(id);
//         if (conv) {
//             setConversation(conv);
//             markAsRead(id);
            
//             const mockMessages = [
//                 {
//                     id: '1',
//                     text: 'Hi there! How are you?',
//                     sender: conv.participants[0].id,
//                     timestamp: new Date(Date.now() - 86400000),
//                     read: true,
//                     attachments: []
//                 },
//                 {
//                     id: '2',
//                     text: "I'm good, thanks! How about you?",
//                     sender: user.id,
//                     timestamp: new Date(Date.now() - 43200000),
//                     read: true,
//                     attachments: []
//                 },
//                 {
//                     id: '3',
//                     text: 'Can you send me the latest project files?',
//                     sender: conv.participants[0].id,
//                     timestamp: new Date(Date.now() - 3600000),
//                     read: true,
//                     attachments: []
//                 }
//             ];
//             setMessages(mockMessages);
//         }

//         const keyboardDidShowListener = Keyboard.addListener(
//             'keyboardDidShow',
//             (e) => {
//                 setKeyboardHeight(e.endCoordinates.height);
//                 setTimeout(() => {
//                     if (flatListRef.current) {
//                         flatListRef.current.scrollToOffset({ offset: 0, animated: true });
//                     }
//                 }, 100);
//             }
//         );

//         const keyboardDidHideListener = Keyboard.addListener(
//             'keyboardDidHide',
//             () => {
//                 setKeyboardHeight(0);
//             }
//         );

//         return () => {
//             keyboardDidShowListener.remove();
//             keyboardDidHideListener.remove();
//         };
//     }, [id, getConversation, markAsRead, user]);

//     useLayoutEffect(() => {
//         if (conversation) {
//             const otherParticipant = conversation.participants.find(p => p.id !== user.id);
//             navigation.setOptions({
//                 title: otherParticipant?.name || 'Conversation',
//             });
//         }
//     }, [conversation, navigation, user]);

//     const handleSendMessage = async () => {
//         if (!messageText.trim() && attachments.length === 0) return;
        
//         const success = await sendMessage(id, messageText, attachments);
//         if (success) {
//             const newMessage = {
//                 id: Date.now().toString(),
//                 text: messageText,
//                 sender: user.id,
//                 timestamp: new Date(),
//                 read: false,
//                 attachments: [...attachments]
//             };
            
//             setMessages([...messages, newMessage]);
//             setMessageText('');
//             setAttachments([]);
            
//             setTimeout(() => {
//                 if (flatListRef.current) {
//                     flatListRef.current.scrollToOffset({ offset: 0, animated: true });
//                 }
//             }, 100);
//         }
//     };

//     const handlePickDocument = async () => {
//         const doc = await pickAttachment();
//         if (doc) {
//             setAttachments([...attachments, doc]);
//         }
//     };

//     const handlePickImage = async () => {
//         const img = await pickImage();
//         if (img) {
//             setAttachments([...attachments, img]);
//         }
//     };

//     const removeAttachment = (index) => {
//         const newAttachments = [...attachments];
//         newAttachments.splice(index, 1);
//         setAttachments(newAttachments);
//     };

//     return (
//         <View style={styles.container}>
//             <FlatList
//                 ref={flatListRef}
//                 data={[...messages].reverse()}
//                 keyExtractor={(item) => item.id}
//                 renderItem={({ item }) => (
//                     <Message
//                         message={item}
//                         isCurrentUser={item.sender === user.id}
//                     />
//                 )}
//                 contentContainerStyle={styles.messagesContainer}
//                 inverted={false}
//                 onContentSizeChange={() => {
//                     if (flatListRef.current) {
//                         flatListRef.current.scrollToOffset({ offset: 0, animated: true });
//                     }
//                 }}
//                 style={{ flex: 1 }}
//             />

//             <KeyboardAvoidingView
//                 behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//                 keyboardVerticalOffset={Platform.select({ ios: 0, android: 25 })}
//                 style={[
//                     styles.inputArea,
//                     { paddingBottom: keyboardHeight > 0 ? keyboardHeight - 30 : 16 }
//                 ]}
//             >
//                 {attachments.length > 0 && (
//                     <ScrollView
//                         horizontal
//                         style={styles.attachmentsContainer}
//                         contentContainerStyle={styles.attachmentsContent}
//                     >
//                         {attachments.map((attachment, index) => (
//                             <View key={index} style={styles.attachmentPreview}>
//                                 {attachment.type === 'image' ? (
//                                     <Image
//                                         source={{ uri: attachment.uri }}
//                                         style={styles.attachmentImage}
//                                     />
//                                 ) : (
//                                     <View style={styles.documentPreview}>
//                                         <Ionicons name="document" size={24} color="#555" />
//                                         <Text style={styles.documentName} numberOfLines={1}>
//                                             {attachment.name}
//                                         </Text>
//                                     </View>
//                                 )}
//                                 <TouchableOpacity
//                                     style={styles.removeAttachment}
//                                     onPress={() => removeAttachment(index)}
//                                 >
//                                     <Ionicons name="close" size={16} color="white" />
//                                 </TouchableOpacity>
//                             </View>
//                         ))}
//                     </ScrollView>
//                 )}

//                 <View style={styles.inputContainer}>
//                     <View style={styles.attachmentButtons}>
//                         <TouchableOpacity onPress={handlePickImage} style={styles.attachmentButton}>
//                             <Ionicons name="image" size={24} color="#007bff" />
//                         </TouchableOpacity>
//                         <TouchableOpacity onPress={handlePickDocument} style={styles.attachmentButton}>
//                             <Ionicons name="document" size={24} color="#007bff" />
//                         </TouchableOpacity>
//                     </View>
//                     <TextInput
//                         style={styles.input}
//                         placeholder="Type a message..."
//                         value={messageText}
//                         onChangeText={setMessageText}
//                         multiline
//                         onFocus={() => {
//                             setTimeout(() => {
//                                 if (flatListRef.current) {
//                                     flatListRef.current.scrollToOffset({ offset: 0, animated: true });
//                                 }
//                             }, 100);
//                         }}
//                     />
//                     <TouchableOpacity
//                         style={styles.sendButton}
//                         onPress={handleSendMessage}
//                         disabled={!messageText.trim() && attachments.length === 0}
//                     >
//                         <Ionicons
//                             name="send"
//                             size={24}
//                             color={messageText.trim() || attachments.length > 0 ? "#007bff" : "#ccc"}
//                         />
//                     </TouchableOpacity>
//                 </View>
//             </KeyboardAvoidingView>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   messagesContainer: {
//     padding: 16,
//     paddingBottom: 80,
//   },
//   inputArea: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'white',
//     borderTopWidth: 1,
//     borderTopColor: '#eee',
//   },
//   attachmentsContainer: {
//     maxHeight: 100,
//     padding: 8,
//   },
//   attachmentsContent: {
//     alignItems: 'center',
//   },
//   attachmentPreview: {
//     width: 80,
//     height: 80,
//     marginRight: 8,
//     borderRadius: 4,
//     overflow: 'hidden',
//     position: 'relative',
//   },
//   attachmentImage: {
//     width: '100%',
//     height: '100%',
//   },
//   documentPreview: {
//     width: '100%',
//     height: '100%',
//     backgroundColor: '#f0f0f0',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 4,
//   },
//   documentName: {
//     fontSize: 10,
//     marginTop: 4,
//     textAlign: 'center',
//   },
//   removeAttachment: {
//     position: 'absolute',
//     top: 4,
//     right: 4,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 8,
//   },
//   attachmentButtons: {
//     flexDirection: 'row',
//   },
//   attachmentButton: {
//     padding: 8,
//   },
//   input: {
//     flex: 1,
//     minHeight: 40,
//     maxHeight: 120,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     backgroundColor: '#f0f0f0',
//     borderRadius: 20,
//     marginHorizontal: 8,
//     fontSize: 16,
//   },
//   sendButton: {
//     padding: 8,
//   },
// });

// export default ConversationView;
import { Stack } from 'expo-router';
import ChatInterface from '../../components/ChatInterface';

export default function ChatScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ChatInterface />
    </>
  );
}