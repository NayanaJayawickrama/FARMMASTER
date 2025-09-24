import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  
  // Get user-specific cart key
  const getCartKey = (userId = null) => {
    const targetUserId = userId || user?.id;
    return targetUserId ? `cartItems_${targetUserId}` : "cartItems_guest";
  };

  // Initialize cart from localStorage (user-specific)
  const getInitialCart = (userId = null) => {
    try {
      const cartKey = getCartKey(userId);
      const stored = localStorage.getItem(cartKey);
      console.log(`Loading cart for key: ${cartKey}`, stored ? JSON.parse(stored) : []);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const [cartItems, setCartItems] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const prevUserRef = useRef(null);

  // Initialize cart when component mounts
  useEffect(() => {
    console.log('CartContext: Initial mount, loading cart...');
    const initialUserId = user?.id || null;
    setCurrentUserId(initialUserId);
    const initialCart = getInitialCart(initialUserId);
    setCartItems(initialCart);
    setIsInitialized(true);
    prevUserRef.current = user;
    
    console.log('CartContext: Initial cart loaded', { 
      userId: initialUserId, 
      cartItems: initialCart 
    });
  }, []); // Only run on mount

  // Handle user changes (login/logout)
  useEffect(() => {
    if (!isInitialized) return;

    const newUserId = user?.id || null;
    const prevUserId = prevUserRef.current?.id || null;
    
    console.log('CartContext: User state changed', { 
      prevUserId, 
      newUserId,
      prevUser: prevUserRef.current,
      newUser: user 
    });

    // Only reload cart if user actually changed
    if (newUserId !== prevUserId) {
      console.log('CartContext: User changed, switching cart data...');
      
      // Save current cart before switching (if we had a previous user)
      if (prevUserId && cartItems.length > 0) {
        const prevCartKey = `cartItems_${prevUserId}`;
        localStorage.setItem(prevCartKey, JSON.stringify(cartItems));
        console.log(`CartContext: Saved previous cart to ${prevCartKey}`, cartItems);
      }
      
      // Update current user ID
      setCurrentUserId(newUserId);
      
      // Load new user's cart
      const newCart = getInitialCart(newUserId);
      setCartItems(newCart);
      
      console.log('CartContext: Switched to new cart', { 
        newUserId, 
        newCart 
      });
    }
    
    // Update previous user reference
    prevUserRef.current = user;
  }, [user, isInitialized, cartItems]); // Include cartItems to ensure we save before switching

  // Persist cart to localStorage on change (user-specific)
  useEffect(() => {
    if (isInitialized && cartItems.length >= 0) { // Allow saving empty carts too
      const cartKey = getCartKey();
      localStorage.setItem(cartKey, JSON.stringify(cartItems));
      console.log(`CartContext: Cart saved to ${cartKey}`, cartItems);
    }
  }, [cartItems, user?.id, isInitialized]);

  // Save cart before user logs out (this will be called by AuthContext)
  const saveCurrentCart = () => {
    if (user?.id && cartItems.length > 0) {
      const cartKey = getCartKey();
      localStorage.setItem(cartKey, JSON.stringify(cartItems));
      console.log(`CartContext: Cart saved before logout to ${cartKey}`, cartItems);
    }
  };

  // Clear cart function (also removes from localStorage)
  const clearCart = () => {
    console.log('CartContext: Clearing cart');
    setCartItems([]);
    const cartKey = getCartKey();
    localStorage.removeItem(cartKey);
  };

  // Clear cart when user logs out (called from AuthContext)
  const clearUserCart = (userId) => {
    console.log('CartContext: Clearing user cart', userId);
    if (userId) {
      localStorage.removeItem(`cartItems_${userId}`);
      // If it's the current user, also clear the state
      if (userId === user?.id) {
        setCartItems([]);
      }
    }
  };

  // Force reload cart for current user
  const reloadCart = () => {
    console.log('CartContext: Force reloading cart');
    const currentCart = getInitialCart();
    setCartItems(currentCart);
  };

  const addToCart = (product, quantity = 1) => {
    console.log('CartContext: Adding to cart', { product, quantity });
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
    console.log('CartContext: Removing from cart', name);
    setCartItems((prev) => prev.filter((item) => item.name !== name));
  };

  const updateQuantity = (name, quantity) => {
    console.log('CartContext: Updating quantity', { name, quantity });
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
    saveCurrentCart, // Expose for AuthContext to call before logout
    reloadCart, // Expose for manual cart reload
    isInitialized, // Expose initialization state
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
