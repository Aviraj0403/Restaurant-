import { Router } from 'express';
import handler from 'express-async-handler';
import auth from '../middleware/authMid.js';
import admin from '../middleware/adminMid.js';
import {
  loginUser,
  getUserCart,
  updateUserCart,
  clearUserCart,
  logoutUser,
  registerUser,
  updateUserProfile,
  changeUserPassword,
  getAllUsers,
  toggleUserBlock,
  getUserById,
  updateUser
} from '../controllers/user.Controller.js';

const router = Router();

router.route('/login').post(handler(loginUser));

router.route('/cart')
  .get(auth, handler(getUserCart))
  .post(auth, handler(updateUserCart))
  .delete(auth, handler(clearUserCart));

router.route('/logout').post(handler(logoutUser));

router.route('/register').post(handler(registerUser));

router.route('/updateProfile').put(auth, handler(updateUserProfile));

router.route('/changePassword').put(auth, handler(changeUserPassword));

router.route('/getall/:searchTerm?').get(admin, handler(getAllUsers));

router.route('/toggleBlock/:userId').put(admin, handler(toggleUserBlock));

router.route('/getById/:userId').get(admin, handler(getUserById));

router.route('/update').put(admin, handler(updateUser));

export default router;
