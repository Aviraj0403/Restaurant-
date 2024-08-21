// src/controllers/cartController.js

import Cart from '../models/Cart.js'; // Import with .js extension
import Food from '../models/Food.js'; // Import with .js extension

// Fetch user's cart
export const getUserCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.food');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.json(cart);
  } catch (error) {
    console.error(`Error fetching cart: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add or update cart item
export const updateUserCart = async (req, res) => {
  const { foodId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id });
    }

    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    const existingItemIndex = cart.items.findIndex(item => item.food.toString() === foodId);
    if (existingItemIndex > -1) {
      // Update existing item
      cart.items[existingItemIndex].quantity = quantity;
      cart.items[existingItemIndex].price = food.price * quantity;
    } else {
      // Add new item
      cart.items.push({ food: foodId, quantity, price: food.price * quantity });
    }

    // Update total price and count
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price, 0);
    cart.totalCount = cart.items.reduce((count, item) => count + item.quantity, 0);

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error(`Error updating cart: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Clear user's cart
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      cart.totalPrice = 0;
      cart.totalCount = 0;
      await cart.save();
      res.status(200).json(cart);
    } else {
      res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    console.error(`Error clearing cart: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};
