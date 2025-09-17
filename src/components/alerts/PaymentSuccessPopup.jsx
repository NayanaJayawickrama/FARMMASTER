import React from 'react';

const PaymentSuccessPopup = ({ isVisible, onClose, transactionId }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full mx-4 p-8 text-center relative animate-fadeInScale">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            {/* Outer circle */}
            <div className="w-36 h-36 rounded-full border-4 border-green-500 flex items-center justify-center">
              {/* Inner checkmark - Made larger */}
              <svg 
                className="w-20 h-20 text-green-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={3} 
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Payment Successful!
        </h2>

        {/* Description */}
        <div className="text-gray-600 mb-6 space-y-2">
          <p className="text-base leading-relaxed">
            Congratulations! Your payment has been successfully processed.<br></br>
            Thank you for choosing FarmMaster!
          </p>
         
        </div>

        {/* Transaction ID */}
        {transactionId && (
          <div className="inline-block bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
            <p className="text-sm text-green-700">
              <span className="font-medium">Transaction ID:</span>
            </p>
            <p className="text-sm font-mono text-green-800 mt-1">
              {transactionId}
            </p>
          </div>
        )}

        <div>
          {/* Action Button */}
          <button
            onClick={onClose}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-7 rounded-xl transition-all duration-200 transform hover:scale-100 focus:outline-none focus:ring-4 focus:ring-green-300"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPopup;
