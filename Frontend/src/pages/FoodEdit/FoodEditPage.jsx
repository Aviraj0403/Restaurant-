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

    getById(foodId).then(food => {
      if (!food) return;
      reset(food);
      setImageUrl(food.imageUrl);
    }).catch(error => {
      toast.error('Failed to load food data');
      console.error("Error fetching food:", error);
    });
  }, [foodId, isEditMode, reset]);

  const submit = async foodData => {
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
      toast.error('Failed to save food data');
      console.error("Error saving food:", error);
    }
  };

  const upload = async event => {
    try {
      setImageUrl('');
      const imageUrl = await uploadImage(event.target.files[0]);
      setImageUrl(imageUrl);
    } catch (error) {
      toast.error('Failed to upload image');
      console.error("Error uploading image:", error);
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
            {...register('name', { required: true, minLength: 5 })}
            error={errors.name}
          />

          <Input
            type="number"
            label="Price"
            {...register('price', { required: true })}
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
            {...register('origins', { required: true })}
            error={errors.origins}
          />

          <Input
            type="text"
            label="Cook Time"
            {...register('cookTime', { required: true })}
            error={errors.cookTime}
          />

          <Button type="submit" text={isEditMode ? 'Update' : 'Create'} />
        </form>
      </div>
    </div>
  );
}
