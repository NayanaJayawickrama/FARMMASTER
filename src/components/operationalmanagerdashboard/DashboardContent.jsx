import React from "react";
import { FileText, Handshake, Leaf } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function DashboardContent() {
  return (
    <div className="p-4 md:p-10">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 mt-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Dashboard</h1>
          <p className="text-sm md:text-lg text-green-600 mt-2">
            Welcome back, Helani Silva
          </p>
        </div>
      </div>

      {/* Overview Section */}
      <div className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border rounded-md p-6 shadow-sm text-center">
            <p className="text-sm text-gray-600">Total Users</p>
            <p className="text-2xl font-bold mt-1">2,235</p>
          </div>
          <div className="border rounded-md p-6 shadow-sm text-center">
            <p className="text-sm text-gray-600">Pending Land Reports</p>
            <p className="text-2xl font-bold mt-1">34</p>
          </div>
          <div className="border rounded-md p-6 shadow-sm text-center">
            <p className="text-sm text-gray-600">Assigned Supervisors</p>
            <p className="text-2xl font-bold mt-1">12</p>
          </div>
          <div className="border rounded-md p-6 shadow-sm text-center">
            <p className="text-sm text-gray-600">Active Cultivations</p>
            <p className="text-2xl font-bold mt-1">80</p>
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
              <p className="font-semibold">Land Report Received</p>
              <p className="text-sm text-green-600">
                Report submitted by Supervisor 1
              </p>
            </div>
          </li>
          <li className="flex items-start gap-4">
            <div className="bg-green-100 rounded-sm p-2">
              <Handshake className="text-green-700" size={26} />
            </div>
            <div>
              <p className="font-semibold">Cultivation Proposal Received</p>
              <p className="text-sm text-green-600">
                Proposal submitted by Supervisor 3
              </p>
            </div>
          </li>
          <li className="flex items-start gap-4">
            <div className="bg-green-100 rounded-sm p-2">
              <FileText className="text-green-700" size={26} />
            </div>
            <div>
              <p className="font-semibold">New Land Report Assigned</p>
              <p className="text-sm text-green-600">Assigned to Supervisor 2</p>
            </div>
          </li>
        </ul>
      </div>

      {/* Quick Actions Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-5">
          <NavLink to="/operationalmanagerusermanagement">
            <button className="bg-green-100 text-black px-4 py-2 rounded-md font-semibold hover:bg-green-600 hover:text-white transition">
              Manage Users
            </button>
          </NavLink>
          <NavLink to="/operationalmanagerproposalmanagement">
            <button className="bg-green-100 text-black px-4 py-2 rounded-md font-semibold hover:bg-green-600 hover:text-white transition">
              View Proposals
            </button>
          </NavLink>
          <NavLink to="/operationalmanagercropinventorymanagement">
            <button className="bg-green-100 text-black px-4 py-2 rounded-md font-semibold hover:bg-green-600 hover:text-white transition">
              Crop Inventory
            </button>
          </NavLink>
          <NavLink to="/operationalmanagerlandreportmanagement">
            <button className="bg-green-100 text-black px-4 py-2 rounded-md font-semibold hover:bg-green-600 hover:text-white transition">
              Assign Land Reports
            </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}
