// services/cartService.js
import axios from 'axios';

// Fetch the user's cart from the server
export const fetchUserCart = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    const { data } = await axios.get(`/api/foods/cart/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw new Error('Failed to fetch cart data.');
  }
};

// Update the user's cart on the server
export const updateCartOnServer = async (userId, cartData) => {
  try {
    const token = localStorage.getItem('token');
    await axios.put(`/api/cart/${userId}`, cartData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    throw new Error('Failed to update cart data.');
  }
};
