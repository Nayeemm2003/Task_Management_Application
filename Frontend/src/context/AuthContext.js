import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || 'https://back-end-production-fcde.up.railway.app';
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/auth/me`);
      setUser(res.data.user);
    } catch (error) {
      console.error('Fetch user failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
  try {
    console.log('Logging in to:', `${API_URL}/api/auth/login`);
    const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
    const { token, user } = res.data;
    
    // Store token
    setToken(token);
    setUser(user);
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    console.log('Login successful!', user);
    return { success: true, user };  // ← Return user data
  } catch (error) {
    console.error('Login error:', error);
    return { 
      success: false, 
      error: error.response?.data?.error || 'Login failed' 
    };
  }
};

  const signup = async (name, email, password, role) => {
  try {
    console.log('Signing up to:', `${API_URL}/api/auth/signup`);
    const res = await axios.post(`${API_URL}/api/auth/signup`, { name, email, password, role });
    const { token, user } = res.data;
    
    // Store token
    setToken(token);
    setUser(user);
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    console.log('Signup successful!', user);
    return { success: true, user };  // ← Return user data
  } catch (error) {
    console.error('Signup error:', error);
    return { 
      success: false, 
      error: error.response?.data?.error || 'Signup failed' 
    };
  }
};

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};