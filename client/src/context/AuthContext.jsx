import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const getCurrentUser = async () => {
    try {
      const userData = await authService.getMe();
      setUser(userData);
    } catch (error) {
      console.error('Get current user error:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

const login = async (email, password) => {
  try {
    setError('');
    const response = await authService.login(email, password);
    setUser(response);
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response)); // Store user data
    return response;
  } catch (error) {
    setError(error.response?.data?.message || 'Login failed');
    throw error;
  }
};

const register = async (userData) => {
  try {
    setError('');
    const response = await authService.register(userData);
    setUser(response);
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response)); 
    return response;
  } catch (error) {
    setError(error.response?.data?.message || 'Registration failed');
    throw error;
  }
};

const logout = () => {
  setUser(null);
  localStorage.removeItem('token');
  localStorage.removeItem('user'); 
};


  const clearError = () => setError('');

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};