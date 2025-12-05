import React from "react";
import heroImage from "../../assets/images/homeimages/farm-hero.jpg"; 
import { ArrowRight } from "lucide-react";
import { NavLink } from "react-router-dom";

const FarmMasterHero = () => {
  return (
    <section className="max-w-[1240px] mx-auto mt-10 rounded-3xl overflow-hidden bg-[#E9FFE7] flex flex-col md:flex-row shadow-md">
      {/* Left Content - Fully Centered */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-8 py-10 md:py-16">
        <div className="flex flex-col items-center text-center space-y-5 w-full max-w-md">
          {/* Title */}
          <h1 className="text-4xl md:text-7xl font-bold text-black leading-tight">
            Farm<span className="text-green-600">Master</span>
          </h1>

          {/* Subtext */}
          <p className="text-gray-500 text-base md:text-lg font-medium">
            Organic Farming Management System
          </p>

          {/* Main Message */}
          <p className="text-xl md:text-2xl font-semibold text-black leading-snug">
            Transform your Land into <br className="hidden md:block" />
            Profitable Organic Farms
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <NavLink to="/register">
            <button className="bg-green-600 text-white px-6 py-2.5 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition">
              Start Your Journey <ArrowRight size={18} />
            </button>
            </NavLink>
            <NavLink to="/about">
            <button className="border border-black px-6 py-2.5 rounded-full font-semibold text-black hover:bg-gray-100 transition">
              Learn More
            </button>
            </NavLink>
          </div>
        </div>
      </div>

      {/* Right Image */}
      <div className="w-full md:w-1/2 h-[300px] md:h-auto">
        <img
          src={heroImage}
          alt="Farm Master Hero"
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  );
};

export default FarmMasterHero;
