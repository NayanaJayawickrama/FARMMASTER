import React from 'react';
import FinancialManagerSidebar from "../../components/financialmanagerdashboard/FinancialManagerSidebar";
import ProposalManagement from "../../components/financialmanagerdashboard/ProposalManagement";

function FinancialMProposalManagement() {
  return (
    <div className="flex min-h-screen">
      <FinancialManagerSidebar />
      <main className="flex-1 md:ml-64 p-4 min-h-screen bg-gray-50">
        <ProposalManagement />
      </main>
    </div>
  );
}

export default FinancialMProposalManagement;