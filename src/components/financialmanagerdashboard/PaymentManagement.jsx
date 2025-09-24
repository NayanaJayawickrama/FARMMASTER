import React, { useState, useEffect } from "react";

export default function PaymentManagement() {
  const [activeTab, setActiveTab] = useState("land-reports");
  const [landReportPayments, setLandReportPayments] = useState([]);
  const [marketplacePayments, setMarketplacePayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch land report payments
  useEffect(() => {
    const fetchLandReportPayments = async () => {
      try {
        const rootUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${rootUrl}/api.php/financial-analytics/land-reports`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const result = await response.json();
        
        if (result.status === 'success') {
          setLandReportPayments(result.data.payments || []);
        } else {
          console.error('Failed to fetch land report payments:', result.message);
          // Fallback to empty array on error
          setLandReportPayments([]);
        }
      } catch (error) {
        console.error("Error fetching land report payments:", error);
        setLandReportPayments([]);
      }
    };

    fetchLandReportPayments();
  }, []);

  // Fetch marketplace payments using the API we created
  useEffect(() => {
    const fetchMarketplacePayments = async () => {
      try {
        const rootUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${rootUrl}/api.php/financial-analytics/transactions`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const result = await response.json();
        
        if (result.status === 'success') {
          setMarketplacePayments(result.data.transactions || []);
        } else {
          console.error('Failed to fetch marketplace payments:', result.message);
        }
      } catch (error) {
        console.error("Error fetching marketplace payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketplacePayments();
  }, []);

  return (
    <div className="flex-1 bg-white min-h-screen p-4 md:p-10 font-poppins">
      <h1 className="text-3xl md:text-4xl font-bold text-black mb-2 mt-4">
        Payment Management
      </h1>
      <p className="text-green-700 mb-6 text-sm">
        Manage and track all payments within the FarmMaster system.
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="border rounded-md p-6 shadow-sm text-center">
          <p className="text-sm text-gray-600">Total Land Report Payments</p>
          <p className="text-2xl font-bold mt-1 text-green-600">
            LKR {landReportPayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
          </p>
        </div>
        <div className="border rounded-md p-6 shadow-sm text-center">
          <p className="text-sm text-gray-600">Total Marketplace Revenue</p>
          <p className="text-2xl font-bold mt-1 text-blue-600">
            LKR {marketplacePayments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0).toLocaleString()}
          </p>
        </div>
        <div className="border rounded-md p-6 shadow-sm text-center">
          <p className="text-sm text-gray-600">Completed Transactions</p>
          <p className="text-2xl font-bold mt-1 text-green-600">
            {[
              ...landReportPayments.filter(p => p.payment_status === 'completed'), 
              ...marketplacePayments.filter(p => p.payment_status === 'completed')
            ].length}
          </p>
        </div>
        <div className="border rounded-md p-6 shadow-sm text-center">
          <p className="text-sm text-gray-600">Pending Transactions</p>
          <p className="text-2xl font-bold mt-1 text-yellow-600">
            {[
              ...landReportPayments.filter(p => p.payment_status === 'pending'), 
              ...marketplacePayments.filter(p => p.payment_status === 'pending')
            ].length}
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("land-reports")}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "land-reports"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Land Report Payments
            </button>
            <button
              onClick={() => setActiveTab("marketplace")}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "marketplace"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Marketplace Payments
            </button>
          </nav>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-500">Loading payment data...</div>
        </div>
      )}

      {/* Land Report Payments Tab */}
      {!loading && activeTab === "land-reports" && (
        <div className="overflow-x-auto bg-white border rounded-xl shadow-sm">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-green-50 text-black font-semibold">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Transaction ID</th>
                <th className="px-6 py-4 whitespace-nowrap">Landowner</th>
                <th className="px-6 py-4 whitespace-nowrap">Amount</th>
                <th className="px-6 py-4 whitespace-nowrap">Date</th>
                <th className="px-6 py-4 whitespace-nowrap">Land ID</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody>
              {landReportPayments.length > 0 ? (
                landReportPayments.map((payment) => (
                  <tr key={payment.id} className="border-t hover:bg-green-50">
                    <td className="px-6 py-4">{payment.transaction_id || payment.id}</td>
                    <td className="px-6 py-4">
                      {payment.first_name && payment.last_name 
                        ? `${payment.first_name} ${payment.last_name}` 
                        : 'Landowner'}
                    </td>
                    <td className="px-6 py-4">LKR {payment.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">{new Date(payment.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">Land #{payment.land_id}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-4 py-1 rounded-full text-xs font-semibold block text-center w-fit ${
                          payment.payment_status === "completed"
                            ? "bg-green-100 text-green-700"
                            : payment.payment_status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {payment.payment_status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No land report payments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Marketplace Payments Tab */}
      {!loading && activeTab === "marketplace" && (
        <div className="overflow-x-auto bg-white border rounded-xl shadow-sm">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-green-50 text-black font-semibold">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Transaction ID</th>
                <th className="px-6 py-4 whitespace-nowrap">Buyer</th>
                <th className="px-6 py-4 whitespace-nowrap">Amount</th>
                <th className="px-6 py-4 whitespace-nowrap">Date</th>
                <th className="px-6 py-4 whitespace-nowrap">Payment Method</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody>
              {marketplacePayments.length > 0 ? (
                marketplacePayments.map((payment) => (
                  <tr key={payment.id} className="border-t hover:bg-green-50">
                    <td className="px-6 py-4">{payment.transaction_id || payment.id}</td>
                    <td className="px-6 py-4">
                      {payment.first_name && payment.last_name 
                        ? `${payment.first_name} ${payment.last_name}` 
                        : 'Buyer'}
                    </td>
                    <td className="px-6 py-4">LKR {parseFloat(payment.amount).toLocaleString()}</td>
                    <td className="px-6 py-4">{new Date(payment.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{payment.payment_method || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-4 py-1 rounded-full text-xs font-semibold block text-center w-fit ${
                          payment.payment_status === "completed"
                            ? "bg-green-100 text-green-700"
                            : payment.payment_status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : payment.payment_status === "failed"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {payment.payment_status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No marketplace payments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
                       
