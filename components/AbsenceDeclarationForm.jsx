import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, ScrollView, Button } from 'react-native';
import { RadioButton } from 'react-native-paper';

const AbsenceDeclarationForm = ({ onSubmit, onClose }) => {
  const [reason, setReason] = useState('sickness');
  const [details, setDetails] = useState('');

  const handleSubmit = () => {
    if (!details.trim()) {
      Alert.alert('Error', 'Please provide details about your absence.');
      return;
    }

    const newDeclaration = {
      id: Date.now().toString(),
      reason,
      details,
      timestamp: new Date().toLocaleString(),
      status: 'Pending',
    };

    onSubmit(newDeclaration);
    onClose();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Absence Declaration Form</Text>

      <Text style={styles.subtitle}>Reason for Absence:</Text>
      <RadioButton.Group onValueChange={(value) => setReason(value)} value={reason}>
        <View style={styles.radioContainer}>
          <RadioButton value="sickness" />
          <Text style={styles.label}>Sudden Sickness</Text>
        </View>
        <View style={styles.radioContainer}>
          <RadioButton value="death" />
          <Text style={styles.label}>Death of a Relative</Text>
        </View>
      </RadioButton.Group>

      <Text style={styles.subtitle}>Details:</Text>
      <TextInput
        style={styles.input}
        placeholder="Provide more details about your absence..."
        value={details}
        onChangeText={setDetails}
        multiline
        numberOfLines={5}
      />

      <View style={styles.buttonContainer}>
        <Button title="Cancel" onPress={onClose} color="#888" />
        <Button title="Submit" onPress={handleSubmit} color="#1e90ff" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#555',
  },
  radioContainer: {
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
    marginBottom: 20,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default AbsenceDeclarationForm;