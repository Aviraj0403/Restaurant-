// controllers/userController.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { BAD_REQUEST } from '../constants/httpStatus.js';
import { UserModel } from '../models/userModel.js';

const PASSWORD_HASH_SALT_ROUNDS = 10;

// Generate token response
const generateTokenResponse = user => {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    address: user.address,
    isAdmin: user.isAdmin,
    token,
  };
};

// Login user
export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    return res.send(generateTokenResponse(user));
  }

  res.status(BAD_REQUEST).send('Username or password is invalid');
};

// Register user
export const register = async (req, res) => {
  const { name, email, password, address } = req.body;

  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    return res.status(BAD_REQUEST).send('User already exists, please login!');
  }

  const hashedPassword = await bcrypt.hash(password, PASSWORD_HASH_SALT_ROUNDS);

  const newUser = {
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    address,
  };

  const result = await UserModel.create(newUser);
  res.send(generateTokenResponse(result));
};

// Update user profile
export const updateProfile = async (req, res) => {
  const { name, address } = req.body;
  const user = await UserModel.findByIdAndUpdate(
    req.user.id,
    { name, address },
    { new: true }
  );

  res.send(generateTokenResponse(user));
};

// Change user password
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await UserModel.findById(req.user.id);

  if (!user) {
    return res.status(BAD_REQUEST).send('Change Password Failed!');
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    return res.status(BAD_REQUEST).send('Current Password Is Not Correct!');
  }

  user.password = await bcrypt.hash(newPassword, PASSWORD_HASH_SALT_ROUNDS);
  await user.save();

  res.send();
};

// Get all users with optional search term
export const getAllUsers = async (req, res) => {
  const { searchTerm } = req.params;

  const filter = searchTerm
    ? { name: { $regex: new RegExp(searchTerm, 'i') } }
    : {};

  const users = await UserModel.find(filter, { password: 0 });
  res.send(users);
};

// Toggle block status for a user
export const toggleBlock = async (req, res) => {
  const { userId } = req.params;

  if (userId === req.user.id) {
    return res.status(BAD_REQUEST).send("Can't block yourself!");
  }

  const user = await UserModel.findById(userId);
  user.isBlocked = !user.isBlocked;
  await user.save();

  res.send(user.isBlocked);
};

// Get user by ID
export const getById = async (req, res) => {
  const { userId } = req.params;
  const user = await UserModel.findById(userId, { password: 0 });
  res.send(user);
};

// Update user details
export const updateUser = async (req, res) => {
  const { id, name, email, address, isAdmin } = req.body;
  await UserModel.findByIdAndUpdate(id, {
    name,
    email,
    address,
    isAdmin,
  });

  res.send();
};

// Logout user
export const logout = async (req, res) => {
  res.send({ message: 'Logout successful' });
};
