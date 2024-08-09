import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../../components/Input/Input';
import Title from '../../components/Title/Title';
import classes from './registerPage.module.css';
import Button from '../../components/Button/Button';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { EMAIL } from '../../constants/patterns';

export default function RegisterPage() {
  const { user, register: registerUser, loading, error } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const returnUrl = params.get('returnUrl');

  useEffect(() => {
    if (user) {
      navigate(returnUrl || '/');
    }
  }, [user, navigate, returnUrl]);

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm();

  const submit = async data => {
    try {
      await registerUser(data);
    } catch (error) {
      // Handle registration errors if needed
      console.error('Registration error:', error);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.details}>
        <Title title="Register" />
        <form onSubmit={handleSubmit(submit)} noValidate>
          <Input
            type="text"
            label="Name"
            autoComplete="name" // Added autocomplete
            {...register('name', {
              required: 'Name is required',
              minLength: {
                value: 5,
                message: 'Name must be at least 5 characters long',
              },
            })}
            error={errors.name?.message}
          />

          <Input
            type="email"
            label="Email"
            autoComplete="email" // Added autocomplete
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
            type="password"
            label="Password"
            autoComplete="new-password" // Added autocomplete
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 5,
                message: 'Password must be at least 5 characters long',
              },
            })}
            error={errors.password?.message}
          />

          <Input
            type="password"
            label="Confirm Password"
            autoComplete="new-password" // Added autocomplete
            {...register('confirmPassword', {
              required: 'Confirm Password is required',
              validate: value =>
                value !== getValues('password')
                  ? 'Passwords do not match'
                  : true,
            })}
            error={errors.confirmPassword?.message}
          />

          <Input
            type="text"
            label="Address"
            autoComplete="street-address" // Added autocomplete
            {...register('address', {
              required: 'Address is required',
              minLength: {
                value: 10,
                message: 'Address must be at least 10 characters long',
              },
            })}
            error={errors.address?.message}
          />

          <Button
            type="submit"
            text={loading ? 'Registering...' : 'Register'}
            disabled={loading}
          />

          <div className={classes.login}>
            Already a user? &nbsp;
            <Link to={`/login${returnUrl ? '?returnUrl=' + returnUrl : ''}`}>
              Login here
            </Link>
          </div>

          {error && <p className={classes.error}>Registration failed: {error.message}</p>}
        </form>
      </div>
    </div>
  );
}
