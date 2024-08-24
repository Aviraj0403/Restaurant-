
import mongoose from 'mongoose';

// In cartModel.js
export const cartItemSchema = new mongoose.Schema({
  food: { type: mongoose.Schema.Types.ObjectId, ref: 'food', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});


const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cartItems: [cartItemSchema],
  totalPrice: { type: Number, required: true },
  totalCount: { type: Number, required: true },
});

export const cartModel = mongoose.model('cart', cartSchema);


