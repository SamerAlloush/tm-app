import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  Linking,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAuth } from '../../context/AuthContext';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const { 
    login,
    sendOTP,
    verifyOTP,
    loading, 
    firebaseReady,
    authError
  } = useAuth();
  
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  
  const passwordInputRef = useRef();
  const otpInputRef = useRef();

  useEffect(() => {
    const checkEmailLink = async () => {
      try {
        const { isSignInWithEmailLink } = await import('firebase/auth');
        const { auth } = await import('../../firebase/firebaseConfig');
        
        if (isSignInWithEmailLink(auth, Linking.createURL('/'))) {
          const emailFromUrl = new URLSearchParams(Linking.createURL('/').split('?')[1]).get('email');
          const otpFromUrl = new URLSearchParams(Linking.createURL('/').split('?')[1]).get('otp');
          
          if (emailFromUrl && otpFromUrl) {
            setEmail(emailFromUrl);
            setOtp(otpFromUrl);
            setOtpSent(true);
            Alert.alert('OTP Received', 'The OTP from your email has been automatically filled.');
          }
        }
      } catch (error) {
        console.error('Email link verification error:', error);
      }
    };

    const handleDeepLink = ({ url }) => {
      if (url.includes('verify-otp')) {
        const params = new URLSearchParams(url.split('?')[1]);
        const emailParam = params.get('email');
        const otpParam = params.get('otp');
        
        if (emailParam && otpParam) {
          setEmail(emailParam);
          setOtp(otpParam);
          setOtpSent(true);
          Alert.alert('OTP Received', 'The OTP from your email has been automatically filled.');
        }
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);
    checkEmailLink();
    
    return () => {
      if (subscription?.remove) {
        subscription.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (authError) {
      Alert.alert('Authentication Error', authError);
    }
  }, [authError]);

  useEffect(() => {
    if (otpCountdown > 0) {
      const timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCountdown]);

  const validateForm = () => {
    const errors = {};
    if (!email) errors.email = 'Email is required';
    else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      errors.email = 'Please enter a valid email';
    }
    if (!otpSent && !password) errors.password = 'Password is required';
    if (otpSent && !otp) errors.otp = 'OTP is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isSendOTPButtonActive = () => {
    return (
      email.length > 0 &&
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) &&
      password.length >= 6
    );
  };

  const handleSendOTP = async () => {
    Keyboard.dismiss();
    if (!firebaseReady) {
      Alert.alert('Initializing', 'Authentication service is starting. Please wait a moment and try again.');
      return;
    }
    if (!validateForm()) return;

    try {
      await sendOTP(email);
      setOtpSent(true);
      setOtpCountdown(60);
      Alert.alert(
        'OTP Sent', 
        'A verification code has been sent to your email. Please check your inbox (and spam folder).',
        [
          {
            text: 'Open Email App',
            onPress: () => Linking.openURL('message://')
          },
          {
            text: 'OK',
            style: 'cancel'
          }
        ]
      );
    } catch (error) {
      let errorMessage = 'Failed to send OTP. Please try again.';
      if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please try again later.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address';
      }
      Alert.alert('Error', errorMessage);
    }
  };

  const handleLogin = async () => {
    Keyboard.dismiss();
    if (!firebaseReady) return;
    if (!validateForm()) return;

    try {
      if (otpSent) {
        await verifyOTP(email, otp);
      }
      await login(email, password);
      router.replace('/');
    } catch (error) {
      let errorMessage = 'Login failed';
      if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email. Please sign up.';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid credentials. Please check your email and password.';
      }
      Alert.alert('Error', errorMessage);
    }
  };

  const handleResendOTP = async () => {
    try {
      await sendOTP(email);
      setOtpCountdown(60);
      Alert.alert('OTP Resent', 'New verification code sent to your email.');
    } catch (error) {
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      extraScrollHeight={20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
          
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
              onSubmitEditing={() => passwordInputRef.current?.focus()}
              blurOnSubmit={false}
              editable={!otpSent}
            />
          </View>
          {formErrors.email && <Text style={styles.errorText}>{formErrors.email}</Text>}

          {!otpSent ? (
            <>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#999"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  ref={passwordInputRef}
                  returnKeyType="done"
                  onSubmitEditing={handleSendOTP}
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.passwordToggle}
                >
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color="#666" 
                  />
                </TouchableOpacity>
              </View>
              {formErrors.password && <Text style={styles.errorText}>{formErrors.password}</Text>}

              <TouchableOpacity 
                style={[
                  styles.button, 
                  (!isSendOTPButtonActive() || loading || !firebaseReady) && styles.buttonDisabled
                ]} 
                onPress={handleSendOTP}
                disabled={!isSendOTPButtonActive() || loading || !firebaseReady}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Send OTP</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter OTP"
                  placeholderTextColor="#999"
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                  ref={otpInputRef}
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />
              </View>
              {formErrors.otp && <Text style={styles.errorText}>{formErrors.otp}</Text>}

              <Text style={styles.otpInstructions}>
                OTP sent to {email}
              </Text>

              <TouchableOpacity 
                style={[styles.button, (loading || !firebaseReady) && styles.buttonDisabled]} 
                onPress={handleLogin}
                disabled={loading || !firebaseReady}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Login</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.resendButton}
                onPress={handleResendOTP}
                disabled={otpCountdown > 0}
              >
                <Text style={[
                  styles.resendButtonText,
                  otpCountdown > 0 && styles.resendButtonDisabled
                ]}>
                  {otpCountdown > 0 ? `Resend in ${otpCountdown}s` : 'Resend OTP'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => setOtpSent(false)}
              >
                <Text style={styles.backButtonText}>Back to Login</Text>
              </TouchableOpacity>
            </>
          )}

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => router.push('/signup')}
          >
            <Text style={styles.secondaryButtonText}>Create New Account</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },
  passwordToggle: {
    padding: 5,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginTop: 16,
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: '#dc3545',
    fontSize: 14,
    marginBottom: 12,
    marginLeft: 4,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#999',
    fontSize: 14,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  secondaryButtonText: {
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resendButton: {
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resendButtonText: {
    color: '#007bff',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  resendButtonDisabled: {
    color: '#999',
    textDecorationLine: 'none',
  },
  backButton: {
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#666',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  otpInstructions: {
    color: '#666',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default Login;