import React from "react";
import Sidebar from "../components/landownerdashboard/Sidebar";
import LeaseProposalBody from "../components/landownerdashboard/LeaseProposalBody";

function LeaseProposalPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 min-h-screen">
        <LeaseProposalBody />
      </main>
    </div>
  );
}

export default LeaseProposalPage;
