import { FoodModel } from '../models/foodModel.js';
import { cartModel } from '../models/cartModel.js';

// Fetch cart
export const fetchCart = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).send('User not authenticated');
    }

    const cart = await cartModel.findOne({ userId }).populate('cartItems.food');
    console.log('Fetched Cart:', cart);
    console.log('Cart Items:', cart.cartItems);
    if (!cart || !cart.cartItems) {
      return res.status(404).send({ items: [], totalPrice: 0, totalCount: 0 });
    }

    const totalPrice = cart.cartItems.reduce((sum, item) => sum + (item.quantity * (item.food?.price || 0)), 0);
    const totalCount = cart.cartItems.reduce((sum, item) => sum + item.quantity, 0);

    res.send({ items: cart.cartItems, totalPrice, totalCount });
  } catch (error) {
    console.error('Error fetching cart:', error.message);
    res.status(500).send('Error fetching cart');
  }
};

// Add item to cart
export const addItemToCart = async (req, res) => {
  const { foodId, quantity } = req.body;

  try {
    let cart = await cartModel.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new cartModel({ userId: req.user.id, cartItems: [], totalPrice: 0, totalCount: 0 });
    }
    console.log('Initial cart:', cart);
    const food = await FoodModel.findById(foodId);
    if (!food) {
      return res.status(404).send('Food not found');
    }

    const existingItem = cart.cartItems.find(item => item.food.toString() === foodId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.cartItems.push({ food: foodId, quantity, price: food.price });
    }

    await cart.save();
    const updatedCart = await cartModel.findOne({ userId: req.user.id }).populate('cartItems.food');

    const totalPrice = updatedCart.cartItems.reduce((sum, item) => sum + (item.quantity * (item.food?.price || 0)), 0);
    const totalCount = updatedCart.cartItems.reduce((sum, item) => sum + item.quantity, 0);

    res.send({ items: updatedCart.cartItems, totalPrice, totalCount });
  } catch (error) {
    console.error('Error adding to cart:', error.message);
    res.status(500).send('Error adding to cart');
  }
};

// Remove item from cart
export const removeItemFromCart = async (req, res) => {
  const { foodId } = req.body;

  try {
    const cart = await cartModel.findOne({ userId: req.user.id });
    if (!cart || !cart.cartItems) {
      return res.status(404).send('Cart not found');
    }

    cart.cartItems = cart.cartItems.filter(item => item.food.toString() !== foodId);
    await cart.save();

    const updatedCart = await cartModel.findOne({ userId: req.user.id }).populate('cartItems.food');

    const totalPrice = updatedCart.cartItems.reduce((sum, item) => sum + (item.quantity * (item.food?.price || 0)), 0);
    const totalCount = updatedCart.cartItems.reduce((sum, item) => sum + item.quantity, 0);

    res.send({ items: updatedCart.cartItems, totalPrice, totalCount });
  } catch (error) {
    console.error('Error removing from cart:', error.message);
    res.status(500).send('Error removing from cart');
  }
};

// Save cart data (used for logging out)
export const saveCart = async (req, res) => {
  try {
    const { cartItems, totalPrice, totalCount } = req.body;
    await cartModel.findOneAndUpdate(
      { userId: req.user.id },
      { cartItems, totalPrice, totalCount },
      { upsert: true, new: true }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error saving cart:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    await cartModel.findOneAndUpdate(
      { userId: req.user.id },
      { cartItems: [], totalPrice: 0, totalCount: 0 },
      { new: true }
    );
    res.send({ items: [], totalPrice: 0, totalCount: 0 });
  } catch (error) {
    console.error('Error clearing cart:', error.message);
    res.status(500).send('Error clearing cart');
  }
};
