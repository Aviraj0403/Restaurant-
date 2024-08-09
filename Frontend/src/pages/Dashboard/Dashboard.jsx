import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import classes from './dashboard.module.css';
import { Link } from 'react-router-dom';

// Define the items array outside of the component to avoid re-creating it on every render
const allItems = [
  {
    title: 'Orders',
    imageUrl: '/icons/orders.svg', // Ensure this path is correct
    url: '/orders',
    bgColor: '#ec407a',
    color: 'white',
  },
  {
    title: 'Profile',
    imageUrl: '/icons/profile.svg', // Ensure this path is correct
    url: '/profile',
    bgColor: '#1565c0',
    color: 'white',
  },
  {
    title: 'Users',
    imageUrl: '/icons/users.svg', // Ensure this path is correct
    url: '/admin/users',
    forAdmin: true,
    bgColor: '#00bfa5',
    color: 'white',
  },
  {
    title: 'Foods',
    imageUrl: '/icons/foods.svg', // Ensure this path is correct
    url: '/admin/foods',
    forAdmin: true,
    bgColor: '#e040fb',
    color: 'white',
  },
];

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className={classes.container}>
      <div className={classes.menu}>
        {allItems
          .filter(item => user.isAdmin || !item.forAdmin)
          .map(item => (
            <Link
              key={item.title}
              to={item.url}
              style={{
                backgroundColor: item.bgColor,
                color: item.color,
              }}
            >
              <img src={item.imageUrl} alt={item.title} />
              <h2>{item.title}</h2>
            </Link>
          ))}
      </div>
    </div>
  );
}
