import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiSearch, FiEye, FiRefreshCw, FiEdit, FiX, FiCheck, FiCheckCircle, FiAlertCircle, FiTrendingUp } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const rootUrl = import.meta.env.VITE_API_URL;

const statusStyles = {
  "In Progress": "bg-slate-100 text-slate-700 border border-slate-200",
  Completed: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  Approved: "bg-green-100 text-green-700 border border-green-200",
  Rejected: "bg-rose-100 text-rose-700 border border-rose-200",
  Pending: "bg-amber-100 text-amber-700 border border-amber-200"
};

export default function AssignedLandReports() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showDataForm, setShowDataForm] = useState(false);
  const [showViewDetails, setShowViewDetails] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [viewingReport, setViewingReport] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [popup, setPopup] = useState({ show: false, type: '', message: '' });
  const [newAssignments, setNewAssignments] = useState([]);
  const [loadingNewAssignments, setLoadingNewAssignments] = useState(true);
  const [assignmentNotification, setAssignmentNotification] = useState({
    show: false,
    message: "",
  });
  const [formData, setFormData] = useState({
    phValue: "",
    organicMatter: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    notes: "",
  });
  const [generatingRecommendations, setGeneratingRecommendations] = useState(false);
  const [recommendationsGenerated, setRecommendationsGenerated] = useState(false);

  // Popup utility functions
  const showPopup = (type, message) => {
    setPopup({ show: true, type, message });
    setTimeout(() => {
      setPopup({ show: false, type: '', message: '' });
    }, 4000);
  };

  const hidePopup = () => {
    setPopup({ show: false, type: '', message: '' });
  };

  // Check for new assignments
  const checkForNewAssignments = async () => {
    setLoadingNewAssignments(true);
    try {
      // Get supervisor ID from user context, fallback to default for testing
      const supervisorId = user?.user_id || 31; // Default to Kanchana Almeda for testing
      
      const response = await axios.get(`${rootUrl}/api/land-reports/assigned?supervisor_id=${supervisorId}`, {
        withCredentials: true
      });
      
      if (response.data.status === 'success') {
        const allReports = response.data.data || [];
        
        // Filter reports assigned in the last 24 hours
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        
        const recentAssignments = allReports.filter(report => {
          const assignedDate = new Date(report.assigned_date || report.report_date);
          return assignedDate > oneDayAgo && (report.completion_status === 'In Progress' || !report.completion_status);
        });
        
        setNewAssignments(recentAssignments);
        
        // Show notification if there are new assignments
        if (recentAssignments.length > 0) {
          setAssignmentNotification({
            show: true,
            message: `You have ${recentAssignments.length} new land report${recentAssignments.length > 1 ? 's' : ''} assigned to you!`
          });
        }
      }
    } catch (error) {
      console.error('Error checking for new assignments:', error);
    } finally {
      setLoadingNewAssignments(false);
    }
  };

  // Fetch assigned reports from backend
  const fetchAssignedReports = async () => {
    setLoading(true);
    setError("");
    try {
      // Get supervisor ID from user context, fallback to default for testing
      const supervisorId = user?.user_id || 31; // Default to Kanchana Almeda for testing
      
      console.log('Fetching assignments for supervisor ID:', supervisorId);
      console.log('Current user context:', user);
      
      const response = await axios.get(`${rootUrl}/api/land-reports/assigned?supervisor_id=${supervisorId}`, {
        withCredentials: true
      });
      
      console.log('API Response:', response.data);
      
      if (response.data.status === 'success') {
        const reportsData = response.data.data || [];
        setReports(reportsData);
      } else {
        setError(response.data.message || "Failed to load assigned reports.");
      }
    } catch (err) {
      console.error('Error fetching assigned reports:', err);
      if (err.response?.status === 401) {
        setError("Authentication required. Please log in.");
      } else if (err.response?.status === 403) {
        setError("Access denied. Only field supervisors can view assigned reports.");
      } else {
        setError("Server error while fetching assigned reports.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedReports();
    checkForNewAssignments();
  }, []);

  // Filter and search reports
  const filteredReports = reports.filter((report) => {
    const matchesSearch = searchTerm
      ? report.landowner_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.formatted_report_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.location?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    
    const matchesStatus = statusFilter
      ? (report.completion_status || 'In Progress') === statusFilter
      : true;
    
    return matchesSearch && matchesStatus;
  });

  // Handle refresh
  const handleRefresh = () => {
    fetchAssignedReports();
  };

  // Handle data submission form
  const handleSubmitData = (report) => {
    setSelectedReport(report);
    setFormData({
      phValue: report.ph_value || "",
      organicMatter: report.organic_matter || "",
      nitrogen: report.nitrogen_level || "",
      phosphorus: report.phosphorus_level || "",
      potassium: report.potassium_level || "",
      notes: report.environmental_notes || "",
    });
    setShowDataForm(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const response = await axios.put(`${rootUrl}/api/land-reports/${selectedReport.report_id}/submit-data`, {
        ph_value: formData.phValue,
        organic_matter: formData.organicMatter,
        nitrogen_level: formData.nitrogen,
        phosphorus_level: formData.phosphorus,
        potassium_level: formData.potassium,
        environmental_notes: formData.notes,
        status: 'Completed'
      }, {
        withCredentials: true
      });

      if (response.data.status === 'success') {
        showPopup('success', 'Data submitted successfully! Report status updated to Completed.');
        setShowDataForm(false);
        setSelectedReport(null);
        fetchAssignedReports(); // Refresh the list
      } else {
        showPopup('error', response.data.message || 'Failed to submit data');
      }
    } catch (err) {
      console.error('Error submitting data:', err);
      showPopup('error', 'Error submitting data. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Generate crop recommendations
  const handleGenerateRecommendations = async () => {
    // First validate that we have enough data
    if (!formData.phValue || !formData.organicMatter) {
      showPopup('error', 'Please enter at least pH value and organic matter percentage before generating recommendations.');
      return;
    }

    setGeneratingRecommendations(true);
    
    try {
      // First submit the current data
      console.log('Submitting data for report ID:', selectedReport.report_id);
      const submitResponse = await axios.put(`${rootUrl}/api/land-reports/${selectedReport.report_id}/submit-data`, {
        ph_value: formData.phValue,
        organic_matter: formData.organicMatter,
        nitrogen_level: formData.nitrogen,
        phosphorus_level: formData.phosphorus,
        potassium_level: formData.potassium,
        environmental_notes: formData.notes,
        status: 'Completed'
      }, {
        withCredentials: true
      });

      console.log('Submit response:', submitResponse.data);

      if (submitResponse.data.status === 'success') {
        // Now generate recommendations
        console.log('Generating recommendations for report ID:', selectedReport.report_id);
        const recommendResponse = await axios.post(`${rootUrl}/crop-recommendations.php?report_id=${selectedReport.report_id}`, {
          action: 'generate'
        }, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log('Recommendation response:', recommendResponse.data);

        if (recommendResponse.data.status === 'success') {
          setRecommendationsGenerated(true);
          showPopup('success', 'Crop recommendations generated successfully! You can now submit the complete report.');
          
          // Trigger dashboard refresh
          window.dispatchEvent(new Event('dashboard_update'));
        } else {
          showPopup('error', recommendResponse.data.message || 'Failed to generate crop recommendations');
        }
      } else {
        showPopup('error', submitResponse.data.message || 'Failed to submit data');
      }
    } catch (err) {
      console.error('Error generating recommendations:', err);
      console.log('Error details:', err.response?.data);
      showPopup('error', `Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setGeneratingRecommendations(false);
    }
  };

  // Final submission after recommendations are generated
  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Final submission to mark report as completed
      const response = await axios.put(`${rootUrl}/api/land-reports/${selectedReport.report_id}/submit-data`, {
        ph_value: formData.phValue,
        organic_matter: formData.organicMatter,
        nitrogen_level: formData.nitrogen,
        phosphorus_level: formData.phosphorus,
        potassium_level: formData.potassium,
        environmental_notes: formData.notes,
        status: 'Completed'
      }, {
        withCredentials: true
      });

      if (response.data.status === 'success') {
        showPopup('success', 'Land report submitted successfully!');
        setShowDataForm(false);
        setSelectedReport(null);
        setRecommendationsGenerated(false);
        fetchAssignedReports(); // Refresh the list
        
        // Trigger dashboard refresh
        window.dispatchEvent(new Event('dashboard_update'));
      } else {
        showPopup('error', response.data.message || 'Failed to submit report');
      }
    } catch (err) {
      console.error('Error submitting final report:', err);
      showPopup('error', 'Error submitting report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelForm = () => {
    setShowDataForm(false);
    setSelectedReport(null);
    setRecommendationsGenerated(false);
    setFormData({
      phValue: "",
      organicMatter: "",
      nitrogen: "",
      phosphorus: "",
      potassium: "",
      notes: "",
    });
  };

  // View report details - find and display submitted land data
  const handleViewReport = (reportId) => {
    try {
      const report = reports.find(r => 
        (r.formatted_report_id === reportId || r.report_id === reportId)
      );
      
      if (report) {
        setViewingReport(report);
        setShowViewDetails(true);
      } else {
        showPopup('error', 'Report not found');
      }
    } catch (error) {
      console.error("Error finding report details:", error);
      showPopup('error', 'Failed to load report details');
    }
  };

  return (
    <div className="flex-1 bg-white min-h-screen p-4 md:p-10 font-poppins">
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4 mt-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-black">
              Assigned Land Reports
            </h2>
            <p className="text-green-600 mb-6 text-sm sm:text-base">
              Manage and view reports assigned to you as a field supervisor
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
            disabled={loading}
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Notification for new assignments */}
        {!loadingNewAssignments && newAssignments.length > 0 && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <FiCheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  New Assignment{newAssignments.length > 1 ? 's' : ''} Available!
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>You have {newAssignments.length} new land report{newAssignments.length > 1 ? 's' : ''} assigned to you:</p>
                  <ul className="list-disc ml-5 mt-1">
                    {newAssignments.slice(0, 3).map((assignment) => (
                      <li key={assignment.report_id}>
                        {assignment.formatted_report_id || `RPT-${assignment.report_id}`} - {assignment.landowner_name || `${assignment.first_name} ${assignment.last_name}`} ({assignment.location})
                      </li>
                    ))}
                    {newAssignments.length > 3 && (
                      <li>...and {newAssignments.length - 3} more</li>
                    )}
                  </ul>
                  <p className="mt-2 font-medium">Please review and start working on these assignments.</p>
                </div>
              </div>
              <div className="ml-auto flex-shrink-0">
                <button
                  onClick={() => setNewAssignments([])}
                  className="bg-white rounded-md p-1.5 text-green-400 hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by landowner name, report ID, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-green-50 text-sm rounded-md pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-green-50 text-sm rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Statuses</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Reports Table */}
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p className="text-gray-600 mt-2">Loading assigned reports...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">
              {searchTerm || statusFilter 
                ? "No reports match your search criteria." 
                : "No reports have been assigned to you yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-green-50 text-gray-700">
                <tr>
                  <th className="py-3 px-4 text-left">Report ID</th>
                  <th className="py-3 px-4 text-left">Landowner Name</th>
                  <th className="py-3 px-4 text-left">Location</th>
                  <th className="py-3 px-4 text-left">Assigned Date</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report, idx) => (
                  <tr
                    key={report.report_id || idx}
                    className="border-t border-gray-200 hover:bg-green-50"
                  >
                    <td className="py-3 px-4 text-green-700 font-medium">
                      {report.formatted_report_id || `RPT-${report.report_id}`}
                    </td>
                    <td className="py-3 px-4 text-green-700">
                      {report.landowner_name || `${report.first_name} ${report.last_name}`}
                    </td>
                    <td className="py-3 px-4">{report.location}</td>
                    <td className="py-3 px-4">
                      {new Date(report.assigned_date || report.report_date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full inline-block text-xs font-medium ${
                          statusStyles[report.completion_status || 'In Progress']
                        }`}
                      >
                        {report.completion_status || 'In Progress'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {(report.completion_status === 'Completed') ? (
                        <button
                          onClick={() => handleViewReport(report.formatted_report_id || report.report_id)}
                          className="flex items-center gap-1 text-green-600 hover:text-green-800 hover:underline text-sm transition-colors duration-200"
                        >
                          <FiEye size={14} />
                          View Details
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSubmitData(report)}
                          className="flex items-center gap-1 text-green-600 hover:text-green-800 hover:underline text-sm transition-colors duration-200"
                        >
                          <FiEdit size={14} />
                          Submit Data
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Summary Stats */}
        {!loading && !error && filteredReports.length > 0 && (
          <div className="mt-6 bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">Assignment Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total Assigned:</span>
                <span className="ml-2 font-semibold">{reports.length}</span>
              </div>
              <div>
                <span className="text-gray-600">In Progress:</span>
                <span className="ml-2 font-semibold text-green-600">
                  {reports.filter(r => (r.completion_status || 'In Progress') === 'In Progress').length}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Completed:</span>
                <span className="ml-2 font-semibold text-green-600">
                  {reports.filter(r => r.completion_status === 'Completed').length}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Data Submission Form Modal */}
      {showDataForm && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-black">
                  Submit Land Data - {selectedReport?.formatted_report_id}
                </h3>
                <button
                  onClick={handleCancelForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleFinalSubmit} className="space-y-6">
                {/* Report Info */}
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-semibold text-gray-800 mb-2">Report Information</h4>
                  <p><span className="font-medium">Landowner:</span> {selectedReport?.landowner_name}</p>
                  <p><span className="font-medium">Location:</span> {selectedReport?.location}</p>
                </div>

                {/* pH Value */}
                <div>
                  <label className="block font-semibold text-black mb-1">pH Value</label>
                  <input
                    type="number"
                    step="0.1"
                    name="phValue"
                    value={formData.phValue}
                    onChange={handleFormChange}
                    placeholder="Enter pH value (e.g., 6.5)"
                    className="w-full bg-green-50 text-green-700 p-3 rounded-md border border-green-500 placeholder-[#5E964F] focus:outline-none focus:ring-2 focus:ring-green-400"
                    required
                  />
                </div>

                {/* Organic Matter */}
                <div>
                  <label className="block font-semibold text-black mb-1">
                    Organic Matter (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="organicMatter"
                    value={formData.organicMatter}
                    onChange={handleFormChange}
                    placeholder="Enter organic matter percentage (e.g., 2.5)"
                    className="w-full bg-green-50 text-green-700 p-3 rounded-md border border-green-500 placeholder-[#5E964F] focus:outline-none focus:ring-2 focus:ring-green-400"
                    required
                  />
                </div>

                {/* Nitrogen */}
                <div>
                  <label className="block font-semibold text-black mb-1">
                    Nitrogen Level
                  </label>
                  <select
                    name="nitrogen"
                    value={formData.nitrogen}
                    onChange={handleFormChange}
                    className="w-full bg-green-50 text-green-700 p-3 rounded-md border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400"
                    required
                  >
                    <option value="">Select nitrogen level</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                {/* Phosphorus */}
                <div>
                  <label className="block font-semibold text-black mb-1">
                    Phosphorus Level
                  </label>
                  <select
                    name="phosphorus"
                    value={formData.phosphorus}
                    onChange={handleFormChange}
                    className="w-full bg-green-50 text-green-700 p-3 rounded-md border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400"
                    required
                  >
                    <option value="">Select phosphorus level</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                {/* Potassium */}
                <div>
                  <label className="block font-semibold text-black mb-1">
                    Potassium Level
                  </label>
                  <select
                    name="potassium"
                    value={formData.potassium}
                    onChange={handleFormChange}
                    className="w-full bg-green-50 text-green-700 p-3 rounded-md border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400"
                    required
                  >
                    <option value="">Select potassium level</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                {/* Environmental Notes */}
                <div>
                  <label className="block font-semibold text-black mb-1">
                    Environmental Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleFormChange}
                    placeholder="Enter detailed environmental observations and notes"
                    rows={5}
                    className="w-full bg-green-50 text-green-700 p-3 rounded-md border border-green-500 placeholder-[#5E964F] focus:outline-none focus:ring-2 focus:ring-green-400"
                    required
                  ></textarea>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleCancelForm}
                    className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
                    disabled={submitting || generatingRecommendations}
                  >
                    Cancel
                  </button>
                  
                  {!recommendationsGenerated ? (
                    /* Generate Crop Recommendations Button */
                    <button
                      type="button"
                      onClick={handleGenerateRecommendations}
                      className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={submitting || generatingRecommendations || !formData.phValue || !formData.organicMatter}
                      title="Enter pH value and organic matter to enable crop recommendations"
                    >
                      {generatingRecommendations ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Generating Recommendations...
                        </>
                      ) : (
                        <>
                          <FiTrendingUp size={16} />
                          Generate Crop Recommendations
                        </>
                      )}
                    </button>
                  ) : (
                    /* Submit Report Button - Only shown after recommendations are generated */
                    <button
                      type="submit"
                      className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Submitting Report...
                        </>
                      ) : (
                        <>
                          <FiCheck size={16} />
                          Submit Land Report
                        </>
                      )}
                    </button>
                  )}
                </div>
                
                {/* Status Messages */}
                {recommendationsGenerated && (
                  <div className="mt-4 p-3 bg-green-50 rounded-md border border-green-200">
                    <div className="flex items-center gap-2">
                      <FiCheckCircle className="text-green-600" size={16} />
                      <p className="text-sm text-green-700">
                        <strong>✅ Crop recommendations generated successfully!</strong> 
                        You can now submit the complete land report with soil analysis and crop recommendations.
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Helper Text */}
                <div className="mt-4 p-3 bg-green-50 rounded-md border border-green-200">
                  <p className="text-sm text-green-700">
                    <strong>💡 Tip:</strong> For best results, enter all soil analysis values (pH, organic matter, nitrogen, phosphorus, potassium) 
                    before generating crop recommendations. The system will analyze your soil data and suggest the most suitable crops 
                    with expected yields and market prices.
                  </p>
                  {(!formData.phValue || !formData.organicMatter) && (
                    <p className="text-sm text-amber-600 mt-2">
                      ⚠️ pH value and organic matter are required to generate crop recommendations.
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showViewDetails && viewingReport && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">
                Land Report Details - {viewingReport.formatted_report_id || `RPT-${viewingReport.report_id}`}
              </h3>
              <button
                onClick={() => {
                  setShowViewDetails(false);
                  setViewingReport(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <FiX size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Report Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">Report Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Report ID:</span>
                    <p className="text-gray-800">{viewingReport.formatted_report_id || `RPT-${viewingReport.report_id}`}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Landowner:</span>
                    <p className="text-gray-800">{viewingReport.landowner_name || `${viewingReport.first_name} ${viewingReport.last_name}`}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Location:</span>
                    <p className="text-gray-800">{viewingReport.location}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Assigned Date:</span>
                    <p className="text-gray-800">{new Date(viewingReport.assigned_date || viewingReport.report_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[viewingReport.completion_status || 'In Progress']}`}>
                      {viewingReport.completion_status || 'In Progress'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submitted Land Data */}
              {viewingReport.completion_status === 'Completed' && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-3">Submitted Land Data</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-green-700">pH Value:</span>
                      <p className="text-gray-800">{viewingReport.ph_value || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-green-700">Organic Matter (%):</span>
                      <p className="text-gray-800">{viewingReport.organic_matter || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-green-700">Nitrogen (%):</span>
                      <p className="text-gray-800">{viewingReport.nitrogen_level || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-green-700">Phosphorus (ppm):</span>
                      <p className="text-gray-800">{viewingReport.phosphorus_level || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-green-700">Potassium (ppm):</span>
                      <p className="text-gray-800">{viewingReport.potassium_level || 'N/A'}</p>
                    </div>
                  </div>
                  
                  {viewingReport.environmental_notes && (
                    <div className="mt-4">
                      <span className="font-medium text-green-700">Additional Notes:</span>
                      <p className="text-gray-800 mt-1 p-3 bg-white rounded border">{viewingReport.environmental_notes}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setShowViewDetails(false);
                    setViewingReport(null);
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup Message */}
      {popup.show && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <div
            className={`p-4 rounded-lg shadow-lg border-l-4 transition-all duration-300 transform ${
              popup.type === 'success'
                ? 'bg-green-50 border-green-500 text-green-800'
                : popup.type === 'error'
                ? 'bg-red-50 border-red-500 text-red-800'
                : 'bg-slate-50 border-slate-400 text-slate-700'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                {popup.type === 'success' && <FiCheckCircle className="mr-2 flex-shrink-0" size={20} />}
                {popup.type === 'error' && <FiAlertCircle className="mr-2 flex-shrink-0" size={20} />}
                {popup.type === 'info' && <FiEye className="mr-2 flex-shrink-0" size={20} />}
                <p className="text-sm font-medium">{popup.message}</p>
              </div>
              <button
                onClick={hidePopup}
                className={`ml-2 flex-shrink-0 ${
                  popup.type === 'success'
                    ? 'text-green-600 hover:text-green-800'
                    : popup.type === 'error'
                    ? 'text-red-600 hover:text-red-800'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <FiX size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Notification Popup */}
      {assignmentNotification.show && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white border border-green-600 p-6 rounded-lg shadow-xl text-center max-w-md">
            <div className="flex items-center justify-center mb-4">
              <FiCheckCircle className="h-8 w-8 text-green-600 mr-2" />
              <h2 className="text-lg font-bold text-green-700">
                New Assignment!
              </h2>
            </div>
            <p className="text-gray-700 mb-4">
              {assignmentNotification.message}
            </p>
            <button
              onClick={() => setAssignmentNotification({ show: false, message: "" })}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 mt-2"
            >
              Got It!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
