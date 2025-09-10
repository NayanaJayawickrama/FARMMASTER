import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const rootUrl = import.meta.env.VITE_API_URL;
const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${rootUrl}/ProductRoute.php?action=getProducts`);
      const data = res.data;

      if (Array.isArray(data)) {
        const mappedProducts = data.map((item) => ({
          id: parseInt(item.product_id),
          product_id: parseInt(item.product_id),
          name: `Organic ${item.crop_name}`,
          crop_name: item.crop_name,
          image_url: item.image_url,
          description: item.description,
          price: parseFloat(item.price_per_unit),
          price_per_unit: parseFloat(item.price_per_unit),
          quantity: parseFloat(item.quantity),
          status: item.status ? item.status.toLowerCase() : "",
        }));
        setProducts(mappedProducts);
      } else {
        setProducts([]);
      }
    } catch (err) {
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const updateProduct = (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, ...updatedFields } : product
      )
    );
  };

  return (
    <ProductContext.Provider value={{ products, updateProduct, fetchProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);