import React from "react";

const AboutFooter = () => {
  return (
    <footer className="w-full mt-16">
      {/* CTA Section */}
      <div className="bg-black py-10 px-4 text-center">
        <h2 className="text-green-500 text-2xl md:text-3xl font-bold mb-8">
          Let’s Grow Together
        </h2>
        <p className="text-white text-base md:text-lg max-w-3xl mx-auto leading-relaxed text-justify mb-8">
          Whether you're a landowner looking to put your land to good use or a buyer seeking
          fresh, organic vegetables — Farm Master is your digital farming partner for a better, greener future.
        </p>
      </div>

      {/* Bottom Line */}
      <div className="bg-gray-100 text-center text-sm text-gray-500 py-4">
        © 2025 Farm Master. All rights reserved.
      </div>
    </footer>
  );
};

export default AboutFooter;
