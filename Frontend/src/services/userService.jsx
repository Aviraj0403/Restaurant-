import axios from 'axios';

// Get user from local storage
export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Log in a user and store the user data in local storage
export const login = async (email, password) => {
  try {
    const { data } = await axios.post('/api/users/login', { email, password });
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('Login error:', error);
    // Optionally show a user-friendly message
    throw new Error('Login failed. Please check your credentials and try again.');
  }
};

// Register a new user and store the user data in local storage
export const register = async (registerData) => {
  try {
    const { data } = await axios.post('/api/users/register', registerData);
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    // Optionally show a user-friendly message
    throw new Error('Registration failed. Please try again later.');
  }
};

// Log out a user by removing data from local storage
export const logout = () => {
  localStorage.removeItem('user');
};

// Update the user profile and store the updated user data in local storage
export const updateProfile = async (user) => {
  try {
    const { data } = await axios.put('/api/users/updateProfile', user);
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('Update profile error:', error);
    // Optionally show a user-friendly message
    throw new Error('Profile update failed. Please try again later.');
  }
};

// Change the user's password
export const changePassword = async (passwords) => {
  try {
    await axios.put('/api/users/changePassword', passwords);
  } catch (error) {
    console.error('Change password error:', error);
    // Optionally show a user-friendly message
    throw new Error('Password change failed. Please try again.');
  }
};

// Get all users with optional search term
export const getAll = async (searchTerm = '') => {
  try {
    const { data } = await axios.get(`/api/users/getAll/${encodeURIComponent(searchTerm)}`);
    return data;
  } catch (error) {
    console.error('Get all users error:', error);
    // Optionally show a user-friendly message
    throw new Error('Failed to retrieve users. Please try again later.');
  }
};

// Toggle block status of a user
export const toggleBlock = async (userId) => {
  try {
    const { data } = await axios.put(`/api/users/toggleBlock/${userId}`);
    return data;
  } catch (error) {
    console.error('Toggle block error:', error);
    // Optionally show a user-friendly message
    throw new Error('Failed to toggle user block status. Please try again later.');
  }
};

// Get user by ID
export const getById = async (userId) => {
  try {
    const { data } = await axios.get(`/api/users/getById/${userId}`);
    return data;
  } catch (error) {
    console.error('Get user by ID error:', error);
    // Optionally show a user-friendly message
    throw new Error('Failed to retrieve user details. Please try again later.');
  }
};

// Update user data
export const updateUser = async (userData) => {
  try {
    const { data } = await axios.put('/api/users/update', userData);
    return data;
  } catch (error) {
    console.error('Update user error:', error);
    // Optionally show a user-friendly message
    throw new Error('Failed to update user data. Please try again later.');
  }
};
