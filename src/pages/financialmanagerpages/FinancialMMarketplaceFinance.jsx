import React from "react";
import FinancialManagerSidebar from "../../components/financialmanagerdashboard/FinancialManagerSidebar";
import MarketplaceFinancePage from "../../components/financialmanagerdashboard/MarketplaceFinance";

function FinancialMMarketplaceFinance() {
  return (
    <div className="flex min-h-screen">
      <FinancialManagerSidebar />
      <main className="flex-1 md:ml-64 p-4 min-h-screen">
        <MarketplaceFinancePage />
      </main>
    </div>
  );
}

export default FinancialMMarketplaceFinance;
