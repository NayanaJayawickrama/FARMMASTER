import React, { useEffect, useState } from "react";
import { FileText, CheckCircle, Bell, RefreshCw } from "lucide-react";
import axios from "axios";

const rootUrl = import.meta.env.VITE_API_URL;

export default function FSDashboardContent() {
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
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
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchDashboardData(true); // Silent refresh
    }, 30000);

    // Listen for dashboard update events from other components
    const handleStorageChange = (e) => {
      if (e.key === 'dashboard_update_trigger') {
        fetchDashboardData(true);
        // Clean up the trigger
        localStorage.removeItem('dashboard_update_trigger');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events within the same window
    const handleCustomUpdate = () => {
      fetchDashboardData(true);
    };
    
    window.addEventListener('dashboard_update', handleCustomUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('dashboard_update', handleCustomUpdate);
    };
  }, []);

  const fetchDashboardData = async (silent = false) => {
    if (!silent) {
      setLoading(true);
    }
    
    try {
      const response = await axios.get(`${rootUrl}/api/land-reports/assigned`, {
        withCredentials: true,
        // Add cache-busting parameter to ensure fresh data
        params: {
          t: Date.now()
        }
      });
      
      if (response.data.status === 'success') {
        const reportsData = response.data.data || [];
        setReports(reportsData);
        setLastUpdated(new Date());
        
        // Calculate statistics with more detailed breakdown
        const totalAssigned = reportsData.length;
        const completed = reportsData.filter(r => 
          r.completion_status === 'Completed' || 
          r.completion_status === 'completed' ||
          (r.environmental_notes && r.ph_value && r.crop_recommendations)
        ).length;
        const inProgress = reportsData.filter(r => 
          r.completion_status === 'In Progress' || 
          r.completion_status === 'in_progress'
        ).length;
        const pending = reportsData.filter(r => 
          !r.completion_status || 
          r.completion_status === 'Pending' ||
          r.completion_status === 'pending'
        ).length;
        
        setStats({
          totalAssigned,
          pending: pending + inProgress, // Combine pending and in-progress
          completed
        });

        // Generate notifications from recent reports
        const notifications = generateNotifications(reportsData);
        setNotifications(notifications);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (!silent) {
        setNotifications([{
          id: 'error-fetch',
          type: 'error',
          icon: Bell,
          title: 'Error loading dashboard data',
          subtitle: 'Please check your connection and try again',
          priority: 'high'
        }]);
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
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
        priority: 'medium'
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
        priority: 'low'
      });
    });

    // Add pending reminders with dynamic urgency
    if (pendingReports.length > 0) {
      const oldestPending = pendingReports.sort((a, b) => 
        new Date(a.assigned_date || a.report_date) - new Date(b.assigned_date || b.report_date)
      )[0];
      
      // Calculate urgency based on how old the assignment is
      const assignedDate = new Date(oldestPending.assigned_date || oldestPending.report_date);
      const daysOld = Math.floor((new Date() - assignedDate) / (1000 * 60 * 60 * 24));
      const priority = daysOld > 7 ? 'high' : daysOld > 3 ? 'medium' : 'low';
      
      notifications.push({
        id: `reminder-${oldestPending.report_id}`,
        type: 'reminder',
        icon: Bell,
        title: `${daysOld > 7 ? 'Urgent: ' : ''}Complete report ${oldestPending.formatted_report_id}`,
        subtitle: `Location: ${oldestPending.location} - Assigned ${assignedDate.toLocaleDateString()} (${daysOld} days ago)`,
        priority: priority
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
          {lastUpdated && (
            <p className="text-xs text-gray-500 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end mt-4 md:mt-0">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
            disabled={loading}
          >
            <RefreshCw className={loading ? "animate-spin" : ""} size={16} />
            {loading ? 'Updating...' : 'Refresh'}
          </button>
          <p className="text-xs text-gray-500 mt-2">
            Auto-refreshes every 30 seconds
          </p>
        </div>
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
            {/* Total Assigned - Neutral color */}
            <div className="border rounded-md p-6 shadow-sm text-center bg-gray-50 border-gray-200 hover:shadow-md transition-shadow">
              <p className="text-sm text-gray-600">Total Assigned Reports</p>
              <p className="text-2xl font-bold mt-1 text-gray-800">{stats.totalAssigned}</p>
            </div>
            
            {/* Pending - Dynamic color based on urgency */}
            <div className={`border rounded-md p-6 shadow-sm text-center hover:shadow-md transition-shadow ${
              stats.pending === 0 
                ? 'bg-gray-50 border-gray-200' 
                : stats.pending > 5 
                ? 'bg-red-50 border-red-200' 
                : stats.pending > 2 
                ? 'bg-amber-50 border-amber-200' 
                : 'bg-yellow-50 border-yellow-200'
            }`}>
              <p className="text-sm text-gray-600">Reports Pending</p>
              <p className={`text-2xl font-bold mt-1 ${
                stats.pending === 0 
                  ? 'text-gray-500' 
                  : stats.pending > 5 
                  ? 'text-red-600' 
                  : stats.pending > 2 
                  ? 'text-amber-600' 
                  : 'text-yellow-600'
              }`}>{stats.pending}</p>
              {stats.pending > 5 && (
                <p className="text-xs text-red-500 mt-1">High Priority!</p>
              )}
            </div>
            
            {/* Completed - Dynamic color based on completion rate */}
            <div className={`border rounded-md p-6 shadow-sm text-center hover:shadow-md transition-shadow ${
              stats.totalAssigned === 0 
                ? 'bg-gray-50 border-gray-200'
                : (stats.completed / stats.totalAssigned) > 0.8 
                ? 'bg-emerald-50 border-emerald-200' 
                : (stats.completed / stats.totalAssigned) > 0.5 
                ? 'bg-green-50 border-green-200' 
                : 'bg-lime-50 border-lime-200'
            }`}>
              <p className="text-sm text-gray-600">Reports Completed</p>
              <p className={`text-2xl font-bold mt-1 ${
                stats.totalAssigned === 0 
                  ? 'text-gray-500'
                  : (stats.completed / stats.totalAssigned) > 0.8 
                  ? 'text-emerald-600' 
                  : (stats.completed / stats.totalAssigned) > 0.5 
                  ? 'text-green-600' 
                  : 'text-lime-600'
              }`}>{stats.completed}</p>
              {stats.totalAssigned > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round((stats.completed / stats.totalAssigned) * 100)}% Complete
                </p>
              )}
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
          <ul className="space-y-4 bg-gray-50/50 p-4 rounded-md border border-gray-200">
            {notifications.map((notification) => {
              const IconComponent = notification.icon;
              
              // Dynamic color classes based on priority and type
              const getPriorityColors = (priority, type) => {
                if (type === 'completion') {
                  return 'bg-green-100 text-green-700 border-green-200';
                }
                if (priority === 'high') {
                  return 'bg-red-100 text-red-700 border-red-200';
                }
                if (priority === 'medium') {
                  return 'bg-amber-100 text-amber-700 border-amber-200';
                }
                return 'bg-slate-100 text-slate-700 border-slate-200';
              };
              
              const getTextColor = (priority, type) => {
                if (type === 'completion') return 'text-green-600';
                if (priority === 'high') return 'text-red-600';
                if (priority === 'medium') return 'text-amber-600';
                return 'text-slate-600';
              };
              
              return (
                <li key={notification.id} className={`flex items-start gap-4 p-3 rounded-md border transition-all hover:shadow-sm ${
                  notification.priority === 'high' ? 'bg-red-50/50 border-red-100' :
                  notification.priority === 'medium' ? 'bg-amber-50/50 border-amber-100' :
                  notification.type === 'completion' ? 'bg-green-50/50 border-green-100' :
                  'bg-white border-gray-100'
                }`}>
                  <div className={`rounded-lg p-2 border ${getPriorityColors(notification.priority, notification.type)}`}>
                    <IconComponent size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{notification.title}</p>
                    <p className={`text-sm ${getTextColor(notification.priority, notification.type)}`}>
                      {notification.subtitle}
                    </p>
                    {notification.priority === 'high' && (
                      <span className="inline-block mt-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                        Urgent
                      </span>
                    )}
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
