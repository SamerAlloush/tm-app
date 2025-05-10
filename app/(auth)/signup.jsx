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

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const { 
    signup, 
    sendOTP,
    verifyOTP,
    loading, 
    firebaseReady,
    authError
  } = useAuth();
  
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();
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
    if (!password) errors.password = 'Password is required';
    if (!confirmPassword) errors.confirmPassword = 'Please confirm your password';
    if (password && password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
    if (otpSent && !otp) errors.otp = 'OTP is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isSendOTPButtonActive = () => {
    return (
      email.length > 0 &&
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) &&
      password.length >= 6 &&
      password === confirmPassword
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
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please login instead.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please try again later.';
      }
      Alert.alert('Error', errorMessage);
    }
  };

  const handleSignup = async () => {
    Keyboard.dismiss();
    if (!firebaseReady) return;
    if (!validateForm()) return;

    try {
      await verifyOTP(email, otp);
      await signup(email, password);
      Alert.alert('Success', 'Account created successfully!');
      router.replace('/');
    } catch (error) {
      let errorMessage = 'Account creation failed';
      if (error.code === 'auth/otp-expired') {
        errorMessage = 'OTP has expired. Please request a new one.';
      } else if (error.code === 'auth/invalid-otp') {
        errorMessage = 'Invalid OTP code. Please try again.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters';
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please login instead.';
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join us to get started</Text>
          
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
                  placeholder="Password (min 6 characters)"
                  placeholderTextColor="#999"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  ref={passwordInputRef}
                  returnKeyType="next"
                  onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
                  blurOnSubmit={false}
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

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor="#999"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  ref={confirmPasswordInputRef}
                  returnKeyType="done"
                  onSubmitEditing={handleSendOTP}
                />
                <TouchableOpacity 
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.passwordToggle}
                >
                  <Ionicons 
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color="#666" 
                  />
                </TouchableOpacity>
              </View>
              {formErrors.confirmPassword && <Text style={styles.errorText}>{formErrors.confirmPassword}</Text>}

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
                  onSubmitEditing={handleSignup}
                />
              </View>
              {formErrors.otp && <Text style={styles.errorText}>{formErrors.otp}</Text>}

              <Text style={styles.otpInstructions}>
                OTP sent to {email}
              </Text>

              <TouchableOpacity 
                style={[styles.button, (loading || !firebaseReady) && styles.buttonDisabled]} 
                onPress={handleSignup}
                disabled={loading || !firebaseReady}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Complete Sign Up</Text>
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
                <Text style={styles.backButtonText}>Back to Sign Up</Text>
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
            onPress={() => router.push('/login')}
          >
            <Text style={styles.secondaryButtonText}>Already have an account? Login</Text>
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
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginTop: 16,
    shadowColor: '#28a745',
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
    borderColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  secondaryButtonText: {
    color: '#28a745',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resendButton: {
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resendButtonText: {
    color: '#28a745',
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

export default Signup;