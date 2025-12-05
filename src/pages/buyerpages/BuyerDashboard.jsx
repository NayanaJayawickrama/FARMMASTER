import React from "react";
import BuyerSidebar from "../../components/buyerdashboard/BuyerSidebar";
import BuyerDashboardContent from "../../components/buyerdashboard/BuyerDashboardContent";

function BuyerDashboard() {
  return (
    <div className="flex min-h-screen">
      <BuyerSidebar />
      <main className="flex-1 md:ml-64 p-4 min-h-screen">
        <BuyerDashboardContent />
      </main>
    </div>
  );
}

export default BuyerDashboard;
