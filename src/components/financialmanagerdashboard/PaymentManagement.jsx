import React from "react";
import { FiSearch } from "react-icons/fi";

const transactions = [
  {
    id: "TXN12345",
    payer: "Samantha Perera",
    amount: "LKR 50,000",
    date: "2024-07-26",
    method: "Bank Transfer",
    status: "Completed",
  },
  {
    id: "TXN67890",
    payer: "Rohan Silva",
    amount: "LKR 25,000",
    date: "2024-07-25",
    method: "Credit Card",
    status: "Completed",
  },
  {
    id: "TXN24680",
    payer: "Nimal Fernando",
    amount: "LKR 75,000",
    date: "2024-07-24",
    method: "Bank Transfer",
    status: "Pending",
  },
  {
    id: "TXN13579",
    payer: "Chandani Rajapaksa",
    amount: "LKR 30,000",
    date: "2024-07-23",
    method: "Credit Card",
    status: "Completed",
  },
  {
    id: "TXN98765",
    payer: "Kamal De Silva",
    amount: "LKR 45,000",
    date: "2024-07-22",
    method: "Bank Transfer",
    status: "Completed",
  },
  {
    id: "TXN54321",
    payer: "Anura Wijesinghe",
    amount: "LKR 60,000",
    date: "2024-07-21",
    method: "Credit Card",
    status: "Pending",
  },
  {
    id: "TXN11223",
    payer: "Priya Jayawardena",
    amount: "LKR 35,000",
    date: "2024-07-20",
    method: "Bank Transfer",
    status: "Completed",
  },
];

export default function PaymentManagement() {
  return (
    <div className="flex-1 bg-white min-h-screen p-4 md:p-10 font-poppins">
     
      <h1 className="text-3xl md:text-4xl font-bold text-black mb-2 mt-4">
        Payment Management
      </h1>
      <p className="text-green-700 mb-6 text-sm">
        Manage and track all payments within the FarmMaster system.
      </p>

      
      <div className="relative mb-6">
        <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-green-600" />
        <input
          type="text"
          placeholder="Search  by Transaction ID, Payer, or Amount"
          className="w-full bg-green-50 rounded-md pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-green-400"
        />
      </div>

      
      <div className="overflow-x-auto bg-white border rounded-xl shadow-sm">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-green-50 text-black font-semibold">
            <tr>
              <th className="px-6 py-4 whitespace-nowrap">Transaction ID</th>
              <th className="px-6 py-4 whitespace-nowrap">Payer</th>
              <th className="px-6 py-4 whitespace-nowrap">Amount</th>
              <th className="px-6 py-4 whitespace-nowrap">Date</th>
              <th className="px-6 py-4 whitespace-nowrap">Payment Method</th>
              <th className="px-6 py-4 whitespace-nowrap">Status</th>
              <th className="px-6 py-4 whitespace-nowrap text-green-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn.id} className="border-t hover:bg-green-50">
                <td className="px-6 py-4">{txn.id}</td>
                <td className="px-6 py-4">{txn.payer}</td>
                <td className="px-6 py-4">{txn.amount}</td>
                <td className="px-6 py-4">{txn.date}</td>
                <td className="px-6 py-4">{txn.method}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-4 py-1 rounded-full text-xs font-semibold block text-center w-fit ${
                      txn.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {txn.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-sm whitespace-nowrap text-black">
                  <div className="flex flex-wrap gap-1">
                    <button className="hover:underline hover:text-green-600 cursor-pointer">View</button>
                    {txn.status === "Completed" ? (
                      <button className="hover:underline hover:text-green-600 cursor-pointer">| Refund</button>
                    ) : (
                      <button className="hover:underline hover:text-green-600 cursor-pointer">| Mark as Paid</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
