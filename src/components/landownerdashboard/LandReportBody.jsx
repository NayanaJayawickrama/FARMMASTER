import React, { useState, useEffect } from "react";
import { Leaf, Download, Eye, Calendar, MapPin, FileText, Clock, CheckCircle, XCircle, AlertCircle, Plus } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { NavLink } from "react-router-dom";

const rootUrl = import.meta.env.VITE_API_URL;

export default function LandReportBody() {
  const [assessmentRequests, setAssessmentRequests] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // "all", "pending", "completed"
  const { user } = useAuth();

  // Test user ID - replace with actual user from auth context
  const testUserId = user?.id || 32;

  useEffect(() => {
    fetchAssessmentRequests();
  }, []);

  const fetchAssessmentRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${rootUrl}/assessments?user_id=${testUserId}`, {
        withCredentials: true
      });
      if (response.data.status === 'success') {
        setAssessmentRequests(response.data.data || []);
        if (response.data.data && response.data.data.length > 0) {
          setSelectedItem(response.data.data[0]);
        }
      } else {
        setError(response.data.message || "Failed to fetch assessment requests");
      }
    } catch (err) {
      setError("Failed to fetch assessment requests: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (reportId) => {
    try {
      // Open the report in a new window for printing/saving as PDF
      const reportUrl = `${rootUrl}/reports/land/${reportId}/pdf`;
      const newWindow = window.open(reportUrl, '_blank');
      
      if (!newWindow) {
        // If popup was blocked, show alternative
        alert("Please allow popups and try again, or copy this URL to view the report: " + reportUrl);
      } else {
        // Auto-focus the new window
        newWindow.focus();
      }
    } catch (err) {
      alert("Failed to open report: " + err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'payment pending': return 'text-yellow-600 bg-yellow-100';
      case 'payment failed': return 'text-red-600 bg-red-100';
      case 'assessment pending': return 'text-blue-600 bg-blue-100';
      case 'report submitted': return 'text-indigo-600 bg-indigo-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return <CheckCircle size={16} className="text-green-600" />;
      case 'rejected': return <XCircle size={16} className="text-red-600" />;
      case 'payment pending': return <Clock size={16} className="text-yellow-600" />;
      case 'payment failed': return <XCircle size={16} className="text-red-600" />;
      case 'assessment pending': return <AlertCircle size={16} className="text-blue-600" />;
      case 'report submitted': return <FileText size={16} className="text-indigo-600" />;
      default: return <Clock size={16} className="text-gray-600" />;
    }
  };

  const filteredRequests = assessmentRequests.filter(request => {
    switch (activeTab) {
      case "pending":
        return !request.has_report || request.overall_status === 'Assessment Pending' || request.overall_status === 'Payment Pending';
      case "completed":
        return request.has_report && (request.report_status === 'Approved' || request.report_status === 'Rejected');
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="flex min-h-screen bg-white">
        <div className="flex-1 p-6 md:p-10">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading assessment requests...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-white">
        <div className="flex-1 p-6 md:p-10">
          <div className="flex justify-center items-center h-64">
            <div className="text-red-500">Error: {error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (assessmentRequests.length === 0) {
    return (
      <div className="flex min-h-screen bg-white">
        <div className="flex-1 p-6 md:p-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
                Land Assessment Requests & Reports
              </h1>
              <NavLink to="/landassessment">
                <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-md transition flex items-center gap-2">
                  <Plus size={18} />
                  Request New Assessment
                </button>
              </NavLink>
            </div>
            <div className="text-center py-12">
              <FileText size={64} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">No land assessment requests found.</p>
              <p className="text-gray-400 mt-2">Start by requesting a land assessment using the button above.</p>
              <div className="mt-6">
                <NavLink to="/landassessment">
                  <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-md transition flex items-center gap-2 mx-auto">
                    <Plus size={20} />
                    Request Your First Assessment
                  </button>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 p-6 md:p-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
              Land Assessment Requests & Reports
            </h1>
            
            {/* Request New Assessment Button */}
            <NavLink to="/landassessment">
              <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-md transition flex items-center gap-2 mb-4 sm:mb-0">
                <Plus size={18} />
                Request New Assessment
              </button>
            </NavLink>
          </div>

          <div className="flex justify-center mb-6">
            {/* Filter Tabs */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "all" 
                    ? "bg-white text-gray-900 shadow-sm" 
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                All ({assessmentRequests.length})
              </button>
              <button
                onClick={() => setActiveTab("pending")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "pending" 
                    ? "bg-white text-gray-900 shadow-sm" 
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Pending ({assessmentRequests.filter(r => !r.has_report || r.overall_status === 'Assessment Pending' || r.overall_status === 'Payment Pending').length})
              </button>
              <button
                onClick={() => setActiveTab("completed")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "completed" 
                    ? "bg-white text-gray-900 shadow-sm" 
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Completed ({assessmentRequests.filter(r => r.has_report && (r.report_status === 'Approved' || r.report_status === 'Rejected')).length})
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Requests List */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Assessment Requests ({filteredRequests.length})
                  </h2>
                </div>
                <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                  {filteredRequests.map((request) => (
                    <div
                      key={`${request.land_id}-${request.report_id || 'no-report'}`}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedItem?.land_id === request.land_id ? 'bg-green-50 border-r-4 border-green-500' : ''
                      }`}
                      onClick={() => setSelectedItem(request)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium text-gray-800 block truncate">
                            {request.has_report ? `Report #${request.report_id}` : `Request #${request.land_id}`}
                          </span>
                          <div className="flex items-center gap-1 mt-1">
                            {getStatusIcon(request.overall_status)}
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(request.overall_status)}`}>
                              {request.overall_status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mb-1">
                        <MapPin size={12} className="mr-1 flex-shrink-0" />
                        <span className="truncate">{request.location}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mb-1">
                        <span className="mr-2">Size: {request.size} acres</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar size={12} className="mr-1 flex-shrink-0" />
                        <span>
                          {request.has_report && request.report_date 
                            ? `Report: ${new Date(request.report_date).toLocaleDateString()}`
                            : `Requested: ${new Date(request.request_date).toLocaleDateString()}`
                          }
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected Item Details */}
            <div className="lg:col-span-2">
              {selectedItem && (
                <div className="bg-white border border-green-600 p-6 md:p-8 rounded-md shadow-sm">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                        {selectedItem.has_report 
                          ? `Land Assessment Report #${selectedItem.report_id}` 
                          : `Assessment Request #${selectedItem.land_id}`
                        }
                      </h1>
                      <p className="text-sm text-green-600 mb-2">
                        {selectedItem.has_report && selectedItem.report_date
                          ? `Report generated on ${new Date(selectedItem.report_date).toLocaleDateString()}`
                          : `Requested on ${new Date(selectedItem.request_date).toLocaleDateString()}`
                        }
                      </p>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(selectedItem.overall_status)}
                        <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(selectedItem.overall_status)}`}>
                          {selectedItem.overall_status}
                        </span>
                      </div>
                    </div>
                    {selectedItem.has_report && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDownloadPDF(selectedItem.report_id)}
                          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm font-semibold rounded-md transition"
                        >
                          <Download size={16} />
                          View/Print Report
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Land Information */}
                  <div className="mb-8">
                    <h2 className="text-base font-semibold text-gray-800 mb-4">
                      Land Information
                    </h2>
                    <table className="w-full text-sm">
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 pl-2 text-green-600">Location</td>
                          <td className="py-2 pr-2 text-right text-gray-800">{selectedItem.location}</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 pl-2 text-green-600">Land Size</td>
                          <td className="py-2 pr-2 text-right text-gray-800">{selectedItem.size} acres</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 pl-2 text-green-600">Payment Status</td>
                          <td className="py-2 pr-2 text-right text-gray-800">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              selectedItem.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                              selectedItem.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {selectedItem.payment_status}
                            </span>
                          </td>
                        </tr>
                        {selectedItem.payment_date && (
                          <tr className="border-b border-gray-200">
                            <td className="py-2 pl-2 text-green-600">Payment Date</td>
                            <td className="py-2 pr-2 text-right text-gray-800">
                              {new Date(selectedItem.payment_date).toLocaleDateString()}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Assessment Status */}
                  <div className="mb-8">
                    <h2 className="text-base font-semibold text-gray-800 mb-4">
                      Assessment Status
                    </h2>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(selectedItem.overall_status)}
                        <div>
                          <p className="font-medium text-gray-800">{selectedItem.overall_status}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            {selectedItem.payment_status === 'pending' && 
                              "Please complete the payment to proceed with land assessment."
                            }
                            {selectedItem.payment_status === 'failed' && 
                              "Payment failed. Please try again or contact support."
                            }
                            {selectedItem.payment_status === 'paid' && !selectedItem.has_report && 
                              "Payment completed. Field supervisor will visit your land soon for assessment."
                            }
                            {selectedItem.has_report && selectedItem.report_status === 'Approved' && 
                              "Assessment completed successfully. Report is ready for download."
                            }
                            {selectedItem.has_report && selectedItem.report_status === 'Rejected' && 
                              "Assessment was rejected. Please contact support for details."
                            }
                            {selectedItem.has_report && !selectedItem.report_status && 
                              "Assessment report has been submitted and is under review."
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Show report details only if report exists and is approved */}
                  {selectedItem.has_report && selectedItem.land_description && (
                    <>
                      {/* Land Description */}
                      <div className="mb-8">
                        <h2 className="text-base font-semibold text-gray-800 mb-4">
                          Land Assessment Description
                        </h2>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-700">{selectedItem.land_description}</p>
                        </div>
                      </div>

                      {/* Crop Recommendations */}
                      {selectedItem.crop_recommendation && (
                        <div className="mb-6">
                          <h2 className="text-base font-semibold text-gray-800 mb-2">
                            Crop Recommendations
                          </h2>
                          <div className="bg-green-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-700 mb-4">
                              Based on the land assessment, the following recommendations have been made:
                            </p>
                            <div className="whitespace-pre-line text-sm text-gray-700">
                              {selectedItem.crop_recommendation}
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Soil Analysis Data for completed reports */}
                  {selectedItem.has_report && selectedItem.report_status === 'Approved' && (
                    <div className="mb-8">
                      <h2 className="text-base font-semibold text-gray-800 mb-4">
                        Soil Analysis Results
                      </h2>
                      {selectedItem.ph_value || selectedItem.organic_matter || selectedItem.nitrogen_level ? (
                        <table className="w-full text-sm">
                          <tbody>
                            {selectedItem.ph_value && (
                              <tr className="border-b border-gray-200">
                                <td className="py-2 pl-2 text-green-600">Soil pH Value</td>
                                <td className="py-2 pr-2 text-right text-gray-800">{selectedItem.ph_value}</td>
                              </tr>
                            )}
                            {selectedItem.organic_matter && (
                              <tr className="border-b border-gray-200">
                                <td className="py-2 pl-2 text-green-600">Organic Matter (%)</td>
                                <td className="py-2 pr-2 text-right text-gray-800">{selectedItem.organic_matter}%</td>
                              </tr>
                            )}
                            {selectedItem.nitrogen_level && (
                              <tr className="border-b border-gray-200">
                                <td className="py-2 pl-2 text-green-600">Nitrogen (N) Level</td>
                                <td className="py-2 pr-2 text-right text-gray-800">{selectedItem.nitrogen_level}</td>
                              </tr>
                            )}
                            {selectedItem.phosphorus_level && (
                              <tr className="border-b border-gray-200">
                                <td className="py-2 pl-2 text-green-600">Phosphorus (P) Level</td>
                                <td className="py-2 pr-2 text-right text-gray-800">{selectedItem.phosphorus_level}</td>
                              </tr>
                            )}
                            {selectedItem.potassium_level && (
                              <tr className="border-b border-gray-200">
                                <td className="py-2 pl-2 text-green-600">Potassium (K) Level</td>
                                <td className="py-2 pr-2 text-right text-gray-800">{selectedItem.potassium_level}</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      ) : (
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <p className="text-sm text-yellow-700">Soil analysis data is being processed by our field supervisors.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Environmental Assessment */}
                  {selectedItem.has_report && selectedItem.environmental_notes && selectedItem.report_status === 'Approved' && (
                    <div className="mb-8">
                      <h2 className="text-base font-semibold text-gray-800 mb-4">
                        Environmental Assessment
                      </h2>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-700">{selectedItem.environmental_notes}</p>
                      </div>
                    </div>
                  )}

                  {/* Next Steps for pending requests */}
                  {!selectedItem.has_report && (
                    <div className="mb-6">
                      <h2 className="text-base font-semibold text-gray-800 mb-4">
                        Next Steps
                      </h2>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-start gap-3">
                          <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-blue-800 mb-2">What happens next?</p>
                            <ol className="text-sm text-blue-700 space-y-1">
                              {selectedItem.payment_status === 'pending' && (
                                <li>1. Complete the assessment payment</li>
                              )}
                              {selectedItem.payment_status === 'paid' && (
                                <>
                                  <li>1. ✅ Payment completed successfully</li>
                                  <li>2. Field supervisor will visit your land (within 3-5 working days)</li>
                                  <li>3. Soil and environmental assessment will be conducted</li>
                                  <li>4. Assessment report will be generated</li>
                                  <li>5. You will receive the final report with crop recommendations</li>
                                </>
                              )}
                            </ol>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
