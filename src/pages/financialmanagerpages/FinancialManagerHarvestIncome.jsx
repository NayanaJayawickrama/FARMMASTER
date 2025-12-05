import React from "react";
import FinancialManagerSidebar from "../../components/financialmanagerdashboard/FinancialManagerSidebar";
import HarvestIncomeManagement from "../../components/financialmanagerdashboard/HarvestIncomeManagement";

export default function FinancialManagerHarvestIncome() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <FinancialManagerSidebar />
      <main className="flex-1 md:ml-64">
        <div className="md:hidden">
          <FinancialManagerSidebar />
        </div>
        <HarvestIncomeManagement />
      </main>
    </div>
  );
}