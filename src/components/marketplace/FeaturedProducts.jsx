import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import carrotImg from "../../assets/images/marketplaceimages/carrot.png";
import cabbageImg from "../../assets/images/marketplaceimages/cabbage.png";
import tomatoImg from "../../assets/images/marketplaceimages/tomato.png";
import leekImg from "../../assets/images/marketplaceimages/leeks.png";

const featuredProducts = [
  {
    name: "Organic Carrots",
    description: "Fresh and sweet farm carrots",
    image: carrotImg,
  },
  {
    name: "Organic Cabbage",
    description: "Crisp, green, and pesticide-free",
    image: cabbageImg,
  },
  {
    name: "Organic Tomatoes",
    description: "Juicy, ripe, and naturally grown",
    image: tomatoImg,
  },
  {
    name: "Organic Leeks",
    description: "Fresh, mild-flavored, and pesticide-free",
    image: leekImg,
  },
];

const FeaturedProducts = () => {
  const scrollRef = useRef(null);

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

  return (
    <section className="flex justify-center py-14 px-4 md:px-10">
      <div className="bg-[#F3FFF0] rounded-2xl max-w-6xl w-full p-8 relative">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-10">
          Featured Products
        </h2>

        {/* Arrows - only show on small screens */}
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

        {/* Product wrapper */}
        <div className="flex justify-center">
          <div
            ref={scrollRef}
            className="
              flex 
              md:grid 
              md:grid-cols-2 
              lg:grid-cols-4 
              gap-6 
              overflow-x-auto 
              md:overflow-visible 
              scrollbar-hide 
              scroll-smooth 
              px-1
            "
            style={{ scrollSnapType: "x mandatory" }}
          >
            {featuredProducts.map((product, index) => (
              <div
                key={index}
                className={`
                  flex-shrink-0 
                  scroll-snap-align-start 
                  w-[220px] h-[260px] 
                  bg-white 
                  border 
                  rounded-lg 
                  p-4 
                  text-center 
                  shadow-sm 
                  hover:shadow-md 
                  transition 
                  md:w-full
                `}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-28 h-28 mx-auto mb-4 object-contain"
                />
                <h3 className="text-lg font-semibold text-black mb-1">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {product.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
