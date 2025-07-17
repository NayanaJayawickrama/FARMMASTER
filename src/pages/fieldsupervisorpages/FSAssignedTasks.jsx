import React from "react";
import SupervisorSidebar from "../../components/fieldsupervisordashboard/SupervisorSidebar";
import AssignedLandReports from "../../components/fieldsupervisordashboard/AssignedLandReports"; 

function FSAssignedTasks() {
  return (
    <div className="flex min-h-screen">
      <SupervisorSidebar />
      <main className="flex-1 md:ml-64 p-4 min-h-screen">
        <AssignedLandReports />
      </main>
    </div>
  );
}

export default FSAssignedTasks;
