import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useProducts } from "../financialmanagerdashboard/ProductContext";

const FeaturedProducts = () => {
  const scrollRef = useRef(null);
  const { products } = useProducts();

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollAmount = 240;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Show only featured products that are not unavailable
  const filteredProducts = products.filter(
    (product) => product.is_featured && product.status !== "unavailable"
  );

  return (
    <section className="flex justify-center py-20 px-4 md:px-10 mt-15">
      <div className="bg-white rounded-2xl max-w-6xl w-full p-10 relative shadow-2xl">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-10 text-green-700 drop-shadow-lg">
          Featured Products
        </h2>

        {/* Arrows for horizontal scroll (mobile only) */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-white p-2 rounded-full shadow hover:bg-gray-100 md:hidden"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-white p-2 rounded-full shadow hover:bg-gray-100 md:hidden"
        >
          <ChevronRight />
        </button>

        {/* Product list */}
        <div
          ref={scrollRef}
          className="grid gap-8 overflow-x-auto md:overflow-visible scrollbar-hide scroll-smooth px-1"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}
        >
          {filteredProducts.length === 0 ? (
            <p className="text-gray-600 text-center col-span-full">
              No featured products available at the moment.
            </p>
          ) : (
            filteredProducts.map((product, index) => (
              <div
                key={index}
                className="bg-white border border-green-200 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition h-[280px] flex-shrink-0 relative"
              >
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

                {/* Show 'Sold Out' badge if product.status is sold */}
                {product.status === "sold" && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                    Sold Out
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
