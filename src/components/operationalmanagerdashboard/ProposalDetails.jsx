import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ProposalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProposalDetails();
  }, [id]);

  const fetchProposalDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost/FARMMASTER-Backend/api.php/proposals/${id}/public`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === 'success') {
        setProposal(data.data);
      } else {
        setError(data.message || 'Failed to fetch proposal details');
      }
    } catch (err) {
      setError('Failed to connect to backend: ' + err.message);
      console.error('Error fetching proposal details:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `Rs. ${amount?.toLocaleString() || '0'}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Accepted':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex-1 bg-white min-h-screen p-4 md:p-10 font-poppins">
        <div className="text-center py-8">
          <p className="text-gray-600">Loading proposal details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 bg-white min-h-screen p-4 md:p-10 font-poppins">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
          <div className="mt-4 space-x-2">
            <button 
              onClick={fetchProposalDetails}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Retry
            </button>
            <button 
              onClick={() => navigate(-1)}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="flex-1 bg-white min-h-screen p-4 md:p-10 font-poppins">
        <div className="text-center py-8">
          <p className="text-gray-600">Proposal not found</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white min-h-screen p-4 md:p-10 font-poppins">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => navigate(-1)}
            className="text-green-600 hover:text-green-700 flex items-center"
          >
            ← Back to Proposals
          </button>
          <div className={`px-4 py-2 rounded-full border text-sm font-semibold ${getStatusColor(proposal.status)}`}>
            {proposal.status}
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
          Proposal #{proposal.proposal_id}
        </h1>
        <p className="text-green-600">
          Detailed information about this farming proposal
        </p>
      </div>

      {/* Proposal Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Landowner Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-black mb-4">Landowner Information</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-600">Name</label>
              <p className="text-lg text-black">{proposal.user_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-lg text-black">{proposal.user_email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">User ID</label>
              <p className="text-lg text-black">#{proposal.user_id}</p>
            </div>
          </div>
        </div>

        {/* Land Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-black mb-4">Land Information</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-600">Land ID</label>
              <p className="text-lg text-black">#{proposal.land_id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Location</label>
              <p className="text-lg text-black">{proposal.location}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Land Size</label>
              <p className="text-lg text-black">{proposal.land_size} acres</p>
            </div>
          </div>
        </div>

        {/* Crop & Production Details */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-black mb-4">Crop & Production</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-600">Crop Type</label>
              <p className="text-lg text-black">{proposal.crop_type}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Estimated Yield</label>
              <p className="text-lg text-black">{proposal.estimated_yield?.toLocaleString()} kg</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Lease Duration</label>
              <p className="text-lg text-black">{proposal.lease_duration_years} years</p>
            </div>
          </div>
        </div>

        {/* Financial Details */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-black mb-4">Financial Details</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-600">Rental Value</label>
              <p className="text-lg text-green-700 font-semibold">{formatCurrency(proposal.rental_value)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">FarmMaster Profit Share</label>
              <p className="text-lg text-black">{proposal.profit_sharing_farmmaster}%</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Landowner Profit Share</label>
              <p className="text-lg text-black">{proposal.profit_sharing_landowner}%</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Estimated Landowner Profit</label>
              <p className="text-lg text-green-700 font-semibold">{formatCurrency(proposal.estimated_profit_landowner)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Information */}
      <div className="bg-gray-50 rounded-lg p-6 mt-6">
        <h2 className="text-xl font-semibold text-black mb-4">Timeline</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Proposal Date</label>
            <p className="text-lg text-black">{formatDate(proposal.proposal_date)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Created At</label>
            <p className="text-lg text-black">{formatDate(proposal.created_at)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Last Updated</label>
            <p className="text-lg text-black">{formatDate(proposal.updated_at)}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 mt-6">
        <button 
          onClick={() => navigate(-1)}
          className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
        >
          Back to List
        </button>
        <button 
          onClick={() => window.print()}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Print Details
        </button>
      </div>
    </div>
  );
};

export default ProposalDetails;