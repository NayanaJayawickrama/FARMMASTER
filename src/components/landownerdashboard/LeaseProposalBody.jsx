import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, MapPin, Calendar, TrendingUp } from "lucide-react";
import axios from "axios";

export default function LeaseProposalBody() {
  const [proposals, setProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const rootUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    setLoading(true);
    setError("");
    try {
      // Get user from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.id || user.user_id || 21; // Check both 'id' and 'user_id' properties
      
      console.log('User from localStorage:', user);
      console.log('Fetching proposals for user_id:', userId);
      console.log('API URL:', `${rootUrl}/proposals?user_id=${userId}`);
      
      const response = await axios.get(`${rootUrl}/api.php/proposals?user_id=${userId}`, {
        withCredentials: true
      });
      
      console.log('Proposals API response:', response.data);
      
      if (response.data.status === 'success') {
        setProposals(response.data.data || []);
        if (response.data.data && response.data.data.length > 0) {
          setSelectedProposal(response.data.data[0]);
        }
      } else {
        setError(response.data.message || "Failed to fetch proposals");
      }
    } catch (err) {
      console.error('Error fetching proposals:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: err.config?.url
      });
      setError("Failed to fetch proposals: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleProposalAction = async (proposalId, action) => {
    try {
      const response = await axios.put(`${rootUrl}/api.php/proposals/${proposalId}/status`, {
        action: action
      }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      
      if (response.data.status === 'success') {
        // Update local state
        const updatedProposals = proposals.map(proposal => 
          proposal.proposal_id === proposalId 
            ? { ...proposal, status: response.data.data.new_status }
            : proposal
        );
        setProposals(updatedProposals);
        
        // Update selected proposal if it's the one being updated
        if (selectedProposal && selectedProposal.proposal_id === proposalId) {
          setSelectedProposal({ ...selectedProposal, status: response.data.data.new_status });
        }
        
        alert(`Proposal ${action}ed successfully!`);
      } else {
        alert("Failed to update proposal: " + response.data.message);
      }
    } catch (err) {
      alert("Error updating proposal: " + (err.response?.data?.error || err.message));
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted': return <CheckCircle size={16} className="text-green-600" />;
      case 'rejected': return <XCircle size={16} className="text-red-600" />;
      case 'pending': return <Clock size={16} className="text-yellow-600" />;
      default: return <Clock size={16} className="text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-white">
        <div className="flex-1 p-6 md:p-10">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading proposals...</div>
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

  if (proposals.length === 0) {
    return (
      <div className="flex min-h-screen bg-white">
        <div className="flex-1 p-6 md:p-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Lease Proposals
            </h1>
            <div className="text-center py-12">
              <TrendingUp size={64} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">No lease proposals found.</p>
              <p className="text-gray-400 mt-2">Proposals will appear here when FarmMaster creates them for your lands.</p>
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
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Lease Proposals
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Proposals List */}
            <div className="lg:col-span-1">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Proposals</h2>
              <div className="space-y-3">
                {proposals.map((proposal) => (
                  <div 
                    key={proposal.proposal_id}
                    onClick={() => setSelectedProposal(proposal)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedProposal?.proposal_id === proposal.proposal_id 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-800">Proposal #{proposal.proposal_id}</p>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(proposal.status)}
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(proposal.status)}`}>
                          {proposal.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <MapPin size={14} className="mr-1" />
                      <span className="truncate">{proposal.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Calendar size={14} className="mr-1" />
                      <span>{new Date(proposal.proposal_date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-green-600 font-medium">
                      Est. Profit: Rs {proposal.estimated_profit_landowner.toLocaleString()}/year
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Proposal Details */}
            <div className="lg:col-span-2">
              {selectedProposal && (
                <div className="bg-white border border-green-600 p-6 md:p-8 rounded-md shadow-sm">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                        Lease Proposal #{selectedProposal.proposal_id}
                      </h1>
                      <p className="text-sm text-green-600 mb-2">
                        Proposed on {new Date(selectedProposal.proposal_date).toLocaleDateString()}
                      </p>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(selectedProposal.status)}
                        <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(selectedProposal.status)}`}>
                          {selectedProposal.status}
                        </span>
                      </div>
                    </div>
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
                          <td className="py-2 pr-2 text-right text-gray-800">{selectedProposal.location}</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 pl-2 text-green-600">Land Size</td>
                          <td className="py-2 pr-2 text-right text-gray-800">{selectedProposal.land_size} acres</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 pl-2 text-green-600">Recommended Crops</td>
                          <td className="py-2 pr-2 text-right text-gray-800">{selectedProposal.crop_type}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Proposal Summary */}
                  <div className="mb-8">
                    <h2 className="text-base font-semibold text-gray-800 mb-4">
                      Proposal Summary
                    </h2>
                    <table className="w-full text-sm">
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 pl-2 text-green-600">Estimated Yield</td>
                          <td className="py-3 pr-2 text-right text-gray-800">{selectedProposal.estimated_yield.toLocaleString()} kg</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 pl-2 text-green-600">Lease Duration</td>
                          <td className="py-3 pr-2 text-right text-gray-800">{selectedProposal.lease_duration_years} years</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 pl-2 text-green-600">Rental Value</td>
                          <td className="py-3 pr-2 text-right text-gray-800">Rs {selectedProposal.rental_value.toLocaleString()} per acre per year</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 pl-2 text-green-600">Profit Sharing</td>
                          <td className="py-3 pr-2 text-right text-gray-800">{selectedProposal.profit_sharing_farmmaster}% (FarmMaster) / {selectedProposal.profit_sharing_landowner}% (Landowner)</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 pl-2 text-green-600 font-semibold">Estimated Profit (Landowner)</td>
                          <td className="py-3 pr-2 text-right text-gray-800 font-semibold">Rs {selectedProposal.estimated_profit_landowner.toLocaleString()} per acre per year</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="mb-10">
                    <h2 className="text-base font-semibold text-gray-800 mb-4">
                      Terms and Conditions
                    </h2>
                    <ul className="text-sm text-gray-700 list-decimal pl-5 space-y-2">
                      <li>
                        <strong>Rent:</strong> FarmMaster agrees to pay the landowner a
                        rental value of Rs {selectedProposal.rental_value.toLocaleString()} per acre per year, payable quarterly.
                      </li>
                      <li>
                        <strong>Profit Sharing:</strong> Profits from the sale of crops
                        will be shared between FarmMaster and the landowner on a {selectedProposal.profit_sharing_farmmaster}/{selectedProposal.profit_sharing_landowner}
                        basis, respectively.
                      </li>
                      <li>
                        <strong>Crop Failure:</strong> In the event of crop failure due
                        to unforeseen circumstances (e.g., natural disasters),
                        FarmMaster will bear the initial losses. Further actions will be
                        determined through mutual agreement.
                      </li>
                      <li>
                        <strong>Land Maintenance:</strong> FarmMaster is responsible for
                        all farming operations and land maintenance during the lease
                        period.
                      </li>
                      <li>
                        <strong>Termination:</strong> Either party may terminate the
                        agreement with a six-month written notice.
                      </li>
                      <li>
                        <strong>Dispute Resolution:</strong> Any disputes will be
                        resolved through mediation.
                      </li>
                    </ul>
                    <p className="text-sm font-semibold text-gray-700 mt-3">
                      By accepting this proposal, you agree to abide by these terms and conditions.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  {selectedProposal.status === 'Pending' && (
                    <div className="flex flex-col md:flex-row gap-4 justify-end">
                      <button 
                        onClick={() => handleProposalAction(selectedProposal.proposal_id, 'accept')}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 text-sm font-semibold rounded-md transition"
                      >
                        Accept Proposal
                      </button>
                      <button 
                        onClick={() => handleProposalAction(selectedProposal.proposal_id, 'reject')}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 text-sm font-semibold rounded-md transition"
                      >
                        Reject Proposal
                      </button>
                    </div>
                  )}
                  
                  {selectedProposal.status !== 'Pending' && (
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <p className="text-gray-600">
                        This proposal has been <strong>{selectedProposal.status.toLowerCase()}</strong>.
                        {selectedProposal.status === 'Accepted' && ' You can now view harvest data for this agreement.'}
                      </p>
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
