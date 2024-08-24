import axios from 'axios'; // Import axios directly

// Configure request interceptor
axios.interceptors.request.use(
  req => {
    const user = localStorage.getItem('user');
    const token = user && JSON.parse(user).token;
    if (token) {
      req.headers['access_token'] = token; // Ensure header name matches what server expects
    }
    return req;
  },
  error => Promise.reject(error)
);

export default axios;

// Fetch cart data
export const fetchCart = async () => {
  try {
    const response = await axios.get('/api/cart');
    return response.data;
  } catch (error) {
    console.error('Error fetching cart:', error.message);
    throw error;
  }
};

// Add item to cart
export const addToCart = async (foodId, quantity) => {
  try {
    const response = await axios.post('/api/cart/add', { foodId, quantity });
    return response.data;
  } catch (error) {
    console.error('Error adding item to cart:', error.message);
    throw error;
  }
};

// Remove item from cart
export const removeFromCart = async (foodId) => {
  try {
    const response = await axios.post('/api/cart/remove', { foodId });
    return response.data;
  } catch (error) {
    console.error('Error removing item from cart:', error.message);
    throw error;
  }
};

// Save cart
export const saveCart = async (cartItems, totalPrice, totalCount) => {
  try {
    const response = await axios.post('/api/cart/save', {
      cartItems,
      totalPrice,
      totalCount
    });
    return response.data;
  } catch (error) {
    console.error('Error saving cart:', error.message);
    throw error;
  }
};

// Clear cart
export const clearCart = async () => {
  try {
    const response = await axios.post('/api/cart/clear');
    return response.data;
  } catch (error) {
    console.error('Error clearing cart:', error.message);
    throw error;
  }
};
