import React from "react";
import Sidebar from "../components/landownerdashboard/Sidebar";
import LandReportBody from "../components/landownerdashboard/LandReportBody";

function LandReportPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 min-h-screen">
        <LandReportBody />
      </main>
    </div>
  );
}

export default LandReportPage;
