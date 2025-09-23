import React, { useEffect, useState } from "react";
import { FileText, Handshake, User, Activity } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function DashboardContent() {
  const [userName, setUserName] = useState("");
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    pendingReports: 0,
    assignedSupervisors: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.name) {
      setUserName(storedUser.name);
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch dashboard statistics
      const statsResponse = await fetch('http://localhost/FARMMASTER-Backend/api.php/dashboard/stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!statsResponse.ok) {
        throw new Error(`HTTP error! status: ${statsResponse.status}`);
      }

      const statsData = await statsResponse.json();
      
      if (statsData.status === 'success') {
        setDashboardData({
          totalUsers: statsData.data.total_users || 0,
          pendingReports: statsData.data.pending_reports || 0,
          assignedSupervisors: statsData.data.assigned_supervisors || 0
        });
      }

      // Fetch recent activity
      const activityResponse = await fetch('http://localhost/FARMMASTER-Backend/api.php/dashboard/activity', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!activityResponse.ok) {
        throw new Error(`HTTP error! status: ${activityResponse.status}`);
      }

      const activityData = await activityResponse.json();
      
      if (activityData.status === 'success') {
        setRecentActivity(activityData.data || []);
      }

    } catch (err) {
      setError('Failed to fetch dashboard data: ' + err.message);
      console.error('Error fetching dashboard data:', err);
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
      case 'user':
        return <User className="text-green-700" size={26} />;
      default:
        return <Activity className="text-green-700" size={26} />;
    }
  };

  const formatActivityDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      
      if (diffInMinutes < 60) {
        return `${diffInMinutes} minutes ago`;
      } else if (diffInMinutes < 1440) {
        const hours = Math.floor(diffInMinutes / 60);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      } else {
        const days = Math.floor(diffInMinutes / 1440);
        return `${days} day${days > 1 ? 's' : ''} ago`;
      }
    } catch (e) {
      return 'Recently';
    }
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

      {/* Error Banner */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-center">{error}</p>
          <button 
            onClick={() => {setError(null); fetchDashboardData();}}
            className="mt-2 mx-auto block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      
      <div className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="border rounded-md p-6 shadow-sm text-center">
            <p className="text-sm text-gray-600">Total Users</p>
            <p className="text-2xl font-bold mt-1">
              {loading ? "..." : error ? "N/A" : dashboardData.totalUsers.toLocaleString()}
            </p>
          </div>
          <div className="border rounded-md p-6 shadow-sm text-center">
            <p className="text-sm text-gray-600">Pending Land Reports</p>
            <p className="text-2xl font-bold mt-1">
              {loading ? "..." : error ? "N/A" : dashboardData.pendingReports}
            </p>
          </div>
          <div className="border rounded-md p-6 shadow-sm text-center">
            <p className="text-sm text-gray-600">Assigned Supervisors</p>
            <p className="text-2xl font-bold mt-1">
              {loading ? "..." : error ? "N/A" : dashboardData.assignedSupervisors}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        {loading ? (
          <div className="bg-green-50/50 p-4 rounded-md">
            <p className="text-center text-gray-500">Loading recent activity...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-center text-red-600">Failed to load recent activity</p>
          </div>
        ) : recentActivity.length > 0 ? (
          <ul className="space-y-4 bg-green-50/50 p-4 rounded-md">
            {recentActivity.map((activity, index) => (
              <li key={index} className="flex items-start gap-5">
                <div className="bg-green-100 rounded-sm p-2">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{activity.title}</p>
                  <p className="text-sm text-green-600">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatActivityDate(activity.activity_date)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="bg-green-50/50 p-4 rounded-md">
            <p className="text-center text-gray-500">No recent activity found</p>
          </div>
        )}
      </div>
    </div>
  );
}
