import React from 'react';
import { Link } from 'react-router-dom';
import Price from '../../components/Price/Price';
import Title from '../../components/Title/Title';
import { useCart } from '../../hooks/useCart';
import classes from './cartPage.module.css';
import NotFound from '../../components/NotFound/NotFound';

export default function CartPage() {
  const { cart, removeFromCart, changeQuantity } = useCart();

  return (
    <>
      <Title title="Cart Page" margin="1.5rem 0 0 2.5rem" />

      {cart.items.length === 0 ? (
        <NotFound message="Cart Page Is Empty!" />
      ) : (
        <div className={classes.container}>
          <ul className={classes.list}>
            {cart.items.map((item) => (
              <li key={item.food.id} className={classes.item}>
                <div className={classes.imageContainer}>
                  <img src={item.food.imageUrl} alt={item.food.name} className={classes.image} />
                </div>
                <div className={classes.details}>
                  <Link to={`/food/${item.food.id}`} className={classes.foodLink}>
                    {item.food.name}
                  </Link>
                </div>
                <div className={classes.quantity}>
                  <select
                    value={item.quantity}
                    onChange={(e) => changeQuantity(item.food.id, Number(e.target.value))}
                  >
                    {[...Array(10).keys()].map((num) => (
                      <option key={num + 1} value={num + 1}>
                        {num + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={classes.price}>
                  <Price price={item.price} />
                </div>
                <div className={classes.remove}>
                  <button
                    className={classes.remove_button}
                    onClick={() => removeFromCart(item.food.id)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className={classes.checkout}>
            <div className={classes.summary}>
              <div className={classes.foods_count}>{cart.totalCount} Items</div>
              <div className={classes.total_price}>
                <Price price={cart.totalPrice} />
              </div>
            </div>

            <Link to="/checkout" className={classes.checkoutLink}>
              Proceed To Checkout
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
