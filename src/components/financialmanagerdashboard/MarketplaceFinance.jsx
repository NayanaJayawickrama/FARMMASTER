import React, { useState, useEffect } from "react";

export default function MarketplaceFinancePage() {
  const [marketplaceData, setMarketplaceData] = useState(null);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch marketplace analytics data
  useEffect(() => {
    const fetchMarketplaceData = async () => {
      try {
        setLoading(true);
        const rootUrl = import.meta.env.VITE_API_URL;
        console.log('Fetching from:', `${rootUrl}/api.php/financial-analytics/marketplace`);
        
        const response = await fetch(`${rootUrl}/api.php/financial-analytics/marketplace`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const result = await response.json();
        console.log('Marketplace API response:', result);
        
        if (result.status === 'success') {
          setMarketplaceData(result.data.summary);
        } else {
          setError(result.message || 'Failed to fetch marketplace data');
        }
      } catch (err) {
        console.error('Error fetching marketplace data:', err);
        setError('Failed to connect to server');
      } finally {
        setLoading(false);
      }
    };

    fetchMarketplaceData();
  }, []);

  // Fetch transaction history
  useEffect(() => {
    const fetchTransactionHistory = async () => {
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
        console.log('Transactions API response:', result);
        
        if (result.status === 'success') {
          setTransactionHistory(result.data.transactions || []);
        } else {
          console.error('Failed to fetch transactions:', result.message);
        }
      } catch (err) {
        console.error('Error fetching transaction history:', err);
      }
    };

    fetchTransactionHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 bg-white min-h-screen p-4 md:p-10 font-poppins">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-500">Loading marketplace data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 bg-white min-h-screen p-4 md:p-10 font-poppins">
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-2 mt-4">
          Marketplace Finance
        </h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white min-h-screen p-4 md:p-10 font-poppins">
      
      <h1 className="text-3xl md:text-4xl font-bold text-black mb-2 mt-4">
        Marketplace Finance
      </h1>
      <p className="text-green-700 text-sm mb-6">
        Manage your sales income and transaction history from the online marketplace.
      </p>

     
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="border rounded-md p-6 shadow-sm text-center">
          <p className="text-sm text-gray-600">Total Sales Income</p>
          <p className="text-2xl font-bold mt-1">
            {marketplaceData ? `${marketplaceData.total_revenue.toLocaleString()} LKR` : '0 LKR'}
          </p>
        </div>
        <div className="border rounded-md p-6 shadow-sm text-center">
          <p className="text-sm text-gray-600">Average Transaction Value</p>
          <p className="text-2xl font-bold mt-1">
            {marketplaceData ? `${marketplaceData.avg_transaction_value.toLocaleString()} LKR` : '0 LKR'}
          </p>
        </div>
        <div className="border rounded-md p-6 shadow-sm text-center">
          <p className="text-sm text-gray-600">Total Transactions</p>
          <p className="text-2xl font-bold mt-1">
            {marketplaceData ? marketplaceData.total_transactions.toLocaleString() : '0'}
          </p>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        <div className="overflow-x-auto bg-white border rounded-xl shadow-sm">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-green-50 text-black font-semibold">
              <tr>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Buyer</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactionHistory.length > 0 ? (
                transactionHistory.map((txn, index) => (
                  <tr key={index} className="border-t hover:bg-green-50">
                    <td className="px-6 py-3">{txn.transaction_id || txn.id}</td>
                    <td className="px-6 py-3">{`${txn.first_name} ${txn.last_name}`}</td>
                    <td className="px-6 py-3">{`${parseFloat(txn.amount).toLocaleString()} LKR`}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        txn.payment_status === 'completed' ? 'bg-green-100 text-green-800' :
                        txn.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        txn.payment_status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {txn.payment_status || 'unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-3">{new Date(txn.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>      
    </div>
  );
}
