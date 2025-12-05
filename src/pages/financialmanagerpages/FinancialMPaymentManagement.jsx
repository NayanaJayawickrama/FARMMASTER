import React from 'react'
import FinancialManagerSidebar from '../../components/financialmanagerdashboard/FinancialManagerSidebar'
import PaymentManagement from '../../components/financialmanagerdashboard/PaymentManagement'

function FinancialMPaymentManagement() {
  return (
    <div className="flex min-h-screen">
      <FinancialManagerSidebar />
      <main className="flex-1 md:ml-64 p-4 min-h-screen">
        <PaymentManagement />
      </main>
    </div>
  )
}

export default FinancialMPaymentManagement
