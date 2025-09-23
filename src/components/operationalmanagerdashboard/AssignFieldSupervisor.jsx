import React, { useState, useEffect } from "react";
import axios from "axios";
import { ArrowLeft, User, Clock, CheckCircle } from "lucide-react";

const rootUrl = import.meta.env.VITE_API_URL;

export default function AssignFieldSupervisor({ onBack, report, onAssignmentComplete }) {
  const [availableSupervisors, setAvailableSupervisors] = useState([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Fetch available (free) Supervisors
  const fetchAvailableSupervisors = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${rootUrl}/api/land-reports/supervisors`, {
        headers: getAuthHeaders()
      });
      if (response.data.status === 'success') {
        // Filter only available supervisors (not currently assigned)
        const freeSupervisors = response.data.data.filter(supervisor => 
          supervisor.assignment_status === 'Available'
        );
        setAvailableSupervisors(freeSupervisors);
      } else {
        setError('Failed to load available Supervisors');
      }
    } catch (error) {
      console.error('Error fetching supervisors:', error);
      setError('Failed to load Supervisors');
    } finally {
      setLoading(false);
    }
  };

  // Assign selected supervisor
  const handleAssignment = async () => {
    if (!selectedSupervisor) {
      alert('Please select a Supervisor');
      return;
    }

    try {
      setAssigning(true);
      const response = await axios.put(`${rootUrl}/api/land-reports/${report.report_id}/assign`, {
        supervisor_id: selectedSupervisor.user_id,
        supervisor_name: selectedSupervisor.full_name
      }, {
        headers: getAuthHeaders()
      });
      
      if (response.data.status === 'success') {
        alert('Supervisor assigned successfully!');
        if (onAssignmentComplete) {
          onAssignmentComplete();
        }
        onBack();
      } else {
        alert('Failed to assign Supervisor');
      }
    } catch (error) {
      console.error('Error assigning supervisor:', error);
      alert('Failed to assign Supervisor');
    } finally {
      setAssigning(false);
    }
  };

  useEffect(() => {
    fetchAvailableSupervisors();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 bg-white min-h-screen p-4 md:p-10 font-poppins">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading available Supervisors...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white min-h-screen p-4 md:p-10 font-poppins">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-green-600 hover:text-green-700 mb-4 font-medium transition"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Land Report Management
          </button>
          
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
            Assign Supervisor
          </h1>
          <p className="text-green-600 text-sm sm:text-base">
            Select an available Supervisor to assign to this land report assessment.
          </p>
        </div>

        {/* Report Information */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Report Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Report ID:</span>
              <span className="ml-2 font-medium text-gray-900">{report?.id || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-600">Location:</span>
              <span className="ml-2 font-medium text-gray-900">{report?.location || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-600">Landowner:</span>
              <span className="ml-2 font-medium text-gray-900">{report?.name || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-600">Requested Date:</span>
              <span className="ml-2 font-medium text-gray-900">{report?.date || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Available Supervisors */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Available Supervisors ({availableSupervisors.length})
          </h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {availableSupervisors.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <Clock className="mx-auto mb-3 text-yellow-500" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Available Supervisors</h3>
              <p className="text-gray-600">
                All Supervisors are currently assigned to other reports. Please try again later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableSupervisors.map((supervisor) => (
                <div
                  key={supervisor.user_id}
                  onClick={() => setSelectedSupervisor(supervisor)}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedSupervisor?.user_id === supervisor.user_id
                      ? 'border-green-500 bg-green-50 shadow-md'
                      : 'border-gray-200 hover:border-green-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <div className="bg-green-100 rounded-full p-2 mr-3">
                        <User className="text-green-600" size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{supervisor.full_name}</h3>
                        <p className="text-sm text-gray-600">ID: {supervisor.user_id}</p>
                      </div>
                    </div>
                    {selectedSupervisor?.user_id === supervisor.user_id && (
                      <CheckCircle className="text-green-500" size={20} />
                    )}
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <span className="ml-2 text-gray-900">{supervisor.email}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Phone:</span>
                      <span className="ml-2 text-gray-900">{supervisor.phone}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <span className="ml-2 inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        {supervisor.assignment_status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-700 font-medium transition"
          >
            <ArrowLeft size={16} className="mr-2" />
            Cancel
          </button>

          <button
            onClick={handleAssignment}
            disabled={!selectedSupervisor || assigning || availableSupervisors.length === 0}
            className={`px-6 py-2 rounded-md font-semibold transition ${
              !selectedSupervisor || assigning || availableSupervisors.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {assigning ? 'Assigning...' : 'Assign Supervisor'}
          </button>
        </div>
      </div>
    </div>
  );
}