import React from "react";
import FinancialManagerSidebar from "../../components/financialmanagerdashboard/FinancialManagerSidebar";
import FinancialReportManagement from "../../components/financialmanagerdashboard/FinancialReportManagement";

function FinancialMFinancialReportManagement() {
  return (
    <div className="flex min-h-screen">
      <FinancialManagerSidebar />
      <main className="flex-1 md:ml-64 p-4 min-h-screen">
        <FinancialReportManagement />
      </main>
    </div>
  );
}

export default FinancialMFinancialReportManagement;
