import { createContext, useContext, useState, useEffect } from 'react';
import {
  initializeAuth,
  getReactNativePersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  sendEmailVerification
} from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { app } from '../firebase/firebaseConfig';
import * as Linking from 'expo-linking';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [auth, setAuth] = useState(null);

  // Initialize auth with persistence
  useEffect(() => {
    const initAuth = async () => {
      try {
        const initializedAuth = initializeAuth(app, {
          persistence: getReactNativePersistence(ReactNativeAsyncStorage)
        });
        setAuth(initializedAuth);
        setFirebaseReady(true);
        
        // Check for email link on initial load
        await handleEmailLink(initializedAuth);
      } catch (error) {
        console.error("Auth initialization error:", error);
        setAuthError(error.message);
        setFirebaseReady(false);
      }
    };

    initAuth();

    // Set up deep link listener
    const subscription = Linking.addEventListener('url', handleDeepLink);
    
    return () => {
      if (subscription?.remove) {
        subscription.remove();
      }
    };
  }, []);

  // Set up auth state listener
  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth,
      (user) => {
        setCurrentUser(user);
        setLoading(false);
        setAuthError(null);
      },
      (error) => {
        setAuthError(error.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [auth]);

  // Handle incoming deep links
  const handleDeepLink = async ({ url }) => {
    if (!url || !auth) return;
    
    try {
      if (isSignInWithEmailLink(auth, url)) {
        const email = await ReactNativeAsyncStorage.getItem('emailForSignIn');
        if (email) {
          await signInWithEmailLink(auth, email, url);
          await ReactNativeAsyncStorage.removeItem('emailForSignIn');
        }
      }
    } catch (error) {
      console.error('Deep link handling error:', error);
      setAuthError(error.message);
    }
  };

  // Handle email link on app start
  const handleEmailLink = async (authInstance) => {
    const initialUrl = await Linking.getInitialURL();
    if (initialUrl && authInstance) {
      await handleDeepLink({ url: initialUrl });
    }
  };

  // Send OTP via email
  const sendOTP = async (email) => {
    try {
      if (!auth) {
        throw new Error('Authentication service not ready');
      }

      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        throw new Error('Invalid email format');
      }

      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store OTP with expiration (5 minutes)
      await ReactNativeAsyncStorage.setItem(
        `otp_${email}`, 
        JSON.stringify({
          otp,
          expiresAt: Date.now() + 300000 // 5 minutes
        })
      );

      // Configure email action link
      const actionCodeSettings = {
        url: `${Linking.createURL('/verify-otp')}?email=${encodeURIComponent(email)}&otp=${otp}`,
        handleCodeInApp: true,
        iOS: {
          bundleId: 'com.tmapp.newproject',
        },
        android: {
          packageName: 'com.tmapp.newproject',
          installApp: true,
          minimumVersion: '12',
        },
      };

      // Send the email
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      
      // Save the email for verification
      await ReactNativeAsyncStorage.setItem('emailForSignIn', email);

      return true;
    } catch (error) {
      console.error("OTP sending error:", error);
      throw error;
    }
  };

  // Verify OTP code
  const verifyOTP = async (email, code) => {
    try {
      // First check if we have a stored OTP
      const storedData = await ReactNativeAsyncStorage.getItem(`otp_${email}`);
      if (!storedData) {
        throw new Error('No OTP verification in progress for this email');
      }

      const { otp, expiresAt } = JSON.parse(storedData);
      
      // Check expiration
      if (Date.now() > expiresAt) {
        await ReactNativeAsyncStorage.removeItem(`otp_${email}`);
        throw new Error('OTP has expired');
      }

      // Verify code
      if (otp !== code) {
        throw new Error('Invalid OTP code');
      }

      // OTP is valid, remove it from storage
      await ReactNativeAsyncStorage.removeItem(`otp_${email}`);
      
      return true;
    } catch (error) {
      console.error("OTP verification error:", error);
      throw error;
    }
  };

  // Sign up new user
  const signup = async (email, password) => {
    try {
      if (!auth) {
        throw new Error('Authentication service not ready');
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        email, 
        password
      );

      // Mark email as verified since we're using OTP verification
      if (userCredential.user) {
        await sendEmailVerification(userCredential.user);
        setCurrentUser(userCredential.user);
      }
      
      return userCredential.user;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  // Login existing user
  const login = async (email, password) => {
    try {
      if (!auth) {
        throw new Error('Authentication service not ready');
      }

      const userCredential = await signInWithEmailAndPassword(
        auth, 
        email, 
        password
      );

      return userCredential.user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Logout current user
  const logout = async () => {
    try {
      if (!auth) {
        throw new Error('Authentication service not ready');
      }
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const value = {
    currentUser,
    signup,
    login,
    logout,
    sendOTP,
    verifyOTP,
    loading,
    authError,
    firebaseReady,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
