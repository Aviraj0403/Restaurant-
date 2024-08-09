import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import classes from './profilePage.module.css';
import Title from '../../components/Title/Title';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import ChangePassword from '../../components/ChangePassword/ChangePassword';

export default function ProfilePage() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm();

  const { user, updateProfile } = useAuth();

  // Reset form with default values when user data is available
  React.useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        address: user.address,
      });
    }
  }, [user, reset]);

  const submit = async data => {
    try {
      await updateProfile(data);
      // Optionally handle successful update (e.g., show a success message)
    } catch (error) {
      // Optionally handle update errors
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.details}>
        <Title title="Update Profile" />
        <form onSubmit={handleSubmit(submit)}>
          <Input
            type="text"
            label="Name"
            {...register('name', {
              required: 'Name is required',
              minLength: {
                value: 5,
                message: 'Name must be at least 5 characters long',
              },
            })}
            error={errors.name}
          />
          <Input
            type="text"
            label="Address"
            {...register('address', {
              required: 'Address is required',
              minLength: {
                value: 10,
                message: 'Address must be at least 10 characters long',
              },
            })}
            error={errors.address}
          />
          <Button type="submit" text="Update" backgroundColor="#009e84" />
        </form>
        <ChangePassword />
      </div>
    </div>
  );
}
