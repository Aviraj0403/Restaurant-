import React, { useEffect, useReducer } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAll, getAllStatus } from '../../services/orderService';
import classes from './ordersPage.module.css';
import Title from '../../components/Title/Title';
import DateTime from '../../components/DateTime/DateTime';
import Price from '../../components/Price/Price';
import NotFound from '../../components/NotFound/NotFound';
import { toast } from 'react-toastify';

const initialState = { allStatus: [], orders: [] };

const reducer = (state, action) => {
  switch (action.type) {
    case 'ALL_STATUS_FETCHED':
      return { ...state, allStatus: action.payload };
    case 'ORDERS_FETCHED':
      return { ...state, orders: action.payload };
    case 'ERROR':
      toast.error(action.payload);
      return state;
    default:
      return state;
  }
};

export default function OrdersPage() {
  const [{ allStatus, orders }, dispatch] = useReducer(reducer, initialState);

  const { filter } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const status = await getAllStatus();
        dispatch({ type: 'ALL_STATUS_FETCHED', payload: status });

        const ordersData = await getAll(filter);
        dispatch({ type: 'ORDERS_FETCHED', payload: ordersData });
      } catch (error) {
        dispatch({ type: 'ERROR', payload: 'Failed to fetch data' });
      }
    };

    fetchData();
  }, [filter]);

  return (
    <div className={classes.container}>
      <Title title="Orders" margin="1.5rem 0 0 .2rem" fontSize="1.9rem" />

      {allStatus.length > 0 && (
        <div className={classes.all_status}>
          <Link to="/orders" className={!filter ? classes.selected : ''}>
            All
          </Link>
          {allStatus.map(state => (
            <Link
              key={state}
              className={state === filter ? classes.selected : ''}
              to={`/orders/${state}`}
            >
              {state}
            </Link>
          ))}
        </div>
      )}

      {orders.length === 0 && (
        <NotFound
          linkRoute={filter ? '/orders' : '/'}
          linkText={filter ? 'Show All' : 'Go To Home Page'}
        />
      )}

      {orders.length > 0 && orders.map(order => (
        <div key={order.id} className={classes.order_summary}>
          <div className={classes.header}>
            <span>{order.id}</span>
            <span>
              <DateTime date={order.createdAt} />
            </span>
            <span>{order.status}</span>
          </div>
          <div className={classes.items}>
            {order.items.map(item => (
              <Link key={item.food.id} to={`/food/${item.food.id}`}>
                <img src={item.food.imageUrl} alt={item.food.name} />
              </Link>
            ))}
          </div>
          <div className={classes.footer}>
            <div>
              <Link to={`/track/${order.id}`}>Show Order</Link>
            </div>
            <div>
              <span className={classes.price}>
                <Price price={order.totalPrice} />
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
