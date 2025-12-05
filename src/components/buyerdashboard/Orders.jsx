import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Orders({ user, rootUrl }) {
  // Use env variable if rootUrl is not passed as prop
  const apiRootUrl = rootUrl || import.meta.env.VITE_API_URL;

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

  return (
    <div className="flex-1 bg-white min-h-screen p-4 md:p-10 font-poppins">
      {/* Heading */}
      <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">Orders</h1>
      <p className="text-green-600 mb-6 text-sm sm:text-base">
        View your recent order history (last 30 orders)
      </p>

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
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                    No orders to display.
                  </td>
                </tr>
              ) : (
                orders.map((order, idx) => (
                  <tr key={order.id || idx} className="border-t hover:bg-green-50">
                    <td className="px-4 py-3">{order.order_number || order.id}</td>
                    <td className="px-4 py-3 text-green-600">{order.date}</td>
                    <td className="px-4 py-3">{order.product || "No products"}</td>
                    <td className="px-4 py-3">{order.total}</td>
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
        


