import React from "react";
import FinancialManagerSidebar from "../../components/financialmanagerdashboard/FinancialManagerSidebar";
import MarketplaceProducts from "../../components/financialmanagerdashboard/MarketplaceProducts";

function FinancialMMarketplaceProducts() {
  return (
    <div className="flex min-h-screen">
      <FinancialManagerSidebar />
      <main className="flex-1 md:ml-64 p-4 min-h-screen">
        <MarketplaceProducts />
      </main>
    </div>
  );
}

export default FinancialMMarketplaceProducts;
