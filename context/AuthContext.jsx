// // import React, { createContext, useContext, useState, useEffect } from 'react';
// // import { auth } from '../firebase/firebaseConfig';
// // import {
// //   createUserWithEmailAndPassword,
// //   signInWithEmailAndPassword,
// //   signOut,
// //   onAuthStateChanged
// // } from 'firebase/auth';

// // const AuthContext = createContext();

// // export function AuthProvider({ children }) {
// //   const [currentUser, setCurrentUser] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   function signup(email, password) {
// //     return createUserWithEmailAndPassword(auth, email, password);
// //   }

// //   function login(email, password) {
// //     return signInWithEmailAndPassword(auth, email, password);
// //   }

// //   function logout() {
// //     return signOut(auth);
// //   }

// //   useEffect(() => {
// //     const unsubscribe = onAuthStateChanged(auth, (user) => {
// //       setCurrentUser(user);
// //       setLoading(false);
// //     });
// //     return unsubscribe;
// //   }, []);

// //   const value = {
// //     currentUser,
// //     signup,
// //     login,
// //     logout,
// //   };

// //   return (
// //     <AuthContext.Provider value={value}>
// //       {!loading && children}
// //     </AuthContext.Provider>
// //   );
// // }

// // export function useAuth() {
// //   return useContext(AuthContext);
// // }
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import auth from '@react-native-firebase/auth';

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Handle user state changes
//   useEffect(() => {
//     const subscriber = auth().onAuthStateChanged(authUser => {
//       setUser(authUser);
//       setLoading(false);
//     });
//     return subscriber; // Unsubscribe on unmount
//   }, []);

//   // Sign up with email/password
//   const signup = async (email, password) => {
//     try {
//       await auth().createUserWithEmailAndPassword(email, password);
//     } catch (error) {
//       let errorMessage = "Signup failed. Please try again.";
//       if (error.code === 'auth/email-already-in-use') {
//         errorMessage = "This email is already in use.";
//       } else if (error.code === 'auth/invalid-email') {
//         errorMessage = "Please enter a valid email.";
//       }
//       throw new Error(errorMessage);
//     }
//   };

//   // Login with email/password
//   const login = async (email, password) => {
//     try {
//       await auth().signInWithEmailAndPassword(email, password);
//     } catch (error) {
//       let errorMessage = "Login failed. Please try again.";
//       if (error.code === 'auth/user-not-found') {
//         errorMessage = "No account found with this email.";
//       } else if (error.code === 'auth/wrong-password') {
//         errorMessage = "Incorrect password.";
//       }
//       throw new Error(errorMessage);
//     }
//   };

//   // Logout
//   const logout = async () => {
//     try {
//       await auth().signOut();
//     } catch (error) {
//       throw new Error("Logout failed. Please try again.");
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);
// context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { app } from '../firebase/firebaseConfig';

const auth = getAuth(app);

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}