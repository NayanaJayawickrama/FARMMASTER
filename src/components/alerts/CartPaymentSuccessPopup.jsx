import React from 'react';
import { CheckCircle, X } from 'lucide-react';

const CartPaymentSuccessPopup = ({ isVisible, onClose, orderData }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-green-700">Payment Successful!</h2>
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
            <div className="bg-green-100 rounded-full p-4">
              <CheckCircle className="text-green-600" size={48} />
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-lg font-medium text-gray-800">
              Your order has been placed successfully!
            </p>
            <p className="text-gray-600">
              Thank you for your purchase. Your order is being processed.
            </p>
          </div>

          {orderData && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Order Number:</span>
                <span className="text-gray-900">{orderData.order_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Transaction ID:</span>
                <span className="text-gray-900 text-sm">{orderData.transaction_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Amount Paid:</span>
                <span className="text-green-600 font-semibold">
                  LKR {orderData.amount?.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          <div className="text-center text-sm text-gray-500">
            <p>You will receive an email confirmation shortly.</p>
            <p>You can track your order in the Orders section.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition font-medium"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPaymentSuccessPopup;