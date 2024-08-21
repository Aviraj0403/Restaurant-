import jwt from 'jsonwebtoken';
import { UserModel } from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import { BAD_REQUEST } from '../constants/httpStatus.js';

const PASSWORD_HASH_SALT_ROUNDS = 10;

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.send(generateTokenResponse(user));
    return;
  }

  res.status(BAD_REQUEST).send('Username or password is invalid');
};

export const getCart = async (req, res) => {
  const userId = req.user.id; // Assume user is authenticated and user ID is available
  const user = await UserModel.findById(userId).select('cart'); // Replace with your actual data fetching logic
  res.json(user.cart || { items: [], totalPrice: 0, totalCount: 0 });
};

export const updateCart = async (req, res) => {
  const userId = req.user.id; // Assume user is authenticated
  const { items, totalPrice, totalCount } = req.body;
  const user = await UserModel.findById(userId);
  user.cart = { items, totalPrice, totalCount };
  await user.save();
  res.sendStatus(200);
};

export const clearCart = async (req, res) => {
  const userId = req.user.id; // Assume user is authenticated
  const user = await UserModel.findById(userId);
  user.cart = { items: [], totalPrice: 0, totalCount: 0 };
  await user.save();
  res.sendStatus(200);
};

export const logout = (req, res) => {
  // Implement token blacklisting or simply inform client to remove the token
  res.send({ message: 'Logout successful' });
};

export const register = async (req, res) => {
  const { name, email, password, address } = req.body;

  const user = await UserModel.findOne({ email });

  if (user) {
    res.status(BAD_REQUEST).send('User already exists, please login!');
    return;
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

export const updateProfile = async (req, res) => {
  const { name, address } = req.body;
  const user = await UserModel.findByIdAndUpdate(
    req.user.id,
    { name, address },
    { new: true }
  );

  res.send(generateTokenResponse(user));
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await UserModel.findById(req.user.id);

  if (!user) {
    res.status(BAD_REQUEST).send('Change Password Failed!');
    return;
  }

  const equal = await bcrypt.compare(currentPassword, user.password);

  if (!equal) {
    res.status(BAD_REQUEST).send('Current Password Is Not Correct!');
    return;
  }

  user.password = await bcrypt.hash(newPassword, PASSWORD_HASH_SALT_ROUNDS);
  await user.save();

  res.send();
};

export const getAllUsers = async (req, res) => {
  const { searchTerm } = req.params;

  const filter = searchTerm
    ? { name: { $regex: new RegExp(searchTerm, 'i') } }
    : {};

  const users = await UserModel.find(filter, { password: 0 });
  res.send(users);
};

export const toggleBlock = async (req, res) => {
  const { userId } = req.params;

  if (userId === req.user.id) {
    res.status(BAD_REQUEST).send("Can't block yourself!");
    return;
  }

  const user = await UserModel.findById(userId);
  user.isBlocked = !user.isBlocked;
  await user.save();

  res.send(user.isBlocked);
};

export const getById = async (req, res) => {
  const { userId } = req.params;
  const user = await UserModel.findById(userId, { password: 0 });
  res.send(user);
};

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
