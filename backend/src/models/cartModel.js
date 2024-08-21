// models/Cart.js
import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
    quantity: { type: Number, default: 1 },
    price: { type: Number, default: 0 }
  }],
  totalPrice: { type: Number, default: 0 },
  totalCount: { type: Number, default: 0 }
});

cartSchema.methods.addToCart = async function (foodId, quantity) {
  const itemIndex = this.items.findIndex(item => item.food.toString() === foodId);
  if (itemIndex > -1) {
    // Item already in cart, update quantity
    this.items[itemIndex].quantity += quantity;
  } else {
    // Item not in cart, add new item
    this.items.push({ food: foodId, quantity, price: 0 }); // price should be updated later
  }
  await this.save(); // Save changes
};

cartSchema.methods.removeFromCart = async function (foodId) {
  this.items = this.items.filter(item => item.food.toString() !== foodId);
  await this.save(); // Save changes
};

// Update price and quantity before saving
cartSchema.pre('save', function (next) {
  this.totalPrice = this.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  this.totalCount = this.items.reduce((acc, item) => acc + item.quantity, 0);
  next();
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
