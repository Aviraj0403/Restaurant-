import { Router } from 'express';
import multer from 'multer';
import handler from 'express-async-handler';
import admin from '../middleware/adminMid.js';
import { uploadImage } from '../controllers/upload.Controller.js';

const router = Router();
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } }); // Limit file size to 5MB

router.post(
  '/',
  admin,
  upload.single('image'),
  handler(uploadImage)
);

export default router;
