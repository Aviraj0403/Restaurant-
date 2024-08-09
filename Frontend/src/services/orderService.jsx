import axios from 'axios';

// Create a new order
export const createOrder = async (order) => {
  try {
    const { data } = await axios.post('/api/orders/create', order);
    return data;
  } catch (error) {
    console.error('Create order error:', error);
    throw new Error('Failed to create order. Please try again later.');
  }
};

// Get the new order for the current user
export const getNewOrderForCurrentUser = async () => {
  try {
    const { data } = await axios.get('/api/orders/newOrderForCurrentUser');
    return data;
  } catch (error) {
    console.error('Get new order error:', error);
    throw new Error('Failed to retrieve new order. Please try again later.');
  }
};

// Pay for an order
export const pay = async (paymentId) => {
  try {
    const { data } = await axios.put('/api/orders/pay', { paymentId });
    return data;
  } catch (error) {
    console.error('Payment error:', error);
    throw new Error('Payment failed. Please try again later.');
  }
};

// Track an order by its ID
export const trackOrderById = async (orderId) => {
  try {
    const { data } = await axios.get(`/api/orders/track/${orderId}`);
    return data;
  } catch (error) {
    console.error('Track order error:', error);
    throw new Error('Failed to track order. Please try again later.');
  }
};

// Get all orders based on state
export const getAll = async (state = '') => {
  try {
    const { data } = await axios.get(`/api/orders/${state}`);
    return data;
  } catch (error) {
    console.error('Get all orders error:', error);
    throw new Error('Failed to retrieve orders. Please try again later.');
  }
};

// Get all order statuses
export const getAllStatus = async () => {
  try {
    const { data } = await axios.get('/api/orders/allstatus');
    return data;
  } catch (error) {
    console.error('Get all statuses error:', error);
    throw new Error('Failed to retrieve order statuses. Please try again later.');
  }
};
