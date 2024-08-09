import React from 'react';

export default function Price({ price, locale = 'en-IN', currency = 'INR' }) {
  const formatPrice = () =>
    new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(price);

  return <span>{formatPrice()}</span>;
}
