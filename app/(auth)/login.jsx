import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login, loading, authError } = useAuth();

  const handleLogin = async () => {
    try {
      await login(email, password);
      Alert.alert('Login successful');
      // router.push('/dashboard'); // Uncomment and adjust as needed
    } catch (error) {
      // Error handled by context
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>
        {authError ? <Text style={styles.error}>{authError}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
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
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
        </TouchableOpacity>
        <View style={styles.footer}>
          <Text>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
            <Text style={styles.link}>Sign Up</Text>
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
  button: { backgroundColor: '#007AFF', borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  error: { color: '#d32f2f', marginBottom: 12, textAlign: 'center' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 18 },
  link: { color: '#007AFF', fontWeight: 'bold' },
});

export default Login;