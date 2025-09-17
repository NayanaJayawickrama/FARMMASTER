import React from 'react'
import Sidebar from "../../components/operationalmanagerdashboard/Sidebar";
import CropInventoryManagement from "../../components/operationalmanagerdashboard/CropInventoryManagement";

function OperationalMCropInventoryManagement() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 min-h-screen">
        <CropInventoryManagement />
      </main>
    </div>
  )
}

export default OperationalMCropInventoryManagement;
