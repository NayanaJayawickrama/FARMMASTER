import React, { useState, useEffect } from "react";
import axios from "axios";

const HarvestPage = () => {
  const [harvestData, setHarvestData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totals, setTotals] = useState({
    totalAmount: 0,
    totalIncome: 0,
    totalExpenses: 0,
    landowenerTotal: 0
  });

  const rootUrl = import.meta.env.VITE_API_URL;

  // Fetch harvest data from backend
  useEffect(() => {
    const fetchHarvestData = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = user.id || user.user_id || 21; // Check both 'id' and 'user_id' properties
        
        console.log('Fetching harvest data for user_id:', userId);

        const response = await axios.get(`${rootUrl}/get_harvest_data.php?user_id=${userId}`);
        
        console.log('Harvest API response:', response.data);
        
        // The API returns data directly as an array
        if (Array.isArray(response.data)) {
          const data = response.data;
          setHarvestData(data);
          
          // Calculate totals
          const totals = data.reduce((acc, item) => {
            acc.totalAmount += parseFloat(item.harvest_amount);
            acc.totalIncome += parseFloat(item.income);
            acc.totalExpenses += parseFloat(item.expenses);
            acc.landowenerTotal += parseFloat(item.landowner_share);
            return acc;
          }, { totalAmount: 0, totalIncome: 0, totalExpenses: 0, landowenerTotal: 0 });
          
          setTotals(totals);
        } else if (response.data.error) {
          setError(response.data.error);
        } else {
          setError('Invalid response format from server');
        }
      } catch (err) {
        console.error('Error fetching harvest data:', err);
        setError('Failed to load harvest data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchHarvestData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Loading harvest data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      
      <h1 className="text-3xl font-bold text-black">Harvests</h1>
      <p className="text-green-600 text-sm mt-1">Track your harvest activities and income</p>

      <h3 className="text-xl font-bold text-black mt-10 mb-4">Harvest Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <p className="text-gray-600 text-sm mb-1">Total Harvest Amount</p>
          <h2 className="text-2xl font-bold text-black">{totals.totalAmount.toLocaleString()} kg</h2>
          <p className="text-green-600 text-sm mt-1">All harvest records</p>
        </div>
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <p className="text-gray-600 text-sm mb-1">Total Income</p>
          <h2 className="text-2xl font-bold text-black">Rs {totals.totalIncome.toLocaleString()}</h2>
          <p className="text-green-600 text-sm mt-1">Gross income from harvest</p>
        </div>
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <p className="text-gray-600 text-sm mb-1">Your Share (Net)</p>
          <h2 className="text-2xl font-bold text-green-600">Rs {totals.landowenerTotal.toLocaleString()}</h2>
          <p className="text-gray-600 text-sm mt-1">After expenses and costs</p>
        </div>
      </div>

     
      <h3 className="text-xl font-bold text-black mt-10 mb-4">Harvest Details</h3>

      <div className="hidden md:block bg-white border rounded-xl overflow-x-auto">
        <table className="min-w-full text-sm text-center border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr className="text-gray-700 font-semibold">
              <th className="px-5 py-4 whitespace-nowrap">Harvest Date</th>
              <th className="px-5 py-4 whitespace-nowrap">Product Type</th>
              <th className="px-5 py-4 whitespace-nowrap">Harvest Amount (kg)</th>
              <th className="px-5 py-4 whitespace-nowrap">Total Income (Rs)</th>
              <th className="px-5 py-4 whitespace-nowrap">Expenses (Rs)</th>
              <th className="px-5 py-4 whitespace-nowrap">Your Share (Rs)</th>
            </tr>
          </thead>
          <tbody>
            {harvestData.length > 0 ? (
              harvestData.map((item, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  <td className="px-5 py-4 text-green-800">
                    {new Date(item.harvest_date).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 text-green-800">{item.product_type}</td>
                  <td className="px-5 py-4 text-green-800">{parseFloat(item.harvest_amount).toLocaleString()}</td>
                  <td className="px-5 py-4 text-green-800">Rs {parseFloat(item.income).toLocaleString()}</td>
                  <td className="px-5 py-4 text-red-600">Rs {parseFloat(item.expenses).toLocaleString()}</td>
                  <td className="px-5 py-4 text-green-600 font-semibold">Rs {parseFloat(item.landowner_share).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-5 py-8 text-gray-500 text-center">
                  No harvest records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      
      <div className="block md:hidden space-y-4">
        {harvestData.length > 0 ? (
          harvestData.map((item, idx) => (
            <div key={idx} className="bg-white border rounded-xl p-4 shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Harvest Date</div>
              <div className="text-green-800 font-semibold">
                {new Date(item.harvest_date).toLocaleDateString()}
              </div>

              <div className="text-sm text-gray-600 mt-3 mb-1">Product Type</div>
              <div className="text-green-800 font-semibold">{item.product_type}</div>

              <div className="text-sm text-gray-600 mt-3 mb-1">Harvest Amount (kg)</div>
              <div className="text-green-800 font-semibold">{parseFloat(item.harvest_amount).toLocaleString()}</div>

              <div className="text-sm text-gray-600 mt-3 mb-1">Total Income (Rs)</div>
              <div className="text-green-800 font-semibold">Rs {parseFloat(item.income).toLocaleString()}</div>

              <div className="text-sm text-gray-600 mt-3 mb-1">Expenses (Rs)</div>
              <div className="text-red-600 font-semibold">Rs {parseFloat(item.expenses).toLocaleString()}</div>

              <div className="text-sm text-gray-600 mt-3 mb-1">Your Share (Rs)</div>
              <div className="text-green-600 font-bold text-lg">Rs {parseFloat(item.landowner_share).toLocaleString()}</div>
            </div>
          ))
        ) : (
          <div className="bg-white border rounded-xl p-8 shadow-sm text-center">
            <p className="text-gray-500">No harvest records found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HarvestPage;
