import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../cart/CartContext";
import { useNavigate } from "react-router-dom";

// Initialize Stripe with your actual publishable key
const stripePromise = loadStripe("pk_test_51Rnk1kC523WS3olJgTHr67VfyR8w8fRy0kyoeoV257f1zaGdO7Egl1kXOtll5zbMnF1IgV0iRmWPkNlYiDvdesAP00teJxyQKk");

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#424770",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4"
      }
    },
    invalid: {
      color: "#9e2146",
      iconColor: "#9e2146"
    }
  }
};

function StripePaymentForm({ orderData, onSuccess, onError }) {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const rootUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setMessage("");

    const testUserId = user?.id || 33; // Buyer user ID

    try {
      // Step 1: Create payment intent for cart purchase
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

      if (paymentIntentResponse.data.status !== "success") {
        throw new Error(paymentIntentResponse.data.message);
      }

      const clientSecret = paymentIntentResponse.data.data.client_secret;
      const paymentIntentId = paymentIntentResponse.data.data.payment_intent_id;

      // Step 2: Confirm payment with Stripe
      const cardNumberElement = elements.getElement(CardNumberElement);
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumberElement,
          billing_details: {
            name: user?.name || "Buyer",
            email: user?.email || "buyer@example.com",
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent.status === "succeeded") {
        // Step 3: Confirm payment on our backend
        const confirmResponse = await axios.post(`${rootUrl}/api/payments/process`, {
          action: "confirm_payment",
          payment_intent_id: paymentIntentId,
          user_id: testUserId
        }, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        });

        if (confirmResponse.data.status === "success") {
          onSuccess({
            transaction_id: confirmResponse.data.data.transaction_id,
            payment_intent_id: paymentIntentId,
            amount: orderData.totalAmount,
            order_number: orderData.orderNumber
          });
        } else {
          throw new Error(confirmResponse.data.message);
        }
      } else {
        throw new Error(`Payment not completed. Status: ${paymentIntent.status}`);
      }

    } catch (error) {
      console.error("Payment error:", error);
      setMessage(`${error.message}`);
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div className={`p-3 rounded-lg text-sm ${message.includes('error') || message.includes('failed') ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
          {message}
        </div>
      )}

      {/* Payment Amount Summary */}
      <div className="bg-green-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-green-800">Order Total</span>
          <span className="text-2xl font-bold text-green-700">
            LKR {orderData.totalAmount?.toLocaleString()}
          </span>
        </div>
        <p className="text-sm text-green-600">Order #{orderData.orderNumber}</p>
      </div>

      {/* Card Input Fields */}
      <div className="space-y-4">
        {/* Card Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Number *
          </label>
          <div className="border border-gray-300 rounded-lg p-4 bg-white">
            <CardNumberElement
              options={CARD_ELEMENT_OPTIONS}
              onChange={(event) => {
                if (event.error) {
                  setMessage("" + event.error.message);
                } else {
                  setMessage("");
                }
              }}
            />
          </div>
        </div>

        {/* Expiry Date and CVV */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date *
            </label>
            <div className="border border-gray-300 rounded-lg p-4 bg-white">
              <CardExpiryElement
                options={CARD_ELEMENT_OPTIONS}
                onChange={(event) => {
                  if (event.error) {
                    setMessage("" + event.error.message);
                  } else {
                    setMessage("");
                  }
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CVV *
            </label>
            <div className="border border-gray-300 rounded-lg p-4 bg-white">
              <CardCvcElement
                options={CARD_ELEMENT_OPTIONS}
                onChange={(event) => {
                  if (event.error) {
                    setMessage("" + event.error.message);
                  } else {
                    setMessage("");
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Processing Payment...
          </>
        ) : (
          `Pay LKR ${orderData.totalAmount?.toLocaleString()} Securely`
        )}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Your payment information is secure and encrypted
      </p>
    </form>
  );
}

export default function CartStripePayment({ orderData, onSuccess, onError, onCancel }) {
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Complete Payment</h2>
        <p className="text-gray-600">
          Secure payment processing for your order
        </p>
      </div>

      <Elements stripe={stripePromise}>
        <StripePaymentForm
          orderData={orderData}
          onSuccess={onSuccess}
          onError={onError}
        />
      </Elements>

      <div className="mt-4 text-center">
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 text-sm font-medium"
        >
          Cancel Payment
        </button>
      </div>

      {/* Test Card Information */}
      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold text-blue-800">Test Card Details:</span>
        </div>
        <div className="text-sm text-blue-700 space-y-1">
          <p><strong>Card Number:</strong> 4242 4242 4242 4242 (Success)</p>
          <p><strong>Card Number:</strong> 4000 0000 0000 0002 (Decline)</p>
          <p><strong>Expiry Date:</strong> Any future date (e.g., 12/25)</p>
          <p><strong>CVV:</strong> Any 3 digits (e.g., 123)</p>
        </div>
      </div>
    </div>
  );
}