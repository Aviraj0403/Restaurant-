import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth'; // Ensure this path is correct
import * as cartService from '../services/cartService.js'; // Ensure this path is correct

const CartContext = createContext(null);
const EMPTY_CART = {
  items: [],
  totalPrice: 0,
  totalCount: 0,
};

const CartProvider = ({ children }) => {
  const { user, logout: authLogout } = useAuth(); // Get user and logout from AuthContext
  const [cartItems, setCartItems] = useState(EMPTY_CART.items);
  const [totalPrice, setTotalPrice] = useState(EMPTY_CART.totalPrice);
  const [totalCount, setTotalCount] = useState(EMPTY_CART.totalCount);

  useEffect(() => {
    if (user) {
      fetchCartFromServer();
    } else {
      const localCart = getCartFromLocalStorage();
      updateCartState(localCart);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      saveCartToServer();
    } else {
      saveCartToLocalStorage();
    }
  }, [cartItems, totalPrice, totalCount, user]);

  useEffect(() => {
    return () => {
      if (user) {
        saveCartToServer(); // Save cart to server on logout
      } else {
        saveCartToLocalStorage(); // Save cart to local storage when user is not logged in
      }
    };
  }, [user]);

  const fetchCartFromServer = async () => {
    try {
      const data = await cartService.fetchCart();
      updateCartState(data);
    } catch (error) {
      console.error('Error fetching cart from server:', error);
    }
  };

  const saveCartToServer = async () => {
    try {
      await cartService.saveCart(cartItems, totalPrice, totalCount);
    } catch (error) {
      console.error('Error saving cart to server:', error);
    }
  };

  const getCartFromLocalStorage = () => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : EMPTY_CART;
  };

  const saveCartToLocalStorage = () => {
    localStorage.setItem(
      'cart',
      JSON.stringify({ items: cartItems, totalPrice, totalCount })
    );
  };

  const updateCartState = ({ items, totalPrice, totalCount }) => {
    setCartItems(items);
    setTotalPrice(totalPrice);
    setTotalCount(totalCount);
  };

  const addToCart = async (food) => {
    try {
      if (user) {
        const updatedCart = await cartService.addToCart(food.id, 1);
        updateCartState(updatedCart);
      } else {
        const localCart = getCartFromLocalStorage();
        const itemIndex = localCart.items.findIndex(item => item.food.id === food.id);
        if (itemIndex >= 0) {
          localCart.items[itemIndex].quantity += 1;
        } else {
          localCart.items.push({ food, quantity: 1, price: food.price });
        }
        localCart.totalPrice += food.price;
        localCart.totalCount += 1;
        setCartItems(localCart.items);
        setTotalPrice(localCart.totalPrice);
        setTotalCount(localCart.totalCount);
        saveCartToLocalStorage();
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (foodId) => {
    try {
      if (user) {
        const updatedCart = await cartService.removeFromCart(foodId);
        updateCartState(updatedCart);
      } else {
        const localCart = getCartFromLocalStorage();
        const itemIndex = localCart.items.findIndex(item => item.food.id === foodId);
        if (itemIndex >= 0) {
          const removedItem = localCart.items.splice(itemIndex, 1)[0];
          localCart.totalPrice -= removedItem.price;
          localCart.totalCount -= removedItem.quantity;
          setCartItems(localCart.items);
          setTotalPrice(localCart.totalPrice);
          setTotalCount(localCart.totalCount);
          saveCartToLocalStorage();
        }
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const changeQuantity = async (foodId, newQuantity) => {
    try {
      if (user) {
        const updatedCartItems = cartItems.map(item =>
          item.food.id === foodId
            ? { ...item, quantity: newQuantity, price: item.food.price * newQuantity }
            : item
        );

        const updatedTotalPrice = updatedCartItems.reduce((total, item) => total + item.price, 0);
        const updatedTotalCount = updatedCartItems.reduce((total, item) => total + item.quantity, 0);

        setCartItems(updatedCartItems);
        setTotalPrice(updatedTotalPrice);
        setTotalCount(updatedTotalCount);

        await cartService.saveCart(updatedCartItems, updatedTotalPrice, updatedTotalCount);
      } else {
        const localCart = getCartFromLocalStorage();
        const itemIndex = localCart.items.findIndex(item => item.food.id === foodId);
        if (itemIndex >= 0) {
          localCart.items[itemIndex].quantity = newQuantity;
          localCart.items[itemIndex].price = localCart.items[itemIndex].food.price * newQuantity;
          localCart.totalPrice = localCart.items.reduce((total, item) => total + item.price, 0);
          localCart.totalCount = localCart.items.reduce((total, item) => total + item.quantity, 0);
          setCartItems(localCart.items);
          setTotalPrice(localCart.totalPrice);
          setTotalCount(localCart.totalCount);
          saveCartToLocalStorage();
        }
      }
    } catch (error) {
      console.error('Error changing quantity:', error);
    }
  };

  const clearCart = async () => {
    try {
      if (user) {
        await cartService.clearCart();
        setCartItems(EMPTY_CART.items);
        setTotalPrice(EMPTY_CART.totalPrice);
        setTotalCount(EMPTY_CART.totalCount);
      } else {
        localStorage.removeItem('cart');
        setCartItems(EMPTY_CART.items);
        setTotalPrice(EMPTY_CART.totalPrice);
        setTotalCount(EMPTY_CART.totalCount);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart: { items: cartItems, totalPrice, totalCount },
        addToCart,
        removeFromCart,
        changeQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

export default CartProvider;
