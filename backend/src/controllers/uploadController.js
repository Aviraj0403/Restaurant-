// controllers/imageController.js
import { BAD_REQUEST } from '../constants/httpStatus.js';
import { configCloudinary } from '../config/cloudinaryConfig.js';

const uploadImageToCloudinary = (imageBuffer) => {
  const cloudinary = configCloudinary();

  return new Promise((resolve, reject) => {
    if (!imageBuffer) return reject(new Error('No image buffer provided'));

    cloudinary.uploader.upload_stream((error, result) => {
      if (error || !result) return reject(error);
      resolve(result.url);
    }).end(imageBuffer);
  });
};

export const uploadImage = async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(BAD_REQUEST).send({ error: 'No file uploaded' });
  }

  try {
    const imageUrl = await uploadImageToCloudinary(file.buffer);
    res.send({ imageUrl });
  } catch (error) {
    console.error('Upload to Cloudinary failed:', error);
    res.status(BAD_REQUEST).send({ error: 'Failed to upload image' });
  }
};
