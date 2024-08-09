import React from 'react';
import { useLoading } from '../../hooks/useLoading';
import classes from './loading.module.css';

// Assuming you have the loading.svg in the public directory
const loadingImageSrc = new URL('/loading.svg', import.meta.url).href;

export default function Loading() {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className={classes.container}>
      <div className={classes.items}>
        <img src={loadingImageSrc} alt="Loading!" />
        <h1>Loading...</h1>
      </div>
    </div>
  );
}
