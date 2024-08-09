import React from 'react';
import PropTypes from 'prop-types';

function Title({ title, fontSize = '2rem', margin = '0' }) {
  return (
    <h1 style={{ fontSize, margin, color: '#616161' }}>
      {title}
    </h1>
  );
}

Title.propTypes = {
  title: PropTypes.string.isRequired,
  fontSize: PropTypes.string,
  margin: PropTypes.string,
};

export default Title;
