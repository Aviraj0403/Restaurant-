import React from 'react';
import { Link } from 'react-router-dom';
import classes from './notFound.module.css';

export default function NotFound({
  message = 'Nothing Found!',
  linkRoute = '/',
  linkText = 'Go To Home Page'
}) {
  return (
    <div className={classes.container}>
      <p>{message}</p>
      <Link to={linkRoute}>{linkText}</Link>
    </div>
  );
}
