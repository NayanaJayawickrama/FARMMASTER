import React from "react";
import Sidebar from "../../components/landownerdashboard/Sidebar";
import LandownerHarvestIncome from "../../components/landownerdashboard/LandownerHarvestIncome";

export default function LandownerHarvestIncomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-1 md:ml-64">
        <div className="md:hidden">
          <Sidebar />
        </div>
        <LandownerHarvestIncome />
      </main>
    </div>
  );
}