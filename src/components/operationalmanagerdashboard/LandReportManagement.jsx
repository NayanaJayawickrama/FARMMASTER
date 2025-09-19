import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LandReportReview from "./LandReportReview";

const LandReportManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("reviews");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedSupervisor, setSelectedSupervisor] = useState("");
  const [availableSupervisors, setAvailableSupervisors] = useState([]);
  const [loadingSupervisors, setLoadingSupervisors] = useState(false);

  // Fetch land reports from backend
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use the public endpoint for testing (no authentication required)
      const response = await fetch('http://localhost/FARMMASTER-Backend/api.php/land-reports/public', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === 'success') {
        setReports(data.data);
      } else {
        setError(data.message || 'Failed to fetch land reports');
      }
    } catch (err) {
      setError('Failed to connect to backend: ' + err.message);
      console.error('Error fetching land reports:', err);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (report) => {
    // Navigate to the land report details page
    navigate(`/land-report-details/${report.report_id}`);
  };

  // Handle assignment functions
  const handleAssignSupervisor = async (assignment) => {
    setSelectedAssignment(assignment);
    setShowAssignModal(true);
    
    // Fetch available supervisors
    try {
      setLoadingSupervisors(true);
      const response = await fetch('http://localhost/FARMMASTER-Backend/api.php/land-reports/supervisors-public', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          setAvailableSupervisors(data.data);
        } else {
          console.error('Failed to fetch supervisors:', data.message);
          alert('Failed to fetch supervisors: ' + data.message);
          setShowAssignModal(false);
        }
      }
    } catch (error) {
      console.error('Error fetching supervisors:', error);
    } finally {
      setLoadingSupervisors(false);
    }
  };

  const handleSubmitAssignment = async () => {
    if (!selectedSupervisor) {
      alert("Please select a supervisor");
      return;
    }

    const supervisor = availableSupervisors.find(s => s.user_id === selectedSupervisor);
    if (!supervisor) {
      alert("Invalid supervisor selection");
      return;
    }

    try {
      const response = await fetch(`http://localhost/FARMMASTER-Backend/api.php/land-reports/${selectedAssignment.report_id}/assign-public`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          supervisor_name: supervisor.full_name,
          supervisor_id: supervisor.user_id
        })
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        alert(`Supervisor ${supervisor.full_name} (ID: ${supervisor.user_id}) assigned successfully!`);
        
        // Close modal and reset form
        setShowAssignModal(false);
        setSelectedSupervisor("");
        setSelectedAssignment(null);
        setAvailableSupervisors([]);
        
        // Refresh data
        fetchReports();
      } else {
        alert('Failed to assign supervisor: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      alert("Failed to assign supervisor: " + err.message);
    }
  };

  // Transform backend data for display
  const transformedReports = reports.map(report => {
    // Extract supervisor information from environmental_notes
    let supervisorInfo = 'To be assigned';
    if (report.environmental_notes && report.environmental_notes.includes('Assigned to:')) {
      const lines = report.environmental_notes.split('\n');
      const supervisorLine = lines.find(line => line.includes('Assigned to:'));
      if (supervisorLine) {
        supervisorInfo = supervisorLine.replace('Assigned to:', '').trim();
      }
    }
    
    return {
      id: `#LR-${report.report_id}`,
      location: report.location,
      name: `${report.first_name} ${report.last_name}`,
      email: report.email,
      date: new Date(report.report_date).toLocaleDateString(),
      status: report.status || 'Pending',
      report_id: report.report_id,
      land_id: report.land_id,
      user_id: report.user_id,
      supervisor_info: supervisorInfo,
      is_assigned: supervisorInfo !== 'To be assigned' // Based on actual supervisor assignment
    };
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Assigned":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-yellow-100 text-yellow-700"; // Default to Pending style for any unknown status
    }
  };

  if (showReview) {
    return <LandReportReview onBack={() => setShowReview(false)} />;
  }

  return (
    <div className="flex-1 bg-white min-h-screen p-4 md:p-10 font-poppins">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-4 mt-4">
          Land Report Management
        </h1>
        <p className="text-green-600 mt-1">
          Manage land assessment assignments and review submitted reports
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("assignments")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "assignments"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Assignment Management
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "reviews"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Report Reviews
          </button>
        </nav>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading land reports...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={fetchReports}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Assignment Management Tab */}
      {activeTab === "assignments" && !loading && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead>
                <tr className="bg-green-50 text-left text-sm text-gray-700">
                  <th className="py-3 px-4">Assignment ID</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Landowner Name</th>
                  <th className="py-3 px-4">Date Assigned</th>
                  <th className="py-3 px-4">Supervisor</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-green-600">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {transformedReports.length === 0 && !error ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-gray-500">
                      No assignments found in the database
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-gray-500">
                      Unable to load assignments. Please check your backend connection.
                    </td>
                  </tr>
                ) : (
                  transformedReports.map((assignment, index) => (
                    <tr
                      key={assignment.report_id || index}
                      className="border-t border-gray-200 hover:bg-green-50 transition"
                    >
                      <td className="py-3 px-4">{assignment.id}</td>
                      <td className="py-3 px-4">{assignment.location}</td>
                      <td className="py-3 px-4">{assignment.name}</td>
                      <td className="py-3 px-4">{assignment.date}</td>
                      <td className="py-3 px-4">
                        {assignment.is_assigned ? assignment.supervisor_info : 'To be assigned'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                          assignment.is_assigned ? getStatusColor("Approved") : getStatusColor("Pending")
                        }`}>
                          {assignment.is_assigned ? 'Assigned' : 'Pending Assignment'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-2">
                          {!assignment.is_assigned && (
                            <button
                              onClick={() => handleAssignSupervisor(assignment)}
                              className="text-green-600 font-semibold hover:underline hover:text-green-700 cursor-pointer text-xs"
                            >
                              Assign
                            </button>
                          )}
                          {assignment.is_assigned && (
                            <span className="text-green-600 font-semibold text-xs">
                              ✓ Assigned
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report Reviews Tab */}
      {activeTab === "reviews" && !loading && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead>
                <tr className="bg-green-50 text-left text-sm text-gray-700">
                  <th className="py-3 px-4">Report ID</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Landowner Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Report Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-green-600">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {transformedReports.length === 0 && !error ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-gray-500">
                      No reports found in the database
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-gray-500">
                      Unable to load reports. Please check your backend connection.
                    </td>
                  </tr>
                ) : (
                  transformedReports.map((report, index) => (
                    <tr
                      key={report.report_id || index}
                      className="border-t border-gray-200 hover:bg-green-50 transition"
                    >
                      <td className="py-3 px-4">{report.report_id}</td>
                      <td className="py-3 px-4 text-green-700">{report.location}</td>
                      <td className="py-3 px-4">{report.name}</td>
                      <td className="py-3 px-4">{report.email}</td>
                      <td className="py-3 px-4">{report.date}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleViewDetails(report)}
                          className="text-black font-semibold hover:underline hover:text-green-600 cursor-pointer"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Assign Supervisor
            </h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Assigning supervisor for: <span className="font-semibold">{selectedAssignment?.location}</span>
              </p>
              <p className="text-sm text-gray-600">
                Landowner: <span className="font-semibold">{selectedAssignment?.name}</span>
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Supervisor
                </label>
                {loadingSupervisors ? (
                  <div className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-500">
                    Loading supervisors...
                  </div>
                ) : (
                  <select
                    value={selectedSupervisor}
                    onChange={(e) => setSelectedSupervisor(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">-- Select a supervisor --</option>
                    {availableSupervisors.map((supervisor) => (
                      <option key={supervisor.user_id} value={supervisor.user_id}>
                        {supervisor.full_name} ({supervisor.user_id}) - {supervisor.role}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {selectedSupervisor && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                  <h4 className="text-sm font-medium text-green-800 mb-2">Supervisor Details:</h4>
                  {availableSupervisors
                    .filter(s => s.user_id === selectedSupervisor)
                    .map(supervisor => (
                      <div key={supervisor.user_id} className="text-sm text-green-700">
                        <p><strong>Name:</strong> {supervisor.full_name}</p>
                        <p><strong>ID:</strong> {supervisor.user_id}</p>
                        <p><strong>Email:</strong> {supervisor.email}</p>
                        <p><strong>Role:</strong> {supervisor.role}</p>
                        {supervisor.phone_number && (
                          <p><strong>Phone:</strong> {supervisor.phone_number}</p>
                        )}
                      </div>
                    ))
                  }
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedSupervisor("");
                  setSelectedAssignment(null);
                  setAvailableSupervisors([]);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitAssignment}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition"
              >
                Assign Supervisor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandReportManagement;