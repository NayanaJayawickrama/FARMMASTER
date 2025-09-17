import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const CartPaymentErrorPopup = ({ isVisible, onClose, errorMessage }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-red-700">Payment Failed</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-100 rounded-full p-4">
              <AlertCircle className="text-red-600" size={48} />
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-lg font-medium text-gray-800">
              Payment Could Not Be Processed
            </p>
            <p className="text-gray-600">
              {errorMessage || "There was an error processing your payment. Please try again."}
            </p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>What you can do:</strong>
            </p>
            <ul className="text-sm text-yellow-700 mt-2 space-y-1">
              <li>• Check your card details and try again</li>
              <li>• Ensure your card has sufficient funds</li>
              <li>• Try a different payment method</li>
              <li>• Contact your bank if the issue persists</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPaymentErrorPopup;