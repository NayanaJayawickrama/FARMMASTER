import React from "react";
import aboutImage from "../../assets/images/about-hero.png"; // Replace with your correct image path

const AboutHero = () => {
  return (
    <section className="max-w-[1240px] mx-auto my-12 px-4">
      <div className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-md">
        {/* Background Image */}
        <img
          src={aboutImage}
          alt="About FarmMaster"
          className="w-full h-full object-cover"
        />

        {/* Left Transparent Overlay */}
        <div className="absolute left-0 top-0 h-full w-full md:w-1/2 flex items-center justify-center px-6">
          {/* Transparent background inside */}
          <div className="bg-black/50 w-full h-full absolute top-0 left-0 z-0"></div>

          {/* Text Content */}
          <div className="text-center space-y-3 relative z-10 px-4">
            <h2 className="text-white text-3xl md:text-5xl font-bold">
              About FarmMaster
            </h2>
            <p className="text-white text-base md:text-lg font-medium">
              Empowering Organic Farming in Sri Lanka
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
