import React, { useState, useEffect } from "react";
import axios from "axios";
import LandReportReview from "./LandReportReview";
import AssignFieldSupervisor from "./AssignFieldSupervisor";
import PopupMessage from "../alerts/PopupMessage";

const rootUrl = import.meta.env.VITE_API_URL;

const statusColors = {
  Assigned: "bg-green-100 text-green-800",
  "In Progress": "bg-yellow-100 text-yellow-800",
  Unassigned: "bg-gray-100 text-gray-800",
  "Not Assigned": "bg-gray-100 text-gray-800",
  Approved: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-700",
  "Not Reviewed": "bg-gray-100 text-gray-800",
};

export default function LandReportManagement() {
  const [showReview, setShowReview] = useState(false);
  const [showAssignSupervisor, setShowAssignSupervisor] = useState(false);
  const [selectedReportForAssignment, setSelectedReportForAssignment] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [assignmentData, setAssignmentData] = useState([]);
  const [reviewData, setReviewData] = useState([]);
  const [availableSupervisors, setAvailableSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Popup message state
  const [popupMessage, setPopupMessage] = useState({
    isOpen: false,
    message: '',
    type: 'success'
  });

  const showPopup = (message, type = 'success') => {
    setPopupMessage({
      isOpen: true,
      message,
      type
    });
  };

  const closePopup = () => {
    setPopupMessage({
      isOpen: false,
      message: '',
      type: 'success'
    });
  };

  // Fetch assignment reports
  const fetchAssignmentReports = async () => {
    try {
      console.log('Fetching assignment reports from:', `${rootUrl}/api/land-reports/assignment-reports-public`);
      const response = await axios.get(`${rootUrl}/api/land-reports/assignment-reports-public`, {
        withCredentials: true
      });
      console.log('Assignment reports response:', response.data);
      if (response.data.status === 'success') {
        setAssignmentData(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching assignment reports:', error);
      console.error('Error response:', error.response?.data);
      setError('Failed to load assignment reports: ' + (error.response?.data?.message || error.message));
    }
  };

  // Fetch review reports
  const fetchReviewReports = async () => {
    try {
      console.log('Fetching review reports from:', `${rootUrl}/api/land-reports/review-reports-public`);
      const response = await axios.get(`${rootUrl}/api/land-reports/review-reports-public`, {
        withCredentials: true
      });
      console.log('Review reports response:', response.data);
      if (response.data.status === 'success') {
        setReviewData(response.data.data || []);
        console.log('Review data set to:', response.data.data);
        console.log('reviewData length:', response.data.data?.length || 0);
      }
    } catch (error) {
      console.error('Error fetching review reports:', error);
      console.error('Error response:', error.response?.data);
      setError('Failed to load review reports: ' + (error.response?.data?.message || error.message));
    }
  };

  // Fetch available supervisors
  const fetchAvailableSupervisors = async () => {
    try {
      console.log('Fetching supervisors from:', `${rootUrl}/api/land-reports/supervisors`);
      const response = await axios.get(`${rootUrl}/api/land-reports/supervisors`, {
        withCredentials: true
      });
      console.log('Supervisors response:', response.data);
      if (response.data.status === 'success') {
        setAvailableSupervisors(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching supervisors:', error);
      console.error('Error response:', error.response?.data);
      setError('Failed to load supervisors: ' + (error.response?.data?.message || error.message));
    }
  };

  // Assign supervisor to a report
  const assignSupervisor = async (reportId, supervisorId, supervisorName) => {
    try {
      const response = await axios.put(`${rootUrl}/api/land-reports/${reportId}/assign`, {
        supervisor_id: supervisorId,
        supervisor_name: supervisorName
      }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      
      if (response.data.status === 'success') {
        // Refresh assignment data
        await fetchAssignmentReports();
        showPopup('Supervisor assigned successfully!', 'success');
      }
    } catch (error) {
      console.error('Error assigning supervisor:', error);
      showPopup('Failed to assign supervisor', 'error');
    }
  };

  // Load all data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchAssignmentReports(),
        fetchReviewReports(),
        fetchAvailableSupervisors()
      ]);
      setLoading(false);
    };
    
    loadData();
  }, []);

  // Handle assignment action - go to supervisor selection page
  const handleAssignmentAction = (report) => {
    // Check if supervisor is already assigned
    if (report.status === 'Assigned' || report.status === 'In Progress' || 
        (report.supervisor && report.supervisor !== 'N/A' && report.supervisor !== 'Not Assigned')) {
      showPopup('This report already has a supervisor assigned and cannot be reassigned.', 'error');
      return;
    }
    
    setSelectedReportForAssignment(report);
    setShowAssignSupervisor(true);
  };

  // Handle view report action
  const handleViewReport = (report) => {
    setSelectedReport(report);
    setShowReview(true);
  };

  if (showAssignSupervisor) {
    return (
      <AssignFieldSupervisor
        onBack={() => setShowAssignSupervisor(false)}
        report={selectedReportForAssignment}
        onAssignmentComplete={async () => {
          // Refresh assignment data after successful assignment
          await fetchAssignmentReports();
        }}
      />
    );
  }

  if (showReview) {
    return <LandReportReview 
      onBack={() => setShowReview(false)} 
      report={selectedReport}
      onSendToLandOwner={async (reportId) => {
        try {
          const response = await axios.put(`${rootUrl}/api/land-reports/${reportId}/send-to-owner`, {}, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
          });
          
          if (response.data.status === 'success') {
            showPopup('Report sent to land owner successfully!', 'success');
            await fetchReviewReports(); // Refresh data
            setShowReview(false);
          }
        } catch (error) {
          console.error('Error sending report to land owner:', error);
          showPopup('Failed to send report to land owner: ' + (error.response?.data?.message || error.message), 'error');
        }
      }}
    />;
  }

  if (loading) {
    return (
      <div className="flex-1 bg-white min-h-screen p-4 md:p-10 font-poppins">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading land reports...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 bg-white min-h-screen p-4 md:p-10 font-poppins">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="ml-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Debug log for review data
  console.log('Current reviewData state:', reviewData);
  console.log('Current assignmentData state:', assignmentData);
  console.log('Loading state:', loading);
  console.log('Error state:', error);

  return (
    <div className="flex-1 bg-white min-h-screen p-4 md:p-10 font-poppins">
     
      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 mt-4">
          Land Report Assignments
        </h2>
        <p className="text-green-600 mb-6 text-sm sm:text-base">
          Manage and assign Supervisors to land report requests.
        </p>
        <div className="overflow-x-auto shadow-sm border border-gray-200 rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-green-50 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">Report ID</th>
                <th className="py-3 px-4 text-left">Location</th>
                <th className="py-3 px-4 text-left">Landowner Name</th>
                <th className="py-3 px-4 text-left">Requested Date</th>
                <th className="py-3 px-4 text-left">Supervisor Name</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left text-green-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignmentData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 px-4 text-center text-gray-500">
                    {loading ? 'Loading assignment data...' : 'No land reports available for assignment'}
                  </td>
                </tr>
              ) : (
                assignmentData.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-t border-gray-200 hover:bg-green-50"
                  >
                    <td className="py-3 px-4">{item.id}</td>
                    <td className="py-3 px-4">{item.location}</td>
                    <td className="py-3 px-4 text-green-700">{item.name}</td>
                    <td className="py-3 px-4">{item.date}</td>
                    <td className="py-3 px-4">{item.supervisor}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full inline-block ${statusColors[item.status]}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {item.status === 'Assigned' || item.status === 'In Progress' || (item.supervisor && item.supervisor !== 'N/A' && item.supervisor !== 'Not Assigned') ? (
                        <span className="text-gray-400 font-medium cursor-not-allowed">
                          Already Assigned
                        </span>
                      ) : (
                        <span 
                          className="text-black font-semibold cursor-pointer hover:underline hover:text-green-600"
                          onClick={() => handleAssignmentAction(item)}
                        >
                          Assign
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4 mt-4">
          <h2 className="text-3xl md:text-4xl font-bold text-black">
            Land Report Review & Approval
          </h2>
          <button
            onClick={async () => {
              setLoading(true);
              await fetchReviewReports();
              setLoading(false);
            }}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Reports
          </button>
        </div>
        <p className="text-green-600 mb-6 text-sm sm:text-base">
          Review the submitted land report data and provide feedback.
        </p>
        <div className="overflow-x-auto shadow-sm border border-gray-200 rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-green-50 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">Report ID</th>
                <th className="py-3 px-4 text-left">Location</th>
                <th className="py-3 px-4 text-left">Landowner Name</th>
                <th className="py-3 px-4 text-left">Supervisor ID</th>
                <th className="py-3 px-4 text-left">Supervisor Name</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left text-green-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviewData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 px-4 text-center text-gray-500">
                    {loading ? 'Loading review data...' : 'No reports available for review'}
                  </td>
                </tr>
              ) : (
                reviewData.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-t border-gray-200 hover:bg-green-50"
                  >
                    <td className="py-3 px-4">{item.id}</td>
                    <td className="py-3 px-4">{item.location}</td>
                    <td className="py-3 px-4 text-green-700">{item.name}</td>
                    <td className="py-3 px-4">{item.supervisorId}</td>
                    <td className="py-3 px-4">{item.supervisor}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full inline-block ${statusColors[item.status]}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td
                      className="py-3 px-4 text-black font-semibold cursor-pointer hover:underline hover:text-green-600"
                      onClick={() => handleViewReport(item)}
                    >
                      View Report
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popup Message */}
      <PopupMessage
        isOpen={popupMessage.isOpen}
        message={popupMessage.message}
        type={popupMessage.type}
        onClose={closePopup}
      />
    </div>
  );
}
