import React from "react";
import { useCart } from "./CartContext";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import placeholderImg from "../../assets/images/marketplaceimages/vegetables.jpg";

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
    
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1px_1fr] gap-6 mt-12">
        
        <div className="bg-white p-5 rounded-md shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

          {cartItems.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            cartItems.map((item, index) => (
              <div key={index} className="mb-3 flex items-center gap-4">
                <img
                  src={item.image_url || item.image || placeholderImg}
                  alt={item.name || "Product image"}
                  className="w-14 h-14 object-contain rounded-md"
                  onError={(e) => {
                    e.target.src = placeholderImg;
                    e.target.onerror = null; // Prevent infinite loop
                  }}
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

      
        <div className="hidden lg:block h-full w-px bg-black mx-auto"></div>

        
        <div className="p-5 rounded-md shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Pay Here</h2>
          <p className="text-sm text-gray-600 mb-4">
            Enter your card details below to complete the payment securely.
          </p>

          
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
