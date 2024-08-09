import axios from 'axios';

// Create an Axios instance with the base URL from the environment variable
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const getUser = () =>
  localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null;

export const login = async (email, password) => {
  const { data } = await apiClient.post('/api/users/login', { email, password });
  localStorage.setItem('user', JSON.stringify(data));
  return data;
};

export const register = async (registerData) => {
  const { data } = await apiClient.post('/api/users/register', registerData);
  localStorage.setItem('user', JSON.stringify(data));
  return data;
};

export const logout = () => {
  localStorage.removeItem('user');
};

export const updateProfile = async (user) => {
  const { data } = await apiClient.put('/api/users/updateProfile', user);
  localStorage.setItem('user', JSON.stringify(data));
  return data;
};

export const changePassword = async (passwords) => {
  await apiClient.put('/api/users/changePassword', passwords);
};

export const getAll = async (searchTerm) => {
  const { data } = await apiClient.get('/api/users/getAll/' + (searchTerm ?? ''));
  return data;
};

export const toggleBlock = async (userId) => {
  const { data } = await apiClient.put('/api/users/toggleBlock/' + userId);
  return data;
};

export const getById = async (userId) => {
  const { data } = await apiClient.get('/api/users/getById/' + userId);
  return data;
};

export const updateUser = async (userData) => {
  const { data } = await apiClient.put('/api/users/update', userData);
  return data;
};
