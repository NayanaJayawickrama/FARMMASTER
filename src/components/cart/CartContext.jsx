import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

// Cookie utilities
const setCookie = (name, value, days = 30) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
};

const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      try {
        return JSON.parse(decodeURIComponent(c.substring(nameEQ.length, c.length)));
      } catch (e) {
        return null;
      }
    }
  }
  return null;
};

const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Get user-specific cart cookie name
  const getCartCookieName = (userId = null) => {
    const targetUserId = userId || user?.id;
    return targetUserId ? `cart_${targetUserId}` : "cart_guest";
  };

  // Load cart from cookies
  const loadCartFromCookie = (userId = null) => {
    try {
      const cookieName = getCartCookieName(userId);
      const stored = getCookie(cookieName);
      console.log(`Loading cart from cookie: ${cookieName}`, stored || []);
      return stored || [];
    } catch (error) {
      console.error('Error loading cart from cookie:', error);
      return [];
    }
  };

  // Save cart to cookies
  const saveCartToCookie = (items, userId = null) => {
    try {
      const cookieName = getCartCookieName(userId);
      setCookie(cookieName, items, 30); // 30 days expiration
      console.log(`Cart saved to cookie: ${cookieName}`, items);
    } catch (error) {
      console.error('Error saving cart to cookie:', error);
    }
  };

  // Initialize cart when user changes or component mounts
  useEffect(() => {
    console.log('CartContext: User effect triggered', { 
      userId: user?.id,
      userExists: !!user
    });

    const userCart = loadCartFromCookie(user?.id);
    setCartItems(userCart);
    setIsInitialized(true);
    
    console.log('CartContext: Cart loaded from cookie', userCart);
  }, [user?.id]); // Re-run whenever user ID changes (login/logout)

  // Auto-save cart to cookies whenever it changes
  useEffect(() => {
    if (isInitialized) {
      saveCartToCookie(cartItems, user?.id);
    }
  }, [cartItems, user?.id, isInitialized]);

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

  const clearCart = () => {
    console.log('CartContext: Clearing cart');
    setCartItems([]);
    const cookieName = getCartCookieName();
    deleteCookie(cookieName);
  };

  const clearUserCart = (userId) => {
    console.log('CartContext: Clearing user cart for:', userId);
    if (userId) {
      const userCartCookie = `cart_${userId}`;
      deleteCookie(userCartCookie);
      if (userId === user?.id) {
        setCartItems([]);
      }
    }
  };

  const saveCurrentCart = () => {
    saveCartToCookie(cartItems, user?.id);
  };

  const reloadCart = () => {
    console.log('CartContext: Force reloading cart from cookie');
    const currentCart = loadCartFromCookie(user?.id);
    setCartItems(currentCart);
    console.log('CartContext: Cart reloaded from cookie:', currentCart);
  };

  // Debug function to show all cart cookies
  const debugCartCookies = () => {
    const allCookies = document.cookie.split(';');
    const cartCookies = allCookies.filter(cookie => cookie.trim().startsWith('cart_'));
    console.log('All cart cookies:', cartCookies);
    cartCookies.forEach(cookie => {
      const [name, value] = cookie.split('=');
      try {
        const data = JSON.parse(decodeURIComponent(value));
        console.log(`${name.trim()}:`, data);
      } catch (e) {
        console.log(`${name.trim()}:`, 'Invalid JSON');
      }
    });
  };

  const value = {
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    clearUserCart,
    saveCurrentCart,
    reloadCart,
    debugCartCookies, // For debugging
    isInitialized,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
