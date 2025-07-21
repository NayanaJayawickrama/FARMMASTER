import React, { createContext, useContext, useState } from "react";
import carrotImg from "../../assets/images/marketplaceimages/carrot.png";
import cabbageImg from "../../assets/images/marketplaceimages/cabbage.png";
import tomatoImg from "../../assets/images/marketplaceimages/tomato.png";
import leekImg from "../../assets/images/marketplaceimages/leeks.png";

const ProductContext = createContext();

const initialProducts = [
  {
    id: 1,
    name: "Organic Carrots",
    image: carrotImg,
    description: "Fresh and sweet farm carrots",
    price: 200,
    quantity: 0,
    status: "available",
  },
  {
    id: 2,
    name: "Organic Cabbage",
    image: cabbageImg,
    description: "Crisp, green and pesticide-free",
    price: 150,
    quantity: 0,
    status: "available",
  },
  {
    id: 3,
    name: "Organic Tomatoes",
    image: tomatoImg,
    description: "Juicy, ripe, and naturally grown",
    price: 160,
    quantity: 0,
    status: "available",
  },
  {
    id: 4,
    name: "Organic Leeks",
    image: leekImg,
    description: "Fresh, mild-flavored, and pesticide-free",
    price: 180,
    quantity: 0,
    status: "available",
  },
];

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(initialProducts);

  const updateProduct = (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, ...updatedFields } : product
      )
    );
  };

  return (
    <ProductContext.Provider value={{ products, updateProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
