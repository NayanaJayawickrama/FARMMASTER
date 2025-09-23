import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import useAutoLogout from "./hooks/useAutoLogout";

import HomePage from "./pages/HomePage";
import Marketplace from "./pages/Marketplace";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import Login from "./pages/Login"; 
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';

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
import FinancialMMarketplaceProducts from "./pages/financialmanagerpages/FinancialMMarketplaceProducts";
import FinancialMFinancialReportManagement from "./pages/financialmanagerpages/FinancialMFinancialReportManagement";
import FinancialMProposalManagement from "./pages/financialmanagerpages/FinancialMProposalManagement";

function App() {
  // Auto-logout after 5 minutes of inactivity (no warning modal - immediate logout)
  const { showWarning, onStayLoggedIn, onLogout } = useAutoLogout(5, 0);

  return (
    <main>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} /> 

        {/* Profile Route - Protected */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        {/* Landowner Protected Routes */}
        <Route path="/landownerdashboard" element={
          <ProtectedRoute requiredRoles={['Landowner']}>
            <LandownerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/landassessment" element={
          <ProtectedRoute requiredRoles={['Landowner']}>
            <LandAssessmentStripePaymentPage />
          </ProtectedRoute>
        } />
        <Route path="/landassessmentstripe" element={
          <ProtectedRoute requiredRoles={['Landowner']}>
            <LandAssessmentStripePaymentPage />
          </ProtectedRoute>
        } />
        <Route path="/landreport" element={
          <ProtectedRoute requiredRoles={['Landowner']}>
            <LandReportPage />
          </ProtectedRoute>
        } />
        <Route path="/leaseproposal" element={
          <ProtectedRoute requiredRoles={['Landowner']}>
            <LeaseProposalPage />
          </ProtectedRoute>
        } />
        <Route path="/harvest" element={
          <ProtectedRoute requiredRoles={['Landowner']}>
            <HarvestPage />
          </ProtectedRoute>
        } />

        {/* Operational Manager Protected Routes */}
        <Route path="/operationalmanagerdashboard" element={
          <ProtectedRoute requiredRoles={['Operational Manager', 'Operational_Manager']}>
            <OperationalMDashboard />
          </ProtectedRoute>
        } />
        <Route path="/operationalmanagerusermanagement" element={
          <ProtectedRoute requiredRoles={['Operational Manager', 'Operational_Manager']}>
            <OperationalMUserManagement />
          </ProtectedRoute>
        } />
        <Route path="/operationalmanagerproposalmanagement" element={
          <ProtectedRoute requiredRoles={['Operational Manager', 'Operational_Manager']}>
            <OperationalMProposalManagement />
          </ProtectedRoute>
        } />
        <Route path="/operationalmanagercropinventorymanagement" element={
          <ProtectedRoute requiredRoles={['Operational Manager', 'Operational_Manager']}>
            <OperationalMCropInventoryManagement />
          </ProtectedRoute>
        } />
        <Route path="/operationalmanagerlandreportmanagement" element={
          <ProtectedRoute requiredRoles={['Operational Manager', 'Operational_Manager']}>
            <OperationalMLandReportManagement />
          </ProtectedRoute>
        } />

        {/* Field Supervisor Protected Routes */}
        <Route path="/fieldsupervisordashboard" element={
          <ProtectedRoute requiredRoles={['Supervisor']}>
            <FSDashboard />
          </ProtectedRoute>
        } />
        <Route path="/fieldsupervisorassignedtasks" element={
          <ProtectedRoute requiredRoles={['Supervisor']}>
            <FSAssignedTasks />
          </ProtectedRoute>
        } />
        <Route path="/fieldsupervisorlanddatasubmission" element={
          <ProtectedRoute requiredRoles={['Supervisor']}>
            <FSLandDataSubmission />
          </ProtectedRoute>
        } />

        {/* Additional Operational Manager Route from master */}
        <Route path="/proposal-details/:id" element={
          <ProtectedRoute requiredRoles={['Operational Manager', 'Operational_Manager']}>
            <ProposalDetails />
          </ProtectedRoute>
        } />

        {/* Buyer Protected Routes */}
        <Route path="/buyerdashboard" element={
          <ProtectedRoute requiredRoles={['Buyer']}>
            <BuyerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/buyerorders" element={
          <ProtectedRoute requiredRoles={['Buyer']}>
            <BuyerOrders />
          </ProtectedRoute>
        } />
        <Route path="/buyercart" element={
          <ProtectedRoute requiredRoles={['Buyer']}>
            <BuyerCart />
          </ProtectedRoute>
        } />
        <Route path="/checkoutpage" element={
          <ProtectedRoute requiredRoles={['Buyer']}>
            <BuyerCheckout />
          </ProtectedRoute>
        } />

        {/* Financial Manager Protected Routes */}
        <Route path="/financialmanagerdashboard" element={
          <ProtectedRoute requiredRoles={['Financial Manager', 'Financial_Manager']}>
            <FinancialMDashboard />
          </ProtectedRoute>
        } />
        <Route path="/financialmanagerpaymentmanagement" element={
          <ProtectedRoute requiredRoles={['Financial Manager', 'Financial_Manager']}>
            <FinancialMPaymentManagement />
          </ProtectedRoute>
        } />
        <Route path="/financialmanagerproposals" element={
          <ProtectedRoute requiredRoles={['Financial Manager', 'Financial_Manager']}>
            <FinancialMProposalManagement />
          </ProtectedRoute>
        } />
        <Route path="/financialmanagerprofitrentcalculation" element={
          <ProtectedRoute requiredRoles={['Financial Manager', 'Financial_Manager']}>
            <FinancialMProfitRentCalculation />
          </ProtectedRoute>
        } />
        <Route path="/financialmanagermarketplaceproducts" element={
          <ProtectedRoute requiredRoles={['Financial Manager', 'Financial_Manager']}>
            <FinancialMMarketplaceProducts />
          </ProtectedRoute>
        } />
        <Route path="/financialmanagermarfinancialreportmanagement" element={
          <ProtectedRoute requiredRoles={['Financial Manager', 'Financial_Manager']}>
            <FinancialMFinancialReportManagement />
          </ProtectedRoute>
        } />

        {/* 404 - Catch all undefined routes */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </main>
  );
}

export default App;
