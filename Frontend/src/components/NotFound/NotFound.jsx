import React from 'react';
import { Link } from 'react-router-dom';
import classes from './notFound.module.css';

// Default Props defined as static for clarity
const defaultProps = {
  message: 'Nothing Found!',
  linkRoute: '/',
  linkText: 'Go To Home Page',
};

export default function NotFound({ message, linkRoute, linkText }) {
  return (
    <div className={classes.container}>
      <p>{message}</p>
      <Link to={linkRoute} className={classes.link}>
        {linkText}
      </Link>
    </div>
  );
}

// Apply defaultProps to the component
NotFound.defaultProps = defaultProps;
