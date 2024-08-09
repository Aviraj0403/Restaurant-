import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import classes from './loginPage.module.css';
import Title from '../../components/Title/Title';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { EMAIL } from '../../constants/patterns';

export default function LoginPage() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [params] = useSearchParams();
  const returnUrl = params.get('returnUrl') || '/';

  useEffect(() => {
    if (user) {
      navigate(returnUrl);
    }
  }, [user, navigate, returnUrl]);

  const submit = async ({ email, password }) => {
    try {
      await login(email, password);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.details}>
        <Title title="Login" />
        <form onSubmit={handleSubmit(submit)} noValidate>
          <Input
            type="email"
            label="Email"
            autocomplete="email" // Added autocomplete attribute
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: EMAIL,
                message: 'Invalid email address'
              }
            })}
            error={errors.email?.message}
          />

          <Input
            type="password"
            label="Password"
            autocomplete="current-password" // Added autocomplete attribute
            {...register('password', {
              required: 'Password is required',
            })}
            error={errors.password?.message}
          />

          <Button type="submit" text="Login" />

          <div className={classes.register}>
            New user? &nbsp;
            <Link to={`/register${returnUrl ? '?returnUrl=' + encodeURIComponent(returnUrl) : ''}`}>
              Register here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
