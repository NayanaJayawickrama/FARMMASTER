import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import MarketplaceHero from "../components/marketplace/MarketplaceHero";
import ProductCategories from "../components/marketplace/ProductCategories";
import FeaturedProducts from "../components/marketplace/FeaturedProducts";
import VegetableSection from "../components/marketplace/VegetableSection";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function MarketplacePage() {

  return (
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
  );
}
