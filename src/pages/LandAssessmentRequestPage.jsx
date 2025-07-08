import React from "react";
import Sidebar from "../components/landownerdashboard/Sidebar";
import LandAssessmentRequestBody from "../components/landownerdashboard/LandAssessmentRequestBody";

function LandAssessmentRequestPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 min-h-screen">
        <LandAssessmentRequestBody />
      </main>
    </div>
  );
}

export default LandAssessmentRequestPage;
