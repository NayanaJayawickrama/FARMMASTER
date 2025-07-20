import React from "react";
import {
  ShoppingCart,
  CheckCircle,
  Bell,
  Repeat,
} from "lucide-react";

export default function BuyerDashboardContent() {
  return (
    <div className="p-4 md:p-10 font-poppins">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-green-600 mt-1">Welcome back, Emily Perera</p>
        </div>
        <button className="border border-black px-4 py-2 rounded-md hover:bg-gray-100 flex items-center gap-2 font-bold text-black mt-4 md:mt-0">
          <Repeat size={20} />
          Switch to Buyer
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="border rounded-md p-6 shadow-sm text-center">
          <p className="text-sm text-gray-600">Recent Orders</p>
          <p className="text-2xl font-bold mt-1">3</p>
        </div>
        <div className="border rounded-md p-6 shadow-sm text-center">
          <p className="text-sm text-gray-600">Total Spendings</p>
          <p className="text-2xl font-bold mt-1">10 000 LKR</p>
        </div>
        <div className="border rounded-md p-6 shadow-sm text-center">
          <p className="text-sm text-gray-600">Purchase History</p>
          <p className="text-2xl font-bold mt-1">12</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <ul className="space-y-4 bg-green-50/50 p-4 rounded-md">
          <li className="flex items-start gap-4">
            <div className="bg-green-100 rounded-sm p-2">
              <ShoppingCart className="text-green-700" size={24} />
            </div>
            <div>
              <p className="font-medium">Order confirmed: #ORD100</p>
              <p className="text-sm text-green-600">Confirmed on 2024-01-15</p>
            </div>
          </li>

          <li className="flex items-start gap-4">
            <div className="bg-green-100 rounded-sm p-2">
              <CheckCircle className="text-green-700" size={24} />
            </div>
            <div>
              <p className="font-medium">Order delivered: #ORD216</p>
              <p className="text-sm text-green-600">Delivered on 2024-02-01</p>
            </div>
          </li>

          <li className="flex items-start gap-4">
            <div className="bg-green-100 rounded-sm p-2">
              <Bell className="text-green-700" size={24} />
            </div>
            <div>
              <p className="font-medium">Payment pending for order: #ORD2221</p>
              <p className="text-sm text-green-600">Reminder sent on 2024-03-10</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
