// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyCGXfiPgX5YT35Oznu-tBCgyQJVM62VOJE",
//   authDomain: "tm-mobile-app-f1ec9.firebaseapp.com",
//   databaseURL: "https://tm-mobile-app-f1ec9-default-rtdb.europe-west1.firebasedatabase.app",
//   projectId: "tm-mobile-app-f1ec9",
//   storageBucket: "tm-mobile-app-f1ec9.firebasestorage.app",
//   messagingSenderId: "323637275731",
//   appId: "1:323637275731:web:7ec2d33693d866fb526aa6",
//   measurementId: "G-WWB4YFFSL6"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// firebaseConfig.js
// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCGXfiPgX5YT35Oznu-tBCgyQJVM62VOJE",
  authDomain: "tm-mobile-app-f1ec9.firebaseapp.com",
  databaseURL: "https://tm-mobile-app-f1ec9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "tm-mobile-app-f1ec9",
  storageBucket: "tm-mobile-app-f1ec9.appspot.com",
  messagingSenderId: "323637275731",
  appId: "1:323637275731:web:7ec2d33693d866fb526aa6",
  measurementId: "G-WWB4YFFSL6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };