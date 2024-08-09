import React from 'react';
import classes from './button.module.css';

const Button = ({
  type = 'button',
  text = 'Submit',
  onClick,
  color = 'white',
  backgroundColor = '#e72929',
  fontSize = '1.3rem',
  width = '12rem',
  height = '3.5rem',
}) => {
  return (
    <div className={classes.container}>
      <button
        type={type}
        onClick={onClick}
        style={{
          color,
          backgroundColor,
          fontSize,
          width,
          height,
        }}
      >
        {text}
      </button>
    </div>
  );
};

export default Button;

