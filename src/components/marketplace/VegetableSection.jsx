import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

import carrotImg from "../../assets/images/marketplaceimages/carrot.png";
import cabbageImg from "../../assets/images/marketplaceimages/cabbage.png";
import tomatoImg from "../../assets/images/marketplaceimages/tomato.png";
import leekImg from "../../assets/images/marketplaceimages/leeks.png";
import rightImg from "../../assets/images/marketplaceimages/right-veg.png";
import leftImg from "../../assets/images/marketplaceimages/left-veg1.png";

const products = [
  {
    name: 'Organic Carrots',
    image: carrotImg,
    description: 'Fresh and sweet farm carrots',
    price: 'Rs. 200.00',
  },
  {
    name: 'Organic Cabbage',
    image: cabbageImg,
    description: 'Crisp, green and pesticide-free',
    price: 'Rs. 150.00',
  },
  {
    name: 'Organic Tomatoes',
    image: tomatoImg,
    description: 'Juicy, ripe, and naturally grown',
    price: 'Rs. 160.00',
  },
  {
    name: 'Organic Leeks',
    image: leekImg,
    description: 'Fresh, mild-flavored, and pesticide-free',
    price: 'Rs. 180.00',
  },
];

const VegetableSection = () => {
  const [quantities, setQuantities] = useState(products.map(() => 1));

  const increaseQuantity = (index) => {
    setQuantities((prev) =>
      prev.map((q, i) => (i === index ? q + 1 : q))
    );
  };

  const decreaseQuantity = (index) => {
    setQuantities((prev) =>
      prev.map((q, i) => (i === index && q > 1 ? q - 1 : q))
    );
  };

  return (
    <section id="vegetables"  className="flex justify-center py-14 px-4 md:px-10">
      <div className="bg-[#F0FFED] rounded-2xl max-w-5xl w-full pt-0 pb-10 overflow-hidden relative">
        
        {/* Top Green Header */}
        <div className="bg-green-600 text-white text-center py-10 px-4 relative">
          <h2 className="text-3xl md:text-5xl font-extrabold">All Organic Vegetables</h2>

          {/* Side Images */}
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

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-6 mt-10">
          {products.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md border border-gray-200 p-4 flex flex-col justify-between items-center text-center h-[370px]"
            >
              <img src={item.image} alt={item.name} className="w-24 h-24 object-contain mb-2" />
              <h3 className="font-bold text-lg text-black">{item.name}</h3>
              <p className="text-sm text-gray-600 mb-1">{item.description}</p>

              {/* Stars */}
              <div className="flex justify-center text-yellow-400 my-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} size={14} />
                ))}
              </div>

              {/* Price */}
              <p className="text-green-600 font-semibold text-md">{item.price}</p>

              {/* Quantity Selector */}
              <div className="border mt-1 rounded flex justify-between items-center w-32 text-sm whitespace-nowrap">
                <button
                  className="px-3"
                  onClick={() => decreaseQuantity(index)}
                >
                  −
                </button>
                <span className="px-2">{quantities[index]} Kg</span>
                <button
                  className="px-3"
                  onClick={() => increaseQuantity(index)}
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button className="mt-3 bg-green-600 text-white font-semibold px-4 py-1 rounded hover:bg-green-700 text-sm">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VegetableSection;
