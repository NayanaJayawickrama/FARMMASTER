import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, ResponsiveContainer } from "recharts";
import { NavLink } from "react-router-dom";

const data = [
  { month: "Jan", income: 32000 },
  { month: "Feb", income: 21000 },
  { month: "Mar", income: 26000 },
  { month: "Apr", income: 28000 },
  { month: "May", income: 52000 },
  { month: "Jun", income: 16000 },
  { month: "Jul", income: 30000 },
];

export default function FinancialDashboardContent() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.name) {
      setUserName(storedUser.name);
    }
  }, []);

  return (
    <div className="p-4 md:p-10 font-poppins">
      {/* Header */}
      <div className="mb-8 mt-4">
        <h1 className="text-3xl md:text-4xl font-bold">Dashboard</h1>
        <p className="text-sm md:text-lg text-green-600 mt-2">
          Welcome back, {userName || "Financial Manager"}
        </p>
      </div>

      {/* Overview Cards */}
      <div className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="border rounded-md p-6 shadow-sm text-center">
            <p className="text-sm text-gray-600">Total Payments Received</p>
            <p className="text-2xl font-bold mt-1">220,235 LKR</p>
          </div>
          <div className="border rounded-md p-6 shadow-sm text-center">
            <p className="text-sm text-gray-600">Current Harvest Income</p>
            <p className="text-2xl font-bold mt-1">220,143 LKR</p>
          </div>
          <div className="border rounded-md p-6 shadow-sm text-center">
            <p className="text-sm text-gray-600">Total Profit Shared</p>
            <p className="text-2xl font-bold mt-1">123,542 LKR</p>
          </div>
        </div>
      </div>

      {/* Income Trend */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Monthly Income Trend</h2>
        <div className="border rounded-md p-6">
          <h3 className="text-md font-semibold mb-4 text-gray-600">
            Income Over Time
          </h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis dataKey="month" />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#16a34a"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-6 text-green-700">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <NavLink to="/transactions">
            <button className="bg-green-100 text-black px-4 py-2 rounded-md font-semibold hover:bg-green-600 hover:text-white transition">
              View Transactions
            </button>
          </NavLink>
          <NavLink to="/financialmanagermarketplacefinance">
            <button className="bg-green-100 text-black px-4 py-2 rounded-md font-semibold hover:bg-green-600 hover:text-white transition">
              Marketplace Earnings
            </button>
          </NavLink>
          <NavLink to="/generate-reports">
            <button className="bg-green-100 text-black px-4 py-2 rounded-md font-semibold hover:bg-green-600 hover:text-white transition">
              Generate Reports
            </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}
