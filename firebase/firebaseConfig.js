import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
const firebaseConfig = {
  apiKey: "AIzaSyAA41SAoJY33F0J6aXUZXbQYFHuXE-pUaU",
  authDomain: "tm-app-41ed2.firebaseapp.com",
  projectId: "tm-app-41ed2",
  storageBucket: "tm-app-41ed2.firebasestorage.app",
  messagingSenderId: "350942547854",
  appId: "1:350942547854:web:ef534783f8b80b77d35edf",
  measurementId: "G-EE3P7X575N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const auth = getAuth(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
// Initialize Analytics only if supported
let analytics;
const initAnalytics = async () => {
  try {
    if (await isSupported()) {
      analytics = getAnalytics(app);
    }
  } catch (error) {
    console.log("Firebase Analytics not supported:", error);
  }
};
initAnalytics();

export { app, auth, analytics };