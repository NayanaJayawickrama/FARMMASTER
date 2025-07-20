import React from "react";
import heroImage from "../../assets/images/homeimages/hero.png";
import { ArrowRight } from "lucide-react";

const MarketplaceHero = () => {
  return (
    <section className="max-w-[1240px] mx-auto mt-10 rounded-3xl overflow-hidden bg-[#F0FFED] flex flex-col md:flex-row shadow-md">
      {/* Left Content - Fully Centered */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-8 py-10 md:py-16">
        <div className="flex flex-col items-center text-center space-y-5 w-full max-w-md">
          {/* Title */}
          <h1 className="text-4xl md:text-7xl font-bold text-black leading-tight">
            Market<span className="text-green-600">place</span>
          </h1>

          {/* Subtext */}
          <p className="text-gray-500 text-base md:text-lg font-medium">
            Fresh & Healthy Organic Foods
          </p>

          {/* Main Message */}
          <p className="text-xl md:text-2xl font-semibold text-black leading-snug">
            Shop Fresh Organic Produce - <br className="hidden md:block" />
            Direct from the Farm!
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <button className="bg-green-600 text-white px-6 py-2.5 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition">
              Shop Now <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Right Image */}
      <div className="hidden md:block w-full md:w-1/2 h-[300px] md:h-auto">
        <img
          src={heroImage}
          alt="Marketplace Hero"
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  );
};

export default MarketplaceHero;
