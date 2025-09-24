import React, { useState, useEffect } from "react";
import { useCart } from "../cart/CartContext";
import { useProducts } from "../financialmanagerdashboard/ProductContext";
import { useAuth } from "../../context/AuthContext";
import { useSearch } from "../../context/SearchContext";
import { useNavigate } from "react-router-dom";

import rightImg from "../../assets/images/marketplaceimages/right-veg.png";
import leftImg from "../../assets/images/marketplaceimages/left-veg1.png";

const VegetableSection = () => {
  const { products, forceRefresh } = useProducts(); // Add forceRefresh
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { searchQuery } = useSearch();
  const navigate = useNavigate();

  const [quantities, setQuantities] = useState([]);
  const [showPopup, setShowPopup] = useState(false); 
  const [showRolePopup, setShowRolePopup] = useState(false);
  const [quantityPopup, setQuantityPopup] = useState({
    show: false,
    message: "",
    availableQuantity: 0,
    requestedQuantity: 0,
    cropName: ""
  });

  useEffect(() => {
    setQuantities(products.map(() => 1));
  }, [products]);

  const increaseQuantity = (index) => {
    setQuantities((prev) => prev.map((q, i) => (i === index ? q + 1 : q)));
  };

  const decreaseQuantity = (index) => {
    setQuantities((prev) =>
      prev.map((q, i) => (i === index && q > 1 ? q - 1 : q))
    );
  };

  const validateQuantity = async (product, requestedQuantity) => {
    try {
      const rootUrl = import.meta.env.VITE_API_URL;
      
      // Debug: Log what we're sending
      console.log('Validation request:', {
        product_id: product.id || product.product_id,
        quantity: requestedQuantity,
        product_name: product.name,
        current_quantity_shown: product.quantity
      });
      
      const response = await fetch(`${rootUrl}/api/products/validate-quantity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          product_id: product.id || product.product_id,
          quantity: requestedQuantity
        })
      });

      const data = await response.json();
      
      // Debug: Log what we received
      console.log('Validation response:', data);
      
      return data;
    } catch (error) {
      console.error('Error validating quantity:', error);
      return {
        status: 'error',
        message: 'Failed to validate quantity. Please try again.'
      };
    }
  };

  const handleAddToCart = async (product, quantity) => {
    console.log('Add to cart attempt:', {
      product: product,
      requested_quantity: quantity,
      product_id: product.id || product.product_id,
      available_quantity: product.quantity
    });
    
    if (!user || !user.id) {
      console.log('User not logged in, showing register popup');
      setShowPopup(true);
      return;
    }
    
    if (user.role !== "Buyer" && user.role !== "buyer") {
      console.log('User is not a buyer, showing role popup');
      setShowRolePopup(true);
      return;
    }

    // First check locally - if requested quantity is within available, proceed directly
    if (quantity <= product.quantity) {
      console.log('Quantity check passed locally, adding to cart:', product, 'quantity:', quantity);
      addToCart(product, quantity);
      
      // Refresh products after successful addition to get updated quantities
      setTimeout(() => {
        console.log('Refreshing products after cart addition...');
        forceRefresh();
      }, 1000);
      
      // Show success message
      setQuantityPopup({
        show: true,
        message: `${quantity} Kg of ${product.name} added to cart successfully!`,
        availableQuantity: product.quantity,
        requestedQuantity: quantity,
        cropName: product.name,
        type: 'success'
      });
      return;
    }

    // If local check fails, validate with backend
    const validationResult = await validateQuantity(product, quantity);
    
    console.log('Validation result:', validationResult);
    
    if (validationResult.status === 'success') {
      console.log('Adding to cart:', product, 'quantity:', quantity);
      addToCart(product, quantity);
      
      // Show success message
      setQuantityPopup({
        show: true,
        message: `${quantity} Kg of ${product.name} added to cart successfully!`,
        availableQuantity: validationResult.data?.available_quantity || product.quantity,
        requestedQuantity: quantity,
        cropName: product.name,
        type: 'success'
      });
    } else {
      // Show error popup with available quantity info
      const errorData = validationResult.data || {};
      console.log('Quantity validation failed:', {
        errorData,
        available_from_response: errorData.available_quantity,
        available_from_product: product.quantity
      });
      
      setQuantityPopup({
        show: true,
        message: validationResult.message || `Only ${errorData.available_quantity || product.quantity} Kg available for ${product.name}`,
        availableQuantity: errorData.available_quantity || product.quantity,
        requestedQuantity: errorData.requested_quantity || quantity,
        cropName: errorData.crop_name || product.name,
        type: 'error'
      });
    }
  };

  // Filter products based on search query
  const filterProducts = (products, query) => {
    if (!query || query.trim() === '') {
      return products;
    }
    
    const searchTerm = query.toLowerCase().trim();
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category?.toLowerCase().includes(searchTerm)
    );
  };

  const availableProducts = products.filter(
    (item) => item.status === "available" || item.quantity === 0
  );

  const filteredProducts = filterProducts(availableProducts, searchQuery);

  // Add refresh on component focus/mount
  useEffect(() => {
    const handleFocus = () => {
      console.log('Window focused, refreshing products...');
      forceRefresh();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [forceRefresh]);

  return (
    <section
      id="vegetables"
      className="relative flex justify-center py-20 px-4 md:px-10"
    >
      <div className="bg-white rounded-2xl max-w-5xl w-full pt-0 pb-10 overflow-hidden relative shadow-2xl">
        <div className="bg-green-600 text-white text-center py-10 px-4 relative rounded-t-2xl">
          <h2 className="text-3xl md:text-5xl font-extrabold drop-shadow-lg">
            {searchQuery ? `Search Results: "${searchQuery}"` : 'All Organic Vegetables'}
          </h2>
          {searchQuery && (
            <p className="text-green-100 mt-2">
              Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </p>
          )}
          <img
            src={leftImg}
            alt="Left Veg"
            className="absolute left-0 top-4 w-28 md:w-30 hidden md:block"
          />
          <img
            src={rightImg}
            alt="Right Veg"
            className="absolute right-0 top-0 w-20 md:w-26 hidden md:block"
          />
        </div>

        
        <div
          className="grid gap-8 px-8 mt-10"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}
        >
          {filteredProducts.map((item, index) => (
            <div
              key={item.id}
              className="rounded-xl shadow-lg border border-gray-200 p-6 flex flex-col justify-between items-center text-center h-[420px] bg-white transition hover:scale-105 hover:shadow-xl"
            >
              <img
                src={item.image_url || ""}
                alt={item.name}
                className="w-28 h-28 object-contain mb-2"
              />
              <h3 className="font-bold text-lg text-green-700 mb-1">{item.name}</h3>
              <p className="text-sm text-gray-600 mb-1">{item.description}</p>
              <p className="text-green-600 font-semibold text-md mb-2">
                Rs. {parseFloat(item.price).toFixed(2)}
              </p>
              
              {/* Available Quantity Display */}
              <p className="text-xs text-gray-500 mb-2">
                Available: {item.quantity} Kg
              </p>
              
              <div className="border mt-1 rounded flex justify-between items-center w-32 text-sm whitespace-nowrap">
                <button
                  className="px-3 cursor-pointer"
                  onClick={() => decreaseQuantity(index)}
                  disabled={item.quantity === 0}
                >
                  -
                </button>
                <span className="px-2">{quantities[index]} Kg</span>
                <button
                  className="px-3 cursor-pointer"
                  onClick={() => increaseQuantity(index)}
                  disabled={item.quantity === 0}
                >
                  +
                </button>
              </div>
              
              {/* Enhanced Warning message if quantity exceeds available */}
              {quantities[index] > item.quantity && item.quantity > 0 && (
                <div className="mt-2 mb-1">
                  <p className="text-xs text-red-600 font-semibold bg-red-50 px-2 py-1 rounded border border-red-200">
                    Only {item.quantity} Kg available in stock!
                  </p>
                  <p className="text-xs text-red-500 mt-1">
                    Please adjust quantity to {item.quantity} Kg or less
                  </p>
                </div>
              )}

              {item.quantity === 0 ? (
                <button
                  disabled
                  className="mt-3 bg-red-500 text-white font-semibold px-4 py-1 rounded cursor-not-allowed text-sm"
                >
                  Sold Out
                </button>
              ) : (
                <button
                  onClick={() => handleAddToCart(item, quantities[index])}
                  className={`mt-3 font-semibold px-4 py-1 rounded text-sm cursor-pointer transition-colors ${
                    quantities[index] > item.quantity 
                      ? 'bg-orange-500 hover:bg-orange-600 text-white border-2 border-orange-600' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {quantities[index] > item.quantity ? 'Check Quantity' : 'Add to Cart'}
                </button>
              )}
            </div>
          ))}

          {filteredProducts.length === 0 && searchQuery && (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">Search</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No products found for "{searchQuery}"
              </h3>
              <p className="text-gray-500 mb-4">
                Try searching with different keywords or check the spelling
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Clear Search
              </button>
            </div>
          )}

          {filteredProducts.length === 0 && !searchQuery && (
            <p className="text-center col-span-full text-gray-600">
              No products to display at the moment.
            </p>
          )}
        </div>

        
        {showPopup && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center border border-green-600">
              <h2 className="text-lg font-bold mb-2 text-gray-800">
                Sign in as Buyer
              </h2>
              <p className="text-gray-600 mb-4">
                You must be logged in as a buyer to add items to your cart.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => navigate("/login")}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Register
                </button>
                <button
                  onClick={() => setShowPopup(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        
        {showRolePopup && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center border border-green-600">
              <h2 className="text-lg font-bold mb-2 text-gray-800">
                Access Restricted
              </h2>
              <p className="text-gray-600 mb-4">
                Only users with a Buyer account can add items to the cart.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowRolePopup(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quantity Validation Popup */}
        {quantityPopup.show && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className={`bg-white p-6 rounded-lg shadow-xl max-w-md w-full text-center border-2 ${
              quantityPopup.type === 'success' ? 'border-green-600' : 'border-red-600'
            }`}>
              <div className={`text-4xl mb-4 ${
                quantityPopup.type === 'success' ? 'text-green-600' : 'text-red-600'
              }`}>
                {quantityPopup.type === 'success' ? 'Success' : 'Warning'}
              </div>
              <h2 className={`text-lg font-bold mb-3 ${
                quantityPopup.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {quantityPopup.type === 'success' ? 'Added to Cart!' : 'Quantity Not Available'}
              </h2>
              <p className={`mb-4 ${
                quantityPopup.type === 'success' ? 'text-green-700' : 'text-red-700'
              }`}>
                {quantityPopup.message}
              </p>
              
              {quantityPopup.type === 'error' && (
                <div className="bg-gray-50 p-3 rounded-lg mb-4 text-sm">
                  <p><strong>Available:</strong> {quantityPopup.availableQuantity} Kg</p>
                  <p><strong>You requested:</strong> {quantityPopup.requestedQuantity} Kg</p>
                  <p className="text-green-600 font-medium mt-2">
                    Tip: Adjust the quantity to {quantityPopup.availableQuantity} Kg or less
                  </p>
                </div>
              )}
              
              <div className="flex justify-center gap-3">
                {quantityPopup.type === 'success' ? (
                  <>
                    <button
                      onClick={() => navigate('/buyercart')}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    >
                      View Cart
                    </button>
                    <button
                      onClick={() => setQuantityPopup({ ...quantityPopup, show: false })}
                      className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
                    >
                      Continue Shopping
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setQuantityPopup({ ...quantityPopup, show: false })}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                  >
                    Got it
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default VegetableSection;
