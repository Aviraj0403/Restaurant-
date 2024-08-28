import { Router } from 'express';
import admin from '../middleware/adminMid.js';
import {
  getAllFoods,
  createFood,
  updateFood,
  deleteFood,
  getTags,
  searchFood,
  getFoodByTag,
  getFoodById
} from '../controllers/food.controller.js';

const router = Router();

router.get('/', getAllFoods);
router.post('/', admin, createFood);
router.put('/', admin, updateFood);
router.delete('/:foodId', admin, deleteFood);
router.get('/tags', getTags);
router.get('/search/:searchTerm', searchFood);
router.get('/tag/:tag', getFoodByTag);
router.get('/:foodId', getFoodById);

export default router;
