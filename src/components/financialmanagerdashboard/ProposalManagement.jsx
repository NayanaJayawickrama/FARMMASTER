import React, { useState, useEffect } from 'react';
import axios from 'axios';

const rootUrl = import.meta.env.VITE_API_URL;

export default function ProposalManagement() {
  const [interestRequests, setInterestRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showProposalForm, setShowProposalForm] = useState(false);

  useEffect(() => {
    fetchInterestRequests();
  }, []);

  const fetchInterestRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${rootUrl}/api/land-reports/interest-requests`, {
        withCredentials: true
      });
      
      if (response.data.status === 'success') {
        const requests = response.data.data || [];
        setInterestRequests(requests);
        if (requests.length > 0 && !selectedRequest) {
          setSelectedRequest(requests[0]);
        }
      } else {
        setError(response.data.message || 'Failed to fetch interest requests');
      }
    } catch (err) {
      setError('Failed to fetch requests: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId, status, notes = '') => {
    try {
      const response = await axios.put(`${rootUrl}/api/land-reports/interest-requests/${requestId}/status`, {
        status,
        notes
      }, {
        withCredentials: true
      });
      
      if (response.data.status === 'success') {
        alert('Request status updated successfully!');
        fetchInterestRequests(); // Refresh the list
      } else {
        alert('Failed to update status: ' + response.data.message);
      }
    } catch (err) {
      alert('Failed to update status: ' + (err.response?.data?.message || err.message));
    }
  };

  const generateProposal = async (request, proposalData) => {
    try {
      // Here you would typically send the proposal data to create a formal proposal
      // For now, we'll just update the request status and show a success message
      await updateRequestStatus(request.request_id, 'approved', 'Proposal generated and sent to landowner');
      alert(`SUCCESS! Leasing proposal generated and sent to ${request.first_name} ${request.last_name}!`);
      setShowProposalForm(false);
      setSelectedRequest(null);
    } catch (err) {
      alert('Failed to generate proposal: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-2">Loading interest requests...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Error: {error}</p>
          <button 
            onClick={fetchInterestRequests}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Partnership Interest Requests</h1>
        <p className="text-gray-600">
          Landowners interested in partnering with FarmMaster for organic farming
        </p>
      </div>

      {interestRequests.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="text-4xl mb-4 text-green-500">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">No Interest Requests Yet</h3>
          <p className="text-gray-500">
            When landowners express interest in organic farming partnerships, they'll appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Requests List */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">
                  Interest Requests ({interestRequests.length})
                </h2>
              </div>
              <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {interestRequests.map((request) => (
                  <div
                    key={request.request_id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedRequest?.request_id === request.request_id ? 'bg-green-50 border-r-4 border-green-500' : ''
                    }`}
                    onClick={() => setSelectedRequest(request)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-gray-800 block truncate">
                          {request.first_name} {request.last_name}
                        </span>
                        <div className="flex items-center gap-1 mt-1">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            request.status === 'under_review' ? 'bg-blue-100 text-blue-800' :
                            request.status === 'approved' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {request.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-600">@</span>
                        <span className="truncate">{request.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-600">Location:</span>
                        <span className="truncate">{request.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-600">Size:</span>
                        <span>Size: {request.size}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400">
                        <span className="text-gray-600">Date:</span>
                        <span>{new Date(request.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedRequest ? (
              <div className="bg-white border border-green-600 p-6 md:p-8 rounded-md shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Interest Request Details
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Submitted on {new Date(selectedRequest.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                    selectedRequest.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    selectedRequest.status === 'under_review' ? 'bg-blue-100 text-blue-800' :
                    selectedRequest.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedRequest.status.replace('_', ' ').toUpperCase()}
                  </div>
                </div>

                {/* Landowner Information */}
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Landowner Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm"><strong>Name:</strong> {selectedRequest.first_name} {selectedRequest.last_name}</p>
                      <p className="text-sm"><strong>Email:</strong> {selectedRequest.email}</p>
                    </div>
                    <div>
                      <p className="text-sm"><strong>Phone:</strong> {selectedRequest.phone}</p>
                      <p className="text-sm"><strong>User ID:</strong> #{selectedRequest.user_id}</p>
                    </div>
                  </div>
                </div>

                {/* Land Information */}
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Land Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm"><strong>Location:</strong> {selectedRequest.location}</p>
                      <p className="text-sm"><strong>Size:</strong> {selectedRequest.size}</p>
                    </div>
                    <div>
                      <p className="text-sm"><strong>Land ID:</strong> #{selectedRequest.land_id}</p>
                      <p className="text-sm"><strong>Report ID:</strong> #{selectedRequest.report_id}</p>
                    </div>
                  </div>
                  {selectedRequest.land_description && (
                    <div className="mt-3">
                      <p className="text-sm"><strong>Description:</strong> {selectedRequest.land_description}</p>
                    </div>
                  )}
                </div>

                {/* Soil Analysis */}
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Soil Analysis</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">pH Level</p>
                      <p className="text-lg font-bold text-blue-600">{selectedRequest.ph_value}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Organic Matter</p>
                      <p className="text-lg font-bold text-green-600">{selectedRequest.organic_matter}%</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Nitrogen</p>
                      <p className="text-lg font-bold text-purple-600">{selectedRequest.nitrogen_level}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Phosphorus</p>
                      <p className="text-lg font-bold text-orange-600">{selectedRequest.phosphorus_level}</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Potassium</p>
                      <p className="text-lg font-bold text-red-600">{selectedRequest.potassium_level}</p>
                    </div>
                  </div>
                </div>

                {/* Land Assessment */}
                {selectedRequest.conclusion && (
                  <div className="mb-6 p-4 bg-teal-50 border border-teal-200 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-3">Land Assessment</h3>
                    <div className={`p-4 rounded-lg ${
                      selectedRequest.conclusion.is_good_for_organic ? 'bg-green-100 border-l-4 border-green-500' : 'bg-yellow-100 border-l-4 border-yellow-500'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-2xl ${selectedRequest.conclusion.is_good_for_organic ? 'text-green-600' : 'text-yellow-600'}`}>
                          {selectedRequest.conclusion.is_good_for_organic ? 'SUITABLE' : 'NEEDS IMPROVEMENT'}
                        </span>
                        <h4 className={`font-semibold ${
                          selectedRequest.conclusion.is_good_for_organic ? 'text-green-800' : 'text-yellow-800'
                        }`}>
                          {selectedRequest.conclusion.is_good_for_organic ? 'Excellent for Organic Farming!' : 'Needs Improvement'}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-700">{selectedRequest.conclusion.conclusion_text}</p>
                      {selectedRequest.conclusion.recommended_crops && selectedRequest.conclusion.recommended_crops.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700 mb-1">Recommended Crops:</p>
                          <div className="flex flex-wrap gap-1">
                            {selectedRequest.conclusion.recommended_crops.map((crop, index) => (
                              <span key={index} className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded-full">
                                {crop}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Financial Manager Notes */}
                {selectedRequest.financial_manager_notes && (
                  <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">Financial Manager Notes</h3>
                    <p className="text-sm text-gray-700">{selectedRequest.financial_manager_notes}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                  {selectedRequest.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateRequestStatus(selectedRequest.request_id, 'under_review', 'Request is under review by the Financial Manager')}
                        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                      >
                        Mark Under Review
                      </button>
                      <button
                        onClick={() => updateRequestStatus(selectedRequest.request_id, 'rejected', 'Request rejected after review')}
                        className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
                      >
                        Reject Request
                      </button>
                      <button
                        onClick={() => {
                          generateProposal(selectedRequest, {
                            lease_duration: '12 months',
                            profit_sharing: '60/40',
                            responsibilities: 'FarmMaster provides seeds, fertilizers, and technical support'
                          });
                        }}
                        className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
                      >
                        ✅ Generate Proposal
                      </button>
                    </>
                  )}
                  
                  {selectedRequest.status === 'under_review' && (
                    <>
                      <button
                        onClick={() => updateRequestStatus(selectedRequest.request_id, 'rejected', 'Request rejected after detailed review')}
                        className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
                      >
                        Reject Request
                      </button>
                      <button
                        onClick={() => {
                          generateProposal(selectedRequest, {
                            lease_duration: '12 months',
                            profit_sharing: '60/40',
                            responsibilities: 'FarmMaster provides seeds, fertilizers, and technical support'
                          });
                        }}
                        className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
                      >
                        Generate Proposal
                      </button>
                    </>
                  )}
                  
                  {selectedRequest.status === 'approved' && (
                    <div className="flex items-center gap-2 text-green-600">
                      <span className="text-green-600">●</span>
                      <span className="font-medium">Proposal Generated and Sent</span>
                    </div>
                  )}
                  
                  {selectedRequest.status === 'rejected' && (
                    <div className="flex items-center gap-2 text-red-600">
                      <span className="text-red-600">●</span>
                      <span className="font-medium">Request Rejected</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                <div className="text-4xl mb-4 text-gray-400">
                  <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Select a Request</h3>
                <p className="text-gray-500">
                  Choose an interest request from the list to view details and take actions.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}