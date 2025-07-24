import React, { useState, useEffect } from "react";
import { useCart } from "../cart/CartContext";
import { useProducts } from "../financialmanagerdashboard/ProductContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import rightImg from "../../assets/images/marketplaceimages/right-veg.png";
import leftImg from "../../assets/images/marketplaceimages/left-veg1.png";

import carrotImg from "../../assets/images/marketplaceimages/carrot.png";
import cabbageImg from "../../assets/images/marketplaceimages/cabbage.png";
import tomatoImg from "../../assets/images/marketplaceimages/tomato.png";
import leekImg from "../../assets/images/marketplaceimages/leeks.png";

const productImages = {
  1: carrotImg,
  4: cabbageImg,
  3: tomatoImg,
  2: leekImg,
};

const VegetableSection = () => {
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [quantities, setQuantities] = useState([]);
  const [showPopup, setShowPopup] = useState(false); 
  const [showRolePopup, setShowRolePopup] = useState(false); 

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
    if (!user) {
      setShowPopup(true);
      return;
    }
    if (user.role !== "Buyer") {
      setShowRolePopup(true);
      return;
    }
    addToCart(product, quantity);
  };

  const availableProducts = products.filter(
    (item) => item.status !== "unavailable"
  );

  return (
    <section
      id="vegetables"
      className="relative flex justify-center py-14 px-4 md:px-10"
    >
      <div className="bg-[#F0FFED] rounded-2xl max-w-5xl w-full pt-0 pb-10 overflow-hidden relative">
        
        <div className="bg-green-600 text-white text-center py-10 px-4 relative">
          <h2 className="text-3xl md:text-5xl font-extrabold">
            All Organic Vegetables
          </h2>
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

        
        <div
          className="grid gap-6 px-6 mt-10"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}
        >
          {availableProducts.map((item, index) => (
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
                <button
                  className="px-3 cursor-pointer"
                  onClick={() => decreaseQuantity(index)}
                >
                  −
                </button>
                <span className="px-2">{quantities[index]} Kg</span>
                <button
                  className="px-3 cursor-pointer"
                  onClick={() => increaseQuantity(index)}
                >
                  +
                </button>
              </div>

              {item.status === "available" ? (
                <button
                  onClick={() => handleAddToCart(item, quantities[index])}
                  className="mt-3 bg-green-600 text-white font-semibold px-4 py-1 rounded hover:bg-green-700 text-sm cursor-pointer"
                >
                  Add to Cart
                </button>
              ) : (
                <button
                  disabled
                  className="mt-3 bg-red-500 text-white font-semibold px-4 py-1 rounded cursor-not-allowed text-sm"
                >
                  Sold Out
                </button>
              )}
            </div>
          ))}

          {availableProducts.length === 0 && (
            <p className="text-center col-span-full text-gray-600">
              No products to display at the moment.
            </p>
          )}
        </div>

        
        {showPopup && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center border border-green-600">
              <h2 className="text-lg font-bold mb-2 text-gray-800">
                Please Register First
              </h2>
              <p className="text-gray-600 mb-4">
                You must be registered to add items to your cart.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => navigate("/register")}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  Go to Register
                </button>
                <button
                  onClick={() => setShowPopup(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        
        {showRolePopup && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center border border-green-600">
              <h2 className="text-lg font-bold mb-2 text-gray-800">
                Access Restricted
              </h2>
              <p className="text-gray-600 mb-4">
                Only users with a Buyer account can add items to the cart.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowRolePopup(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default VegetableSection;
