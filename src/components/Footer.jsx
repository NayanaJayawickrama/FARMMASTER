import React from 'react';
import logo from '../assets/images/logo.png';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white px-6 py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Logo & Description */}
        <div className="flex flex-col items-start space-y-3">
          <img src={logo} alt="Farm Master Logo" className="h-20 w-auto" />
          <p className="text-gray-400 text-sm">
            Transforming agriculture through<br />
            technology and sustainable farming<br />
            practices.
          </p>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Services</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>Land Analysis</li>
            <li>Crop Recommendations</li>
            <li>Farm Management</li>
            <li>Organic Marketplace</li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Support</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>Help Center</li>
            <li>Contact Us</li>
            
            <li>Community</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>support@farmmaster.lk</li>
            <li>+94 77 123 4567</li>
            <li>Badulla, Sri Lanka</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-10 pt-4 text-center text-sm text-gray-500">
        © 2025 Farm Master. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
