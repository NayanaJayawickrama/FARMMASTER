import React, { useEffect, useState } from "react";
import {
  ShoppingCart,
  CheckCircle,
  Bell,
  Repeat,
  X
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import RoleSwitcher from "../RoleSwitcher";

const rootUrl = import.meta.env.VITE_API_URL;

export default function BuyerDashboardContent() {
  const [user, setUser] = useState({});
  const { user: authUser } = useAuth();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const [dashboardData, setDashboardData] = useState({
    recentOrders: [],
    purchaseHistory: [],
    recentActivities: []
  });
  const calculateTotalSpending = (dashboardData) => {
  let sum = 0;
  if (!dashboardData) return sum;

  if (dashboardData.purchaseHistory) {
    dashboardData.purchaseHistory.forEach((purchase) => {
      sum += parseFloat(purchase.total_amount || 0);
    });
  }

  if (dashboardData.recentOrders) {
    dashboardData.recentOrders.forEach((order) => {
      sum += parseFloat(order.total_amount || 0);
    });
  }

  return parseFloat(sum.toFixed(2));
};


  // Fetch data from backend
  const fetchBuyerDashboardData = async () => {
    try {
      const res = await axios.post(
        `${rootUrl}/api/buyerDashboard`,
        { userId: user.id },
        { withCredentials: true }
      );

      if (res.data && res.data.data) {
        setDashboardData({
          recentOrders: res.data.data.recent_orders || [],
          purchaseHistory: res.data.data.purchase_history || [],
          recentActivities: res.data.data.recent_activities || []
        });
      }
    } catch (error) {
      console.error("Error fetching buyer dashboard data:", error);
    }
  };

  useEffect(() => {
    if (user && user.id) {
      fetchBuyerDashboardData();
    }
  }, [user]);

  console.log(dashboardData.recentActivities)

  return (
    <div className="p-4 md:p-10 font-poppins">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-green-600 mt-1">
            Welcome back, {user?.name || "Buyer"}
          </p>
        </div>
        <RoleSwitcher className="mt-4 md:mt-0" />
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="border rounded-md p-6 shadow-sm text-center">
          <p className="text-sm text-gray-600">Recent Orders</p>
          <p className="text-2xl font-bold mt-1">{dashboardData.recentOrders.length}</p>
        </div>
        <div className="border rounded-md p-6 shadow-sm text-center">
          <p className="text-sm text-gray-600">Total Spendings</p>
          <p className="text-2xl font-bold mt-1">
            {calculateTotalSpending(dashboardData)} LKR
          </p>
        </div>
        <div className="border rounded-md p-6 shadow-sm text-center">
          <p className="text-sm text-gray-600">Purchase History</p>
          <p className="text-2xl font-bold mt-1">{dashboardData.purchaseHistory.length}</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <ul className="space-y-4 bg-green-50/50 p-4 rounded-md">
          {dashboardData.recentActivities.length > 0 ? (
            dashboardData.recentActivities.map((activity, index) => (
              <li key={index} className="flex items-start gap-4">
                <div className="bg-green-100 rounded-sm p-2">
                  {activity.order_status === "pending" && (
                    <Bell className="text-green-700" size={24} />
                  )}
                  {(activity.order_status === "completed" ||
                    activity.order_status === "delivered") && (
                    <CheckCircle className="text-green-700" size={24} />
                  )}
                  {activity.order_status === "processing" && (
                    <Repeat className="text-green-700" size={24} />
                  )}
                  {activity.order_status === "shipped" && (
                    <ShoppingCart className="text-green-700" size={24} />
                  )}
                  {activity.order_status === "cancelled" && (
                    <X className="text-red-600" size={24} />
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    Order #{activity.order_number} – {activity.order_status}
                  </p>
                  <p className="text-sm text-green-600">
                    {activity.created_at
                      ? new Date(activity.created_at).toLocaleDateString()
                      : "No date"}
                  </p>
                </div>
              </li>
            ))
          ) : (
            <li className="text-gray-600">No recent activities</li>
          )}
        </ul>
      </div>
    </div>
  );
}
