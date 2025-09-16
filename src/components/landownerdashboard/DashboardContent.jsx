import React, { useEffect, useState } from "react";
import { FileText, Handshake, Leaf, Repeat, MapPin, Calendar } from "lucide-react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const rootUrl = import.meta.env.VITE_API_URL;

export default function DashboardContent() {
  const [user, setUser] = useState(null);
  const [landReports, setLandReports] = useState([]);
  const [assessmentRequests, setAssessmentRequests] = useState([]);
  const [userLands, setUserLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: authUser } = useAuth();

  // Test user ID
  const testUserId = authUser?.id || 32;

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
      // Fetch assessment requests (includes both requests and reports)
      const [requestsResponse, landsResponse] = await Promise.all([
        axios.get(`${rootUrl}/assessments?user_id=${testUserId}`, { withCredentials: true }),
        axios.get(`${rootUrl}/api/lands?user_id=${testUserId}`, { withCredentials: true })
      ]);

      if (requestsResponse.data.status === 'success') {
        // Store full assessment requests data
        const assessmentData = requestsResponse.data.data || [];
        setAssessmentRequests(assessmentData);
        // Convert assessment requests to land reports format for compatibility
        const completedReports = assessmentData.filter(item => item.has_report);
        setLandReports(completedReports);
      }
      
      if (landsResponse.data.status === 'success') {
        setUserLands(landsResponse.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'text-green-600';
      case 'rejected': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  // Calculate statistics from assessment requests
  const totalRequests = assessmentRequests.length;
  const completedReports = assessmentRequests.filter(r => r.has_report && r.report_status === 'Approved').length;
  const pendingRequests = assessmentRequests.filter(r => 
    r.overall_status === 'Payment Pending' || 
    r.overall_status === 'Assessment Pending' || 
    (r.has_report && !r.report_status)
  ).length;
  const totalLands = userLands.length;
  const recentActivity = [
    ...assessmentRequests.slice(0, 5).map(request => ({
      type: request.has_report ? 'report' : 'request',
      title: request.has_report 
        ? `Land Report #${request.report_id}` 
        : `Assessment Request #${request.land_id}`,
      subtitle: `${request.overall_status} - ${request.location}`,
      date: request.has_report ? request.report_date : request.request_date,
      status: request.overall_status
    }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div className="p-4 md:p-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 mt-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Dashboard</h1>
          <p className="text-sm md:text-lg text-green-600 mt-2">
            Welcome back, {user?.name || authUser?.name || "Landowner"}
          </p>
        </div>
        <button className="border border-black px-4 py-2 rounded-md hover:bg-gray-100 flex items-center gap-2 font-bold text-black mt-4 md:mt-0">
          <Repeat size={20} />
          Switch to Buyer
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="text-gray-500">Loading dashboard data...</div>
        </div>
      ) : (
        <>
          {/* Overview */}
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="border rounded-md p-6 shadow-sm text-center">
                <p className="text-sm text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold mt-1">{totalRequests}</p>
              </div>
              <div className="border rounded-md p-6 shadow-sm text-center">
                <p className="text-sm text-gray-600">Completed Reports</p>
                <p className="text-2xl font-bold mt-1 text-green-600">{completedReports}</p>
              </div>
              <div className="border rounded-md p-6 shadow-sm text-center">
                <p className="text-sm text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold mt-1 text-yellow-600">{pendingRequests}</p>
              </div>
              <div className="border rounded-md p-6 shadow-sm text-center">
                <p className="text-sm text-gray-600">Registered Lands</p>
                <p className="text-2xl font-bold mt-1">{totalLands}</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
            {recentActivity.length > 0 ? (
              <ul className="space-y-4 bg-green-50/50 p-4 rounded-md">
                {recentActivity.map((activity, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className="bg-green-100 rounded-sm p-2">
                      {activity.type === 'report' ? (
                        <FileText className="text-green-700" size={26} />
                      ) : activity.type === 'request' ? (
                        <MapPin className="text-green-700" size={26} />
                      ) : activity.type === 'proposal' ? (
                        <Handshake className="text-green-700" size={26} />
                      ) : (
                        <MapPin className="text-green-700" size={26} />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{activity.title}</p>
                      <p className="text-sm text-gray-600">{activity.subtitle}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar size={14} className="text-gray-400" />
                        <p className="text-xs text-gray-500">
                          {new Date(activity.date).toLocaleDateString()}
                        </p>
                        {activity.status && (
                          <span className={`text-xs ${getStatusColor(activity.status)}`}>
                            • {activity.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="bg-gray-50 p-8 rounded-md text-center">
                <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No recent activity found</p>
                <p className="text-sm text-gray-500">Start by requesting a land assessment</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
