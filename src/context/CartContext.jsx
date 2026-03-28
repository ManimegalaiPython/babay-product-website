import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCart as fetchCart, addToCart, updateCartItem, removeFromCart } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total_price: 0 });
  const { user } = useAuth();

  const loadCart = async () => {
    if (!user) {
      setCart({ items: [], total_price: 0 });
      return;
    }
    try {
      const { data } = await fetchCart();
      setCart(data);
    } catch (error) {
      console.error('Failed to load cart', error);
    }
  };

  useEffect(() => {
    loadCart();
  }, [user]);

  const addItem = async (productId, quantity) => {
    if (!user) {
      throw new Error('NOT_LOGGED_IN');
    }
    try {
      await addToCart(productId, quantity);
      await loadCart();
    } catch (error) {
      console.error('Cart API error:', error);
      throw error;
    }
  };

  const removeItem = async (itemId) => {
    try {
      await removeFromCart(itemId);
      await loadCart();
    } catch (error) {
      console.error('Remove item error:', error);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      await updateCartItem(itemId, quantity);
      await loadCart();
    } catch (error) {
      console.error('Update quantity error:', error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQuantity, loadCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);