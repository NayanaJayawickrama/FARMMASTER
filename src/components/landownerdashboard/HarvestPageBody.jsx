import React from "react";

const harvestData = [
  { date: "2024-07-15", product: "Tomato", amount: 500, income: 100000, expenses: 20000, rent: 10000 },
  { date: "2024-06-20", product: "Carrot", amount: 300, income: 60000, expenses: 12000, rent: 6000 },
  { date: "2024-05-25", product: "Leeks", amount: 400, income: 50000, expenses: 10000, rent: 5000 },
  { date: "2024-04-30", product: "Cabbage", amount: 200, income: 30000, expenses: 6000, rent: 3000 },
  { date: "2024-03-05", product: "Tomato", amount: 100, income: 10000, expenses: 2000, rent: 1000 },
];

const HarvestPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      
      <h1 className="text-3xl font-bold text-black">Harvests</h1>
      <p className="text-green-600 text-sm mt-1">Track your harvest activities and income</p>

      <h3 className="text-xl font-bold text-black mt-10 mb-4">Harvest Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <p className="text-gray-600 text-sm mb-1">Total Harvest Amount</p>
          <h2 className="text-2xl font-bold text-black">1500 kg</h2>
          <p className="text-green-600 text-sm mt-1">+15%</p>
        </div>
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <p className="text-gray-600 text-sm mb-1">Income Trend</p>
          <h2 className="text-2xl font-bold text-black">Rs 250,000</h2>
          <p className="text-green-600 text-sm mt-1">+10%</p>
        </div>
      </div>

     
      <h3 className="text-xl font-bold text-black mt-10 mb-4">Harvest Details</h3>

      <div className="hidden md:block bg-white border rounded-xl overflow-x-auto">
        <table className="min-w-full text-sm text-center border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr className="text-gray-700 font-semibold">
              <th className="px-5 py-4 whitespace-nowrap">Date</th>
              <th className="px-5 py-4 whitespace-nowrap">Product Type</th>
              <th className="px-5 py-4 whitespace-nowrap">Harvest Amount (kg)</th>
              <th className="px-5 py-4 whitespace-nowrap">Income (Rs)</th>
              <th className="px-5 py-4 whitespace-nowrap">Expenses (Rs)</th>
              <th className="px-5 py-4 whitespace-nowrap">Land Rent (Rs)</th>
            </tr>
          </thead>
          <tbody>
            {harvestData.map((item, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50">
                <td className="px-5 py-4 text-green-800">{item.date}</td>
                <td className="px-5 py-4 text-green-800">{item.product}</td>
                <td className="px-5 py-4 text-green-800">{item.amount}</td>
                <td className="px-5 py-4 text-green-800">Rs {item.income.toLocaleString()}</td>
                <td className="px-5 py-4 text-green-800">Rs {item.expenses.toLocaleString()}</td>
                <td className="px-5 py-4 text-green-800">Rs {item.rent.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
      <div className="block md:hidden space-y-4">
        {harvestData.map((item, idx) => (
          <div key={idx} className="bg-white border rounded-xl p-4 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Date</div>
            <div className="text-green-800 font-semibold">{item.date}</div>

            <div className="text-sm text-gray-600 mt-3 mb-1">Product Type</div>
            <div className="text-green-800 font-semibold">{item.product}</div>

            <div className="text-sm text-gray-600 mt-3 mb-1">Harvest Amount (kg)</div>
            <div className="text-green-800 font-semibold">{item.amount}</div>

            <div className="text-sm text-gray-600 mt-3 mb-1">Income (Rs)</div>
            <div className="text-green-800 font-semibold">Rs {item.income.toLocaleString()}</div>

            <div className="text-sm text-gray-600 mt-3 mb-1">Expenses (Rs)</div>
            <div className="text-green-800 font-semibold">Rs {item.expenses.toLocaleString()}</div>

            <div className="text-sm text-gray-600 mt-3 mb-1">Land Rent (Rs)</div>
            <div className="text-green-800 font-semibold">Rs {item.rent.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HarvestPage;
