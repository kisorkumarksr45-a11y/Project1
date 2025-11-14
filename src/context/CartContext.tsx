import { createContext, useContext, useState, ReactNode } from 'react';
import type { CartItem, Jersey } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (jersey: Jersey, size: string, quantity: number) => void;
  removeFromCart: (jerseyId: string, size: string) => void;
  updateQuantity: (jerseyId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (jersey: Jersey, size: string, quantity: number) => {
    setCartItems((prev) => {
      const existingItem = prev.find(
        (item) => item.jersey.id === jersey.id && item.size === size
      );

      if (existingItem) {
        return prev.map((item) =>
          item.jersey.id === jersey.id && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prev, { jersey, size, quantity }];
    });
  };

  const removeFromCart = (jerseyId: string, size: string) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.jersey.id === jerseyId && item.size === size))
    );
  };

  const updateQuantity = (jerseyId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(jerseyId, size);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.jersey.id === jerseyId && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.jersey.price * item.quantity,
      0
    );
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
