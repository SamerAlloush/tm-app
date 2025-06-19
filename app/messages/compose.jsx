// // // // import React, { useState } from 'react';
// // // // import {
// // // //   View,
// // // //   Text,
// // // //   TextInput,
// // // //   TouchableOpacity,
// // // //   StyleSheet,
// // // //   ScrollView,
// // // //   Image,
// // // //   KeyboardAvoidingView,
// // // //   Platform,
// // // //   ActivityIndicator,
// // // //   Alert
// // // // } from 'react-native';
// // // // import Icon from 'react-native-vector-icons/MaterialIcons';
// // // // import * as ImagePicker from 'expo-image-picker';
// // // // import { useMessaging } from '../../context/MessagingContext';
// // // // import { useNavigation } from 'expo-router';

// // // // const ComposeMessage = () => {
// // // //   const navigation = useNavigation();
// // // //   const { createNewMessage } = useMessaging();
  
// // // //   const [recipients, setRecipients] = useState('');
// // // //   const [subject, setSubject] = useState('');
// // // //   const [content, setContent] = useState('');
// // // //   const [attachments, setAttachments] = useState([]);
// // // //   const [isSending, setIsSending] = useState(false);

// // // //   const pickImage = async () => {
// // // //     const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
// // // //     if (!permissionResult.granted) {
// // // //       Alert.alert(
// // // //         "Permission Required",
// // // //         "We need access to your photos to attach images."
// // // //       );
// // // //       return;
// // // //     }

// // // //     try {
// // // //       const result = await ImagePicker.launchImageLibraryAsync({
// // // //         mediaTypes: ImagePicker.MediaTypeOptions.Images,
// // // //         allowsEditing: true,
// // // //         aspect: [4, 3],
// // // //         quality: 0.8,
// // // //       });

// // // //       if (!result.canceled && result.assets) {
// // // //         setAttachments([...attachments, ...result.assets.map(asset => ({
// // // //           uri: asset.uri,
// // // //           type: 'image',
// // // //           name: asset.fileName || `image_${Date.now()}.jpg`
// // // //         }))]);
// // // //       }
// // // //     } catch (error) {
// // // //       Alert.alert("Error", "Failed to pick image. Please try again.");
// // // //     }
// // // //   };

// // // //   const removeAttachment = (index) => {
// // // //     setAttachments(attachments.filter((_, i) => i !== index));
// // // //   };

// // // //   const validateEmail = (email) => {
// // // //     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// // // //     return re.test(String(email).toLowerCase());
// // // //   };

// // // //   const handleSend = async () => {
// // // //     if (!recipients.trim()) {
// // // //       Alert.alert("Error", "Please enter at least one recipient");
// // // //       return;
// // // //     }

// // // //     if (!subject.trim()) {
// // // //       Alert.alert("Error", "Please enter a subject");
// // // //       return;
// // // //     }

// // // //     if (!content.trim() && attachments.length === 0) {
// // // //       Alert.alert("Error", "Please enter a message or attach a file");
// // // //       return;
// // // //     }

// // // //     const recipientList = recipients.split(',').map(email => email.trim());
    
// // // //     const invalidEmails = recipientList.filter(email => !validateEmail(email));
// // // //     if (invalidEmails.length > 0) {
// // // //       Alert.alert(
// // // //         "Invalid Email",
// // // //         `The following emails are invalid: ${invalidEmails.join(', ')}`
// // // //       );
// // // //       return;
// // // //     }

// // // //     try {
// // // //       setIsSending(true);
// // // //       await createNewMessage(recipientList, subject, content, attachments);
// // // //       navigation.goBack();
// // // //     } catch (error) {
// // // //       Alert.alert("Error", "Failed to send message. Please try again.");
// // // //     } finally {
// // // //       setIsSending(false);
// // // //     }
// // // //   };

// // // //   return (
// // // //     <KeyboardAvoidingView
// // // //       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
// // // //       style={styles.container}
// // // //       keyboardVerticalOffset={90}
// // // //     >
// // // //       <ScrollView contentContainerStyle={styles.contentContainer}>
// // // //         <View style={styles.inputContainer}>
// // // //           <Text style={styles.label}>To:</Text>
// // // //           <TextInput
// // // //             style={styles.input}
// // // //             placeholder="Enter recipient emails (comma separated)"
// // // //             value={recipients}
// // // //             onChangeText={setRecipients}
// // // //             keyboardType="email-address"
// // // //             autoCapitalize="none"
// // // //             autoCorrect={false}
// // // //             editable={!isSending}
// // // //           />
// // // //         </View>
        
// // // //         <View style={styles.inputContainer}>
// // // //           <Text style={styles.label}>Subject:</Text>
// // // //           <TextInput
// // // //             style={styles.input}
// // // //             placeholder="Enter subject"
// // // //             value={subject}
// // // //             onChangeText={setSubject}
// // // //             editable={!isSending}
// // // //           />
// // // //         </View>
        
// // // //         <TextInput
// // // //           style={[styles.input, styles.messageInput]}
// // // //           placeholder="Type your message here..."
// // // //           multiline
// // // //           value={content}
// // // //           onChangeText={setContent}
// // // //           editable={!isSending}
// // // //         />
        
// // // //         {attachments.length > 0 && (
// // // //           <View style={styles.attachmentsContainer}>
// // // //             <Text style={styles.attachmentsLabel}>Attachments:</Text>
// // // //             <ScrollView
// // // //               horizontal
// // // //               style={styles.attachmentsScroll}
// // // //               contentContainerStyle={styles.attachmentsScrollContent}
// // // //             >
// // // //               {attachments.map((attachment, index) => (
// // // //                 <View key={index} style={styles.attachmentItem}>
// // // //                   <Image
// // // //                     source={{ uri: attachment.uri }}
// // // //                     style={styles.attachmentImage}
// // // //                     resizeMode="cover"
// // // //                   />
// // // //                   <TouchableOpacity
// // // //                     style={styles.removeAttachment}
// // // //                     onPress={() => removeAttachment(index)}
// // // //                     disabled={isSending}
// // // //                   >
// // // //                     <Icon name="close" size={16} color="#fff" />
// // // //                   </TouchableOpacity>
// // // //                 </View>
// // // //               ))}
// // // //             </ScrollView>
// // // //           </View>
// // // //         )}
// // // //       </ScrollView>
      
// // // //       <View style={styles.footer}>
// // // //         <TouchableOpacity
// // // //           style={styles.attachmentButton}
// // // //           onPress={pickImage}
// // // //           disabled={isSending}
// // // //         >
// // // //           <Icon name="attach-file" size={24} color="#666" />
// // // //         </TouchableOpacity>
        
// // // //         <TouchableOpacity
// // // //           style={styles.sendButton}
// // // //           onPress={handleSend}
// // // //           disabled={
// // // //             !recipients.trim() ||
// // // //             !subject.trim() ||
// // // //             (!content.trim() && attachments.length === 0) ||
// // // //             isSending
// // // //           }
// // // //         >
// // // //           {isSending ? (
// // // //             <ActivityIndicator size="small" color="#fff" />
// // // //           ) : (
// // // //             <>
// // // //               <Icon name="send" size={24} color="#fff" />
// // // //               <Text style={styles.sendButtonText}>Send</Text>
// // // //             </>
// // // //           )}
// // // //         </TouchableOpacity>
// // // //       </View>
// // // //     </KeyboardAvoidingView>
// // // //   );
// // // // };

// // // // const styles = StyleSheet.create({
// // // //   container: {
// // // //     flex: 1,
// // // //     backgroundColor: '#fff',
// // // //   },
// // // //   contentContainer: {
// // // //     padding: 15,
// // // //     paddingBottom: 80,
// // // //   },
// // // //   inputContainer: {
// // // //     marginBottom: 15,
// // // //   },
// // // //   label: {
// // // //     marginBottom: 5,
// // // //     color: '#666',
// // // //     fontWeight: 'bold',
// // // //     fontSize: 16,
// // // //   },
// // // //   input: {
// // // //     borderWidth: 1,
// // // //     borderColor: '#e0e0e0',
// // // //     borderRadius: 8,
// // // //     padding: 12,
// // // //     fontSize: 16,
// // // //   },
// // // //   messageInput: {
// // // //     minHeight: 150,
// // // //     textAlignVertical: 'top',
// // // //   },
// // // //   attachmentsContainer: {
// // // //     marginTop: 15,
// // // //   },
// // // //   attachmentsLabel: {
// // // //     marginBottom: 8,
// // // //     color: '#666',
// // // //     fontWeight: 'bold',
// // // //     fontSize: 16,
// // // //   },
// // // //   attachmentsScroll: {
// // // //     maxHeight: 120,
// // // //   },
// // // //   attachmentsScrollContent: {
// // // //     flexDirection: 'row',
// // // //   },
// // // //   attachmentItem: {
// // // //     position: 'relative',
// // // //     marginRight: 10,
// // // //   },
// // // //   attachmentImage: {
// // // //     width: 100,
// // // //     height: 100,
// // // //     borderRadius: 8,
// // // //   },
// // // //   removeAttachment: {
// // // //     position: 'absolute',
// // // //     top: 5,
// // // //     right: 5,
// // // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // // //     borderRadius: 10,
// // // //     width: 20,
// // // //     height: 20,
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //   },
// // // //   footer: {
// // // //     position: 'absolute',
// // // //     bottom: 0,
// // // //     left: 0,
// // // //     right: 0,
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     padding: 12,
// // // //     backgroundColor: '#f5f5f5',
// // // //     borderTopWidth: 1,
// // // //     borderTopColor: '#e0e0e0',
// // // //   },
// // // //   attachmentButton: {
// // // //     padding: 10,
// // // //   },
// // // //   sendButton: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     backgroundColor: '#007bff',
// // // //     paddingVertical: 10,
// // // //     paddingHorizontal: 20,
// // // //     borderRadius: 20,
// // // //   },
// // // //   sendButtonText: {
// // // //     marginLeft: 8,
// // // //     color: '#fff',
// // // //     fontWeight: 'bold',
// // // //     fontSize: 16,
// // // //   },
// // // // });

// // // // export default ComposeMessage;
// // // import React, { useState } from 'react';
// // // import {
// // //   View, Text, TextInput, TouchableOpacity,
// // //   StyleSheet, ScrollView, ActivityIndicator
// // // } from 'react-native';
// // // import { Ionicons } from '@expo/vector-icons';
// // // import { useMessaging } from '../../context/MessagingContext';
// // // import { useAuth } from '../../context/AuthContext';
// // // import { useRouter } from 'expo-router';
// // // import * as ImagePicker from 'expo-image-picker';

// // // const ComposeMessage = () => {
// // //   const router = useRouter();
// // //   const { currentUser } = useAuth();
// // //   const { createConversation, sendMessage } = useMessaging();
  
// // //   const [recipients, setRecipients] = useState('');
// // //   const [subject, setSubject] = useState('');
// // //   const [content, setContent] = useState('');
// // //   const [attachments, setAttachments] = useState([]);
// // //   const [isSending, setIsSending] = useState(false);

// // //   const pickImage = async () => {
// // //     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
// // //     if (status !== 'granted') return;

// // //     const result = await ImagePicker.launchImageLibraryAsync({
// // //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
// // //       quality: 0.8,
// // //       allowsMultipleSelection: true
// // //     });

// // //     if (!result.canceled) {
// // //       setAttachments(prev => [
// // //         ...prev,
// // //         ...result.assets.map(a => ({
// // //           uri: a.uri,
// // //           type: 'image',
// // //           name: a.fileName || `image_${Date.now()}.jpg`
// // //         }))
// // //       ]);
// // //     }
// // //   };

// // //   const handleSend = async () => {
// // //     if (!recipients.trim() || !subject.trim() || (!content.trim() && attachments.length === 0)) {
// // //       return;
// // //     }

// // //     try {
// // //       setIsSending(true);
// // //       const recipientIds = recipients.split(',').map(r => r.trim());
// // //       const conversationId = await createConversation(
// // //         [currentUser.uid, ...recipientIds],
// // //         subject
// // //       );
      
// // //       await sendMessage(conversationId, content, attachments);
// // //       router.back();
// // //     } catch (error) {
// // //       console.error('Send error:', error);
// // //     } finally {
// // //       setIsSending(false);
// // //     }
// // //   };

// // //   return (
// // //     <ScrollView contentContainerStyle={styles.container}>
// // //       <View style={styles.inputGroup}>
// // //         <Text style={styles.label}>To:</Text>
// // //         <TextInput
// // //           style={styles.input}
// // //           placeholder="Enter recipient IDs (comma separated)"
// // //           value={recipients}
// // //           onChangeText={setRecipients}
// // //           editable={!isSending}
// // //         />
// // //       </View>

// // //       <View style={styles.inputGroup}>
// // //         <Text style={styles.label}>Subject:</Text>
// // //         <TextInput
// // //           style={styles.input}
// // //           placeholder="Enter subject"
// // //           value={subject}
// // //           onChangeText={setSubject}
// // //           editable={!isSending}
// // //         />
// // //       </View>

// // //       <TextInput
// // //         style={[styles.input, styles.messageInput]}
// // //         placeholder="Type your message..."
// // //         multiline
// // //         value={content}
// // //         onChangeText={setContent}
// // //         editable={!isSending}
// // //       />

// // //       <TouchableOpacity
// // //         style={styles.attachButton}
// // //         onPress={pickImage}
// // //         disabled={isSending}
// // //       >
// // //         <Ionicons name="attach" size={24} color="#666" />
// // //         <Text style={styles.attachText}>Attach files</Text>
// // //       </TouchableOpacity>

// // //       <TouchableOpacity
// // //         style={[styles.sendButton, isSending && styles.disabledButton]}
// // //         onPress={handleSend}
// // //         disabled={isSending}
// // //       >
// // //         {isSending ? (
// // //           <ActivityIndicator color="#fff" />
// // //         ) : (
// // //           <Text style={styles.sendText}>Send Message</Text>
// // //         )}
// // //       </TouchableOpacity>
// // //     </ScrollView>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     padding: 20,
// // //   },
// // //   inputGroup: {
// // //     marginBottom: 20,
// // //   },
// // //   label: {
// // //     marginBottom: 8,
// // //     fontWeight: 'bold',
// // //     color: '#333',
// // //   },
// // //   input: {
// // //     borderWidth: 1,
// // //     borderColor: '#ddd',
// // //     borderRadius: 8,
// // //     padding: 12,
// // //     fontSize: 16,
// // //   },
// // //   messageInput: {
// // //     minHeight: 150,
// // //     textAlignVertical: 'top',
// // //   },
// // //   attachButton: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     padding: 12,
// // //     marginBottom: 20,
// // //   },
// // //   attachText: {
// // //     marginLeft: 10,
// // //     color: '#666',
// // //   },
// // //   sendButton: {
// // //     backgroundColor: '#007bff',
// // //     padding: 15,
// // //     borderRadius: 8,
// // //     alignItems: 'center',
// // //   },
// // //   disabledButton: {
// // //     backgroundColor: '#ccc',
// // //   },
// // //   sendText: {
// // //     color: '#fff',
// // //     fontWeight: 'bold',
// // //     fontSize: 16,
// // //   },
// // // });

// // // export default ComposeMessage;
// // import React, { useState } from 'react';
// // import {
// //   View,
// //   Text,
// //   TextInput,
// //   TouchableOpacity,
// //   StyleSheet,
// //   ScrollView,
// //   ActivityIndicator,
// //   Image
// // } from 'react-native';
// // import { Ionicons } from '@expo/vector-icons';
// // import { useMessaging } from '../../context/MessagingContext';
// // import { useAuth } from '../../context/AuthContext';
// // import { useRouter } from 'expo-router';
// // import * as ImagePicker from 'expo-image-picker';

// // const ComposeMessage = () => {
// //   const router = useRouter();
// //   const { currentUser } = useAuth();
// //   const { createConversation, sendMessage } = useMessaging();
  
// //   const [recipients, setRecipients] = useState('');
// //   const [subject, setSubject] = useState('');
// //   const [content, setContent] = useState('');
// //   const [attachments, setAttachments] = useState([]);
// //   const [isSending, setIsSending] = useState(false);

// //   const pickImage = async () => {
// //     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
// //     if (status !== 'granted') return;

// //     const result = await ImagePicker.launchImageLibraryAsync({
// //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
// //       quality: 0.8,
// //       allowsMultipleSelection: true
// //     });

// //     if (!result.canceled) {
// //       setAttachments(prev => [
// //         ...prev,
// //         ...result.assets.map(a => ({
// //           uri: a.uri,
// //           type: 'image',
// //           name: a.fileName || `image_${Date.now()}.jpg`
// //         }))
// //       ]);
// //     }
// //   };

// //   const handleSend = async () => {
// //     if (!recipients.trim() || !subject.trim() || (!content.trim() && attachments.length === 0)) {
// //       return;
// //     }

// //     try {
// //       setIsSending(true);
// //       const recipientIds = recipients.split(',').map(r => r.trim());
// //       const conversationId = await createConversation(
// //         [currentUser.uid, ...recipientIds],
// //         subject
// //       );
      
// //       await sendMessage(conversationId, content, attachments);
// //       router.back();
// //     } catch (error) {
// //       console.error('Send error:', error);
// //     } finally {
// //       setIsSending(false);
// //     }
// //   };

// //   return (
// //     <ScrollView contentContainerStyle={styles.container}>
// //       <View style={styles.inputGroup}>
// //         <Text style={styles.label}>To:</Text>
// //         <TextInput
// //           style={styles.input}
// //           placeholder="Enter recipient IDs (comma separated)"
// //           value={recipients}
// //           onChangeText={setRecipients}
// //           editable={!isSending}
// //         />
// //       </View>

// //       <View style={styles.inputGroup}>
// //         <Text style={styles.label}>Subject:</Text>
// //         <TextInput
// //           style={styles.input}
// //           placeholder="Enter subject"
// //           value={subject}
// //           onChangeText={setSubject}
// //           editable={!isSending}
// //         />
// //       </View>

// //       <TextInput
// //         style={[styles.input, styles.messageInput]}
// //         placeholder="Type your message..."
// //         multiline
// //         value={content}
// //         onChangeText={setContent}
// //         editable={!isSending}
// //       />

// //       <TouchableOpacity
// //         style={styles.attachButton}
// //         onPress={pickImage}
// //         disabled={isSending}
// //       >
// //         <Ionicons name="attach" size={24} color="#666" />
// //         <Text style={styles.attachText}>Attach files</Text>
// //       </TouchableOpacity>

// //       <TouchableOpacity
// //         style={[styles.sendButton, isSending && styles.disabledButton]}
// //         onPress={handleSend}
// //         disabled={isSending}
// //       >
// //         {isSending ? (
// //           <ActivityIndicator color="#fff" />
// //         ) : (
// //           <Text style={styles.sendText}>Send Message</Text>
// //         )}
// //       </TouchableOpacity>
// //     </ScrollView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     padding: 20,
// //   },
// //   inputGroup: {
// //     marginBottom: 20,
// //   },
// //   label: {
// //     marginBottom: 8,
// //     fontWeight: 'bold',
// //     color: '#333',
// //   },
// //   input: {
// //     borderWidth: 1,
// //     borderColor: '#ddd',
// //     borderRadius: 8,
// //     padding: 12,
// //     fontSize: 16,
// //   },
// //   messageInput: {
// //     minHeight: 150,
// //     textAlignVertical: 'top',
// //   },
// //   attachButton: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     padding: 12,
// //     marginBottom: 20,
// //   },
// //   attachText: {
// //     marginLeft: 10,
// //     color: '#666',
// //   },
// //   sendButton: {
// //     backgroundColor: '#007bff',
// //     padding: 15,
// //     borderRadius: 8,
// //     alignItems: 'center',
// //   },
// //   disabledButton: {
// //     backgroundColor: '#ccc',
// //   },
// //   sendText: {
// //     color: '#fff',
// //     fontWeight: 'bold',
// //     fontSize: 16,
// //   },
// // });

// // export default ComposeMessage;
// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   ActivityIndicator,
//   Image
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useMessaging } from '../../context/MessagingContext';
// import { useAuth } from '../../context/AuthContext';
// import { useRouter } from 'expo-router';
// import * as ImagePicker from 'expo-image-picker';

// const ComposeMessage = () => {
//   const router = useRouter();
//   const { currentUser } = useAuth();
//   const { createConversation } = useMessaging();
  
//   const [recipients, setRecipients] = useState('');
//   const [subject, setSubject] = useState('');
//   const [content, setContent] = useState('');
//   const [attachments, setAttachments] = useState([]);
//   const [isSending, setIsSending] = useState(false);

//   const pickImage = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== 'granted') return;

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 0.8,
//       allowsMultipleSelection: true
//     });

//     if (!result.canceled) {
//       setAttachments(prev => [
//         ...prev,
//         ...result.assets.map(a => ({
//           uri: a.uri,
//           type: 'image',
//           name: a.fileName || `image_${Date.now()}.jpg`
//         }))
//       ]);
//     }
//   };

//   const handleSend = async () => {
//     if (!recipients.trim() || !subject.trim() || (!content.trim() && attachments.length === 0)) {
//       return;
//     }

//     try {
//       setIsSending(true);
//       const recipientIds = recipients.split(',').map(r => r.trim());
//       const conversationId = await createConversation(
//         recipientIds,
//         subject
//       );
      
//       router.replace({
//         pathname: `/messages/${conversationId}`,
//         params: { title: subject }
//       });
//     } catch (error) {
//       console.error('Send error:', error);
//     } finally {
//       setIsSending(false);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <View style={styles.inputGroup}>
//         <Text style={styles.label}>To:</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter recipient IDs (comma separated)"
//           value={recipients}
//           onChangeText={setRecipients}
//           editable={!isSending}
//         />
//       </View>

//       <View style={styles.inputGroup}>
//         <Text style={styles.label}>Subject:</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter subject"
//           value={subject}
//           onChangeText={setSubject}
//           editable={!isSending}
//         />
//       </View>

//       <TextInput
//         style={[styles.input, styles.messageInput]}
//         placeholder="Type your message..."
//         multiline
//         value={content}
//         onChangeText={setContent}
//         editable={!isSending}
//       />

//       <TouchableOpacity
//         style={styles.attachButton}
//         onPress={pickImage}
//         disabled={isSending}
//       >
//         <Ionicons name="attach" size={24} color="#666" />
//         <Text style={styles.attachText}>Attach files</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={[styles.sendButton, isSending && styles.disabledButton]}
//         onPress={handleSend}
//         disabled={isSending}
//       >
//         {isSending ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text style={styles.sendText}>Send Message</Text>
//         )}
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//   },
//   inputGroup: {
//     marginBottom: 20,
//   },
//   label: {
//     marginBottom: 8,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 16,
//   },
//   messageInput: {
//     minHeight: 150,
//     textAlignVertical: 'top',
//   },
//   attachButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 12,
//     marginBottom: 20,
//   },
//   attachText: {
//     marginLeft: 10,
//     color: '#666',
//   },
//   sendButton: {
//     backgroundColor: '#007bff',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   disabledButton: {
//     backgroundColor: '#ccc',
//   },
//   sendText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
// });

// export default ComposeMessage;
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator,
  Image,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMessaging } from '../../context/MessagingContext';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { uploadFile } from '../../utils/storage';
import { Video } from 'expo-av';

const ComposeMessage = () => {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { createConversation, isSendingMessage } = useMessaging();
  
  const [recipients, setRecipients] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);

  const pickMedia = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'We need access to your media library to attach files');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 0.8,
      allowsMultipleSelection: true
    });

    if (!result.canceled) {
      setAttachments(prev => [
        ...prev,
        ...result.assets.map(a => ({
          uri: a.uri,
          type: a.type === 'video' ? 'video' : 'image',
          name: a.fileName || `${a.type}_${Date.now()}.${a.type === 'video' ? 'mp4' : 'jpg'}`
        }))
      ]);
    }
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if (!recipients.trim()) {
      Alert.alert('Error', 'Please enter at least one recipient');
      return;
    }

    if (!subject.trim()) {
      Alert.alert('Error', 'Please enter a subject');
      return;
    }

    if (!content.trim() && attachments.length === 0) {
      Alert.alert('Error', 'Please enter a message or attach a file');
      return;
    }

    try {
      setUploading(true);
      const recipientIds = recipients.split(',').map(r => r.trim());
      
      // Upload attachments first
      const uploadedAttachments = await Promise.all(
        attachments.map(async (attachment) => {
          const downloadUrl = await uploadFile(
            `messages/${Date.now()}_${attachment.name}`,
            attachment.uri
          );
          return {
            uri: downloadUrl,
            type: attachment.type
          };
        })
      );

      const conversationId = await createConversation(
        recipientIds,
        subject,
        content,
        uploadedAttachments
      );
      
      router.replace({
        pathname: `/messages/${conversationId}`,
        params: { title: subject }
      });
    } catch (error) {
      console.error('Send error:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>To:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter recipient IDs (comma separated)"
          value={recipients}
          onChangeText={setRecipients}
          editable={!uploading}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Subject:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter subject"
          value={subject}
          onChangeText={setSubject}
          editable={!uploading}
        />
      </View>

      <TextInput
        style={[styles.input, styles.messageInput]}
        placeholder="Type your message..."
        multiline
        value={content}
        onChangeText={setContent}
        editable={!uploading}
      />

      <TouchableOpacity 
        style={styles.attachButton}
        onPress={pickMedia}
        disabled={uploading}
      >
        <Ionicons name="attach" size={24} color="#666" />
        <Text style={styles.attachText}>Attach files</Text>
      </TouchableOpacity>

      {attachments.length > 0 && (
        <View style={styles.attachmentsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {attachments.map((att, index) => (
              <View key={index} style={styles.attachmentItem}>
                {att.type === 'image' ? (
                  <Image source={{ uri: att.uri }} style={styles.attachmentImage} />
                ) : (
                  <Video
                    source={{ uri: att.uri }}
                    style={styles.attachmentImage}
                    resizeMode="cover"
                    shouldPlay={false}
                  />
                )}
                <TouchableOpacity 
                  style={styles.removeAttachment}
                  onPress={() => removeAttachment(index)}
                >
                  <Ionicons name="close" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      <TouchableOpacity
        style={[styles.sendButton, (uploading || isSendingMessage) && styles.disabledButton]}
        onPress={handleSend}
        disabled={uploading || isSendingMessage}
      >
        {uploading || isSendingMessage ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.sendText}>Send Message</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  messageInput: {
    minHeight: 150,
    textAlignVertical: 'top',
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 20,
  },
  attachText: {
    marginLeft: 10,
    color: '#666',
  },
  attachmentsContainer: {
    marginBottom: 20,
  },
  attachmentItem: {
    position: 'relative',
    marginRight: 10,
  },
  attachmentImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeAttachment: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  sendText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ComposeMessage;