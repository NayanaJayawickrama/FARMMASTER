import React from 'react'
import FinancialManagerSidebar from '../../components/financialmanagerdashboard/FinancialManagerSidebar'
import ProfitRentCalculation from '../../components/financialmanagerdashboard/ProfitRentCalculation'

function FinancialMProfitRentCalculation() {
  return (
    <div className="flex min-h-screen">
      <FinancialManagerSidebar />
      <main className="flex-1 md:ml-64 p-4 min-h-screen">
        <ProfitRentCalculation />
      </main>
    </div>
  )
}

export default FinancialMProfitRentCalculation
