import React from "react";
import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import Marketplace from "./pages/Marketplace";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import Login from "./pages/Login"; 
import LandownerDashboard from "./pages/LandownerDashboard";
import LandAssessmentRequestPage from "./pages/LandAssessmentRequestPage";
import LandAssessmentPaymentPage from "./pages/LandAssessmentPaymentPage";
import LandReportPage from "./pages/LandReportPage";
import LeaseProposalPage from "./pages/LeaseProposalPage";
import HarvestPage from "./pages/HarvestPage";

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
        <Route path="/harvest" element={<HarvestPage/>}/>
      </Routes>
    </main>
  );
}

export default App;
