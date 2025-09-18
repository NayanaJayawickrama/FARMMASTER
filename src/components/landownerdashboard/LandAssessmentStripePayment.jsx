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
import { useNavigate } from "react-router-dom";
import MapLocationPicker from "./MapLocationPicker";
import PaymentSuccessPopup from "../alerts/PaymentSuccessPopup";
import PaymentErrorPopup from "../alerts/PaymentErrorPopup";

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

function StripePaymentForm({ landData, onSuccess, onError }) {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  const rootUrl = import.meta.env.VITE_API_URL;
  const assessmentFee = 5000;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setMessage("");

    const testUserId = user?.id || 32;

    try {
      // Step 1: Insert land details
      const landResponse = await axios.post(`${rootUrl}/api/lands`, {
        user_id: testUserId,
        size: landData.size,
        location: landData.location,
      }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });

      if (landResponse.data.status !== "success") {
        throw new Error(landResponse.data.message);
      }

      const landId = landResponse.data.data.land_id;

      // Step 2: Create payment intent with Stripe
      const paymentIntentResponse = await axios.post(`${rootUrl}/api/payments/process`, {
        action: "create_payment_intent",
        user_id: testUserId,
        land_id: landId,
        amount: assessmentFee
      }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });

      if (paymentIntentResponse.data.status !== "success") {
        throw new Error(paymentIntentResponse.data.message);
      }

      const clientSecret = paymentIntentResponse.data.data.client_secret;
      const paymentIntentId = paymentIntentResponse.data.data.payment_intent_id;

      // Step 3: Confirm payment with Stripe
      const cardNumberElement = elements.getElement(CardNumberElement);

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumberElement,
          billing_details: {
            name: user?.name || "Landowner",
            email: user?.email || "test@example.com",
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent.status === "succeeded") {
        // Step 4: Confirm payment on our backend
        const confirmResponse = await axios.post(`${rootUrl}/api/payments/process`, {
          action: "confirm_payment",
          payment_intent_id: paymentIntentId,
          user_id: testUserId,
          land_id: landId
        }, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        });

        if (confirmResponse.data.status === "success") {
          onSuccess({
            transaction_id: confirmResponse.data.transaction_id,
            payment_intent_id: paymentIntentId,
            amount: assessmentFee
          });
        } else {
          throw new Error(confirmResponse.data.message);
        }
      } else {
        throw new Error(`Payment not completed. Status: ${paymentIntent.status}`);
      }

    } catch (error) {
      console.error("Payment error:", error);
      const errorMessage = error.response?.data?.message || error.message;
      setMessage("❌ " + errorMessage);
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Order Summary */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-3">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Land Size:</span>
            <span className="font-medium">{landData.size} acres</span>
          </div>
          <div className="flex justify-between">
            <span>Location:</span>
            <span className="font-medium">{landData.location}</span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-semibold">
              <span>Total Amount:</span>
              <span>LKR {assessmentFee.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

     {/* Secure Payment Information */}
     {/* <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold text-blue-800"> Secure Payment Processing</span>
        </div>
        <p className="text-sm text-blue-700 mb-2">Your payment is processed securely with industry-standard encryption</p>
        <div className="text-sm text-blue-700 space-y-1">
          <p><strong>Test Card Details (for testing only):</strong></p>
          <p><strong>Card Number:</strong> 4242 4242 4242 4242 (Success)</p>
          <p><strong>Card Number:</strong> 4000 0000 0000 0002 (Decline)</p>
          <p><strong>Expiry Date:</strong> Any future date (e.g., 12/25)</p>
          <p><strong>CVV:</strong> Any 3 digits (e.g., 123)</p>
        </div>
      </div>*/}

      {/* Separate Card Input Fields */}
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
                  setMessage("❌ " + event.error.message);
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
                    setMessage("❌ " + event.error.message);
                  } else {
                    setMessage("");
                  }
                }}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CVV/CVC *
            </label>
            <div className="border border-gray-300 rounded-lg p-4 bg-white">
              <CardCvcElement
                options={CARD_ELEMENT_OPTIONS}
                onChange={(event) => {
                  if (event.error) {
                    setMessage("❌ " + event.error.message);
                  } else {
                    setMessage("");
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`p-4 rounded-lg text-sm ${
          message.startsWith('✅') 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      {/* Submit Button */}
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
          `Pay LKR ${assessmentFee.toLocaleString()} Securely`
        )}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Your payment information is secure and encrypted
      </p>
    </form>
  );
}

export default function LandAssessmentStripePayment() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [message, setMessage] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [paymentError, setPaymentError] = useState("");
  
  // Land details
  const [landData, setLandData] = useState({
    size: "",
    location: ""
  });

  const handleLandInputChange = (e) => {
    const { name, value } = e.target;
    
    // If it's the size field, validate it's positive
    if (name === 'size') {
      const numValue = parseFloat(value);
      if (value !== '' && (isNaN(numValue) || numValue <= 0)) {
        setMessage("⚠️ Land size must be positive.");
      } else {
        setMessage("");
      }
    }
    
    setLandData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationSelect = (location) => {
    setLandData(prev => ({
      ...prev,
      location: location
    }));
  };

  const proceedToPayment = () => {
    if (!landData.size || !landData.location) {
      setMessage("⚠️ Please fill in all land details.");
      return;
    }

    // Validate land size is positive
    const sizeValue = parseFloat(landData.size);
    if (isNaN(sizeValue) || sizeValue <= 0) {
      setMessage("⚠️ Land size must be positive.");
      return;
    }
    
    setMessage("");
    setCurrentStep(2);
  };

  const goBackToLandDetails = () => {
    setCurrentStep(1);
    setMessage("");
  };

  const handlePaymentSuccess = (paymentResultData) => {
    // Store payment result for popup
    setPaymentResult(paymentResultData);
    
    // Show success popup instead of inline message
    setShowSuccessPopup(true);
    
    // Reset form
    setLandData({ size: "", location: "" });
    setCurrentStep(1);
  };

  const handlePaymentError = (error) => {
    console.error("Payment failed:", error);
    
    // Store error message for popup
    setPaymentError(error);
    
    // Show error popup
    setShowErrorPopup(true);
  };

  const handleSuccessPopupClose = () => {
    setShowSuccessPopup(false);
    setPaymentResult(null);
    
    // Redirect to dashboard
    navigate("/landownerdashboard");
  };

  const handleErrorPopupClose = () => {
    setShowErrorPopup(false);
    setPaymentError("");
    
    // Stay on the payment page for retry
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 flex justify-center items-center p-4">
        <div className="w-full max-w-2xl bg-white p-8 shadow-lg rounded-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Land Assessment Request & Payment
            </h1>
            <p className="text-gray-600">
              Complete your land assessment request with secure payment processing
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 1 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                1
              </div>
              <div className="w-12 h-1 bg-gray-300 mx-2">
                <div className={`h-1 transition-all duration-300 ${
                  currentStep >= 2 ? 'bg-green-500 w-full' : 'bg-green-500 w-0'
                }`}></div>
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 2 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                2
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <span className="text-sm text-gray-600">
              {currentStep === 1 ? 'Step 1: Land Details' : 'Step 2: Secure Payment'}
            </span>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`p-4 rounded-lg mb-6 text-sm ${
              message.startsWith('✅') 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : message.startsWith('⚠️')
                ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          {/* Step 1: Land Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Land Size (Acres) *
                  </label>
                  <input
                    type="number"
                    name="size"
                    placeholder="e.g., 5.5"
                    value={landData.size}
                    onChange={handleLandInputChange}
                    min="0.1"
                    step="0.1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-green-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assessment Fee
                  </label>
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-semibold">
                    LKR {5000}
                  </div>
                  
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Land Location *
                </label>
                <MapLocationPicker
                  onLocationSelect={handleLocationSelect}
                  initialLocation={landData.location}
                />
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">What's Included:</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Soil pH analysis</li>
                  <li>• Nutrient level assessment</li>
                  <li>• Crop recommendations</li>
                  <li>• Environmental data analysis</li>
                  <li>• Detailed report within 7 days</li>
                </ul>
              </div>

              <button
                type="button"
                onClick={proceedToPayment}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition duration-200"
              >
                Proceed to Secure Payment
              </button>
            </div>
          )}

          {/* Step 2: Stripe Payment */}
          {currentStep === 2 && (
            <Elements stripe={stripePromise}>
              <div className="space-y-6">
                <div className="flex gap-4 mb-6">
                  <button
                    type="button"
                    onClick={goBackToLandDetails}
                    className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition duration-200"
                  >
                    Back to Land Details
                  </button>
                </div>
                
                <StripePaymentForm
                  landData={landData}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </div>
            </Elements>
          )}
        </div>
      </div>

      {/* Success Popup */}
      <PaymentSuccessPopup
        isVisible={showSuccessPopup}
        onClose={handleSuccessPopupClose}
        transactionId={paymentResult?.transaction_id}
      />

      {/* Error Popup */}
      <PaymentErrorPopup
        isVisible={showErrorPopup}
        onClose={handleErrorPopupClose}
        errorMessage={paymentError}
      />
    </div>
  );
}
