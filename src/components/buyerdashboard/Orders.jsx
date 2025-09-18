import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Orders({ user, rootUrl }) {
  // Use env variable if rootUrl is not passed as prop
  const apiRootUrl = rootUrl || import.meta.env.VITE_API_URL;

  const [activeTab, setActiveTab] = useState("All");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Try to get user from props, then localStorage (as object)
    let userObj = user && user.id ? user : null;
    if (!userObj) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          userObj = JSON.parse(storedUser);
        } catch (e) {
          userObj = null;
        }
      }
    }
    const userId = userObj && userObj.id ? userObj.id : null;
    console.log("Orders userId from localStorage:", userObj && userObj.id);
    console.log("Orders userId from prop:", user && user.id);
    console.log("Orders userId used:", userId);

    if (!userId) {
      setError("User not found.");
      setLoading(false);
      return;
    }
    if (!apiRootUrl) {
      setError("API root URL not set.");
      setLoading(false);
      return;
    }
    setLoading(true);
    axios
      .post(
        `${apiRootUrl}/api/buyer/orders`,
        { userId },
        { withCredentials: true }
      )
      .then((res) => {
        console.log("Orders API response:", res.data); // Debug log
        if (
          res.data &&
          res.data.status === 'success' &&
          res.data.data &&
          Array.isArray(res.data.data.orders)
        ) {
          setOrders(res.data.data.orders);
          setError("");
          console.log("Orders set in state:", res.data.data.orders); // Debug log
        } else {
          setOrders([]);
          setError(res.data.message || "No orders found.");
        }
        setLoading(false);
      })
      .catch(() => {
        setOrders([]);
        setError("Failed to fetch orders.");
        setLoading(false);
      });
  }, [user, rootUrl]);

  const filterOrders = () => {
    let filtered = orders;
    if (activeTab === "Active")
      filtered = orders.filter(
        (order) =>
          order.status !== "delivered" &&
          order.status !== "cancelled" &&
          order.status !== "Delivered" &&
          order.status !== "Cancelled"
      );
    if (activeTab === "Completed")
      filtered = orders.filter(
        (order) =>
          order.status === "delivered" ||
          order.status === "cancelled" ||
          order.status === "Delivered" ||
          order.status === "Cancelled"
      );
    return filtered;
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
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading orders...</div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">{error}</div>
        ) : (
          <table className="min-w-full text-sm text-left">
            <thead className="bg-green-50 text-black font-semibold">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Payment Date</th>
                <th className="px-4 py-3">Products</th>
                <th className="px-4 py-3">Total Amount</th>
                <th className="px-4 py-3">Order Status</th>
              </tr>
            </thead>
            <tbody>
              {filterOrders().length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                    No orders to display.
                  </td>
                </tr>
              ) : (
                filterOrders().map((order, idx) => (
                  <tr key={order.id || idx} className="border-t hover:bg-green-50">
                    <td className="px-4 py-3">{order.order_number || order.id}</td>
                    <td className="px-4 py-3 text-green-600">{order.date}</td>
                    <td className="px-4 py-3">{order.product || "No products"}</td>
                    <td className="px-4 py-3">{order.total}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          order.status === "Delivered" || order.status === "delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "Shipped" || order.status === "shipped"
                            ? "bg-blue-100 text-blue-700"
                            : order.status === "Processing" || order.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : ""
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}


