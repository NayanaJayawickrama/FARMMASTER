import React from "react";
import DashboardContent from "../../components/landownerdashboard/DashboardContent";
import Sidebar from "../../components/landownerdashboard/Sidebar";


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
