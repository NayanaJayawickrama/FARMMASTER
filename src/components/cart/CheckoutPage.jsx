import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { useCart } from "./CartContext";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import placeholderImg from "../../assets/images/marketplaceimages/vegetables.jpg";
import CartPaymentSuccessPopup from "../alerts/CartPaymentSuccessPopup";
import CartPaymentErrorPopup from "../alerts/CartPaymentErrorPopup";
import MockStripePayment from "./MockStripePayment";

// Initialize Stripe
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

function PaymentForm({ cartItems, totalAmount, onSuccess, onError }) {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const rootUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    if (!shippingAddress.trim()) {
      setMessage("❌ Please enter a shipping address");
      return;
    }

    setLoading(true);
    setMessage("");

    console.log("=== PAYMENT PROCESS STARTED ===");
    
    const testUserId = user?.id || 33; // Buyer user ID

    try {
      // Check if user is authenticated
      if (!user) {
        throw new Error("Please log in to complete your purchase");
      }

      if (user.role !== 'Buyer') {
        throw new Error("Only buyers can make purchases. Please log in with a buyer account.");
      }

      // Step 1: Create order
      const cartItemsForBackend = cartItems.map(item => ({
        product_id: item.product_id || item.id,
        quantity: item.quantity
      }));

      console.log("=== ORDER CREATION DATA ===");
      console.log("Cart items for backend:", cartItemsForBackend);
      console.log("User ID:", testUserId);
      console.log("User:", user);
      console.log("Shipping address:", shippingAddress);
      console.log("API URL:", rootUrl);

      let orderResponse;
      
      try {
        console.log("Making order creation request...");
        orderResponse = await axios.post(`${rootUrl}/api/orders`, {
          user_id: testUserId,
          cart_items: cartItemsForBackend,
          shipping_address: shippingAddress,
          order_notes: "Order placed through checkout"
        }, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        });

        console.log("=== ORDER CREATION RESPONSE ===");
        console.log("Status:", orderResponse.status);
        console.log("Response data:", orderResponse.data);
      } catch (orderError) {
        console.error("=== ORDER CREATION FAILED ===");
        console.error("Error:", orderError);
        console.error("Response status:", orderError.response?.status);
        console.error("Response data:", orderError.response?.data);
        console.error("Response headers:", orderError.response?.headers);
        
        // Handle authentication error specifically
        if (orderError.response?.status === 401) {
          throw new Error("Your session has expired. Please log in again to complete your purchase.");
        }
        
        const errorMessage = orderError.response?.data?.message || orderError.message || "Failed to create order";
        console.error("Final error message:", errorMessage);
        throw new Error(errorMessage);
      }

      console.log("=== CHECKING ORDER RESPONSE STATUS ===");
      console.log("Response data status:", orderResponse.data?.status);
      console.log("Full response data:", orderResponse.data);
      
      if (orderResponse.data.status !== "success") {
        console.error("=== ORDER RESPONSE STATUS NOT SUCCESS ===");
        console.error("Expected: 'success', Got:", orderResponse.data.status);
        console.error("Response message:", orderResponse.data.message);
        console.error("Full response data:", JSON.stringify(orderResponse.data, null, 2));
        throw new Error(orderResponse.data.message || "Failed to create order");
      }

      const orderId = orderResponse.data.data.order_id;
      const orderNumber = orderResponse.data.data.order_number;

      console.log("Order created successfully. ID:", orderId, "Number:", orderNumber);

      // Step 2: Create payment intent
      console.log("Creating payment intent...");
      
      let paymentIntentResponse;
      
      try {
        paymentIntentResponse = await axios.post(`${rootUrl}/api/payments/process`, {
          action: "create_payment_intent",
          user_id: testUserId,
          payment_type: "cart_purchase",
          cart_order_id: orderId,
          amount: totalAmount
        }, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        });

        console.log("Payment intent response:", paymentIntentResponse.data);
      } catch (paymentIntentError) {
        console.error("Payment intent creation failed:", paymentIntentError);
        console.error("Payment intent error response:", paymentIntentError.response?.data);
        throw new Error(paymentIntentError.response?.data?.message || paymentIntentError.message || "Failed to create payment intent");
      }

      if (paymentIntentResponse.data.status !== "success") {
        throw new Error(paymentIntentResponse.data.message || "Failed to create payment intent");
      }

      const clientSecret = paymentIntentResponse.data.data.client_secret;
      const paymentIntentId = paymentIntentResponse.data.data.payment_intent_id;

      console.log("Payment intent created. ID:", paymentIntentId);

      // Step 3: Confirm payment with Stripe
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
        // Step 4: Confirm payment on backend
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
            amount: totalAmount,
            order_number: orderNumber
          });
        } else {
          throw new Error(confirmResponse.data.message);
        }
      } else {
        throw new Error(`Payment not completed. Status: ${paymentIntent.status}`);
      }

    } catch (error) {
      console.error("Payment error:", error);
      console.error("Error details:", error.response?.data);
      console.error("Error status:", error.response?.status);
      
      // Handle specific error cases
      if (error.response?.status === 401 || error.message.includes("session has expired") || error.message.includes("Authentication required")) {
        setMessage("❌ Your session has expired. Redirecting to login...");
        onError("Your session has expired. Please log in again to complete your purchase.");
        // Clear localStorage and redirect to login after a delay
        setTimeout(() => {
          logout();
          window.location.href = '/login';
        }, 3000);
      } else if (error.response?.status === 403) {
        setMessage("❌ Access denied. Please check your account permissions.");
        onError("Access denied. Please check your account permissions.");
      } else if (error.message.includes("session has expired")) {
        setMessage("❌ Your session has expired. Redirecting to login...");
        onError("Session expired. Please log in again.");
        setTimeout(() => {
          logout();
          window.location.href = '/login';
        }, 2000);
      } else if (error.response?.data?.message) {
        // Use the backend error message if available
        setMessage(`❌ ${error.response.data.message}`);
        onError(error.response.data.message);
      } else {
        setMessage(`❌ ${error.message || "There was an error processing your payment. Please try again."}`);
        onError(error.message || "There was an error processing your payment. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div className={`p-3 rounded-lg text-sm ${message.includes('❌') ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
          {message}
        </div>
      )}

      {/* Shipping Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Shipping Address *
        </label>
        <textarea
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          placeholder="Enter your complete shipping address..."
          className="w-full border border-gray-300 rounded-lg p-3 bg-white resize-none"
          rows="3"
          required
        />
      </div>

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
            CVV *
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

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Processing Payment...
          </>
        ) : (
          `Pay ${totalAmount.toFixed(2)} LKR`
        )}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Your payment information is secure and encrypted
      </p>
    </form>
  );
}

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [paymentError, setPaymentError] = useState("");
  const [sessionValid, setSessionValid] = useState(true);
  const [sessionChecking, setSessionChecking] = useState(true);
  const [stripeAvailable, setStripeAvailable] = useState(true);

  // Check Stripe connectivity
  useEffect(() => {
    const checkStripeConnectivity = async () => {
      try {
        const response = await fetch('https://js.stripe.com/v3/', { 
          mode: 'no-cors', 
          method: 'HEAD',
          cache: 'no-cache'
        });
        setStripeAvailable(true);
      } catch (error) {
        console.log('Stripe not accessible, using mock payment system');
        setStripeAvailable(false);
      }
    };
    
    checkStripeConnectivity();
  }, []);

  // Check session validity when component mounts
  useEffect(() => {
    const checkSession = async () => {
      if (!user) {
        setSessionValid(false);
        setSessionChecking(false);
        return;
      }

      try {
        // Try making a simple authenticated request to verify session
        const rootUrl = import.meta.env.VITE_API_URL || "http://localhost/v/FARMMASTER-Backend";
        const response = await axios.get(`${rootUrl}/api/products`, {
          withCredentials: true
        });
        
        if (response.status === 200) {
          setSessionValid(true);
        }
      } catch (error) {
        console.log("Session check failed:", error.response?.status);
        if (error.response?.status === 401) {
          setSessionValid(false);
        }
      }
      
      setSessionChecking(false);
    };

    checkSession();
  }, [user]);

  const subTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subTotal > 0 ? 250 : 0;
  const total = subTotal + shipping;

  const handlePaymentSuccess = (paymentResultData) => {
    setPaymentResult(paymentResultData);
    setShowSuccessPopup(true);
  };

  const handlePaymentError = (errorMessage) => {
    setPaymentError(errorMessage);
    setShowErrorPopup(true);
  };

  const handleSuccessPopupClose = () => {
    setShowSuccessPopup(false);
    clearCart(); // Clear cart after successful payment
    navigate("/buyerdashboard"); // Navigate to dashboard
  };

  const handleErrorPopupClose = () => {
    setShowErrorPopup(false);
  };

  // Show loading while checking session
  if (sessionChecking) {
    return (
      <div className="min-h-screen bg-white p-4 md:p-10 font-poppins flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Check if session is invalid
  if (!sessionValid || !user) {
    return (
      <div className="min-h-screen bg-white p-4 md:p-10 font-poppins flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4 text-black">Session Expired</h1>
          <p className="text-gray-600 mb-6">Your session has expired. Please log in again to complete your purchase.</p>
          <Link
            to="/login"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition mr-4"
          >
            Login Again
          </Link>
          <Link
            to="/marketplace"
            className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition"
          >
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  // Check if user is logged in and has buyer role
  if (!user) {
    return (
      <div className="min-h-screen bg-white p-4 md:p-10 font-poppins flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4 text-black">Login Required</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to complete your purchase.</p>
          <Link
            to="/login"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (user.role !== 'Buyer') {
    return (
      <div className="min-h-screen bg-white p-4 md:p-10 font-poppins flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4 text-black">Access Denied</h1>
          <p className="text-gray-600 mb-6">Only buyers can make purchases. Please log in with a buyer account.</p>
          <Link
            to="/login"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition mr-4"
          >
            Login as Buyer
          </Link>
          <Link
            to="/marketplace"
            className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition"
          >
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-10 font-poppins">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-black">
        Checkout
      </h1>
    
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1px_1fr] gap-8 mt-8">
        
        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Order Summary</h2>

          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Your cart is empty.</p>
              <Link
                to="/marketplace"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={item.image_url || item.image || placeholderImg}
                      alt={item.name || "Product image"}
                      className="w-16 h-16 object-contain rounded-md"
                      onError={(e) => {
                        e.target.src = placeholderImg;
                        e.target.onerror = null;
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        {item.quantity} Kg × LKR {item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">
                        LKR {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>LKR {subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span>LKR {shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-green-700 border-t pt-2">
                  <span>Total</span>
                  <span>LKR {total.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Divider */}
        <div className="hidden lg:block h-full w-px bg-gray-200"></div>

        {/* Payment Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Payment Details</h2>
          
          {cartItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Add items to your cart to proceed with payment.
            </div>
          ) : stripeAvailable ? (
            <Elements stripe={stripePromise}>
              <PaymentForm
                cartItems={cartItems}
                totalAmount={total}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </Elements>
          ) : (
            <MockStripePayment
              orderData={{
                orderId: Date.now(), // Temporary order ID for mock
                orderNumber: `ORD${Date.now()}`,
                totalAmount: total
              }}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          )}

          {/* Test Card Information */}
          <div className="mt-8 bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-blue-800">
                {stripeAvailable ? "🌐 Live Stripe Payment" : "🧪 Mock Payment Mode"}
              </span>
            </div>
            <div className="text-sm text-blue-700 space-y-1">
              {stripeAvailable ? (
                <>
                  <p><strong>Card Number:</strong> 4242 4242 4242 4242 (Success)</p>
                  <p><strong>Card Number:</strong> 4000 0000 0000 0002 (Decline)</p>
                  <p><strong>Expiry Date:</strong> Any future date (e.g., 12/25)</p>
                  <p><strong>CVV:</strong> Any 3 digits (e.g., 123)</p>
                </>
              ) : (
                <>
                  <p><strong>Network Issue:</strong> Cannot reach Stripe servers</p>
                  <p><strong>Solution:</strong> Using mock payment for development</p>
                  <p><strong>Note:</strong> No real payment will be processed</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    
      {/* Back to Cart Button */}
      <div className="mt-8">
        <Link
          to="/buyercart"
          className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition"
        >
          <ArrowLeft size={18} />
          Back to Cart
        </Link>
      </div>

      {/* Success Popup */}
      <CartPaymentSuccessPopup
        isVisible={showSuccessPopup}
        onClose={handleSuccessPopupClose}
        orderData={paymentResult}
      />

      {/* Error Popup */}
      <CartPaymentErrorPopup
        isVisible={showErrorPopup}
        onClose={handleErrorPopupClose}
        errorMessage={paymentError}
      />
    </div>
  );
}
