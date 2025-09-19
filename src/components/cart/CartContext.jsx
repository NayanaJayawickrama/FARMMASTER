import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  
  // Get user-specific cart key
  const getCartKey = () => {
    return user?.id ? `cartItems_${user.id}` : "cartItems_guest";
  };

  // Initialize cart from localStorage (user-specific)
  const getInitialCart = () => {
    try {
      const cartKey = getCartKey();
      const stored = localStorage.getItem(cartKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const [cartItems, setCartItems] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(user?.id || null);

  // Effect to handle user changes and load appropriate cart
  useEffect(() => {
    const newUserId = user?.id || null;
    
    // If user changed, load the new user's cart
    if (newUserId !== currentUserId) {
      setCurrentUserId(newUserId);
      const newCart = getInitialCart();
      setCartItems(newCart);
    }
  }, [user?.id]);

  // Persist cart to localStorage on change (user-specific)
  useEffect(() => {
    if (user?.id || currentUserId) {
      const cartKey = getCartKey();
      localStorage.setItem(cartKey, JSON.stringify(cartItems));
    }
  }, [cartItems, user?.id]);

  // Clear cart function (also removes from localStorage)
  const clearCart = () => {
    setCartItems([]);
    if (user?.id) {
      const cartKey = getCartKey();
      localStorage.removeItem(cartKey);
    }
  };

  // Clear cart when user logs out (called from AuthContext)
  const clearUserCart = (userId) => {
    if (userId) {
      localStorage.removeItem(`cartItems_${userId}`);
      // If it's the current user, also clear the state
      if (userId === user?.id) {
        setCartItems([]);
      }
    }
  };

  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.name === product.name);
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (name) => {
    setCartItems((prev) => prev.filter((item) => item.name !== name));
  };

  const updateQuantity = (name, quantity) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.name === name ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const value = {
    cartItems,
    setCartItems, // Expose for external use (e.g., AddToCartPageContent)
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    clearUserCart, // Expose for AuthContext to use
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
