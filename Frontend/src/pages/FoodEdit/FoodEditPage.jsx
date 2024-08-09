import { useParams, useNavigate } from 'react-router-dom';
import classes from './foodEdit.module.css';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { add, getById, update } from '../../services/foodService';
import Title from '../../components/Title/Title';
import InputContainer from '../../components/InputContainer/InputContainer';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { uploadImage } from '../../services/uploadService';
import { toast } from 'react-toastify';

export default function FoodEditPage() {
  const { foodId } = useParams();
  const [imageUrl, setImageUrl] = useState('');
  const isEditMode = !!foodId;

  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (!isEditMode) return;

    const fetchFood = async () => {
      try {
        const food = await getById(foodId);
        if (!food) {
          toast.error('Food not found.');
          return;
        }
        reset(food);
        setImageUrl(food.imageUrl);
      } catch (error) {
        console.error('Error fetching food details:', error);
        toast.error('Failed to fetch food details. Please try again later.');
      }
    };

    fetchFood();
  }, [foodId, isEditMode, reset]);

  const submit = async (foodData) => {
    const food = { ...foodData, imageUrl };

    try {
      if (isEditMode) {
        await update(food);
        toast.success(`Food "${food.name}" updated successfully!`);
      } else {
        const newFood = await add(food);
        toast.success(`Food "${food.name}" added successfully!`);
        navigate('/admin/editFood/' + newFood.id, { replace: true });
      }
    } catch (error) {
      console.error('Error saving food data:', error);
      toast.error('Failed to save food data. Please try again later.');
    }
  };

  const upload = async (event) => {
    setImageUrl('');
    try {
      const uploadedImageUrl = await uploadImage(event);
      setImageUrl(uploadedImageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again later.');
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <Title title={isEditMode ? 'Edit Food' : 'Add Food'} />
        <form
          className={classes.form}
          onSubmit={handleSubmit(submit)}
          noValidate
        >
          <InputContainer label="Select Image">
            <input type="file" onChange={upload} accept="image/jpeg" />
          </InputContainer>

          {imageUrl && (
            <a href={imageUrl} className={classes.image_link} target="_blank" rel="noopener noreferrer">
              <img src={imageUrl} alt="Uploaded" />
            </a>
          )}

          <Input
            type="text"
            label="Name"
            {...register('name', { required: 'Name is required', minLength: { value: 5, message: 'Name must be at least 5 characters long' } })}
            error={errors.name}
          />

          <Input
            type="number"
            label="Price"
            {...register('price', { required: 'Price is required' })}
            error={errors.price}
          />

          <Input
            type="text"
            label="Tags"
            {...register('tags')}
            error={errors.tags}
          />

          <Input
            type="text"
            label="Origins"
            {...register('origins', { required: 'Origins are required' })}
            error={errors.origins}
          />

          <Input
            type="text"
            label="Cook Time"
            {...register('cookTime', { required: 'Cook time is required' })}
            error={errors.cookTime}
          />

          <Button type="submit" text={isEditMode ? 'Update' : 'Create'} />
        </form>
      </div>
    </div>
  );
}
