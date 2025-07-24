import React, { useState } from "react";

export default function MarketplaceFinancePage() {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [paymentSchedule, setPaymentSchedule] = useState("");

  const transactions = [
    {
      product: "Organic Rice",
      buyer: "Samantha Perera",
      quantity: "100 kg",
      totalPrice: "$500",
      date: "2024-07-26",
    },
    {
      product: "Organic Vegetables",
      buyer: "Rohan Silva",
      quantity: "50 kg",
      totalPrice: "$250",
      date: "2024-07-25",
    },
    {
      product: "Organic Fruits",
      buyer: "Nimal Fernando",
      quantity: "75 kg",
      totalPrice: "$375",
      date: "2024-07-24",
    },
    {
      product: "Organic Spices",
      buyer: "Deepa Rajapaksa",
      quantity: "25 kg",
      totalPrice: "$125",
      date: "2024-07-23",
    },
    {
      product: "Organic Tea",
      buyer: "Arun Kumar",
      quantity: "150 kg",
      totalPrice: "$750",
      date: "2024-07-22",
    },
    {
      product: "Organic Rice",
      buyer: "Samantha Perera",
      quantity: "100 kg",
      totalPrice: "$500",
      date: "2024-07-21",
    },
    {
      product: "Organic Vegetables",
      buyer: "Rohan Silva",
      quantity: "50 kg",
      totalPrice: "$250",
      date: "2024-07-20",
    },
    {
      product: "Organic Fruits",
      buyer: "Nimal Fernando",
      quantity: "75 kg",
      totalPrice: "$375",
      date: "2024-07-19",
    },
    {
      product: "Organic Spices",
      buyer: "Deepa Rajapaksa",
      quantity: "25 kg",
      totalPrice: "$125",
      date: "2024-07-18",
    },
    {
      product: "Organic Tea",
      buyer: "Arun Kumar",
      quantity: "150 kg",
      totalPrice: "$750",
      date: "2024-07-17",
    },
  ];

  return (
    <div className="flex-1 bg-white min-h-screen p-4 md:p-10 font-poppins">
      
      <h1 className="text-3xl md:text-4xl font-bold text-black mb-2 mt-4">
        Marketplace Finance
      </h1>
      <p className="text-green-700 text-sm mb-6">
        Manage your sales income and transaction history from the online marketplace.
      </p>

     
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="border rounded-md p-6 shadow-sm text-center">
          <p className="text-sm text-gray-600">Total Sales Income</p>
          <p className="text-2xl font-bold mt-1">125,000 LKR</p>
        </div>
        <div className="border rounded-md p-6 shadow-sm text-center">
          <p className="text-sm text-gray-600">Average Transaction Value</p>
          <p className="text-2xl font-bold mt-1">2,500 LKR</p>
        </div>
        <div className="border rounded-md p-6 shadow-sm text-center">
          <p className="text-sm text-gray-600">Total Transactions</p>
          <p className="text-2xl font-bold mt-1">500</p>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        <div className="overflow-x-auto bg-white border rounded-xl shadow-sm">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-green-50 text-black font-semibold">
              <tr>
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">Buyer</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4">Total Price</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn, index) => (
                <tr key={index} className="border-t hover:bg-green-50">
                  <td className="px-6 py-3">{txn.product}</td>
                  <td className="px-6 py-3">{txn.buyer}</td>
                  <td className="px-6 py-3">{txn.quantity}</td>
                  <td className="px-6 py-3">{txn.totalPrice}</td>
                  <td className="px-6 py-3">{txn.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button className="bg-green-600 text-white px-6 py-2 mt-5 rounded-md text-sm font-semibold hover:bg-green-700 cursor-pointer">
          Download Report
        </button>
      </div>      
    </div>
  );
}
