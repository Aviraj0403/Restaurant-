import { model, Schema } from 'mongoose';

const CartItemSchema = new Schema({
  food: { type: Schema.Types.ObjectId, ref: 'food', required: true },
  quantity: { type: Number, required: true },
}, { _id: false });

const CartSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  items: [CartItemSchema],
}, { timestamps: true });

export const CartModel = model('cart', CartSchema);
