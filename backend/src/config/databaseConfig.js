import { connect, set } from 'mongoose';
import { UserModel } from '../models/userModel.js';
import { FoodModel } from '../models/foodModel.js';
import { sample_users } from '../data.js';
import { sample_foods } from '../data.js';
import bcrypt from 'bcryptjs';

const PASSWORD_HASH_SALT_ROUNDS = 10;
set('strictQuery', true);

export const dbconnect = async () => {
  try {
    // Updated connection without deprecated options
    await connect(process.env.MONGO_URL);
    await seedUsers();
    await seedFoods();
    // console.log()
    console.log('Connected to MongoDB Atlas successfully---');
  } catch (error) {
    console.log('Error connecting to MongoDB Atlas:', error);
  }
};

async function seedUsers() {
  const usersCount = await UserModel.countDocuments();
  if (usersCount > 0) {
    console.log('Users seed is already done!');
    return;
  }

  for (let user of sample_users) {
    user.password = await bcrypt.hash(user.password, PASSWORD_HASH_SALT_ROUNDS);
    await UserModel.create(user);
  }

  console.log('Users seed is done!');
}

async function seedFoods() {
  const foodsCount = await FoodModel.countDocuments();
  if (foodsCount > 0) {
    console.log('Foods seed is already done!');
    return;
  }

  for (const food of sample_foods) {
    food.imageUrl = `/foods/${food.imageUrl}`;
    await FoodModel.create(food);
  }

  console.log('Foods seed is done!');
}
