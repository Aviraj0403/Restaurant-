import { Router } from 'express';
import handler from 'express-async-handler';
import auth from '../middleware/authMid.js';
import { CartModel } from '../models/cartModel.js';
import { FoodModel } from '../models/foodModel.js';

const router = Router();
router.use(auth);

router.get('/', handler(async (req, res) => {
  const cart = await CartModel.findOne({ user: req.user.id }).populate('items.food');
  if (!cart) {
    return res.status(404).send({ items: [], totalPrice: 0, totalCount: 0 });
  }
  const totalPrice = cart.items.reduce((sum, item) => sum + (item.quantity * item.food.price), 0);
  const totalCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  res.send({ items: cart.items, totalPrice, totalCount });
}));

router.post('/add', handler(async (req, res) => {
  const { foodId, quantity } = req.body;
  const cart = await CartModel.findOne({ user: req.user.id });

  if (!cart) {
    return res.status(404).send('Cart not found');
  }

  const food = await FoodModel.findById(foodId);
  if (!food) {
    return res.status(404).send('Food not found');
  }

  const existingItem = cart.items.find(item => item.food.toString() === foodId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ food: foodId, quantity });
  }

  await cart.save();
  const updatedCart = await CartModel.findOne({ user: req.user.id }).populate('items.food');
  const totalPrice = updatedCart.items.reduce((sum, item) => sum + (item.quantity * item.food.price), 0);
  const totalCount = updatedCart.items.reduce((sum, item) => sum + item.quantity, 0);
  res.send({ items: updatedCart.items, totalPrice, totalCount });
}));

router.post('/remove', handler(async (req, res) => {
  const { foodId } = req.body;
  const cart = await CartModel.findOne({ user: req.user.id });

  if (!cart) {
    return res.status(404).send('Cart not found');
  }

  cart.items = cart.items.filter(item => item.food.toString() !== foodId);

  await cart.save();
  const updatedCart = await CartModel.findOne({ user: req.user.id }).populate('items.food');
  const totalPrice = updatedCart.items.reduce((sum, item) => sum + (item.quantity * item.food.price), 0);
  const totalCount = updatedCart.items.reduce((sum, item) => sum + item.quantity, 0);
  res.send({ items: updatedCart.items, totalPrice, totalCount });
}));

router.post('/clear', handler(async (req, res) => {
  await CartModel.findOneAndUpdate({ user: req.user.id }, { items: [] }, { new: true });
  res.send({ items: [], totalPrice: 0, totalCount: 0 });
}));

export default router;
