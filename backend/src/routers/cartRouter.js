import express from 'express';
import { getUserCart, updateUserCart, clearCart } from '../controllers/cartController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Fetch user's cart
router.get('/cart', authMiddleware, async (req, res) => {
    try {
      const cartItems = await CartModel.find({ userId: req.user._id });
      console.log(`Cart items fetched for user ${req.user._id}: ${cartItems}`);
      res.json(cartItems);
    } catch (error) {
      console.error(`Error fetching cart items: ${error.message}`);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

// Add or update cart item
router.post('/cart', authMiddleware, updateUserCart);

// Clear cart after order
router.post('/cart/clear', authMiddleware, clearCart);

export default router;
