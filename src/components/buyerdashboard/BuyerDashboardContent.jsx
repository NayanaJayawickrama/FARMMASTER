import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Package,
  Calendar
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import RoleSwitcher from "../RoleSwitcher";

const rootUrl = import.meta.env.VITE_API_URL;

export default function BuyerDashboardContent() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const { user: authUser } = useAuth();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const [dashboardData, setDashboardData] = useState({
    allOrders: [],
    recentActivities: []
  });

  const calculateTotalSpending = (dashboardData) => {
    let sum = 0;
    if (!dashboardData || !dashboardData.allOrders) return sum;

    dashboardData.allOrders.forEach((order) => {
      sum += parseFloat(order.total_amount || 0);
    });

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
        // Combine recent orders and purchase history into one array
        const allOrders = [
          ...(res.data.data.recent_orders || []),
          ...(res.data.data.purchase_history || [])
        ];
        
        setDashboardData({
          allOrders: allOrders,
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="border rounded-md p-6 shadow-sm text-center">
          <p className="text-sm text-gray-600">Total Orders</p>
          <p className="text-2xl font-bold mt-1">{dashboardData.allOrders.length}</p>
        </div>
        <div className="border rounded-md p-6 shadow-sm text-center">
          <p className="text-sm text-gray-600">Total Spendings</p>
          <p className="text-2xl font-bold mt-1">
            {calculateTotalSpending(dashboardData)} LKR
          </p>
        </div>
      </div>

      {/* Recent Purchases */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Recent Purchases</h2>
        <div className="bg-white border rounded-xl shadow-sm">
          {dashboardData.recentActivities.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {dashboardData.recentActivities.map((purchase, index) => (
                <div key={index} className="flex items-center justify-between p-4 hover:bg-green-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 rounded-full p-3">
                      <Package className="text-green-700" size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Order #{purchase.order_number}
                      </p>
                      <p className="text-sm text-gray-600">
                        {purchase.created_at
                          ? new Date(purchase.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })
                          : "No date"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-700">
                      Rs. {parseFloat(purchase.total_amount || 0).toFixed(2)}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar size={12} />
                      <span>
                        {purchase.created_at
                          ? new Date(purchase.created_at).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <ShoppingCart size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No recent purchases</p>
              <p className="text-sm">Your recent orders will appear here</p>
            </div>
          )}
        </div>
        {dashboardData.recentActivities.length > 0 && (
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/buyerorders')}
              className="text-green-600 hover:text-green-700 font-medium text-sm hover:underline"
            >
              View All Orders →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
