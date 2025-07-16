import React from "react";
import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import Marketplace from "./pages/Marketplace";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import Login from "./pages/Login"; 

import LandownerDashboard from "./pages/landownerpages/LandownerDashboard";
import LandAssessmentPaymentPage from "./pages/landownerpages/LandAssessmentPaymentPage";
import LandAssessmentRequestPage from "./pages/landownerpages/LandAssessmentRequestPage";
import LandReportPage from "./pages/landownerpages/LandReportPage";
import LeaseProposalPage from "./pages/landownerpages/LeaseProposalPage";
import HarvestPage from "./pages/landownerpages/HarvestPage";

import OperationalMDashboard from "./pages/operationalmanagerpages/OperationalMDashboard";
import OperationalMUserManagement from "./pages/operationalmanagerpages/OperationalMUserManagement";
import OperationalMProposalManagement from "./pages/operationalmanagerpages/OperationalMProposalManagement";
import OperationalMCropInventoryManagement from "./pages/operationalmanagerpages/OperationalMCropInventoryManagement";
import OperationalMLandReportManagement from "./pages/operationalmanagerpages/OperationalMLandReportManagement";

import FSDashboard from "./pages/fieldsupervisorpages/FSDashboard";
import FSAssignedTasks from "./pages/fieldsupervisorpages/FSAssignedTasks";
import FSLandDataSubmission from "./pages/fieldsupervisorpages/FSLandDataSubmission";


function App() {
  return (
    <main>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} /> 

        <Route path="/landownerdashboard" element={<LandownerDashboard />} />
        <Route path="/landassessmentrequest" element={<LandAssessmentRequestPage />} />
        <Route path="/landassessmentpayment" element={<LandAssessmentPaymentPage />} />
        <Route path="/landreport" element={<LandReportPage />} />
        <Route path="/leaseproposal" element={<LeaseProposalPage />} />
        <Route path="/harvest" element={<HarvestPage />} />

        <Route path="/operationalmanagerdashboard" element={<OperationalMDashboard />} />
        <Route path="/operationalmanagerusermanagement" element={<OperationalMUserManagement />} />
        <Route path="/operationalmanagerproposalmanagement" element={<OperationalMProposalManagement />} />
        <Route path="/operationalmanagercropinventorymanagement" element={<OperationalMCropInventoryManagement />} />
        <Route path="/operationalmanagerlandreportmanagement" element={<OperationalMLandReportManagement />} />

        <Route path="/fieldsupervisordashboard" element={<FSDashboard />} />
        <Route path="/fieldsupervisorassignedtasks" element={<FSAssignedTasks />} />
        <Route path="/fieldsupervisorlanddatasubmission" element={<FSLandDataSubmission />} />
      </Routes>
    </main>
  );
}

export default App;
