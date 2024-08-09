import { Router } from 'express';
import admin from '../middleware/adminMid.js';
import multer from 'multer';
import handler from 'express-async-handler';
import { BAD_REQUEST } from '../constants/httpStatus.js';
import { cloudinaryInstance } from '../config/cloudinaryConfig.js';

const router = Router();
const upload = multer(); // Middleware to handle multipart/form-data

router.post(
  '/',
  admin,
  upload.single('image'),
  handler(async (req, res) => {
    const file = req.file;

    if (!file) {
      return res.status(BAD_REQUEST).send({ message: 'No file uploaded' });
    }

    try {
      const imageUrl = await uploadImageToCloudinary(file.buffer);
      res.send({ imageUrl });
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      res.status(500).send({ message: 'Error uploading image' });
    }
  })
);

const uploadImageToCloudinary = (imageBuffer) => {
  return new Promise((resolve, reject) => {
    if (!imageBuffer) {
      return reject(new Error('No image buffer provided'));
    }

    cloudinaryInstance.uploader.upload_stream(
      { resource_type: 'image' },
      (error, result) => {
        if (error) {
          return reject(new Error(`Cloudinary upload error: ${error.message}`));
        }
        if (!result) {
          return reject(new Error('Cloudinary did not return a result'));
        }
        resolve(result.url);
      }
    ).end(imageBuffer);
  });
};

export default router;
