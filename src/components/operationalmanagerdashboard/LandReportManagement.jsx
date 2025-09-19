import React, { useState } from "react";
import LandReportReview from "./LandReportReview";

const assignmentData = [
  {
    id: "#2024-LR-023",
    location: "Kandy",
    name: "Nimal Perera",
    date: "2025-02-11",
    supervisor: "Mr. Perera",
    status: "Assigned",
  },
  {
    id: "#2024-LR-011",
    location: "Nuwara Eliya",
    name: "Roshan Silva",
    date: "2025-02-11",
    supervisor: "Unassigned",
    status: "Unassigned",
  },
  {
    id: "#2024-LR-091",
    location: "Kurunegala",
    name: "Harsha Silva",
    date: "2025-02-11",
    supervisor: "Mr. Fernando",
    status: "Assigned",
  },
  {
    id: "#2024-LR-073",
    location: "Matara",
    name: "Dumindu Perera",
    date: "2025-02-11",
    supervisor: "Ms. De Silva",
    status: "In Progress",
  },
  {
    id: "#2024-LR-055",
    location: "Matale",
    name: "Ruwan Aravinda",
    date: "2025-02-11",
    supervisor: "Mr. Perera",
    status: "Assigned",
  },
];

const reviewData = [
  {
    id: "#2024-LR-023",
    location: "Kandy",
    name: "Nimal Perera",
    supervisorId: "SR0021",
    supervisor: "Mr. Perera",
    status: "Approved",
  },
  {
    id: "#2024-LR-011",
    location: "Nuwara Eliya",
    name: "Roshan Silva",
    supervisorId: "SR0044",
    supervisor: "Ms. Silva",
    status: "Not Reviewed",
  },
  {
    id: "#2024-LR-091",
    location: "Kurunegala",
    name: "Harsha Silva",
    supervisorId: "SR0021",
    supervisor: "Mr. Fernando",
    status: "Rejected",
  },
  {
    id: "#2024-LR-073",
    location: "Matara",
    name: "Dumindu Perera",
    supervisorId: "SR0021",
    supervisor: "Ms. De Silva",
    status: "Not Reviewed",
  },
  {
    id: "#2024-LR-055",
    location: "Matale",
    name: "Ruwan Aravinda",
    supervisorId: "SR0021",
    supervisor: "Mr. Perera",
    status: "Not Reviewed",
  },
];

const statusColors = {
  Assigned: "bg-green-100 text-green-800",
  "In Progress": "bg-yellow-100 text-yellow-800",
  Unassigned: "bg-gray-100 text-gray-800",
  Approved: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-700",
  "Not Reviewed": "bg-gray-100 text-gray-800",
};

export default function LandReportManagement() {
  const [showReview, setShowReview] = useState(false);

  if (showReview) {
    return <LandReportReview onBack={() => setShowReview(false)} />;
  }

  return (
    <div className="flex-1 bg-white min-h-screen p-4 md:p-10 font-poppins">
     
      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 mt-4">
          Land Report Assignments
        </h2>
        <p className="text-green-600 mb-6 text-sm sm:text-base">
          Manage and assign field supervisors to land report requests.
        </p>
        <div className="overflow-x-auto shadow-sm border border-gray-200 rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-green-50 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">Report ID</th>
                <th className="py-3 px-4 text-left">Location</th>
                <th className="py-3 px-4 text-left">Landowner Name</th>
                <th className="py-3 px-4 text-left">Requested Date</th>
                <th className="py-3 px-4 text-left">Supervisor Name</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left text-green-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignmentData.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-t border-gray-200 hover:bg-green-50"
                >
                  <td className="py-3 px-4">{item.id}</td>
                  <td className="py-3 px-4">{item.location}</td>
                  <td className="py-3 px-4 text-green-700">{item.name}</td>
                  <td className="py-3 px-4">{item.date}</td>
                  <td className="py-3 px-4">{item.supervisor}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full inline-block ${statusColors[item.status]}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-black font-semibold cursor-pointer hover:underline hover:text-green-600">
                    {item.status === "Unassigned" ? "Assign" : "Reassign"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 mt-4">
          Land Report Review & Approval
        </h2>
        <p className="text-green-600 mb-6 text-sm sm:text-base">
          Review the submitted land report data and provide feedback.
        </p>
        <div className="overflow-x-auto shadow-sm border border-gray-200 rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-green-50 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">Report ID</th>
                <th className="py-3 px-4 text-left">Location</th>
                <th className="py-3 px-4 text-left">Landowner Name</th>
                <th className="py-3 px-4 text-left">Supervisor ID</th>
                <th className="py-3 px-4 text-left">Supervisor Name</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left text-green-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviewData.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-t border-gray-200 hover:bg-green-50"
                >
                  <td className="py-3 px-4">{item.id}</td>
                  <td className="py-3 px-4">{item.location}</td>
                  <td className="py-3 px-4 text-green-700">{item.name}</td>
                  <td className="py-3 px-4">{item.supervisorId}</td>
                  <td className="py-3 px-4">{item.supervisor}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full inline-block ${statusColors[item.status]}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td
                    className="py-3 px-4 text-black font-semibold cursor-pointer hover:underline hover:text-green-600"
                    onClick={() => setShowReview(true)}
                  >
                    View Report
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
