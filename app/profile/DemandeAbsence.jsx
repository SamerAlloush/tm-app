// app/profile/DemandeAbsence.jsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, SafeAreaView, Alert, ActivityIndicator, Platform } from 'react-native';
import { RadioButton, Checkbox, Button } from 'react-native-paper';
import { Calendar } from 'react-native-calendars';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
//import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
//import { db } from '../../firebase/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';

const DemandeAbsence = () => {
  const router = useRouter();
  const { currentUser, accessToken } = useAuth();
  const [reason, setReason] = useState('sick');
  const [morningChecked, setMorningChecked] = useState(false);
  const [afternoonChecked, setAfternoonChecked] = useState(false);
  const [selectedDates, setSelectedDates] = useState({});
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const apiUrl = 'http://localhost:5000/api';

  const holidays = {
    '2023-12-25': { disabled: true, disableTouchEvent: true },
    '2024-01-01': { disabled: true, disableTouchEvent: true },
  };

  const onDayPress = (day) => {
    const { dateString } = day;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date
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

    if (!morningChecked && !afternoonChecked) {
      Alert.alert("Time Not Selected", "Please select at least one part of the day (Morning or Afternoon).");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/absences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          email: currentUser.email,
          fullName: currentUser.fullName,
          reason,
          dates: dates.join(', '),
          morning: morningChecked,
          afternoon: afternoonChecked,
          status: 'Pending',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to submit request' }));
        throw new Error(errorData.message);
      }
      
      Alert.alert("Success", "Your absence request has been submitted.");
      router.back();
    } catch (error) {
      console.error("Error submitting request:", error);
      Alert.alert("Error", error.message || "Failed to submit request. Please try again.");
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
          <Text style={styles.userInfo}>
            Employee: {currentUser?.fullName}
          </Text>
          <Text style={styles.userInfo}>Email: {currentUser?.email}</Text>
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
          labelStyle={{ color: '#fff' }}
          loading={loading}
          disabled={loading}
        >
          Submit Request
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  userInfoContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
      default: {
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  userInfo: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  selectedDatesContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
      default: {
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  selectedDatesText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  clearButton: {
    borderColor: '#ff4444',
  },
  calendarButton: {
    backgroundColor: '#1e90ff',
    marginBottom: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    width: '90%',
    maxWidth: 400,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      },
      default: {
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
    }),
  },
  closeCalendarButton: {
    backgroundColor: '#1e90ff',
    marginTop: 16,
  },
  submitButton: {
    backgroundColor: '#1e90ff',
    marginTop: 24,
    marginBottom: 32,
  },
});

export default DemandeAbsence;