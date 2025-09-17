import FinancialManagerSidebar from "../../components/financialmanagerdashboard/FinancialManagerSidebar";
import FMDashboardContent from "../../components/financialmanagerdashboard/FMDashboardContent";

function FinancialMDashboard() {
  return (
    <div className="flex min-h-screen">
      <FinancialManagerSidebar />
      <main className="flex-1 md:ml-64 p-4 min-h-screen">
        <FMDashboardContent />
      </main>
    </div>
  );
}

export default FinancialMDashboard;
