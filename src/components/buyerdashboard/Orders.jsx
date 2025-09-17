import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";

const initialOrders = [
  {
    id: "#12345",
    date: "2024-07-26",
    product: "Organic Vegetables",
    total: "$50.00",
    status: "Delivered",
  },
  {
    id: "#12346",
    date: "2024-07-20",
    product: "Organic Fruits",
    total: "$75.00",
    status: "Shipped",
  },
  {
    id: "#12347",
    date: "2024-07-15",
    product: "Organic Spices",
    total: "$30.00",
    status: "Processing",
  },
  {
    id: "#12348",
    date: "2024-07-10",
    product: "Organic Vegetables",
    total: "$60.00",
    status: "Delivered",
  },
  {
    id: "#12349",
    date: "2024-07-05",
    product: "Organic Fruits",
    total: "$90.00",
    status: "Delivered",
  },
];

export default function Orders() {
  const [activeTab, setActiveTab] = useState("All");

  const filterOrders = () => {
    if (activeTab === "All") return initialOrders;
    if (activeTab === "Active")
      return initialOrders.filter(
        (order) => order.status === "Shipped" || order.status === "Processing"
      );
    if (activeTab === "Completed")
      return initialOrders.filter((order) => order.status === "Delivered");
  };

  const tabClass = (tab) =>
    `pb-2 border-b-2 text-sm sm:text-base ${
      activeTab === tab
        ? "border-green-600 text-green-700 font-semibold"
        : "border-transparent text-gray-500 hover:text-green-600"
    } cursor-pointer`;

  return (
    <div className="flex-1 bg-white min-h-screen p-4 md:p-10 font-poppins">
      {/* Heading */}
      <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">Orders</h1>
      <p className="text-green-600 mb-6 text-sm sm:text-base">
        View and manage your order history
      </p>

      {/* Search Bar */}
      <div className="relative mb-6">
        <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-green-600" />
        <input
          type="text"
          placeholder="Search orders"
          className="w-full bg-green-50 rounded-md pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-green-400"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-6 mb-6 border-b border-gray-200">
        <button className={tabClass("All")} onClick={() => setActiveTab("All")}>
          All Orders
        </button>
        <button
          className={tabClass("Active")}
          onClick={() => setActiveTab("Active")}
        >
          Active Orders
        </button>
        <button
          className={tabClass("Completed")}
          onClick={() => setActiveTab("Completed")}
        >
          Completed Orders
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white border rounded-xl shadow-sm">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-green-50 text-black font-semibold">
            <tr>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Products</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filterOrders().map((order, idx) => (
              <tr key={idx} className="border-t hover:bg-green-50">
                <td className="px-4 py-3">{order.id}</td>
                <td className="px-4 py-3 text-green-600">{order.date}</td>
                <td className="px-4 py-3">{order.product}</td>
                <td className="px-4 py-3">{order.total}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Shipped"
                        ? "bg-blue-100 text-blue-700"
                        : order.status === "Processing"
                        ? "bg-yellow-100 text-yellow-700"
                        : ""
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
