import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getById, updateUser } from '../../services/userService';
import { useParams } from 'react-router-dom';
import classes from './userEdit.module.css';
import Title from '../../components/Title/Title';
import Input from '../../components/Input/Input';
import { EMAIL } from '../../constants/patterns';
import Button from '../../components/Button/Button';

export default function UserEditPage() {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { userId } = useParams();
  const isEditMode = Boolean(userId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      loadUser();
    }
  }, [userId, isEditMode]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const user = await getById(userId);
      reset(user);
    } catch (err) {
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const submit = async userData => {
    try {
      setLoading(true);
      await updateUser(userId, userData); // Pass userId to updateUser
      // Optionally handle successful update (e.g., show a success message)
    } catch (err) {
      setError('Failed to update user data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <Title title={isEditMode ? 'Edit User' : 'Add User'} />
        <form onSubmit={handleSubmit(submit)} noValidate>
          {error && <p className={classes.error}>{error}</p>}
          <Input
            label="Name"
            {...register('name', {
              required: 'Name is required',
              minLength: {
                value: 3,
                message: 'Name must be at least 3 characters long',
              },
            })}
            error={errors.name?.message}
          />
          <Input
            label="Email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: EMAIL,
                message: 'Invalid email address',
              },
            })}
            error={errors.email?.message}
          />
          <Input
            label="Address"
            {...register('address', {
              required: 'Address is required',
              minLength: {
                value: 5,
                message: 'Address must be at least 5 characters long',
              },
            })}
            error={errors.address?.message}
          />

          <Input
            label="Is Admin"
            type="checkbox"
            {...register('isAdmin')}
          />

          <Button type="submit" text={loading ? 'Saving...' : 'Save'} disabled={loading} />
        </form>
      </div>
    </div>
  );
}
