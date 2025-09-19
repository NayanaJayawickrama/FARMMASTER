import React, { useEffect, useState } from "react";
import { FileText, Handshake } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function DashboardContent() {
  const [userName, setUserName] = useState("");
  const [dashboardStats, setDashboardStats] = useState({
    total_users: 0,
    pending_reports: 0,
    assigned_supervisors: 0,
    active_cultivations: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.name) {
      setUserName(storedUser.name);
    }
    
    // Fetch dashboard statistics and recent activity from API
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard statistics
      const statsResponse = await fetch('http://localhost/FARMMASTER-Backend/api.php/dashboard/stats');
      const statsData = await statsResponse.json();
      
      if (statsData.status === 'success') {
        setDashboardStats(statsData.data);
      }
      
      // Fetch recent activity
      const activityResponse = await fetch('http://localhost/FARMMASTER-Backend/api.php/dashboard/activity');
      const activityData = await activityResponse.json();
      
      if (activityData.status === 'success') {
        setRecentActivity(activityData.data);
      }
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'land_report':
        return <FileText className="text-green-700" size={26} />;
      case 'proposal':
        return <Handshake className="text-green-700" size={26} />;
      default:
        return <FileText className="text-green-700" size={26} />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  return (
    <div className="p-4 md:p-10 font-poppins">
    
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 mt-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Dashboard</h1>
          <p className="text-sm md:text-lg text-green-600 mt-2">
            Welcome back, {userName || "Operational Manager"}
          </p>
        </div>
      </div>

      
      <div className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Overview</h2>
        {loading ? (
          <div className="text-center text-gray-600">Loading statistics...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border rounded-md p-6 shadow-sm text-center">
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold mt-1">{dashboardStats.total_users}</p>
            </div>
            <div className="border rounded-md p-6 shadow-sm text-center">
              <p className="text-sm text-gray-600">Pending Land Reports</p>
              <p className="text-2xl font-bold mt-1">{dashboardStats.pending_reports}</p>
            </div>
            <div className="border rounded-md p-6 shadow-sm text-center">
              <p className="text-sm text-gray-600">Assigned Supervisors</p>
              <p className="text-2xl font-bold mt-1">{dashboardStats.assigned_supervisors}</p>
            </div>
            <div className="border rounded-md p-6 shadow-sm text-center">
              <p className="text-sm text-gray-600">Active Cultivations</p>
              <p className="text-2xl font-bold mt-1">{dashboardStats.active_cultivations}</p>
            </div>
          </div>
        )}
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        {loading ? (
          <div className="text-center text-gray-600">Loading recent activity...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : (
          <ul className="space-y-4 bg-green-50/50 p-4 rounded-md">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <li key={index} className="flex items-start gap-5">
                  <div className="bg-green-100 rounded-sm p-2">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{activity.title}</p>
                    <p className="text-sm text-green-600 mb-1">
                      {activity.description.length > 100 
                        ? activity.description.substring(0, 100) + '...' 
                        : activity.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(activity.activity_date)}
                    </p>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-center text-gray-500 py-4">
                No recent activity found
              </li>
            )}
          </ul>
        )}
      </div>

     
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-5">
          <NavLink to="/operationalmanagerusermanagement">
            <button className="bg-green-100 text-black px-4 py-2 rounded-md font-semibold hover:bg-green-600 hover:text-white transition">
              Manage Users
            </button>
          </NavLink>
          <NavLink to="/operationalmanagerproposalmanagement">
            <button className="bg-green-100 text-black px-4 py-2 rounded-md font-semibold hover:bg-green-600 hover:text-white transition">
              View Proposals
            </button>
          </NavLink>
          <NavLink to="/operationalmanagercropinventorymanagement">
            <button className="bg-green-100 text-black px-4 py-2 rounded-md font-semibold hover:bg-green-600 hover:text-white transition">
              Crop Inventory
            </button>
          </NavLink>
          <NavLink to="/operationalmanagerlandreportmanagement">
            <button className="bg-green-100 text-black px-4 py-2 rounded-md font-semibold hover:bg-green-600 hover:text-white transition">
              Assign Land Reports
            </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}
