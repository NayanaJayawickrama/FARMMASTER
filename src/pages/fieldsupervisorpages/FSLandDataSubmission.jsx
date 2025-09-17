import React from "react";
import SupervisorSidebar from "../../components/fieldsupervisordashboard/SupervisorSidebar";
import LandDataSubmissionForm from "../../components/fieldsupervisordashboard/LandDataSubmissionForm";

function FSLandDataSubmission() {
  return (
    <div className="flex min-h-screen">
      <SupervisorSidebar />
      <main className="flex-1 md:ml-64 p-4 min-h-screen">
        <LandDataSubmissionForm />
      </main>
    </div>
  );
}

export default FSLandDataSubmission;
