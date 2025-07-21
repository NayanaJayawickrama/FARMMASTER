import React, { useState } from "react";
import FinancialReportForm from "./FinancialReportForm"; // form component

export default function FinancialReportManagement() {
  const [showForm, setShowForm] = useState(false);

  const summaryData = [
    { title: "Total Income", amount: "$120,000" },
    { title: "Rent Payouts", amount: "$30,000" },
    { title: "Product Revenue", amount: "$90,000" },
  ];

  const reportData = [
    {
      date: "2024-07-01",
      category: "Income",
      description: "Sale of organic vegetables",
      amount: "$50,000",
    },
    {
      date: "2024-07-15",
      category: "Expense",
      description: "Rent payout to landowners",
      amount: "$10,000",
    },
    {
      date: "2024-08-01",
      category: "Income",
      description: "Sale of organic fruits",
      amount: "$40,000",
    },
    {
      date: "2024-08-15",
      category: "Expense",
      description: "Rent payout to landowners",
      amount: "$10,000",
    },
    {
      date: "2024-09-01",
      category: "Income",
      description: "Sale of organic herbs",
      amount: "$30,000",
    },
  ];

  if (showForm) {
    return <FinancialReportForm onCancel={() => setShowForm(false)} />;
  }

  return (
    <div className="flex-1 bg-white min-h-screen p-4 md:p-10 font-poppins">
      <h1 className="text-3xl md:text-4xl font-bold text-black mb-2 mt-4">
        Financial Reports
      </h1>
      <p className="text-green-700 text-sm mb-6">
        Generate and access financial reports for FarmMaster operations.
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {summaryData.map((item, idx) => (
          <div
            key={idx}
            className="border rounded-md p-6 shadow-sm text-center"
          >
            <p className="text-sm text-gray-600">{item.title}</p>
            <p className="text-2xl font-bold mt-1">{item.amount}</p>
          </div>
        ))}
      </div>

      {/* Report Data Table */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Report Data</h2>
        <div className="overflow-x-auto bg-white border rounded-xl shadow-sm">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-green-50 text-black font-semibold">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Amount</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((row, index) => (
                <tr key={index} className="border-t hover:bg-green-50">
                  <td className="px-6 py-4">{row.date}</td>
                  <td className="px-6 py-4">{row.category}</td>
                  <td className="px-6 py-4">{row.description}</td>
                  <td className="px-6 py-4">{row.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 text-white px-6 py-2 rounded-md text-sm font-semibold hover:bg-green-700 cursor-pointer"
          >
            Add Data
          </button>
          <button className="bg-green-600 text-white px-6 py-2 rounded-md text-sm font-semibold hover:bg-green-700 cursor-pointer">
            Update Data
          </button>
        </div>

        <div className="flex flex-wrap gap-4">
          <button className="bg-green-100 text-black px-6 py-2 rounded-md text-sm font-semibold hover:bg-green-200 cursor-pointer">
            Download Report
          </button>
          <button className="bg-green-200 text-black px-6 py-2 rounded-md text-sm font-semibold hover:bg-green-200 cursor-pointer">
            Send for Review
          </button>
        </div>
      </div>
    </div>
  );
}
