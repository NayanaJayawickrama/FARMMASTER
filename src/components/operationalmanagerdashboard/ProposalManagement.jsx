import React from "react";

// Sample proposal data
const proposals = [
  {
    id: "#2024001",
    name: "Rohan Silva",
    status: "Pending",
    profit: "Rs. 50,000",
  },
  {
    id: "#2024002",
    name: "Nimal Perera",
    status: "Accepted",
    profit: "Rs. 75,000",
  },
  {
    id: "#2024003",
    name: "Kamal Fernando",
    status: "Rejected",
    profit: "Rs. 60,000",
  },
  {
    id: "#2024004",
    name: "Sunil Jayawardena",
    status: "Pending",
    profit: "Rs. 80,000",
  },
  {
    id: "#2024005",
    name: "Chandrika Bandara",
    status: "Accepted",
    profit: "Rs. 90,000",
  },
];

const statusStyles = {
  Pending: "bg-green-50 text-black",
  Accepted: "bg-green-200 text-black font-semibold",
  Rejected: "bg-red-100 text-red-700 font-semibold",
};

export default function ProposalManagement() {
  return (
    <div className="flex-1 bg-white min-h-screen p-4 md:p-10 font-poppins">
    
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-4 mt-4">Proposal Management</h1>
        <p className="text-green-600 mt-1">
          Manage and send proposals to landowners.
        </p>
      </div>

  
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
        <table className="min-w-full border border-gray-200">
          <thead>
            <tr className="bg-green-50 text-left text-sm text-gray-700">
              <th className="py-3 px-4">Proposal ID</th>
              <th className="py-3 px-4">Landowner Name</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Profit Estimate</th>
              <th className="py-3 px-4 text-green-600">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {proposals.map((proposal, index) => (
              <tr
                key={index}
                className="border-t border-gray-200 hover:bg-green-50 transition"
              >
                <td className="py-3 px-4">{proposal.id}</td>
                <td className="py-3 px-4 text-green-700">{proposal.name}</td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm ${statusStyles[proposal.status]}`}
                  >
                    {proposal.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-green-700">{proposal.profit}</td>
                <td className="py-3 px-4 text-black font-semibold hover:underline hover:text-green-600 cursor-pointer">
                  View Details
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
