// app/profile/DemandeAbsence.jsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { RadioButton, Checkbox, Button } from 'react-native-paper';
import { Calendar } from 'react-native-calendars';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';

const DemandeAbsence = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [reason, setReason] = useState('sick');
  const [morningChecked, setMorningChecked] = useState(false);
  const [afternoonChecked, setAfternoonChecked] = useState(false);
  const [selectedDates, setSelectedDates] = useState({});
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const holidays = {
    '2023-12-25': { disabled: true, disableTouchEvent: true },
    '2024-01-01': { disabled: true, disableTouchEvent: true },
  };

  const onDayPress = (day) => {
    const { dateString } = day;
    const today = new Date();
    const selectedDate = new Date(dateString);

    if (selectedDate < today) {
      Alert.alert("Invalid Date", "You cannot select a date that has already passed.");
      return;
    }

    const dayOfWeek = selectedDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      Alert.alert("Invalid Date", "Weekends cannot be selected. Please choose another date.");
      return;
    }

    if (holidays[dateString]) {
      Alert.alert("Invalid Date", "This date is a holiday. Please choose another date.");
      return;
    }

    const newDates = { ...selectedDates };
    if (newDates[dateString]) {
      delete newDates[dateString];
    } else {
      newDates[dateString] = { selected: true, selectedColor: '#1e90ff' };
    }
    setSelectedDates(newDates);
  };

  const handleSubmit = async () => {
    const dates = Object.keys(selectedDates);
    if (dates.length === 0) {
      Alert.alert("No Dates Selected", "Please select one or more dates for your absence.");
      return;
    }

    setLoading(true);
    try {
      const newDemand = {
        userId: user.uid,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        reason,
        dates: dates.join(', '),
        morningChecked,
        afternoonChecked,
        status: 'Pending',
        createdAt: serverTimestamp()
      };

      await setDoc(doc(db, "absenceRequests", Date.now().toString()), newDemand);
      
      Alert.alert("Success", "Your absence request has been submitted.");
      router.back();
    } catch (error) {
      console.error("Error submitting request:", error);
      Alert.alert("Error", "Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color="#1e90ff" 
            onPress={() => router.back()}
            style={styles.backButton}
          />
          <Text style={styles.title}>Absence Request</Text>
        </View>

        <View style={styles.userInfoContainer}>
          <Text style={styles.userInfo}>Employee: {user?.firstName} {user?.lastName}</Text>
          <Text style={styles.userInfo}>ID: {user?.uid.substring(0, 8)}</Text>
        </View>

        <Text style={styles.subtitle}>Reason of Absence</Text>
        <RadioButton.Group onValueChange={setReason} value={reason}>
          <View style={styles.radioContainer}>
            <RadioButton value="sick" color="#1e90ff" />
            <Text style={styles.label}>Sickness</Text>
          </View>
          <View style={styles.radioContainer}>
            <RadioButton value="vacation" color="#1e90ff" />
            <Text style={styles.label}>Vacation</Text>
          </View>
          <View style={styles.radioContainer}>
            <RadioButton value="personal" color="#1e90ff" />
            <Text style={styles.label}>Personal</Text>
          </View>
        </RadioButton.Group>

        <Text style={styles.subtitle}>Select Absence Days</Text>
        {Object.keys(selectedDates).length > 0 && (
          <View style={styles.selectedDatesContainer}>
            <Text style={styles.selectedDatesText}>
              Selected: {Object.keys(selectedDates).join(', ')}
            </Text>
            <Button 
              mode="outlined" 
              onPress={() => setSelectedDates({})} 
              style={styles.clearButton}
              labelStyle={{ color: '#ff4444' }}
            >
              Clear Selection
            </Button>
          </View>
        )}

        <Button 
          mode="contained" 
          onPress={() => setIsCalendarVisible(true)} 
          style={styles.calendarButton}
          labelStyle={{ color: '#fff' }}
        >
          {Object.keys(selectedDates).length > 0 ? "Modify Dates" : "Select Dates"}
        </Button>

        <Modal visible={isCalendarVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.calendarContainer}>
              <Calendar
                markingType={'custom'}
                onDayPress={onDayPress}
                markedDates={{ ...selectedDates, ...holidays }}
                minDate={new Date().toISOString().split('T')[0]}
                theme={{
                  calendarBackground: '#fff',
                  todayTextColor: '#1e90ff',
                  selectedDayBackgroundColor: '#1e90ff',
                  arrowColor: '#1e90ff',
                }}
              />
              <Button 
                mode="contained" 
                onPress={() => setIsCalendarVisible(false)} 
                style={styles.closeCalendarButton}
                labelStyle={{ color: '#fff' }}
              >
                Done
              </Button>
            </View>
          </View>
        </Modal>

        <Text style={styles.subtitle}>Part of Day</Text>
        <View style={styles.checkboxContainer}>
          <Checkbox 
            status={morningChecked ? 'checked' : 'unchecked'} 
            onPress={() => setMorningChecked(!morningChecked)}
            color="#1e90ff"
          />
          <Text style={styles.label}>Morning</Text>
        </View>
        <View style={styles.checkboxContainer}>
          <Checkbox 
            status={afternoonChecked ? 'checked' : 'unchecked'} 
            onPress={() => setAfternoonChecked(!afternoonChecked)}
            color="#1e90ff"
          />
          <Text style={styles.label}>Afternoon</Text>
        </View>

        <Button 
          mode="contained" 
          onPress={handleSubmit} 
          style={styles.submitButton}
          loading={loading}
          disabled={loading || Object.keys(selectedDates).length === 0}
          labelStyle={{ color: '#fff' }}
        >
          {loading ? 'Submitting...' : 'Submit Request'}
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  userInfoContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    color: '#333',
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
  selectedDatesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  selectedDatesText: {
    fontSize: 16,
    color: '#555',
  },
  clearButton: {
    borderColor: '#ff4444',
  },
  calendarButton: {
    marginVertical: 10,
    backgroundColor: '#1e90ff',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  calendarContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  closeCalendarButton: {
    marginTop: 10,
    backgroundColor: '#1e90ff',
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: '#28a745',
  },
});

export default DemandeAbsence;