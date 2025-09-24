import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const rootUrl = import.meta.env.VITE_API_URL;
const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(Date.now());

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${rootUrl}/api.php/products`, {
        withCredentials: true
      });

      if (res.data.status === 'success') {
        const data = res.data.data;

        if (Array.isArray(data)) {
          const mappedProducts = data.map((item) => ({
            id: parseInt(item.product_id),
            product_id: parseInt(item.product_id),
            name: `Organic ${item.crop_name}`,
            crop_name: item.crop_name,
            // Use backend-provided full image URL
            image_url: item.image_url || "",
            description: item.description,
            price: parseFloat(item.price_per_unit),
            price_per_unit: parseFloat(item.price_per_unit),
            quantity: parseFloat(item.quantity),
            status: item.quantity === 0 ? "sold" : item.status ? item.status.toLowerCase() : "",
            is_featured: item.is_featured ? true : false
          }));
          setProducts(mappedProducts);
          setLastFetchTime(Date.now());
          setError(null);
          console.log('Products fetched successfully:', mappedProducts.length, 'items');
        } else {
          setProducts([]);
        }
      } else {
        setProducts([]);
      }
    } catch (err) {
      setProducts([]);
      console.error("Error fetching products:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh products every 30 seconds
  useEffect(() => {
    fetchProducts();
    
    const refreshInterval = setInterval(() => {
      console.log('Auto-refreshing products...');
      fetchProducts();
    }, 30000); // 30 seconds

    return () => clearInterval(refreshInterval);
  }, []);

  // Force refresh when user comes back to the tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // User came back to the tab, refresh if it's been more than 10 seconds
        const timeSinceLastFetch = Date.now() - lastFetchTime;
        if (timeSinceLastFetch > 10000) { // 10 seconds
          console.log('Tab became visible, refreshing products...');
          fetchProducts();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [lastFetchTime]);

  const updateProduct = (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, ...updatedFields } : product
      )
    );
  };

  // Manual refresh function for components to call
  const forceRefresh = () => {
    console.log('Force refreshing products...');
    fetchProducts();
  };

  const value = {
    products,
    loading,
    error,
    fetchProducts,
    forceRefresh, // Expose force refresh
    updateProduct,
    lastFetchTime, // Expose last fetch time
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);