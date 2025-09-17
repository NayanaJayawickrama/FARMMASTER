import React from "react";
import { X } from "lucide-react";
import { useCart } from "./CartContext";
import { HashLink } from "react-router-hash-link";
import { Link } from "react-router-dom";
import placeholderImg from "../../assets/images/marketplaceimages/vegetables.jpg";

const AddToCartPageContent = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();

  const subTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subTotal > 0 ? 250 : 0;
  const total = subTotal + shipping;

  return (
    <div className="p-4 md:p-10 font-poppins bg-white min-h-screen">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-10 text-center md:text-left text-black">
        Shopping Cart
      </h2>

      <div className="flex flex-col lg:flex-row gap-10">
        
        <div className="flex-1">
          {cartItems.length === 0 ? (
            <p className="text-gray-600 text-center mt-10">
              Your cart is empty.
            </p>
          ) : (
            <>
              
              <div className="grid grid-cols-2 md:grid-cols-6 text-gray-500 font-semibold border-b pb-3 mb-4 text-sm">
                <span className="col-span-2">Item</span>
                <span className="hidden md:block">Price</span>
                <span className="hidden md:block">Quantity</span>
                <span className="hidden md:block">Total</span>
                <span className="hidden md:block"></span>
              </div>

              
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 md:grid-cols-6 items-center gap-4 border-b py-4 text-sm"
                >
                  
                  <div className="col-span-2 flex items-center gap-4">
                    <img
                      src={item.image_url || item.image || placeholderImg}
                      alt={item.name || "Product image"}
                      className="w-16 h-16 object-contain"
                      onError={(e) => {
                        e.target.src = placeholderImg;
                        e.target.onerror = null; // Prevent infinite loop
                      }}
                    />
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      
                      <div className="md:hidden mt-2 text-gray-700 text-sm">
                        <p>Price: Rs. {item.price.toFixed(2)}</p>
                        <p>Total: Rs. {(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                
                  <span className="text-gray-700 hidden md:block">
                    Rs. {item.price.toFixed(2)}
                  </span>

                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.name, item.quantity - 1)}
                      className="px-2 py-1 border rounded hover:bg-gray-100"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span>{item.quantity} Kg</span>
                    <button
                      onClick={() => updateQuantity(item.name, item.quantity + 1)}
                      className="px-2 py-1 border rounded hover:bg-gray-100"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  
                  <span className="text-green-700 font-semibold hidden md:block">
                    Rs. {(item.price * item.quantity).toFixed(2)}
                  </span>

                
                  <div className="flex justify-end">
                    <button
                      onClick={() => removeFromCart(item.name)}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Remove item"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        
        <div className="w-full lg:w-1/3 bg-gray-50 p-6 rounded-md shadow-sm h-fit text-sm">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Order Summary
          </h3>
          <div className="flex justify-between mb-2 text-gray-700">
            <span>Subtotal</span>
            <span>Rs. {subTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2 text-gray-700">
            <span>Shipping</span>
            <span>Rs. {shipping.toFixed(2)}</span>
          </div>
          <hr className="my-3" />
          <div className="flex justify-between text-base font-bold">
            <span>Total</span>
            <span className="text-green-700">Rs. {total.toFixed(2)}</span>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Link to="/checkoutpage">
              <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
                Proceed to Checkout
              </button>
            </Link>

            <HashLink smooth to="/marketplace#vegetables">
              <button className="w-full border border-gray-400 text-gray-700 py-2 rounded hover:bg-gray-200 transition">
                Continue Shopping
              </button>
            </HashLink>

            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="text-sm text-red-500 hover:underline mt-2"
              >
                Clear Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToCartPageContent;
