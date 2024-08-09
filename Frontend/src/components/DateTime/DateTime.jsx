import React from 'react';

const DateTime = ({
  date,
  options = {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  },
}) => {
  const currentLocale = new Intl.DateTimeFormat().resolvedOptions().locale;

  const getDate = () => {
    // Ensure date is valid
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return 'Invalid Date';
    }
    return new Intl.DateTimeFormat(currentLocale, options).format(parsedDate);
  };

  return <>{getDate()}</>;
};

export default DateTime;
