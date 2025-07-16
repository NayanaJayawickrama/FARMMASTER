import React from "react";
import Sidebar from "../../components/landownerdashboard/Sidebar";
import HarvestPageBody from "../../components/landownerdashboard/HarvestPageBody";

function HarvestPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 min-h-screen">
        <HarvestPageBody />
      </main>
    </div>
  );
}

export default HarvestPage;
