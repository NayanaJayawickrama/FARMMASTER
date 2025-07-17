import React from "react";
import FSDashboardContent from "../../components/fieldsupervisordashboard/FSDashboardContent";
import SupervisorSidebar from "../../components/fieldsupervisordashboard/SupervisorSidebar";

function FSDashboard() {
  return (
    <div className="flex min-h-screen">
      <SupervisorSidebar />
      <main className="flex-1 md:ml-64 p-4 min-h-screen">
        <FSDashboardContent />
      </main>
    </div>
  );
}

export default FSDashboard;
