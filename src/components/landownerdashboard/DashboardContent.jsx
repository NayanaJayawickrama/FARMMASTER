import React from "react";
import { FileText, Handshake, Leaf, Repeat } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function DashboardContent() {
  return (
    <div className="p-4 md:p-10">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 mt-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Dashboard</h1>
          <p className="text-sm md:text-lg text-green-600 mt-2">
            Welcome back, Nila Perera
          </p>
        </div>
        <button className="border border-black px-4 py-2 rounded-md hover:bg-gray-100 flex items-center gap-2 font-bold text-black mt-4 md:mt-0">
          <Repeat size={20} />
          Switch to Buyer
        </button>
      </div>

      {/* Overview Section */}
      <div className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-md p-6 shadow-sm text-center">
            <p className="text-sm text-gray-600">Land Report Requests</p>
            <p className="text-2xl font-bold mt-1">2</p>
          </div>
          <div className="border rounded-md p-6 shadow-sm text-center">
            <p className="text-sm text-gray-600">Active Proposals</p>
            <p className="text-2xl font-bold mt-1">1</p>
          </div>
          <div className="border rounded-md p-6 shadow-sm text-center">
            <p className="text-sm text-gray-600">Total Harvests</p>
            <p className="text-2xl font-bold mt-1">3</p>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        <ul className="space-y-4 bg-green-50/50 p-4 rounded-md">
          <li className="flex items-start gap-5">
            <div className="bg-green-100 rounded-sm p-2">
              <FileText className="text-green-700" size={26} />
            </div>
            <div>
              <p className="font-semibold">Land Report for Block A</p>
              <p className="text-sm text-green-600">Requested on 2024-01-15</p>
            </div>
          </li>
          <li className="flex items-start gap-4">
            <div className="bg-green-100 rounded-sm p-2">
              <Handshake className="text-green-700" size={26} />
            </div>
            <div>
              <p className="font-semibold">Proposal for Block B</p>
              <p className="text-sm text-green-600">Submitted on 2024-02-01</p>
            </div>
          </li>
          <li className="flex items-start gap-4">
            <div className="bg-green-100 rounded-sm p-2">
              <Leaf className="text-green-700" size={26} />
            </div>
            <div>
              <p className="font-semibold">Harvest for Block A</p>
              <p className="text-sm text-green-600">Completed on 2024-03-10</p>
            </div>
          </li>
        </ul>
      </div>

      {/* Request New Land Report Button */}
      <div className="flex justify-end">
        <NavLink to="/landassessmentrequest">
          <button className="bg-green-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-green-700 transition">
            Request New Land Report
          </button>
        </NavLink>
      </div>
    </div>
  );
}
