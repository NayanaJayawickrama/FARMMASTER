import React from "react";
import { useCart } from "./CartContext";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function CheckoutPage() {
  const { cartItems } = useCart();

  const subTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subTotal > 0 ? 250 : 0;
  const total = subTotal + shipping;

  return (
    <div className="min-h-screen bg-white p-4 md:p-10 font-poppins">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-black">
        Checkout
      </h1>

      {/* Customer Info Form */}
      <div className="space-y-4 max-w-3xl">
        <input
          type="text"
          placeholder="Name"
          className="w-full bg-green-50 px-4 py-3 rounded-md outline-none"
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full bg-green-50 px-4 py-3 rounded-md outline-none"
        />
        <input
          type="tel"
          placeholder="Phone"
          className="w-full bg-green-50 px-4 py-3 rounded-md outline-none"
        />
        <input
          type="text"
          placeholder="Address"
          className="w-full bg-green-50 px-4 py-3 rounded-md outline-none"
        />
        <input
          type="text"
          placeholder="City"
          className="w-full bg-green-50 px-4 py-3 rounded-md outline-none"
        />
        <input
          type="text"
          placeholder="Postal Code"
          className="w-full bg-green-50 px-4 py-3 rounded-md outline-none"
        />
        <input
          type="text"
          placeholder="Country"
          className="w-full bg-green-50 px-4 py-3 rounded-md outline-none"
        />
      </div>

      {/* Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1px_1fr] gap-6 mt-12">
        {/* Left Side: Order Summary */}
        <div className="bg-white p-5 rounded-md shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

          {cartItems.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            cartItems.map((item, index) => (
              <div key={index} className="mb-3 flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 object-contain rounded-md"
                />
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-green-700">
                    Quantity: {item.quantity}
                  </p>
                </div>
              </div>
            ))
          )}

          {/* Price Summary */}
          <div className="mt-6 space-y-2 text-sm text-black">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{subTotal.toFixed(2)} LKR</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping.toFixed(2)} LKR</span>
            </div>
            <hr className="my-2 border-black" />
            <div className="flex justify-between font-bold text-green-700">
              <span>Total</span>
              <span>{total.toFixed(2)} LKR</span>
            </div>
          </div>
        </div>

        {/* Divider Line */}
        <div className="hidden lg:block h-full w-px bg-black mx-auto"></div>

        {/* Right Side: Pay Here */}
        <div className="p-5 rounded-md shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Pay Here</h2>
          <p className="text-sm text-gray-600 mb-4">
            Enter your card details below to complete the payment securely.
          </p>

          {/* Card Number */}
          <label
            htmlFor="cardNumber"
            className="text-sm text-gray-700 font-medium block mb-1"
          >
            Card Number
          </label>
          <input
            id="cardNumber"
            type="text"
            placeholder="1234 5678 9012 3456"
            className="w-full bg-white border px-4 py-3 rounded-md mb-4 outline-none"
          />

          <div className="flex gap-4">
            {/* Expiry Date */}
            <div className="w-1/2">
              <label
                htmlFor="expiry"
                className="text-sm text-gray-700 font-medium block mb-1"
              >
                Expiry Date (MM/YY)
              </label>
              <input
                id="expiry"
                type="text"
                placeholder="MM / YY"
                className="w-full bg-white border px-4 py-3 rounded-md outline-none"
              />
            </div>

            {/* CVV */}
            <div className="w-1/2">
              <label
                htmlFor="cvv"
                className="text-sm text-gray-700 font-medium block mb-1"
              >
                CVV
              </label>
              <input
                id="cvv"
                type="text"
                placeholder="123"
                className="w-full bg-white border px-4 py-3 rounded-md outline-none"
              />
            </div>
          </div>

          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md mt-6 transition">
            Pay {total.toFixed(2)} LKR
          </button>
        </div>
      </div>
      {/* Back to Cart Button */}
      <div className="mt-8 mb-6">
        <Link
          to="/buyercart"
          className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md font-s hover:bg-green-700 transition"
        >
          <ArrowLeft size={18} />
          Back to Cart
        </Link>
      </div>
    </div>
  );
}
