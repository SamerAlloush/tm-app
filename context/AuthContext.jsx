import React, { createContext, useContext, useState } from 'react';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig.extra.apiUrl;

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) throw new Error('Invalid credentials');
      const data = await response.json();
      setCurrentUser(data.user || { email }); // Adjust as per backend response
      return data;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, name, phone, roles) => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await fetch(`${apiUrl}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, phone, roles }),
      });
      if (!response.ok) throw new Error('Signup failed');
      const data = await response.json();
      setCurrentUser(data.user || { email }); // Adjust as per backend response
      return data;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setCurrentUser(null);
    // Optionally, call backend to invalidate token/session
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout, loading, authError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}