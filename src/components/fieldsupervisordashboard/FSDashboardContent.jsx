import React, { useEffect, useState } from "react";
import { FileText, CheckCircle, Bell, RefreshCw } from "lucide-react";
import axios from "axios";

const rootUrl = import.meta.env.VITE_API_URL;

export default function FSDashboardContent() {
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAssigned: 0,
    pending: 0,
    completed: 0
  });
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${rootUrl}/api/land-reports/assigned`, {
        withCredentials: true
      });
      
      if (response.data.status === 'success') {
        const reportsData = response.data.data || [];
        setReports(reportsData);
        
        // Calculate statistics
        const totalAssigned = reportsData.length;
        const completed = reportsData.filter(r => r.completion_status === 'Completed').length;
        const pending = reportsData.filter(r => r.completion_status === 'In Progress' || !r.completion_status).length;
        
        setStats({
          totalAssigned,
          pending,
          completed
        });

        // Generate notifications from recent reports
        const notifications = generateNotifications(reportsData);
        setNotifications(notifications);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateNotifications = (reportsData) => {
    const notifications = [];
    
    // Recent assignments (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentAssignments = reportsData.filter(report => {
      const assignedDate = new Date(report.assigned_date || report.report_date);
      return assignedDate > sevenDaysAgo && (report.completion_status !== 'Completed');
    });

    const recentCompletions = reportsData.filter(report => {
      const reportDate = new Date(report.report_date);
      return reportDate > sevenDaysAgo && report.completion_status === 'Completed';
    });

    const pendingReports = reportsData.filter(report => 
      report.completion_status === 'In Progress' || !report.completion_status
    );

    // Add new assignment notifications
    recentAssignments.slice(0, 2).forEach(report => {
      notifications.push({
        id: `assignment-${report.report_id}`,
        type: 'assignment',
        icon: FileText,
        title: `New report assigned: ${report.formatted_report_id}`,
        subtitle: `Location: ${report.location} - ${new Date(report.assigned_date || report.report_date).toLocaleDateString()}`,
        color: 'blue'
      });
    });

    // Add completion notifications
    recentCompletions.slice(0, 1).forEach(report => {
      notifications.push({
        id: `completion-${report.report_id}`,
        type: 'completion',
        icon: CheckCircle,
        title: `Report completed: ${report.formatted_report_id}`,
        subtitle: `Landowner: ${report.landowner_name} - ${new Date(report.report_date).toLocaleDateString()}`,
        color: 'green'
      });
    });

    // Add pending reminders
    if (pendingReports.length > 0) {
      const oldestPending = pendingReports.sort((a, b) => 
        new Date(a.assigned_date || a.report_date) - new Date(b.assigned_date || b.report_date)
      )[0];
      
      notifications.push({
        id: `reminder-${oldestPending.report_id}`,
        type: 'reminder',
        icon: Bell,
        title: `Reminder: Complete report ${oldestPending.formatted_report_id}`,
        subtitle: `Location: ${oldestPending.location} - Assigned ${new Date(oldestPending.assigned_date || oldestPending.report_date).toLocaleDateString()}`,
        color: 'yellow'
      });
    }

    return notifications.slice(0, 3); // Limit to 3 notifications
  };

  const handleRefresh = () => {
    fetchDashboardData();
  };

  return (
    <div className="p-4 md:p-10">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 mt-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Dashboard</h1>
          <p className="text-sm md:text-lg text-green-600 mt-2">
            Welcome back, {user?.name || "Field Supervisor"}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 mt-4 md:mt-0"
          disabled={loading}
        >
          <RefreshCw className={loading ? "animate-spin" : ""} size={16} />
          Refresh
        </button>
      </div>

      {/* Overview Section */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Overview</h2>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="border rounded-md p-6 shadow-sm text-center animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="border rounded-md p-6 shadow-sm text-center bg-blue-50 border-blue-200">
              <p className="text-sm text-gray-600">Total Assigned Reports</p>
              <p className="text-2xl font-bold mt-1 text-blue-600">{stats.totalAssigned}</p>
            </div>
            <div className="border rounded-md p-6 shadow-sm text-center bg-yellow-50 border-yellow-200">
              <p className="text-sm text-gray-600">Reports Pending</p>
              <p className="text-2xl font-bold mt-1 text-yellow-600">{stats.pending}</p>
            </div>
            <div className="border rounded-md p-6 shadow-sm text-center bg-green-50 border-green-200">
              <p className="text-sm text-gray-600">Reports Completed</p>
              <p className="text-2xl font-bold mt-1 text-green-600">{stats.completed}</p>
            </div>
          </div>
        )}
      </div>

      {/* Notifications Section */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Recent Activity & Notifications</h2>
        {loading ? (
          <div className="bg-green-50/50 p-4 rounded-md">
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-start gap-4 animate-pulse">
                  <div className="bg-gray-200 rounded-sm p-2 w-10 h-10"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : notifications.length > 0 ? (
          <ul className="space-y-4 bg-green-50/50 p-4 rounded-md">
            {notifications.map((notification) => {
              const IconComponent = notification.icon;
              const colorClasses = {
                blue: 'bg-blue-100 text-blue-700',
                green: 'bg-green-100 text-green-700',
                yellow: 'bg-yellow-100 text-yellow-700'
              };
              
              return (
                <li key={notification.id} className="flex items-start gap-4">
                  <div className={`${colorClasses[notification.color]} rounded-sm p-2`}>
                    <IconComponent size={26} />
                  </div>
                  <div>
                    <p className="font-semibold">{notification.title}</p>
                    <p className="text-sm text-green-600">{notification.subtitle}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="bg-green-50/50 p-8 rounded-md text-center">
            <Bell className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-600 text-lg">No recent notifications</p>
            <p className="text-gray-500 text-sm mt-2">
              New assignments and updates will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
