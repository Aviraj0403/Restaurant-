// context/AuthContext.jsx
import React, { useState, createContext, useContext } from 'react';
import * as userService from '../services/userService';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => userService.getUser());

  const login = async (email, password) => {
    try {
      const user = await userService.login(email, password);
      setUser(user);
      toast.success('Login Successful');
    } catch (err) {
      toast.error(err.message || 'Login Failed');
    }
  };

  const register = async (data) => {
    try {
      const user = await userService.register(data);
      setUser(user);
      toast.success('Register Successful');
    } catch (err) {
      toast.error(err.message || 'Registration Failed');
    }
  };

  const logout = () => {
    userService.logout();
    setUser(null);
    toast.success('Logout Successful');
  };

  const updateProfile = async (userData) => {
    try {
      const updatedUser = await userService.updateProfile(userData);
      toast.success('Profile Update Was Successful');
      if (updatedUser) setUser(updatedUser);
    } catch (err) {
      toast.error(err.message || 'Profile Update Failed');
    }
  };

  const changePassword = async (passwords) => {
    try {
      await userService.changePassword(passwords);
      logout();
      toast.success('Password Changed Successfully, Please Login Again!');
    } catch (err) {
      toast.error(err.message || 'Password Change Failed');
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, register, updateProfile, changePassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
