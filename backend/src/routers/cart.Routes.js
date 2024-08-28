import { Router } from 'express';
import handler from 'express-async-handler';
import auth from '../middleware/authMid.js'; 
import {
  fetchCart,
  addItemToCart,
  removeItemFromCart,
  saveCart,
  clearCart
} from '../controllers/cart.controller.js';

const router = Router();
router.use(auth);

router.route('/')
  .get(handler(fetchCart));

router.route('/add')
  .post(handler(addItemToCart));

router.route('/remove')
  .post(handler(removeItemFromCart));

router.route('/save')
  .post(handler(saveCart));

router.route('/clear')
  .post(handler(clearCart));

export default router;
