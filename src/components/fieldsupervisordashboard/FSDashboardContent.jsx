import React from "react";
import { FileText, CheckCircle, Bell } from "lucide-react";

export default function FSDashboardContent() {
  return (
    <div className="p-4 md:p-10">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 mt-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Dashboard</h1>
          <p className="text-sm md:text-lg text-green-600 mt-2">
            Welcome back, Saman Silva
          </p>
        </div>
      </div>

      {/* Overview Section */}
      <div className="mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="border rounded-md p-6 shadow-sm text-center">
            <p className="text-sm text-gray-600">Assigned Reports</p>
            <p className="text-2xl font-bold mt-1">12</p>
          </div>
          <div className="border rounded-md p-6 shadow-sm text-center">
            <p className="text-sm text-gray-600">Reports Pending Submission</p>
            <p className="text-2xl font-bold mt-1">3</p>
          </div>
          <div className="border rounded-md p-6 shadow-sm text-center">
            <p className="text-sm text-gray-600">Reports Submitted</p>
            <p className="text-2xl font-bold mt-1">9</p>
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Notifications</h2>
        <ul className="space-y-4 bg-green-50/50 p-4 rounded-md">
          <li className="flex items-start gap-5">
            <div className="bg-green-100 rounded-sm p-2">
              <FileText className="text-green-700" size={26} />
            </div>
            <div>
              <p className="font-semibold">
                New report assigned: Field Visit - Passara
              </p>
              <p className="text-sm text-green-600">
                Requested on 2024-01-15
              </p>
            </div>
          </li>
          <li className="flex items-start gap-5">
            <div className="bg-green-100 rounded-sm p-2">
              <CheckCircle className="text-green-700" size={26} />
            </div>
            <div>
              <p className="font-semibold">
                Report submitted successfully: Field Visit - Badulla
              </p>
              <p className="text-sm text-green-600">Submitted on 2024-02-01</p>
            </div>
          </li>
          <li className="flex items-start gap-5">
            <div className="bg-green-100 rounded-sm p-2">
              <Bell className="text-green-700" size={26} />
            </div>
            <div>
              <p className="font-semibold">
                Reminder: Submit report for Field Visit - Hali Ela
              </p>
              <p className="text-sm text-green-600">Requested on 2024-03-10</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
