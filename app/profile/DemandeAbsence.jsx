
// // // // export default DemandeAbsence;
// // // import React, { useState } from 'react';
// // // import { View, Text, TextInput, Alert, StyleSheet, ScrollView, Modal, SafeAreaView } from 'react-native';
// // // import { RadioButton, Checkbox, Button } from 'react-native-paper';
// // // import { Calendar } from 'react-native-calendars';
// // // import { useLocalSearchParams, useRouter } from 'expo-router';

// // // const DemandeAbsence = () => {
// // //   const router = useRouter();
// // //   const { pendingDemands: pendingDemandsParam } = useLocalSearchParams();

// // //   // Ensure pendingDemands is an array
// // //   const [pendingDemands, setPendingDemands] = useState(
// // //     pendingDemandsParam ? JSON.parse(pendingDemandsParam) : []
// // //   );

// // //   const [firstName, setFirstName] = useState('');
// // //   const [lastName, setLastName] = useState('');
// // //   const [reason, setReason] = useState('sick');
// // //   const [morningChecked, setMorningChecked] = useState(false);
// // //   const [afternoonChecked, setAfternoonChecked] = useState(false);
// // //   const [selectedDates, setSelectedDates] = useState({});
// // //   const [isCalendarVisible, setIsCalendarVisible] = useState(false);

// // //   // Define holidays (you can expand this list as needed)
// // //   const holidays = {
// // //     '2023-12-25': { disabled: true, disableTouchEvent: true }, // Christmas
// // //     '2024-01-01': { disabled: true, disableTouchEvent: true }, // New Year's Day
// // //   };

// // //   const onDayPress = (day) => {
// // //     const { dateString } = day;
// // //     const today = new Date();
// // //     const selectedDate = new Date(dateString);

// // //     // Check if the selected date is in the past
// // //     if (selectedDate < today) {
// // //       Alert.alert("Invalid Date", "You cannot select a date that has already passed.");
// // //       return;
// // //     }

// // //     // Check if the selected date is a weekend
// // //     const dayOfWeek = selectedDate.getDay();
// // //     if (dayOfWeek === 0 || dayOfWeek === 6) {
// // //       Alert.alert("Invalid Date", "Weekends cannot be selected. Please choose another date.");
// // //       return;
// // //     }

// // //     // Check if the selected date is a holiday
// // //     if (holidays[dateString]) {
// // //       Alert.alert("Invalid Date", "This date is a holiday. Please choose another date.");
// // //       return;
// // //     }

// // //     // Toggle the selected date
// // //     const newDates = { ...selectedDates };
// // //     if (newDates[dateString]) {
// // //       delete newDates[dateString];
// // //     } else {
// // //       newDates[dateString] = { selected: true, selectedColor: 'blue' };
// // //     }
// // //     setSelectedDates(newDates);
// // //   };

// // //   const handleSubmit = () => {
// // //     const dates = Object.keys(selectedDates);
// // //     if (dates.length > 0) {
// // //       const newDemand = {
// // //         id: pendingDemands.length + 1,
// // //         firstName,
// // //         lastName,
// // //         reason,
// // //         dates: dates.join(', '),
// // //         morningChecked,
// // //         afternoonChecked,
// // //         status: 'Pending',
// // //       };

// // //       // Update the pending demands state
// // //       const updatedPendingDemands = [...pendingDemands, newDemand];
// // //       setPendingDemands(updatedPendingDemands);

// // //       // Pass the updated state back to the profile screen
// // //       router.push({
// // //         pathname: '/profile',
// // //         params: { updatedPendingDemands: JSON.stringify(updatedPendingDemands) },
// // //       });

// // //       Alert.alert("Absence Request Submitted", `You have requested absence for: ${dates.join(', ')}`);
// // //       clearForm();
// // //     } else {
// // //       Alert.alert("No Dates Selected", "Please select one or more dates for your absence.");
// // //     }
// // //   };

// // //   const clearForm = () => {
// // //     setFirstName('');
// // //     setLastName('');
// // //     setReason('sick');
// // //     setMorningChecked(false);
// // //     setAfternoonChecked(false);
// // //     setSelectedDates({});
// // //   };

// // //   const goToProfile = () => {
// // //     router.push('/profile');
// // //   };

// // //   return (
// // //     <SafeAreaView style={{ flex: 1 }}>
// // //       <ScrollView style={styles.container} contentContainerStyle={styles.content}>
// // //         <Text style={styles.title}>Demande d'Absence</Text>
// // //         <TextInput style={styles.input} onChangeText={setFirstName} value={firstName} placeholder="First Name" />
// // //         <TextInput style={styles.input} onChangeText={setLastName} value={lastName} placeholder="Last Name" />

// // //         <Text style={styles.subtitle}>Reason of Absence</Text>
// // //         <RadioButton.Group onValueChange={newReason => setReason(newReason)} value={reason}>
// // //           <View style={styles.radioContainer}>
// // //             <RadioButton value="sick" />
// // //             <Text style={styles.label}>Sickness</Text>
// // //           </View>
// // //           <View style={styles.radioContainer}>
// // //             <RadioButton value="vacation" />
// // //             <Text style={styles.label}>Vacation</Text>
// // //           </View>
// // //           <View style={styles.radioContainer}>
// // //             <RadioButton value="personal" />
// // //             <Text style={styles.label}>Personal</Text>
// // //           </View>
// // //         </RadioButton.Group>

// // //         <Text style={styles.subtitle}>Select Absence Days</Text>
// // //         {Object.keys(selectedDates).length > 0 && (
// // //           <View style={styles.selectedDatesContainer}>
// // //             <Text style={styles.selectedDatesText}>Selected Days: {Object.keys(selectedDates).join(', ')}</Text>
// // //             <Button mode="outlined" onPress={() => setSelectedDates({})} style={styles.clearButton}>Clear Selected Days</Button>
// // //           </View>
// // //         )}

// // //         <Button mode="contained" onPress={() => setIsCalendarVisible(true)} style={styles.button}>
// // //           {Object.keys(selectedDates).length > 0 ? "Modify Absence Day" : "Choose Absence Day"}
// // //         </Button>

// // //         <Modal visible={isCalendarVisible} animationType="slide" transparent={true} onRequestClose={() => setIsCalendarVisible(false)}>
// // //           <View style={styles.modalContainer}>
// // //             <View style={styles.calendarContainer}>
// // //               <Calendar
// // //                 markingType={'custom'}
// // //                 onDayPress={onDayPress}
// // //                 markedDates={{ ...selectedDates, ...holidays }}
// // //                 minDate={new Date().toISOString().split('T')[0]} // Disable past dates
// // //               />
// // //               <Button mode="outlined" onPress={() => setIsCalendarVisible(false)} style={styles.closeButton}>Close</Button>
// // //             </View>
// // //           </View>
// // //         </Modal>

// // //         <Text style={styles.subtitle}>Part of the Day Skipped</Text>
// // //         <View style={styles.checkboxContainer}>
// // //           <Checkbox status={morningChecked ? 'checked' : 'unchecked'} onPress={() => setMorningChecked(!morningChecked)} />
// // //           <Text style={styles.label}>Morning</Text>
// // //         </View>
// // //         <View style={styles.checkboxContainer}>
// // //           <Checkbox status={afternoonChecked ? 'checked' : 'unchecked'} onPress={() => setAfternoonChecked(!afternoonChecked)} />
// // //           <Text style={styles.label}>Afternoon</Text>
// // //         </View>

// // //         <Button mode="contained" onPress={handleSubmit} style={styles.button}>Submit Absence Request</Button>
// // //         <Button mode="outlined" onPress={goToProfile} style={styles.button}>Back to Profile</Button>
// // //       </ScrollView>
// // //     </SafeAreaView>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     paddingTop: 50,
// // //     paddingHorizontal: 20,
// // //   },
// // //   content: {
// // //     paddingBottom: 80,
// // //   },
// // //   title: {
// // //     fontSize: 24,
// // //     fontWeight: 'bold',
// // //     marginBottom: 20,
// // //     textAlign: 'center',
// // //     color: '#333',
// // //   },
// // //   subtitle: {
// // //     fontSize: 18,
// // //     fontWeight: 'bold',
// // //     marginBottom: 10,
// // //     color: '#555',
// // //   },
// // //   radioContainer: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     marginBottom: 10,
// // //   },
// // //   checkboxContainer: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     marginBottom: 10,
// // //   },
// // //   label: {
// // //     marginLeft: 8,
// // //     fontSize: 16,
// // //     color: '#333',
// // //   },
// // //   input: {
// // //     width: '100%',
// // //     padding: 12,
// // //     borderWidth: 1,
// // //     borderColor: '#ddd',
// // //     borderRadius: 5,
// // //     marginBottom: 15,
// // //     fontSize: 16,
// // //   },
// // //   button: {
// // //     marginVertical: 10,
// // //     paddingVertical: 10,
// // //   },
// // //   clearButton: {
// // //     marginVertical: 10,
// // //   },
// // //   modalContainer: {
// // //     flex: 1,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     backgroundColor: 'rgba(0, 0, 0, 0.5)',
// // //   },
// // //   calendarContainer: {
// // //     backgroundColor: 'white',
// // //     padding: 20,
// // //     borderRadius: 10,
// // //     width: '90%',
// // //   },
// // //   closeButton: {
// // //     marginTop: 10,
// // //   },
// // //   selectedDatesContainer: {
// // //     marginBottom: 10,
// // //     alignItems: 'center',
// // //   },
// // //   selectedDatesText: {
// // //     fontSize: 16,
// // //     color: '#333',
// // //     marginBottom: 10,
// // //   },
// // // });

// // // export default DemandeAbsence;
// // import React, { useState } from 'react';
// // import { View, Text, TextInput, Alert, StyleSheet, ScrollView, Modal, SafeAreaView } from 'react-native';
// // import { RadioButton, Checkbox, Button } from 'react-native-paper';
// // import { Calendar } from 'react-native-calendars';
// // import { useLocalSearchParams, useRouter } from 'expo-router';

// // const DemandeAbsence = () => {
// //   const router = useRouter();
// //   const { pendingDemands: pendingDemandsParam } = useLocalSearchParams();

// //   // Ensure pendingDemands is an array
// //   const [pendingDemands, setPendingDemands] = useState(
// //     pendingDemandsParam ? JSON.parse(pendingDemandsParam) : []
// //   );

// //   const [firstName, setFirstName] = useState('');
// //   const [lastName, setLastName] = useState('');
// //   const [reason, setReason] = useState('sick');
// //   const [morningChecked, setMorningChecked] = useState(false);
// //   const [afternoonChecked, setAfternoonChecked] = useState(false);
// //   const [selectedDates, setSelectedDates] = useState({});
// //   const [isCalendarVisible, setIsCalendarVisible] = useState(false);

// //   // Define holidays (you can expand this list as needed)
// //   const holidays = {
// //     '2023-12-25': { disabled: true, disableTouchEvent: true }, // Christmas
// //     '2024-01-01': { disabled: true, disableTouchEvent: true }, // New Year's Day
// //   };

// //   const onDayPress = (day) => {
// //     const { dateString } = day;
// //     const today = new Date();
// //     const selectedDate = new Date(dateString);

// //     // Check if the selected date is in the past
// //     if (selectedDate < today) {
// //       Alert.alert("Invalid Date", "You cannot select a date that has already passed.");
// //       return;
// //     }

// //     // Check if the selected date is a weekend
// //     const dayOfWeek = selectedDate.getDay();
// //     if (dayOfWeek === 0 || dayOfWeek === 6) {
// //       Alert.alert("Invalid Date", "Weekends cannot be selected. Please choose another date.");
// //       return;
// //     }

// //     // Check if the selected date is a holiday
// //     if (holidays[dateString]) {
// //       Alert.alert("Invalid Date", "This date is a holiday. Please choose another date.");
// //       return;
// //     }

// //     // Toggle the selected date
// //     const newDates = { ...selectedDates };
// //     if (newDates[dateString]) {
// //       delete newDates[dateString];
// //     } else {
// //       newDates[dateString] = { selected: true, selectedColor: 'blue' };
// //     }
// //     setSelectedDates(newDates);
// //   };

// //   const handleSubmit = () => {
// //     const dates = Object.keys(selectedDates);
// //     if (dates.length > 0) {
// //       const newDemand = {
// //         id: pendingDemands.length + 1,
// //         firstName,
// //         lastName,
// //         reason,
// //         dates: dates.join(', '),
// //         morningChecked,
// //         afternoonChecked,
// //         status: 'Pending',
// //       };

// //       // Update the pending demands state
// //       const updatedPendingDemands = [...pendingDemands, newDemand];
// //       setPendingDemands(updatedPendingDemands);

// //       // Pass the updated state back to the profile screen
// //       router.push({
// //         pathname: '/profile',
// //         params: { updatedPendingDemands: JSON.stringify(updatedPendingDemands) },
// //       });

// //       Alert.alert("Absence Request Submitted", `You have requested absence for: ${dates.join(', ')}`);
// //       clearForm();
// //     } else {
// //       Alert.alert("No Dates Selected", "Please select one or more dates for your absence.");
// //     }
// //   };

// //   const clearForm = () => {
// //     setFirstName('');
// //     setLastName('');
// //     setReason('sick');
// //     setMorningChecked(false);
// //     setAfternoonChecked(false);
// //     setSelectedDates({});
// //   };

// //   const goToProfile = () => {
// //     router.push('/profile');
// //   };

// //   return (
// //     <SafeAreaView style={{ flex: 1 }}>
// //       <ScrollView style={styles.container} contentContainerStyle={styles.content}>
// //         <Text style={styles.title}>Demande d'Absence</Text>
// //         <TextInput style={styles.input} onChangeText={setFirstName} value={firstName} placeholder="First Name" />
// //         <TextInput style={styles.input} onChangeText={setLastName} value={lastName} placeholder="Last Name" />

// //         <Text style={styles.subtitle}>Reason of Absence</Text>
// //         <RadioButton.Group onValueChange={newReason => setReason(newReason)} value={reason}>
// //           <View style={styles.radioContainer}>
// //             <RadioButton value="sick" />
// //             <Text style={styles.label}>Sickness</Text>
// //           </View>
// //           <View style={styles.radioContainer}>
// //             <RadioButton value="vacation" />
// //             <Text style={styles.label}>Vacation</Text>
// //           </View>
// //           <View style={styles.radioContainer}>
// //             <RadioButton value="personal" />
// //             <Text style={styles.label}>Personal</Text>
// //           </View>
// //         </RadioButton.Group>

// //         <Text style={styles.subtitle}>Select Absence Days</Text>
// //         {Object.keys(selectedDates).length > 0 && (
// //           <View style={styles.selectedDatesContainer}>
// //             <Text style={styles.selectedDatesText}>Selected Days: {Object.keys(selectedDates).join(', ')}</Text>
// //             <Button mode="outlined" onPress={() => setSelectedDates({})} style={styles.clearButton}>Clear Selected Days</Button>
// //           </View>
// //         )}

// //         <Button mode="contained" onPress={() => setIsCalendarVisible(true)} style={styles.button}>
// //           {Object.keys(selectedDates).length > 0 ? "Modify Absence Day" : "Choose Absence Day"}
// //         </Button>

// //         <Modal visible={isCalendarVisible} animationType="slide" transparent={true} onRequestClose={() => setIsCalendarVisible(false)}>
// //           <View style={styles.modalContainer}>
// //             <View style={styles.calendarContainer}>
// //               <Calendar
// //                 markingType={'custom'}
// //                 onDayPress={onDayPress}
// //                 markedDates={{ ...selectedDates, ...holidays }}
// //                 minDate={new Date().toISOString().split('T')[0]} // Disable past dates
// //               />
// //               <Button mode="outlined" onPress={() => setIsCalendarVisible(false)} style={styles.closeButton}>Close</Button>
// //             </View>
// //           </View>
// //         </Modal>

// //         <Text style={styles.subtitle}>Part of the Day Skipped</Text>
// //         <View style={styles.checkboxContainer}>
// //           <Checkbox status={morningChecked ? 'checked' : 'unchecked'} onPress={() => setMorningChecked(!morningChecked)} />
// //           <Text style={styles.label}>Morning</Text>
// //         </View>
// //         <View style={styles.checkboxContainer}>
// //           <Checkbox status={afternoonChecked ? 'checked' : 'unchecked'} onPress={() => setAfternoonChecked(!afternoonChecked)} />
// //           <Text style={styles.label}>Afternoon</Text>
// //         </View>

// //         <Button mode="contained" onPress={handleSubmit} style={styles.button}>Submit Absence Request</Button>
// //         <Button mode="outlined" onPress={goToProfile} style={styles.button}>Back to Profile</Button>
// //       </ScrollView>
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     paddingTop: 50,
// //     paddingHorizontal: 20,
// //   },
// //   content: {
// //     paddingBottom: 80,
// //   },
// //   title: {
// //     fontSize: 24,
// //     fontWeight: 'bold',
// //     marginBottom: 20,
// //     textAlign: 'center',
// //     color: '#333',
// //   },
// //   subtitle: {
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //     marginBottom: 10,
// //     color: '#555',
// //   },
// //   radioContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: 10,
// //   },
// //   checkboxContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: 10,
// //   },
// //   label: {
// //     marginLeft: 8,
// //     fontSize: 16,
// //     color: '#333',
// //   },
// //   input: {
// //     width: '100%',
// //     padding: 12,
// //     borderWidth: 1,
// //     borderColor: '#ddd',
// //     borderRadius: 5,
// //     marginBottom: 15,
// //     fontSize: 16,
// //   },
// //   button: {
// //     marginVertical: 10,
// //     paddingVertical: 10,
// //   },
// //   clearButton: {
// //     marginVertical: 10,
// //   },
// //   modalContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(0, 0, 0, 0.5)',
// //   },
// //   calendarContainer: {
// //     backgroundColor: 'white',
// //     padding: 20,
// //     borderRadius: 10,
// //     width: '90%',
// //   },
// //   closeButton: {
// //     marginTop: 10,
// //   },
// //   selectedDatesContainer: {
// //     marginBottom: 10,
// //     alignItems: 'center',
// //   },
// //   selectedDatesText: {
// //     fontSize: 16,
// //     color: '#333',
// //     marginBottom: 10,
// //   },
// // });

// // export default DemandeAbsence;
// import React, { useState } from 'react';
// import { View, Text, TextInput, Alert, StyleSheet, ScrollView, Modal, SafeAreaView } from 'react-native';
// import { RadioButton, Checkbox, Button } from 'react-native-paper';
// import { Calendar } from 'react-native-calendars';
// import { useLocalSearchParams, useRouter } from 'expo-router';

// const DemandeAbsence = () => {
//   const router = useRouter();
//   const { pendingDemands: pendingDemandsParam } = useLocalSearchParams();

//   // Ensure pendingDemands is an array
//   const [pendingDemands, setPendingDemands] = useState(
//     pendingDemandsParam ? JSON.parse(pendingDemandsParam) : []
//   );

//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [reason, setReason] = useState('sick');
//   const [morningChecked, setMorningChecked] = useState(false);
//   const [afternoonChecked, setAfternoonChecked] = useState(false);
//   const [selectedDates, setSelectedDates] = useState({});
//   const [isCalendarVisible, setIsCalendarVisible] = useState(false);

//   // Define holidays (you can expand this list as needed)
//   const holidays = {
//     '2023-12-25': { disabled: true, disableTouchEvent: true }, // Christmas
//     '2024-01-01': { disabled: true, disableTouchEvent: true }, // New Year's Day
//   };

//   const onDayPress = (day) => {
//     const { dateString } = day;
//     const today = new Date();
//     const selectedDate = new Date(dateString);

//     // Check if the selected date is in the past
//     if (selectedDate < today) {
//       Alert.alert("Invalid Date", "You cannot select a date that has already passed.");
//       return;
//     }

//     // Check if the selected date is a weekend
//     const dayOfWeek = selectedDate.getDay();
//     if (dayOfWeek === 0 || dayOfWeek === 6) {
//       Alert.alert("Invalid Date", "Weekends cannot be selected. Please choose another date.");
//       return;
//     }

//     // Check if the selected date is a holiday
//     if (holidays[dateString]) {
//       Alert.alert("Invalid Date", "This date is a holiday. Please choose another date.");
//       return;
//     }

//     // Toggle the selected date
//     const newDates = { ...selectedDates };
//     if (newDates[dateString]) {
//       delete newDates[dateString];
//     } else {
//       newDates[dateString] = { selected: true, selectedColor: 'blue' };
//     }
//     setSelectedDates(newDates);
//   };

//   const handleSubmit = () => {
//     const dates = Object.keys(selectedDates);
//     if (dates.length > 0) {
//       const newDemand = {
//         id: pendingDemands.length + 1,
//         firstName,
//         lastName,
//         reason,
//         dates: dates.join(', '),
//         morningChecked,
//         afternoonChecked,
//         status: 'Pending',
//       };

//       // Update the pending demands state
//       const updatedPendingDemands = [...pendingDemands, newDemand];
//       setPendingDemands(updatedPendingDemands);

//       // Pass the updated state back to the profile screen
//       router.push({
//         pathname: '/profile',
//         params: { updatedPendingDemands: JSON.stringify(updatedPendingDemands) },
//       });

//       Alert.alert("Absence Request Submitted", `You have requested absence for: ${dates.join(', ')}`);
//       clearForm();
//     } else {
//       Alert.alert("No Dates Selected", "Please select one or more dates for your absence.");
//     }
//   };

//   const clearForm = () => {
//     setFirstName('');
//     setLastName('');
//     setReason('sick');
//     setMorningChecked(false);
//     setAfternoonChecked(false);
//     setSelectedDates({});
//   };

//   const goToProfile = () => {
//     router.push('/profile');
//   };

//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <ScrollView style={styles.container} contentContainerStyle={styles.content}>
//         <Text style={styles.title}>Demande d'Absence</Text>
//         <TextInput style={styles.input} onChangeText={setFirstName} value={firstName} placeholder="First Name" />
//         <TextInput style={styles.input} onChangeText={setLastName} value={lastName} placeholder="Last Name" />

//         <Text style={styles.subtitle}>Reason of Absence</Text>
//         <RadioButton.Group onValueChange={newReason => setReason(newReason)} value={reason}>
//           <View style={styles.radioContainer}>
//             <RadioButton value="sick" />
//             <Text style={styles.label}>Sickness</Text>
//           </View>
//           <View style={styles.radioContainer}>
//             <RadioButton value="vacation" />
//             <Text style={styles.label}>Vacation</Text>
//           </View>
//           <View style={styles.radioContainer}>
//             <RadioButton value="personal" />
//             <Text style={styles.label}>Personal</Text>
//           </View>
//         </RadioButton.Group>

//         <Text style={styles.subtitle}>Select Absence Days</Text>
//         {Object.keys(selectedDates).length > 0 && (
//           <View style={styles.selectedDatesContainer}>
//             <Text style={styles.selectedDatesText}>Selected Days: {Object.keys(selectedDates).join(', ')}</Text>
//             <Button mode="outlined" onPress={() => setSelectedDates({})} style={styles.clearButton}>Clear Selected Days</Button>
//           </View>
//         )}

//         <Button mode="contained" onPress={() => setIsCalendarVisible(true)} style={styles.button}>
//           {Object.keys(selectedDates).length > 0 ? "Modify Absence Day" : "Choose Absence Day"}
//         </Button>

//         <Modal visible={isCalendarVisible} animationType="slide" transparent={true} onRequestClose={() => setIsCalendarVisible(false)}>
//           <View style={styles.modalContainer}>
//             <View style={styles.calendarContainer}>
//               <Calendar
//                 markingType={'custom'}
//                 onDayPress={onDayPress}
//                 markedDates={{ ...selectedDates, ...holidays }}
//                 minDate={new Date().toISOString().split('T')[0]} // Disable past dates
//               />
//               <Button mode="outlined" onPress={() => setIsCalendarVisible(false)} style={styles.closeButton}>Close</Button>
//             </View>
//           </View>
//         </Modal>

//         <Text style={styles.subtitle}>Part of the Day Skipped</Text>
//         <View style={styles.checkboxContainer}>
//           <Checkbox status={morningChecked ? 'checked' : 'unchecked'} onPress={() => setMorningChecked(!morningChecked)} />
//           <Text style={styles.label}>Morning</Text>
//         </View>
//         <View style={styles.checkboxContainer}>
//           <Checkbox status={afternoonChecked ? 'checked' : 'unchecked'} onPress={() => setAfternoonChecked(!afternoonChecked)} />
//           <Text style={styles.label}>Afternoon</Text>
//         </View>

//         <Button mode="contained" onPress={handleSubmit} style={styles.button}>Submit Absence Request</Button>
//         <Button mode="outlined" onPress={goToProfile} style={styles.button}>Back to Profile</Button>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 20, // Reduced paddingTop to lift content up
//     paddingHorizontal: 20,
//   },
//   content: {
//     paddingBottom: 60, // Reduced paddingBottom to avoid overlap with nav bar
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10, // Reduced marginBottom to lift content up
//     textAlign: 'center',
//     color: '#333',
//   },
//   subtitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginTop: 10, // Reduced marginTop to lift content up
//     marginBottom: 10,
//     color: '#555',
//   },
//   radioContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   checkboxContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   label: {
//     marginLeft: 8,
//     fontSize: 16,
//     color: '#333',
//   },
//   input: {
//     width: '100%',
//     padding: 12,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 5,
//     marginBottom: 15,
//     fontSize: 16,
//   },
//   button: {
//     marginVertical: 10,
//     paddingVertical: 10,
//   },
//   clearButton: {
//     marginVertical: 10,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   calendarContainer: {
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 10,
//     width: '90%',
//   },
//   closeButton: {
//     marginTop: 10,
//   },
//   selectedDatesContainer: {
//     marginBottom: 10,
//     alignItems: 'center',
//   },
//   selectedDatesText: {
//     fontSize: 16,
//     color: '#333',
//     marginBottom: 10,
//   },
// });

// export default DemandeAbsence;
import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, ScrollView, Modal, SafeAreaView } from 'react-native';
import { RadioButton, Checkbox, Button } from 'react-native-paper';
import { Calendar } from 'react-native-calendars';
import { useLocalSearchParams, useRouter } from 'expo-router';

const DemandeAbsence = () => {
  const router = useRouter();
  const { pendingDemands: pendingDemandsParam } = useLocalSearchParams();

  // Ensure pendingDemands is an array
  const [pendingDemands, setPendingDemands] = useState(
    pendingDemandsParam ? JSON.parse(pendingDemandsParam) : []
  );

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [reason, setReason] = useState('sick');
  const [morningChecked, setMorningChecked] = useState(false);
  const [afternoonChecked, setAfternoonChecked] = useState(false);
  const [selectedDates, setSelectedDates] = useState({});
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  // Define holidays (you can expand this list as needed)
  const holidays = {
    '2023-12-25': { disabled: true, disableTouchEvent: true }, // Christmas
    '2024-01-01': { disabled: true, disableTouchEvent: true }, // New Year's Day
  };

  const onDayPress = (day) => {
    const { dateString } = day;
    const today = new Date();
    const selectedDate = new Date(dateString);

    // Check if the selected date is in the past
    if (selectedDate < today) {
      Alert.alert("Invalid Date", "You cannot select a date that has already passed.");
      return;
    }

    // Check if the selected date is a weekend
    const dayOfWeek = selectedDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      Alert.alert("Invalid Date", "Weekends cannot be selected. Please choose another date.");
      return;
    }

    // Check if the selected date is a holiday
    if (holidays[dateString]) {
      Alert.alert("Invalid Date", "This date is a holiday. Please choose another date.");
      return;
    }

    // Toggle the selected date
    const newDates = { ...selectedDates };
    if (newDates[dateString]) {
      delete newDates[dateString];
    } else {
      newDates[dateString] = { selected: true, selectedColor: 'blue' };
    }
    setSelectedDates(newDates);
  };

  const handleSubmit = () => {
    const dates = Object.keys(selectedDates);
    if (dates.length > 0) {
      const newDemand = {
        id: pendingDemands.length + 1,
        firstName,
        lastName,
        reason,
        dates: dates.join(', '),
        morningChecked,
        afternoonChecked,
        status: 'Pending',
      };

      // Update the pending demands state
      const updatedPendingDemands = [...pendingDemands, newDemand];
      setPendingDemands(updatedPendingDemands);

      // Pass the updated state back to the profile screen
      router.push({
        pathname: '/profile',
        params: { updatedPendingDemands: JSON.stringify(updatedPendingDemands) },
      });

      Alert.alert("Absence Request Submitted", `You have requested absence for: ${dates.join(', ')}`);
      clearForm();
    } else {
      Alert.alert("No Dates Selected", "Please select one or more dates for your absence.");
    }
  };

  const clearForm = () => {
    setFirstName('');
    setLastName('');
    setReason('sick');
    setMorningChecked(false);
    setAfternoonChecked(false);
    setSelectedDates({});
  };

  const goToProfile = () => {
    router.push('/profile');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Demande d'Absence</Text>
        <TextInput style={styles.input} onChangeText={setFirstName} value={firstName} placeholder="First Name" />
        <TextInput style={styles.input} onChangeText={setLastName} value={lastName} placeholder="Last Name" />

        <Text style={styles.subtitle}>Reason of Absence</Text>
        <RadioButton.Group onValueChange={newReason => setReason(newReason)} value={reason}>
          <View style={styles.radioContainer}>
            <RadioButton value="sick" />
            <Text style={styles.label}>Sickness</Text>
          </View>
          <View style={styles.radioContainer}>
            <RadioButton value="vacation" />
            <Text style={styles.label}>Vacation</Text>
          </View>
          <View style={styles.radioContainer}>
            <RadioButton value="personal" />
            <Text style={styles.label}>Personal</Text>
          </View>
        </RadioButton.Group>

        <Text style={styles.subtitle}>Select Absence Days</Text>
        {Object.keys(selectedDates).length > 0 && (
          <View style={styles.selectedDatesContainer}>
            <Text style={styles.selectedDatesText}>Selected Days: {Object.keys(selectedDates).join(', ')}</Text>
            <Button mode="outlined" onPress={() => setSelectedDates({})} style={styles.clearButton}>Clear Selected Days</Button>
          </View>
        )}

        <Button mode="contained" onPress={() => setIsCalendarVisible(true)} style={styles.button}>
          {Object.keys(selectedDates).length > 0 ? "Modify Absence Day" : "Choose Absence Day"}
        </Button>

        <Modal visible={isCalendarVisible} animationType="slide" transparent={true} onRequestClose={() => setIsCalendarVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.calendarContainer}>
              <Calendar
                markingType={'custom'}
                onDayPress={onDayPress}
                markedDates={{ ...selectedDates, ...holidays }}
                minDate={new Date().toISOString().split('T')[0]} // Disable past dates
              />
              <Button mode="outlined" onPress={() => setIsCalendarVisible(false)} style={styles.closeButton}>Close</Button>
            </View>
          </View>
        </Modal>

        <Text style={styles.subtitle}>Part of the Day Skipped</Text>
        <View style={styles.checkboxContainer}>
          <Checkbox status={morningChecked ? 'checked' : 'unchecked'} onPress={() => setMorningChecked(!morningChecked)} />
          <Text style={styles.label}>Morning</Text>
        </View>
        <View style={styles.checkboxContainer}>
          <Checkbox status={afternoonChecked ? 'checked' : 'unchecked'} onPress={() => setAfternoonChecked(!afternoonChecked)} />
          <Text style={styles.label}>Afternoon</Text>
        </View>

        <Button mode="contained" onPress={handleSubmit} style={styles.button}>Submit Absence Request</Button>
        <Button mode="outlined" onPress={goToProfile} style={styles.button}>Back to Profile</Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20, // Reduced paddingTop to lift content up
    paddingHorizontal: 20,
  },
  content: {
    paddingBottom: 60, // Reduced paddingBottom to avoid overlap with nav bar
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10, // Reduced marginBottom to lift content up
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10, // Reduced marginTop to lift content up
    marginBottom: 10,
    color: '#555',
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    marginVertical: 10,
    paddingVertical: 10,
  },
  clearButton: {
    marginVertical: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  calendarContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  closeButton: {
    marginTop: 10,
  },
  selectedDatesContainer: {
    marginBottom: 10,
    alignItems: 'center',
  },
  selectedDatesText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
});

export default DemandeAbsence;