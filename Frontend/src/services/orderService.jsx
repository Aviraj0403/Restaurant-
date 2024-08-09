import axios from 'axios';

// Ensure axios is configured with the correct base URL in your axiosConfig.js
// axios.defaults.baseURL = import.meta.env.VITE_API_URL || '/';

export const createOrder = async (order) => {
  try {
    const { data } = await axios.post('/api/orders/create', order);
    return data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error; // Re-throw error after logging it
  }
};

export const getNewOrderForCurrentUser = async () => {
  try {
    const { data } = await axios.get('/api/orders/newOrderForCurrentUser');
    return data;
  } catch (error) {
    console.error('Error fetching new order for current user:', error);
    throw error;
  }
};

export const pay = async (paymentId) => {
  try {
    const { data } = await axios.put('/api/orders/pay', { paymentId });
    return data;
  } catch (error) {
    console.error('Error processing payment:', error);
    throw error;
  }
};

export const trackOrderById = async (orderId) => {
  try {
    const { data } = await axios.get(`/api/orders/track/${orderId}`);
    return data;
  } catch (error) {
    console.error('Error tracking order:', error);
    throw error;
  }
};

export const getAll = async (state) => {
  try {
    const { data } = await axios.get(`/api/orders/${state ?? ''}`);
    return data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const getAllStatus = async () => {
  try {
    const { data } = await axios.get('/api/orders/allstatus');
    return data;
  } catch (error) {
    console.error('Error fetching all order statuses:', error);
    throw error;
  }
};
