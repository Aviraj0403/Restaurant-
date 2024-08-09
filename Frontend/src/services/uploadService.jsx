import { toast } from 'react-toastify';
import axios from 'axios';

// Function to upload an image
export const uploadImage = async (event) => {
  let toastId = null;

  // Get the image file from the event
  const image = await getImage(event);
  if (!image) return null;

  // Create a FormData object to send the image file
  const formData = new FormData();
  formData.append('image', image, image.name);

  try {
    // Make a POST request to upload the image
    const response = await axios.post('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (event) => {
        // Show progress toast notification
        const progress = Math.round((event.loaded / event.total) * 100);
        if (toastId) {
          toast.update(toastId, { progress: `${progress}%` });
        } else {
          toastId = toast.success('Uploading...', { progress: `${progress}%` });
        }
      },
    });

    // Dismiss the toast notification
    toast.dismiss(toastId);

    // Return the image URL from the response
    return response.data.imageUrl;
  } catch (error) {
    // Dismiss the toast notification and show an error
    toast.dismiss(toastId);
    toast.error('Image upload failed!');
    console.error('Error uploading image:', error);
    return null;
  }
};

// Function to get the image file from the event
const getImage = async (event) => {
  const files = event.target.files;

  // Check if a file was selected
  if (!files || files.length <= 0) {
    toast.warning('No file selected for upload!');
    return null;
  }

  const file = files[0];

  // Check if the file type is JPEG
  if (file.type !== 'image/jpeg') {
    toast.error('Only JPG files are allowed');
    return null;
  }

  return file;
};
