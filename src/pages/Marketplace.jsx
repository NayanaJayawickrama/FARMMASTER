import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import MarketplaceHero from "../components/marketplace/MarketplaceHero";
import ProductCategories from "../components/marketplace/ProductCategories";
import FeaturedProducts from "../components/marketplace/FeaturedProducts";
import VegetableSection from "../components/marketplace/VegetableSection";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { SearchProvider } from "../context/SearchContext";

export default function MarketplacePage() {

  return (
    <SearchProvider>
      <div className="pt-24">
        <Navbar />
        <MarketplaceHero />
        <ProductCategories />
        <FeaturedProducts />
        <div id="vegetables">
          <VegetableSection />
        </div>
        <Footer />
      </div>
    </SearchProvider>
  );
}
