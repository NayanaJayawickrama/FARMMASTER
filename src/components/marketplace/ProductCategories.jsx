import React from 'react';
import { Link } from 'react-router-dom';
import vegNewImage from '../../assets/images/marketplaceimages/vegetablesnew.png';

const ProductCategories = () => {
  const handleShopClick = (e) => {
    e.preventDefault();
    const section = document.getElementById("vegetables");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="pt-16 mt-10">
      <div className="relative z-10 max-w-4xl w-full mx-auto rounded-3xl shadow-2xl bg-white/95 p-10 flex flex-col md:flex-row items-center justify-between">
        {/* Right: Transparent vegetable image (now first) */}
        <div className="flex-1 flex justify-center items-center mb-8 md:mb-0 md:order-1">
          <img
            src={vegNewImage}
            alt="Vegetable Marketplace"
            className="w-72 h-72 object-contain drop-shadow-xl"
            style={{ background: "none" }}
          />
        </div>
        {/* Left: About Us and Welcome */}
        <div className="flex-1 flex flex-col items-start justify-center px-2 md:px-6 md:order-2">
          <h2 className="text-3xl md:text-4xl font-extrabold text-green-700 mb-4 text-left drop-shadow-lg tracking-tight">
            Organic Marketplace
          </h2>
          <p className="text-gray-700 mb-6 text-left text-lg leading-relaxed">
            Welcome to Sri Lanka's trusted online marketplace for organic vegetables. Browse, shop, and enjoy fresh, healthy produce delivered from local farms directly to your table.
          </p>
          <a
            href="#vegetables"
            onClick={handleShopClick}
            className="bg-gradient-to-r from-green-600 to-lime-400 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition text-lg"
          >
            Shop Now
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;
