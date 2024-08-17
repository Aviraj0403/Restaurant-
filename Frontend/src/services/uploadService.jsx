import { toast } from 'react-toastify';
import axios from 'axios';

export const uploadImage = async (event) => {
  let toastId = null;

  try {
    const image = await getImage(event);
    if (!image) return null;

    const formData = new FormData();
    formData.append('image', image, image.name);

    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        if (toastId) {
          toast.update(toastId, { progress });
        } else {
          toastId = toast.success('Uploading...', { progress });
        }
      },
    });

    toast.dismiss(toastId);
    return response.data.imageUrl;

  } catch (error) {
    toast.dismiss(toastId);
    console.error('Upload error:', error);
    toast.error('Failed to upload image. Please try again later.');
    return null;
  }
};

const getImage = async (event) => {
  const files = event.target.files;

  if (!files || files.length <= 0) {
    toast.warning('Upload file is not selected!');
    return null;
  }

  const file = files[0];

  if (file.type !== 'image/jpeg') {
    toast.error('Only JPG type is allowed');
    return null;
  }

  return file;
};
  