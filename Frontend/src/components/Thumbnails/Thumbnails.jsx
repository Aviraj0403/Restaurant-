// src/components/Thumbnails/Thumbnails.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Price from '../Price/Price';
import StarRating from '../StarRating/StarRating';
import styles from './thumbnails.module.css'; // Ensure this path is correct

const Thumbnails = ({ foods }) => {
  return (
    <ul className={styles.list}>
      {foods.map(food => (
        <li key={food.id}>
          <Link to={`/food/${food.id}`}>
            <img
              className={styles.image}
              src={food.imageUrl}
              alt={food.name}
            />

            <div className={styles.content}>
              <div className={styles.name}>{food.name}</div>
              <span
                className={`${styles.favorite} ${
                  food.favorite ? '' : styles.not
                }`}
              >
                ❤
              </span>
              <div className={styles.stars}>
                <StarRating stars={food.stars} />
              </div>
              <div className={styles.product_item_footer}>
                <div className={styles.origins}>
                  {food.origins.map(origin => (
                    <span key={origin}>{origin}</span>
                  ))}
                </div>
                <div className={styles.cook_time}>
                  <span>🕒</span>
                  {food.cookTime}
                </div>
              </div>
              <div className={styles.price}>
                <Price price={food.price} />
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Thumbnails;
