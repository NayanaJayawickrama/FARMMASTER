import React from "react";
import Sidebar from "../components/landownerdashboard/Sidebar";
import DashboardContent from "../components/landownerdashboard/DashboardContent";

function LandownerDashboard() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 min-h-screen">
        <DashboardContent />
      </main>
    </div>
  );
}

export default LandownerDashboard;
