import React, { useEffect, useState } from "react";
import { FileText, CheckCircle, Bell, RefreshCw, AlertTriangle, TrendingUp, Clock } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const rootUrl = import.meta.env.VITE_API_URL;

export default function FSDashboardContent() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [stats, setStats] = useState({
    totalAssigned: 0,
    inProgress: 0,
    completed: 0
  });
  const [notifications, setNotifications] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  // Fetch dynamic dashboard data
  const fetchDashboardData = async (silent = false) => {
    if (!silent) {
      setLoading(true);
      setError("");
    }
    
    try {
      // Get supervisor ID from user context
      const supervisorId = user?.user_id || user?.id;
      
      if (!supervisorId) {
        setError("User information not available. Please log in again.");
        return;
      }

      if (!rootUrl) {
        setError("API configuration missing. Please check environment settings.");
        return;
      }
      
      const response = await axios.get(`${rootUrl}/api/land-reports/assigned`, {
        withCredentials: true,
        params: {
          supervisor_id: supervisorId,
          t: Date.now()
        }
      });
      
      if (response.data && response.data.status === 'success') {
        const reportsData = response.data.data || [];
        
        setReports(reportsData);
        setLastUpdated(new Date());
        
        // Calculate statistics (excluding pending)
        const totalAssigned = reportsData.length;
        const completed = reportsData.filter(r => 
          r.completion_status === 'Completed' || 
          r.completion_status === 'completed'
        ).length;
        const inProgress = reportsData.filter(r => 
          r.completion_status === 'In Progress' || 
          r.completion_status === 'in_progress' ||
          (!r.completion_status && (r.ph_value || r.environmental_notes))
        ).length;
        
        const calculatedStats = {
          totalAssigned,
          inProgress,
          completed
        };
        
        setStats(calculatedStats);

        // Generate notifications and activity
        const notifications = generateNotifications(reportsData);
        const activity = generateRecentActivity(reportsData);
        
        setNotifications(notifications);
        setRecentActivity(activity);
        
        setError("");
        
      } else {
        setError(response.data?.message || "Failed to load dashboard data - invalid response format.");
      }
    } catch (err) {
      if (!silent) {
        if (err.response?.status === 401) {
          setError("Authentication required. Please log in again.");
        } else if (err.response?.status === 403) {
          setError("Access denied. Only field supervisors can view this dashboard.");
        } else if (err.response?.status === 404) {
          setError("API endpoint not found. Please contact system administrator.");
        } else if (err.code === 'ECONNABORTED') {
          setError("Request timed out. Please check your internet connection and try again.");
        } else if (err.code === 'NETWORK_ERROR' || err.message.includes('Network Error')) {
          setError("Network error. Please check your internet connection.");
        } else {
          setError(`Server error while loading dashboard data: ${err.message}`);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Generate dynamic notifications based on real data
  const generateNotifications = (reportsData) => {
    const notifications = [];
    
    // Get current date for calculations
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    
    // Find overdue reports (assigned more than 7 days ago and still not completed)
    const overdueReports = reportsData.filter(report => {
      const assignedDate = new Date(report.assigned_date || report.report_date);
      return assignedDate < sevenDaysAgo && report.completion_status !== 'Completed';
    });

    // Find recent assignments (last 3 days)
    const recentAssignments = reportsData.filter(report => {
      const assignedDate = new Date(report.assigned_date || report.report_date);
      return assignedDate > threeDaysAgo && report.completion_status !== 'Completed';
    });

    // Find reports in progress
    const inProgressReports = reportsData.filter(report => 
      report.completion_status === 'In Progress' ||
      (!report.completion_status && (report.ph_value || report.environmental_notes))
    );

    // Add overdue notifications (high priority)
    if (overdueReports.length > 0) {
      const oldestOverdue = overdueReports.sort((a, b) => 
        new Date(a.assigned_date || a.report_date) - new Date(b.assigned_date || b.report_date)
      )[0];
      
      const daysOverdue = Math.floor((now - new Date(oldestOverdue.assigned_date || oldestOverdue.report_date)) / (1000 * 60 * 60 * 24));
      
      notifications.push({
        id: `overdue-${oldestOverdue.report_id}`,
        type: 'urgent',
        icon: AlertTriangle,
        title: `Urgent: ${overdueReports.length} overdue report${overdueReports.length > 1 ? 's' : ''}`,
        subtitle: `Oldest: ${oldestOverdue.formatted_report_id || `RPT-${oldestOverdue.report_id}`} - ${daysOverdue} days overdue`,
        priority: 'high',
        count: overdueReports.length
      });
    }

    // Add recent assignment notifications (medium priority)
    if (recentAssignments.length > 0) {
      notifications.push({
        id: 'recent-assignments',
        type: 'assignment',
        icon: FileText,
        title: `${recentAssignments.length} new assignment${recentAssignments.length > 1 ? 's' : ''} this week`,
        subtitle: `Latest: ${recentAssignments[0].location} - ${new Date(recentAssignments[0].assigned_date || recentAssignments[0].report_date).toLocaleDateString()}`,
        priority: 'medium',
        count: recentAssignments.length
      });
    }

    // Add in-progress reminder (low priority)
    if (inProgressReports.length > 0) {
      notifications.push({
        id: 'in-progress',
        type: 'progress',
        icon: Clock,
        title: `${inProgressReports.length} report${inProgressReports.length > 1 ? 's' : ''} in progress`,
        subtitle: `Continue working on pending reports`,
        priority: 'low',
        count: inProgressReports.length
      });
    }

    // Add completion celebration (if any completed recently)
    const recentlyCompleted = reportsData.filter(report => {
      if (report.completion_status !== 'Completed') return false;
      const reportDate = new Date(report.report_date);
      return reportDate > threeDaysAgo;
    });

    if (recentlyCompleted.length > 0) {
      notifications.push({
        id: 'recent-completions',
        type: 'completion',
        icon: CheckCircle,
        title: `${recentlyCompleted.length} report${recentlyCompleted.length > 1 ? 's' : ''} completed recently`,
        subtitle: `Great work! Keep up the momentum`,
        priority: 'success',
        count: recentlyCompleted.length
      });
    }

    return notifications.slice(0, 4); // Limit to 4 notifications
  };

  // Generate recent activity feed
  const generateRecentActivity = (reportsData) => {
    const activities = [];
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Sort reports by date (most recent first)
    const sortedReports = [...reportsData].sort((a, b) => 
      new Date(b.assigned_date || b.report_date) - new Date(a.assigned_date || a.report_date)
    );

    sortedReports.slice(0, 5).forEach(report => {
      const assignedDate = new Date(report.assigned_date || report.report_date);
      const isRecent = assignedDate > sevenDaysAgo;
      
      let activityType = 'assigned';
      let icon = FileText;
      let description = `Assigned to analyze land at ${report.location}`;
      
      if (report.completion_status === 'Completed') {
        activityType = 'completed';
        icon = CheckCircle;
        description = `Completed land analysis for ${report.location}`;
      } else if (report.ph_value || report.environmental_notes) {
        activityType = 'progress';
        icon = TrendingUp;
        description = `Started analysis for ${report.location}`;
      }
      
      activities.push({
        id: report.report_id,
        type: activityType,
        icon,
        title: report.formatted_report_id || `RPT-${report.report_id}`,
        description,
        landowner: report.landowner_name || `${report.first_name} ${report.last_name}`,
        date: assignedDate,
        isRecent,
        status: report.completion_status || 'Pending'
      });
    });

    return activities;
  };

  // Auto-refresh and event listeners
  useEffect(() => {
    if (user && (user.user_id || user.id)) {
      fetchDashboardData();
    } else {
      setLoading(false);
      if (!user) {
        setError("Please log in to view the dashboard.");
      }
    }
    
    const interval = setInterval(() => {
      if (user && (user.user_id || user.id)) {
        fetchDashboardData(true);
      }
    }, 60000);

    const handleStorageChange = (e) => {
      if (e.key === 'dashboard_update_trigger') {
        fetchDashboardData(true);
        localStorage.removeItem('dashboard_update_trigger');
      }
    };

    const handleCustomUpdate = () => {
      fetchDashboardData(true);
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('dashboard_update', handleCustomUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('dashboard_update', handleCustomUpdate);
    };
  }, [user?.user_id, user?.id]);

  const handleRefresh = () => {
    fetchDashboardData();
  };

  return (
    <div className="p-4 md:p-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 mt-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Field Supervisor Dashboard</h1>
          <p className="text-sm md:text-lg text-green-600 mt-2">
            Welcome back, {user?.name || user?.first_name || "Field Supervisor"}
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
            Auto-refreshes every 60 seconds
          </p>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-medium">Error Loading Dashboard</div>
              <div className="text-sm mt-1">{error}</div>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleRefresh}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors text-sm"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors text-sm"
            >
              Reload Page
            </button>
          </div>
        </div>
      )}

      {/* Show empty state when no error but no data */}
      {!loading && !error && stats.totalAssigned === 0 && (
        <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            <span>No reports have been assigned to you yet. New assignments will appear here.</span>
          </div>
        </div>
      )}

      {/* Overview Statistics - Updated to match site colors */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Assignment Overview</h2>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="border rounded-lg p-6 shadow-sm text-center animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Total Assigned - Green theme */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6 shadow-sm text-center hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center mb-2">
                <FileText className="w-6 h-6 text-green-600 mr-2" />
                <p className="text-sm text-green-700 font-medium">Total Assigned</p>
              </div>
              <p className="text-3xl font-bold text-green-800">{stats.totalAssigned}</p>
              <p className="text-xs text-green-600 mt-1">All time</p>
            </div>
            
            {/* In Progress - Light green theme */}
            <div className="bg-gradient-to-br from-green-100 to-green-200 border border-green-300 rounded-lg p-6 shadow-sm text-center hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-6 h-6 text-green-700 mr-2" />
                <p className="text-sm text-green-800 font-medium">In Progress</p>
              </div>
              <p className="text-3xl font-bold text-green-900">{stats.inProgress}</p>
              <p className="text-xs text-green-700 mt-1">Active work</p>
            </div>
            
            {/* Completed - Emerald green theme */}
            <div className={`border rounded-lg p-6 shadow-sm text-center hover:shadow-md transition-shadow ${
              stats.totalAssigned === 0 
                ? 'bg-gray-50 border-gray-200'
                : 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200'
            }`}>
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className={`w-6 h-6 mr-2 ${
                  stats.totalAssigned === 0 ? 'text-gray-500' : 'text-emerald-600'
                }`} />
                <p className={`text-sm font-medium ${
                  stats.totalAssigned === 0 ? 'text-gray-600' : 'text-emerald-700'
                }`}>Completed</p>
              </div>
              <p className={`text-3xl font-bold ${
                stats.totalAssigned === 0 ? 'text-gray-500' : 'text-emerald-800'
              }`}>{stats.completed}</p>
              {stats.totalAssigned > 0 && (
                <p className="text-xs text-emerald-600 mt-1">
                  {Math.round((stats.completed / stats.totalAssigned) * 100)}% completion rate
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Notifications Section - Updated colors */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Notifications & Alerts</h2>
        {loading ? (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-start gap-4 animate-pulse">
                  <div className="bg-gray-200 rounded-lg p-3 w-12 h-12"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => {
              const IconComponent = notification.icon;
              
              const getPriorityColors = () => {
                switch (notification.priority) {
                  case 'high':
                    return 'bg-red-50 border-red-200 hover:bg-red-100';
                  case 'medium':
                    return 'bg-orange-50 border-orange-200 hover:bg-orange-100';
                  case 'success':
                    return 'bg-green-50 border-green-200 hover:bg-green-100';
                  default:
                    return 'bg-green-50 border-green-200 hover:bg-green-100';
                }
              };
              
              const getIconColors = () => {
                switch (notification.priority) {
                  case 'high':
                    return 'bg-red-100 text-red-600 border-red-200';
                  case 'medium':
                    return 'bg-orange-100 text-orange-600 border-orange-200';
                  case 'success':
                    return 'bg-green-100 text-green-600 border-green-200';
                  default:
                    return 'bg-green-100 text-green-600 border-green-200';
                }
              };
              
              return (
                <div key={notification.id} className={`flex items-center gap-4 p-4 rounded-lg border transition-all cursor-pointer ${getPriorityColors()}`}>
                  <div className={`rounded-lg p-3 border ${getIconColors()}`}>
                    <IconComponent size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                      {notification.count > 1 && (
                        <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          {notification.count}
                        </span>
                      )}
                      {notification.priority === 'high' && (
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          URGENT
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">{notification.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-green-50 p-8 rounded-lg text-center border border-green-100">
            <Bell className="mx-auto mb-4 text-green-400" size={48} />
            <p className="text-green-700 text-lg font-medium">No notifications</p>
            <p className="text-green-600 text-sm mt-2">
              {stats.totalAssigned === 0 
                ? "You'll see notifications here when reports are assigned to you" 
                : "All caught up! Great work on staying current with your assignments"}
            </p>
          </div>
        )}
      </div>

      {/* Recent Activity - Updated colors */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-lg border animate-pulse">
                <div className="bg-gray-200 rounded-lg p-3 w-12 h-12"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2 w-2/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        ) : recentActivity.length > 0 ? (
          <div className="space-y-3">
            {recentActivity.map((activity) => {
              const IconComponent = activity.icon;
              
              return (
                <div key={activity.id} className={`flex items-center gap-4 p-4 rounded-lg border transition-all hover:shadow-md ${
                  activity.isRecent ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                }`}>
                  <div className={`rounded-lg p-3 border ${
                    activity.type === 'completed' ? 'bg-emerald-100 text-emerald-600 border-emerald-200' :
                    activity.type === 'progress' ? 'bg-green-100 text-green-600 border-green-200' :
                    'bg-gray-100 text-gray-600 border-gray-200'
                  }`}>
                    <IconComponent size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900">{activity.title}</h4>
                      {activity.isRecent && (
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Landowner: {activity.landowner} • {activity.date.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      activity.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                      activity.status === 'In Progress' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {activity.status || 'Pending'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-green-50 p-8 rounded-lg text-center border border-green-100">
            <TrendingUp className="mx-auto mb-4 text-green-400" size={48} />
            <p className="text-green-700 text-lg font-medium">No recent activity</p>
            <p className="text-green-600 text-sm mt-2">
              Your recent assignments and progress will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
            