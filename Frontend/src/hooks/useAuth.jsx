// context/AuthContext.jsx
import React, { useState, createContext, useContext, useCallback } from 'react';
import * as userService from '../services/userService';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => userService.getUser());

  const login = useCallback(async (email, password) => {
    try {
      const userData = await userService.login(email, password);
      setUser(userData);
      toast.success('Login Successful');
    } catch (err) {
      toast.error(err.message || 'Login Failed');
    }
  }, []);

  const register = useCallback(async (data) => {
    try {
      const userData = await userService.register(data);
      setUser(userData);
      toast.success('Register Successful');
    } catch (err) {
      toast.error(err.message || 'Registration Failed');
    }
  }, []);

  const logout = useCallback(() => {
    userService.logout();
    setUser(null);
    toast.success('Logout Successful');
  }, []);

  const updateProfile = useCallback(async (userData) => {
    try {
      const updatedUser = await userService.updateProfile(userData);
      setUser(updatedUser);
      toast.success('Profile Update Was Successful');
    } catch (err) {
      toast.error(err.message || 'Profile Update Failed');
    }
  }, []);

  const changePassword = useCallback(async (passwords) => {
    try {
      await userService.changePassword(passwords);
      logout(); // Automatically log out after password change
      toast.success('Password Changed Successfully, Please Login Again!');
    } catch (err) {
      toast.error(err.message || 'Password Change Failed');
    }
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, register, updateProfile, changePassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
