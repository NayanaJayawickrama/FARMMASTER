import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function MockStripePayment({ orderData, onSuccess, onError }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [expiryDate, setExpiryDate] = useState("12/25");
  const [cvc, setCvc] = useState("123");
  const [cardholderName, setCardholderName] = useState(user?.name || "");

  const rootUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    setLoading(true);
    setMessage("");

    const testUserId = user?.id || 33; // Buyer user ID

    try {
      console.log("=== MOCK PAYMENT PROCESS STARTED ===");
      
      // Step 1: Create payment intent (will use mock in backend)
      console.log("Creating payment intent...");
      const paymentIntentResponse = await axios.post(`${rootUrl}/api/payments/process`, {
        action: "create_payment_intent",
        user_id: testUserId,
        payment_type: "cart_purchase",
        cart_order_id: orderData.orderId,
        amount: orderData.totalAmount
      }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });

      console.log("Payment intent response:", paymentIntentResponse.data);

      if (paymentIntentResponse.data.status !== "success") {
        throw new Error(paymentIntentResponse.data.message);
      }

      const paymentIntentId = paymentIntentResponse.data.data.payment_intent_id;
      console.log("Payment intent created with ID:", paymentIntentId);

      // Step 2: Simulate card validation
      if (!cardNumber || !expiryDate || !cvc) {
        throw new Error("Please fill in all card details");
      }

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 3: Confirm payment (will use mock in backend)
      console.log("Confirming payment...");
      const confirmResponse = await axios.post(`${rootUrl}/api/payments/process`, {
        action: "confirm_payment",
        payment_intent_id: paymentIntentId,
        user_id: testUserId
      }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });

      console.log("Payment confirmation response:", confirmResponse.data);

      if (confirmResponse.data.status === "success") {
        setMessage("✅ Payment processed successfully! (Mock Mode)");
        onSuccess({
          transaction_id: confirmResponse.data.data.transaction_id,
          payment_intent_id: paymentIntentId,
          amount: orderData.totalAmount,
          order_number: orderData.orderNumber
        });
      } else {
        throw new Error(confirmResponse.data.message);
      }

    } catch (error) {
      console.error("Mock payment error:", error);
      setMessage("❌ Payment failed: " + (error.response?.data?.message || error.message));
      onError && onError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <div className="mb-6">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-4">
          <div className="flex items-center">
            <span className="font-semibold">🧪 Development Mock Payment</span>
          </div>
          <p className="text-sm mt-1">
            Network connectivity to Stripe is unavailable. Using mock payment system for development.
          </p>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Payment Details</h3>
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">Order: #{orderData.orderNumber}</p>
          <p className="text-lg font-semibold text-blue-600">
            Total: LKR {orderData.totalAmount?.toLocaleString()}
          </p>
        </div>
      </div>

      {message && (
        <div className={`p-3 rounded-lg mb-4 ${message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}

      {/* Mock Card Input Fields */}
      <div className="space-y-4">
        {/* Cardholder Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cardholder Name *
          </label>
          <input
            type="text"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="John Doe"
            required
          />
        </div>

        {/* Card Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Number *
          </label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="4242 4242 4242 4242"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Use 4242 4242 4242 4242 for success</p>
        </div>

        {/* Expiry Date and CVC */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date *
            </label>
            <input
              type="text"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="12/25"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CVC *
            </label>
            <input
              type="text"
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="123"
              maxLength="4"
              required
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2 mt-6"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Processing Mock Payment...
          </>
        ) : (
          `Pay LKR ${orderData.totalAmount?.toLocaleString()} (Mock)`
        )}
      </button>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600 text-center">
          🔒 This is a development mock payment system
        </p>
        <p className="text-xs text-gray-500 text-center mt-1">
          No real payment will be processed
        </p>
      </div>
    </form>
  );
}