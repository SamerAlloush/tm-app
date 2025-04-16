// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);