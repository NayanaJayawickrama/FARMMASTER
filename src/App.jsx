import React from "react";
import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import Marketplace from "./pages/Marketplace";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import Login from "./pages/Login"; 
import ResetPassword from './pages/ResetPassword';

import LandownerDashboard from "./pages/landownerpages/LandownerDashboard";
import LandAssessmentStripePaymentPage from "./pages/landownerpages/LandAssessmentStripePaymentPage";
import LandReportPage from "./pages/landownerpages/LandReportPage";
import LeaseProposalPage from "./pages/landownerpages/LeaseProposalPage";
import HarvestPage from "./pages/landownerpages/HarvestPage";

import OperationalMDashboard from "./pages/operationalmanagerpages/OperationalMDashboard";
import OperationalMUserManagement from "./pages/operationalmanagerpages/OperationalMUserManagement";
import OperationalMProposalManagement from "./pages/operationalmanagerpages/OperationalMProposalManagement";
import OperationalMCropInventoryManagement from "./pages/operationalmanagerpages/OperationalMCropInventoryManagement";
import OperationalMLandReportManagement from "./pages/operationalmanagerpages/OperationalMLandReportManagement";
import ProposalDetails from "./components/operationalmanagerdashboard/ProposalDetails";

import FSDashboard from "./pages/fieldsupervisorpages/FSDashboard";
import FSAssignedTasks from "./pages/fieldsupervisorpages/FSAssignedTasks";
import FSLandDataSubmission from "./pages/fieldsupervisorpages/FSLandDataSubmission";

import BuyerDashboard from "./pages/buyerpages/BuyerDashboard";
import BuyerCart from "./pages/buyerpages/BuyerCart";
import BuyerOrders from "./pages/buyerpages/BuyerOrders";
import BuyerCheckout from "./pages/buyerpages/BuyerCheckout";

import FinancialMDashboard from "./pages/financialmanagerpages/FinancialMDashboard";
import FinancialMPaymentManagement from "./pages/financialmanagerpages/FinancialMPaymentManagement";
import FinancialMProfitRentCalculation from "./pages/financialmanagerpages/FinancialMProfitRentCalculation";
import FinancialMMarketplaceFinance from "./pages/financialmanagerpages/FinancialMMarketplaceFinance";
import FinancialMMarketplaceProducts from "./pages/financialmanagerpages/FinancialMMarketplaceProducts";
import FinancialMFinancialReportManagement from "./pages/financialmanagerpages/FinancialMFinancialReportManagement";

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
        <Route path="/reset-password" element={<ResetPassword />} />


        <Route path="/landownerdashboard" element={<LandownerDashboard />} />
        <Route path="/landassessment" element={<LandAssessmentStripePaymentPage />} />
        <Route path="/landassessmentstripe" element={<LandAssessmentStripePaymentPage />} />
        <Route path="/landreport" element={<LandReportPage />} />
        <Route path="/leaseproposal" element={<LeaseProposalPage />} />
        <Route path="/harvest" element={<HarvestPage />} />

        <Route path="/operationalmanagerdashboard" element={<OperationalMDashboard />} />
        <Route path="/operationalmanagerusermanagement" element={<OperationalMUserManagement />} />
        <Route path="/operationalmanagerproposalmanagement" element={<OperationalMProposalManagement />} />
        <Route path="/proposal-details/:id" element={<ProposalDetails />} />
        <Route path="/operationalmanagercropinventorymanagement" element={<OperationalMCropInventoryManagement />} />
        <Route path="/operationalmanagerlandreportmanagement" element={<OperationalMLandReportManagement />} />

        <Route path="/fieldsupervisordashboard" element={<FSDashboard />} />
        <Route path="/fieldsupervisorassignedtasks" element={<FSAssignedTasks />} />
        <Route path="/fieldsupervisorlanddatasubmission" element={<FSLandDataSubmission />} />

        <Route path="/buyerdashboard" element={<BuyerDashboard />}/>
        <Route path="/buyerorders" element={<BuyerOrders />}/>
        <Route path="/buyercart" element={<BuyerCart />}/>
        <Route path="/checkoutpage" element={<BuyerCheckout />}/>

        <Route path="/financialmanagerdashboard" element={<FinancialMDashboard />} />
        <Route path="/financialmanagerpaymentmanagement" element={<FinancialMPaymentManagement />} />
        <Route path="/financialmanagerprofitrentcalculation" element={<FinancialMProfitRentCalculation />} />
        <Route path="/financialmanagermarketplacefinance" element={<FinancialMMarketplaceFinance />} />
        <Route path="/financialmanagermarketplaceproducts" element={<FinancialMMarketplaceProducts />} />
        <Route path="/financialmanagermarfinancialreportmanagement" element={<FinancialMFinancialReportManagement />} />

      </Routes>
    </main>
  );
}

export default App;
