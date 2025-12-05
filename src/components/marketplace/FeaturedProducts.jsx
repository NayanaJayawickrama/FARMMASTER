import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useProducts } from "../financialmanagerdashboard/ProductContext";

const FeaturedProducts = () => {
  const scrollRef = useRef(null);
  const { products } = useProducts();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Show only featured products that are not unavailable
  const filteredProducts = products.filter(
    (product) => product.is_featured && product.status !== "unavailable"
  );

  const productsPerView = 3;
  const totalPages = Math.ceil(filteredProducts.length / productsPerView);

  const scroll = (direction) => {
    if (direction === "left") {
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
    } else {
      setCurrentIndex((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
    }
  };

  const getCurrentProducts = () => {
    const startIndex = currentIndex * productsPerView;
    return filteredProducts.slice(startIndex, startIndex + productsPerView);
  };

  const currentProducts = getCurrentProducts();

  return (
    <section className="flex justify-center py-20 px-4 md:px-10 mt-15">
      <div className="bg-white rounded-2xl max-w-6xl w-full p-10 relative shadow-2xl">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-10 text-green-700 drop-shadow-lg">
          Featured Products
        </h2>

        {filteredProducts.length === 0 ? (
          <p className="text-gray-600 text-center">
            No featured products available at the moment.
          </p>
        ) : (
          <>
            {/* Navigation Arrows */}
            {totalPages > 1 && (
              <>
                <button
                  onClick={() => scroll("left")}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() => scroll("right")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {/* Product Grid - Dynamic columns based on available products */}
            <div
              className={`grid gap-8 px-1 ${
                currentProducts.length === 1
                  ? "grid-cols-1 justify-items-center"
                  : currentProducts.length === 2
                  ? "grid-cols-1 md:grid-cols-2"
                  : "grid-cols-1 md:grid-cols-3"
              }`}
            >
              {currentProducts.map((product, index) => (
                <div
                  key={`${currentIndex}-${index}`}
                  className="bg-white border border-green-200 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 h-[280px] flex flex-col justify-between relative max-w-sm mx-auto w-full"
                >
                  <div>
                    <img
                      src={product.image_url || ""}
                      alt={product.name}
                      className="w-28 h-28 mx-auto mb-4 object-contain"
                    />
                    <h3 className="text-lg font-semibold text-green-700 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {product.description || "No description available"}
                    </p>
                  </div>

                  {/* Show 'Sold Out' badge if product.status is sold */}
                  {product.status === "sold" && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                      Sold Out
                    </span>
                  )}

                  {/* Price display */}
                  <div className="mt-auto">
                    <p className="text-green-600 font-semibold text-lg">
                      Rs. {parseFloat(product.price || 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Dots */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "bg-green-600 scale-125"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Product counter */}
            {totalPages > 1 && (
              <div className="text-center mt-4">
                <p className="text-sm text-gray-500">
                  Showing{" "}
                  {currentIndex * productsPerView + 1} -{" "}
                  {Math.min(
                    (currentIndex + 1) * productsPerView,
                    filteredProducts.length
                  )}{" "}
                  of {filteredProducts.length} featured products
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
           
