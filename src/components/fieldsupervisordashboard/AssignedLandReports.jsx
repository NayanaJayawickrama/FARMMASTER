import React from "react";

const reportData = [
  {
    id: "RPT-2024-001",
    name: "Kamal Perera",
    location: "Badulla",
    date: "2024-07-20",
    status: "Pending",
  },
  {
    id: "RPT-2024-002",
    name: "Nimal Silva",
    location: "Badulla",
    date: "2024-07-21",
    status: "In Progress",
  },
  {
    id: "RPT-2024-003",
    name: "Sunil Fernando",
    location: "Badulla",
    date: "2024-07-22",
    status: "Pending",
  },
  {
    id: "RPT-2024-004",
    name: "Rohan De Silva",
    location: "Badulla",
    date: "2024-07-23",
    status: "Completed",
  },
  {
    id: "RPT-2024-005",
    name: "Lakshmi Wijesinghe",
    location: "Badulla",
    date: "2024-07-24",
    status: "Pending",
  },
];

const statusStyles = {
  Pending: "bg-green-100 text-green-800",
  "In Progress": "bg-yellow-100 text-yellow-800",
  Completed: "bg-gray-100 text-gray-800",
};

export default function AssignedLandReports() {
  return (
    <div className="flex-1 bg-white min-h-screen p-4 md:p-10 font-poppins">
      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 mt-4">
          Assigned Land Reports
        </h2>
        <p className="text-green-600 mb-6 text-sm sm:text-base">
          Manage and view reports for assigned lands
        </p>

        <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-green-50 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">Report ID</th>
                <th className="py-3 px-4 text-left">Landowner Name</th>
                <th className="py-3 px-4 text-left">Location</th>
                <th className="py-3 px-4 text-left">Assigned Date</th>
                <th className="py-3 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-t border-gray-200 hover:bg-green-50"
                >
                  <td className="py-3 px-4 text-green-700">{item.id}</td>
                  <td className="py-3 px-4 text-green-700">{item.name}</td>
                  <td className="py-3 px-4">{item.location}</td>
                  <td className="py-3 px-4">{item.date}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full inline-block ${statusStyles[item.status]}`}
                    >
                      {item.status}
                    </span>
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
