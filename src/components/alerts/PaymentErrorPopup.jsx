import React from 'react';

const PaymentErrorPopup = ({ isVisible, onClose, errorMessage }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full mx-4 p-8 text-center relative animate-fadeInScale">
        {/* Error Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            {/* Outer circle */}
            <div className="w-36 h-36 rounded-full border-4 border-red-500 flex items-center justify-center">
              {/* Inner X mark */}
              <svg 
                className="w-20 h-20 text-red-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={3} 
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Payment Failed!
        </h2>

        {/* Description */}
        <div className="text-gray-600 mb-6 space-y-2">
          <p className="text-base leading-relaxed">
            Sorry, your payment could not be processed.<br />
            {errorMessage && <span className="text-red-600">{errorMessage}</span>}
          </p>
        </div>

        <div>
          {/* Action Button */}
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-7 rounded-xl transition-all duration-200 transform hover:scale-100 focus:outline-none focus:ring-4 focus:ring-red-300"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentErrorPopup;
