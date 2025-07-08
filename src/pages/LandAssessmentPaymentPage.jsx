import React from "react";
import Sidebar from "../components/landownerdashboard/Sidebar";
import LandAssessmentPayment from "../components/landownerdashboard/LandAssessmentPayment";

function LandAssessmentPaymentPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 min-h-screen">
        <LandAssessmentPayment />
      </main>
    </div>
  );
}

export default LandAssessmentPaymentPage;
