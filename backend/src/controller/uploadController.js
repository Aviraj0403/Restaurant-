import { Router } from 'express';
import admin from '../middleware/adminMid.js';
import multer from 'multer';
import handler from 'express-async-handler';
import { uploadImage } from '../controllers/uploadController.js';

const router = Router();
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } }); // Limit file size to 5MB

router.post(
  '/',
  admin,
  upload.single('image'),
  handler(uploadImage)
);

export default router;
