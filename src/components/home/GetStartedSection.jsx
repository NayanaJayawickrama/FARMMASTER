import React from 'react';
import { NavLink } from "react-router-dom";

const GetStartedSection = () => {
  return (
    <section className="bg-green-500 mt-30 py-10 px-4">
      <div className="max-w-4xl mx-auto text-center space-y-4">
        
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          Ready to Maximize Your Land's Potential?
        </h2>

        <p className="text-white text-lg">
          Join thousands of landowners who are already earning from sustainable organic farming
        </p>
        <NavLink to="/register">
        <button className="mt-4 bg-white text-green-500 font-medium px-6 py-2 rounded hover:bg-green-100 transition">
          Get Started Today
        </button>
        </NavLink>
        
        
      </div>
    </section>
  );
};

export default GetStartedSection;
