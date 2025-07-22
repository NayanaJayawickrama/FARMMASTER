import React, { useState, useEffect } from "react";
import { useCart } from "../cart/CartContext";
import { useProducts } from "../financialmanagerdashboard/ProductContext";

import rightImg from "../../assets/images/marketplaceimages/right-veg.png";
import leftImg from "../../assets/images/marketplaceimages/left-veg1.png";

import carrotImg from "../../assets/images/marketplaceimages/carrot.png";
import cabbageImg from "../../assets/images/marketplaceimages/cabbage.png";
import tomatoImg from "../../assets/images/marketplaceimages/tomato.png";
import leekImg from "../../assets/images/marketplaceimages/leeks.png";

const productImages = {
  1: carrotImg,
  2: cabbageImg,
  3: tomatoImg,
  4: leekImg,
};

const VegetableSection = () => {
  const { products } = useProducts();
  const { addToCart } = useCart();

  const [quantities, setQuantities] = useState([]);

  useEffect(() => {
    setQuantities(products.map(() => 1));
  }, [products]);

  const increaseQuantity = (index) => {
    setQuantities((prev) => prev.map((q, i) => (i === index ? q + 1 : q)));
  };

  const decreaseQuantity = (index) => {
    setQuantities((prev) =>
      prev.map((q, i) => (i === index && q > 1 ? q - 1 : q))
    );
  };

  const handleAddToCart = (product, quantity) => {
    addToCart(product, quantity);
  };

  return (
    <section id="vegetables" className="flex justify-center py-14 px-4 md:px-10">
      <div className="bg-[#F0FFED] rounded-2xl max-w-5xl w-full pt-0 pb-10 overflow-hidden relative">
        {/* Header */}
        <div className="bg-green-600 text-white text-center py-10 px-4 relative">
          <h2 className="text-3xl md:text-5xl font-extrabold">All Organic Vegetables</h2>
          <img
            src={leftImg}
            alt="Left Veg"
            className="absolute left-0 top-4 w-28 md:w-30 hidden md:block"
          />
          <img
            src={rightImg}
            alt="Right Veg"
            className="absolute right-0 top-0 w-20 md:w-26 hidden md:block"
          />
        </div>

        {/* Product Cards */}
        <div
          className="grid gap-6 px-6 mt-10"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}
        >
          {products.map((item, index) => (
            <div
              key={item.id}
              className="rounded-lg shadow-md border border-gray-200 p-4 flex flex-col justify-between items-center text-center h-[370px] bg-white"
            >
              <img
                src={productImages[item.id] || ""}
                alt={item.name}
                className="w-24 h-24 object-contain mb-2"
              />
              <h3 className="font-bold text-lg text-black">{item.name}</h3>
              <p className="text-sm text-gray-600 mb-1">{item.description}</p>

              <p className="text-green-600 font-semibold text-md">
                Rs. {item.price}.00
              </p>

              <div className="border mt-1 rounded flex justify-between items-center w-32 text-sm whitespace-nowrap">
                <button className="px-3" onClick={() => decreaseQuantity(index)}>
                  −
                </button>
                <span className="px-2">{quantities[index]} Kg</span>
                <button className="px-3" onClick={() => increaseQuantity(index)}>
                  +
                </button>
              </div>

              {item.status === "sold" ? (
                <button
                  className="mt-3 bg-red-500 text-white font-semibold px-4 py-1 rounded cursor-not-allowed text-sm"
                  disabled
                >
                  Sold Out
                </button>
              ) : (
                <button
                  onClick={() => handleAddToCart(item, quantities[index])}
                  className="mt-3 bg-green-600 text-white font-semibold px-4 py-1 rounded hover:bg-green-700 text-sm"
                >
                  Add to Cart
                </button>
              )}
            </div>
          ))}
          {products.length === 0 && (
            <p className="text-center col-span-full text-gray-600">No available products at the moment.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default VegetableSection;
