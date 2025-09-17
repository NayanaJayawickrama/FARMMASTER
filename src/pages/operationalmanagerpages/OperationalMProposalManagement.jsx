import React from "react";
import Sidebar from "../../components/operationalmanagerdashboard/Sidebar";
import ProposalManagement from "../../components/operationalmanagerdashboard/ProposalManagement";

function OperationalMProposalManagement() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 min-h-screen">
        <ProposalManagement />
      </main>
    </div>
  );
}

export default OperationalMProposalManagement;
