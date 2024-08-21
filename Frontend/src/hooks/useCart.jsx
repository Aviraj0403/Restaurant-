import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { fetchUserCart, updateCartOnServer } from '../services/cartService';

const CartContext = createContext(null);
const EMPTY_CART = {
  items: [],
  totalPrice: 0,
  totalCount: 0,
};

const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState(EMPTY_CART.items);
  const [totalPrice, setTotalPrice] = useState(EMPTY_CART.totalPrice);
  const [totalCount, setTotalCount] = useState(EMPTY_CART.totalCount);

  useEffect(() => {
    const fetchCartData = async () => {
      if (user && user._id) {
        try {
          const cart = await fetchUserCart(user._id); // Ensure you're passing the correct user ID
  
          if (cart && cart.items.length > 0) {
            setCartItems(cart.items);
            setTotalPrice(cart.totalPrice);
            setTotalCount(cart.totalCount);
          } else {
            console.warn(`No cart items found for user ${user._id}`);
            clearCart(); // Reset to empty cart if no items are found
          }
        } catch (err) {
          console.error(`Error fetching cart for user ${user._id}:`, err);
          // Optionally, you could retry fetching the cart here or show a user notification
        }
      } else {
        clearCart(); // Clear cart when no user is logged in
      }
    };
  
    fetchCartData();
  }, [user]); // This will re-run whenever the user object changes
  

  useEffect(() => {
    const updateCart = async () => {
      if (user && cartItems.length > 0) {
        const totalPrice = sum(cartItems.map(item => item.price));
        const totalCount = sum(cartItems.map(item => item.quantity));
        setTotalPrice(totalPrice);
        setTotalCount(totalCount);

        try {
          await updateCartOnServer(user._id, { items: cartItems, totalPrice, totalCount });
          console.log(`Cart successfully updated for user ${user._id}`);
        } catch (err) {
          console.error(`Failed to update cart on server for user ${user._id}:`, err);
          // Optional: Show user a notification about the failure
        }
      }
    };

    updateCart();
  }, [cartItems, user]);

  const sum = items => items.reduce((prevValue, curValue) => prevValue + curValue, 0);

  const removeFromCart = foodId => {
    const filteredCartItems = cartItems.filter(item => item.food.id !== foodId);
    setCartItems(filteredCartItems);
  };

  const changeQuantity = (cartItem, newQuantity) => {
    const { food } = cartItem;
    const updatedCartItem = {
      ...cartItem,
      quantity: newQuantity,
      price: food.price * newQuantity,
    };

    setCartItems(
      cartItems.map(item => (item.food.id === food.id ? updatedCartItem : item))
    );
  };

  const addToCart = food => {
    const cartItem = cartItems.find(item => item.food.id === food.id);
    if (cartItem) {
      changeQuantity(cartItem, cartItem.quantity + 1);
    } else {
      setCartItems([...cartItems, { food, quantity: 1, price: food.price }]);
    }
  };

  const clearCart = () => {
    setCartItems(EMPTY_CART.items);
    setTotalPrice(EMPTY_CART.totalPrice);
    setTotalCount(EMPTY_CART.totalCount);
  };

  return (
    <CartContext.Provider
      value={{
        cart: { items: cartItems, totalPrice, totalCount },
        removeFromCart,
        changeQuantity,
        addToCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

export default CartProvider;
