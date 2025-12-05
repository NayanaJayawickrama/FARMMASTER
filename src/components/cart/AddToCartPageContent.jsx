import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useCart } from "./CartContext";
import { useAuth } from "../../context/AuthContext";
import { HashLink } from "react-router-hash-link";
import { Link } from "react-router-dom";
import placeholderImg from "../../assets/images/marketplaceimages/vegetables.jpg";

const AddToCartPageContent = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, isInitialized, reloadCart } = useCart();
  const { user } = useAuth();
  const [quantityWarning, setQuantityWarning] = useState({
    show: false,
    message: "",
    itemName: "",
    maxQuantity: 0
  });

  // Force reload cart when component mounts and user is available
  useEffect(() => {
    if (user?.id) {
      // Check if cart should be reloaded from cookies
      console.log('Cart page loaded for user:', user.id);
      
      // Small delay to ensure cookie context is fully loaded
      setTimeout(() => {
        if (cartItems.length === 0) {
          console.log('Cart is empty, attempting to reload from cookies...');
          reloadCart();
        }
      }, 100);
    }
  }, [user?.id]);

  const subTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subTotal > 0 ? 250 : 0;
  const total = subTotal + shipping;

  // Show loading state while cart is initializing
  if (!isInitialized) {
    return (
      <div className="p-4 md:p-10 font-poppins bg-white min-h-screen">
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  const validateAndUpdateQuantity = async (itemName, newQuantity) => {
    try {
      const item = cartItems.find(cartItem => cartItem.name === itemName);
      if (!item) return;

      // First check if we need to get fresh product data to check available quantity
      const rootUrl = import.meta.env.VITE_API_URL;
      
      // Get current product data to check available quantity
      const productResponse = await fetch(`${rootUrl}/api/products/${item.id || item.product_id}`, {
        method: 'GET',
        credentials: 'include'
      });

      if (productResponse.ok) {
        const productData = await productResponse.json();
        const availableQuantity = productData.data?.quantity || 0;
        
        console.log('Current available quantity:', availableQuantity, 'Requested:', newQuantity);
        
        // If requested quantity is within available stock, update directly
        if (newQuantity <= availableQuantity) {
          console.log('Quantity check passed, updating cart');
          updateQuantity(itemName, newQuantity);
          return;
        } else {
          // Show warning if exceeds available stock
          setQuantityWarning({
            show: true,
            message: `Only ${availableQuantity} Kg available for ${itemName}`,
            itemName: itemName,
            maxQuantity: availableQuantity
          });
          return;
        }
      }

      // Fallback to API validation if product fetch fails
      const response = await fetch(`${rootUrl}/api/products/validate-quantity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          product_id: item.id || item.product_id,
          quantity: newQuantity
        })
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        updateQuantity(itemName, newQuantity);
      } else {
        // Show warning popup
        const errorData = data.data || {};
        setQuantityWarning({
          show: true,
          message: `Only ${errorData.available_quantity || 0} Kg available for ${itemName}`,
          itemName: itemName,
          maxQuantity: errorData.available_quantity || 0
        });
      }
    } catch (error) {
      console.error('Error validating quantity:', error);
      // Still update quantity if validation fails (fallback)
      updateQuantity(itemName, newQuantity);
    }
  };

  const handleQuantityIncrease = (itemName, currentQuantity) => {
    validateAndUpdateQuantity(itemName, currentQuantity + 1);
  };

  const handleQuantityDecrease = (itemName, currentQuantity) => {
    if (currentQuantity > 1) {
      updateQuantity(itemName, currentQuantity - 1);
    }
  };

  return (
    <div className="p-4 md:p-10 font-poppins bg-white min-h-screen">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-10 text-center md:text-left text-black">
        Shopping Cart
      </h2>

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1">
          {cartItems.length === 0 ? (
            <div className="text-center mt-10">
              <p className="text-gray-600 mb-4">Your cart is empty.</p>
              <p className="text-sm text-gray-500">
                Items you add to your cart will be saved for your next visit.
              </p>
            </div>
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
                        e.target.onerror = null;
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
                      onClick={() => handleQuantityDecrease(item.name, item.quantity)}
                      className="px-2 py-1 border rounded hover:bg-gray-100"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span>{item.quantity} Kg</span>
                    <button
                      onClick={() => handleQuantityIncrease(item.name, item.quantity)}
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

      {/* Quantity Warning Popup - Fixed styling */}
      {quantityWarning.show && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4 text-center border-2 border-orange-500">
            <div className="text-4xl mb-4 text-orange-500">⚠️</div>
            <h2 className="text-lg font-bold mb-3 text-orange-800">
              Quantity Limit Reached
            </h2>
            <p className="text-orange-700 mb-4">
              {quantityWarning.message}
            </p>
            <div className="bg-orange-50 p-3 rounded-lg mb-4 text-sm">
              <p className="text-orange-700">
                <strong>Maximum available:</strong> {quantityWarning.maxQuantity} Kg
              </p>
              <p className="text-green-600 font-medium mt-2">
                The quantity has been set to the maximum available amount
              </p>
            </div>
            <button
              onClick={() => setQuantityWarning({ ...quantityWarning, show: false })}
              className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddToCartPageContent;
