// userModel.js
import mongoose from 'mongoose';
import { cartItemSchema } from '../models/cartModel.js'; // Ensure this path is correct

const { Schema, model } = mongoose;

export const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    cart: {
      cartItems: [cartItemSchema],
      totalPrice: { type: Number, default: 0 },
      totalCount: { type: Number, default: 0 },
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

export const UserModel = model('user', UserSchema);
