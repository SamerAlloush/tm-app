import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator, Modal, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

const roleOptions = [
  { label: 'Admin', value: 'admin' },
  { label: 'HR', value: 'hr' },
  { label: 'Accounting', value: 'accounting' },
  { label: 'Purchase Department', value: 'purchase_department' },
  { label: 'Project Manager', value: 'project_manager' },
  { label: 'Mechanics', value: 'mechanics' },
  { label: 'Worker', value: 'worker' },
];

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState(roleOptions[0].value);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const router = useRouter();
  const { signup, loading, authError } = useAuth();

  const handleSignup = async () => {
    if (!name || !email || !phone || !password) {
      Alert.alert('Please fill in all fields');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Please enter a valid email address');
      return;
    }
    try {
      await signup(email, password, name, phone, [role] );
      Alert.alert('Signup successful');
      // router.push('/dashboard'); // Uncomment and adjust as needed
    } catch (error) {
      // Error handled by context
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>
        {authError ? <Text style={styles.error}>{authError}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.toggleBtn}>
            <Text style={{ color: '#007AFF' }}>{showPassword ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dropdownContainer}>
          <Text style={styles.pickerLabel}>Select Role:</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setDropdownVisible(true)}
          >
            <Text style={styles.dropdownText}>{roleOptions.find(opt => opt.value === role)?.label}</Text>
          </TouchableOpacity>
          <Modal
            visible={dropdownVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setDropdownVisible(false)}
          >
            <Pressable style={styles.modalOverlay} onPress={() => setDropdownVisible(false)}>
              <View style={styles.dropdownList}>
                <FlatList
                  data={roleOptions}
                  keyExtractor={item => item.value}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        setRole(item.value);
                        setDropdownVisible(false);
                      }}
                    >
                      <Text style={[styles.dropdownItemText, role === item.value && styles.dropdownItemTextSelected]}>{item.label}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </Pressable>
          </Modal>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
        </TouchableOpacity>
        <View style={styles.footer}>
          <Text>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.link}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f6f7fb' },
  card: { width: '90%', backgroundColor: '#fff', borderRadius: 16, padding: 24, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 4 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 8, textAlign: 'center', color: '#222' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16, backgroundColor: '#fafbfc' },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  toggleBtn: { marginLeft: 8 },
  dropdownContainer: { marginBottom: 16 },
  dropdown: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, padding: 12, backgroundColor: '#fafbfc' },
  dropdownText: { fontSize: 16, color: '#222' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' },
  dropdownList: { width: '80%', backgroundColor: '#fff', borderRadius: 8, paddingVertical: 8, elevation: 8 },
  dropdownItem: { padding: 14, borderBottomWidth: 1, borderBottomColor: '#eee' },
  dropdownItemText: { fontSize: 16, color: '#222' },
  dropdownItemTextSelected: { color: '#007AFF', fontWeight: 'bold' },
  button: { backgroundColor: '#007AFF', borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  error: { color: '#d32f2f', marginBottom: 12, textAlign: 'center' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 18 },
  link: { color: '#007AFF', fontWeight: 'bold' },
});

export default Signup;