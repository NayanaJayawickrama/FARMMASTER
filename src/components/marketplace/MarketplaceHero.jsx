import React from 'react';
import vegetablesimage from '../../assets/images/vegetables_hero1.png';

const MarketplaceHero = () => {
  return (
    <section 
      style={{ backgroundColor: "#F0FFED" }} 
      className="flex flex-col md:flex-row rounded-2xl overflow-hidden max-w-5xl mx-auto mt-10 h-auto md:h-[400px]"
    >
      
      {/* Left Side - Text Content Fully Centered with Padding */}
      <div className="flex items-center justify-center w-full md:w-1/2 p-4 md:p-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <h1 className="text-6xl font-bold">
            Organic <span className="text-green-500">Vegetables</span>
          </h1>

          <p className="text-gray-600 text-xl">
            Eat Fresh. Live Healthy.
          </p>

          <p className="text-2xl font-medium">
            Get 100% organic vegetables<br />grown with love and care
          </p>

          <button className="mt-2 bg-green-500 text-white font-bold px-6 py-2 rounded-2xl hover:bg-green-600 transition">
            Shop Now
          </button>
        </div>
      </div>

      {/* Right Side - Image Section without Padding */}
      <div className="hidden md:block w-full md:w-1/2 h-[300px] md:h-auto">
        <img 
          src={vegetablesimage} 
          alt="Vegetables" 
          className="w-full h-full object-cover"
        />
      </div>
      
    </section>
  );
};

export default MarketplaceHero;
