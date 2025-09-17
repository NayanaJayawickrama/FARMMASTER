import React from "react";
import Sidebar from "../../components/operationalmanagerdashboard/Sidebar";
import UserManagement from "../../components/operationalmanagerdashboard/UserManagement";

function OperationalMUserManagement() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 min-h-screen">
        <UserManagement />
      </main>
    </div>
  );
}

export default OperationalMUserManagement;
