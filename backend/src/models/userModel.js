// models/UserModel.js
import { model, Schema } from 'mongoose';

const orderItemSchema1 = new Schema({
  productId:{
    type: Schema.Types.ObjectId,
    ref:"food"
  },
  quantity:{
    type:Number,
    required:true
  }

})

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    cart: [orderItemSchema1],
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

export const UserModel = model('User', UserSchema);
