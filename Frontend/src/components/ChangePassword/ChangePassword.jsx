import React from 'react';
import { useForm } from 'react-hook-form';
import Title from '../Title/Title';
import Input from '../Input/Input';
import Button from '../Button/Button';
import { useAuth } from '../../hooks/useAuth';

export default function ChangePassword() {
  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm();

  const { changePassword } = useAuth();

  const onSubmit = async (passwords) => {
    try {
      await changePassword(passwords);
    } catch (error) {
      // Handle error if needed
      console.error("Failed to change password:", error);
    }
  };

  return (
    <div>
      <Title title="Change Password" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="password"
          label="Current Password"
          {...register('currentPassword', {
            required: 'Current password is required',
          })}
          error={errors.currentPassword?.message}
        />

        <Input
          type="password"
          label="New Password"
          {...register('newPassword', {
            required: 'New password is required',
            minLength: {
              value: 5,
              message: 'New password must be at least 5 characters long',
            },
          })}
          error={errors.newPassword?.message}
        />

        <Input
          type="password"
          label="Confirm Password"
          {...register('confirmNewPassword', {
            required: 'Please confirm your new password',
            validate: value =>
              value !== getValues('newPassword') 
                ? 'Passwords do not match' 
                : true,
          })}
          error={errors.confirmNewPassword?.message}
        />

        <Button type="submit" text="Change" />
      </form>
    </div>
  );
}
