import React from 'react';
import { Link } from 'react-router-dom';

import vegImage from '../../assets/images/vegetables.jpg';
import fruitsImage from '../../assets/images/fruits.jpg';
import spicesImage from '../../assets/images/spices.jpg';
import grainsImage from '../../assets/images/grains.png';

const ProductCategories = () => {
  const categories = [
    { name: 'Vegetables', image: vegImage, path: '/vegetables' },
    { name: 'Fruits', image: fruitsImage, path: '/fruits' },
    { name: 'Spices', image: spicesImage, path: '/spices' },
    { name: 'Grains', image: grainsImage, path: '/grains' },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-green-700">
        Explore Our Product Categories
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-12 place-items-center">
        {categories.map((category, index) => (
          <Link
            to={category.path}
            key={index}
            className="group relative w-44 h-44 rounded-full overflow-hidden shadow-2xl transform transition duration-500 hover:scale-110 hover:rotate-1 bg-white"
          >
            {/* Gradient border effect */}
            <div className="absolute inset-0 z-0 rounded-full bg-gradient-to-tr from-green-300 via-lime-100 to-green-300 group-hover:blur-sm group-hover:scale-105 transition-all duration-500" />

            {/* Image Layer */}
            <img
              src={category.image}
              alt={category.name}
              className="relative z-10 w-full h-full object-cover rounded-full border-4 border-white"
            />

            {/* Glow ring on hover */}
            <div className="absolute inset-0 rounded-full z-10 border-4 border-transparent group-hover:border-green-400 transition-all duration-500" />

            {/* Category Label */}
            <div className="absolute bottom-3 left-1/2 z-20 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-semibold text-green-800 shadow-md group-hover:bg-green-100 transition duration-300">
              {category.name}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ProductCategories;
