import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProposalManagement = () => {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch proposals from backend
  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use the public endpoint for testing (no authentication required)
      const response = await fetch('http://localhost/FARMMASTER-Backend/api.php/proposals/public', {
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
        // Transform backend data to match frontend format
        const transformedProposals = data.data.map(proposal => ({
          id: proposal.proposal_display_id || `#${proposal.proposal_id}`,
          name: proposal.landowner_name,
          status: proposal.status,
          profit: `Rs. ${proposal.estimated_profit_landowner?.toLocaleString() || '0'}`,
          proposal_id: proposal.proposal_id
        }));
        setProposals(transformedProposals);
      } else {
        setError(data.message || 'Failed to fetch proposals');
      }
    } catch (err) {
      setError('Failed to connect to backend: ' + err.message);
      console.error('Error fetching proposals:', err);
      // No fallback data - only show actual database data
      setProposals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (proposal) => {
    // Navigate to the proposal details page
    navigate(`/proposal-details/${proposal.proposal_id}`);
  };

  const statusStyles = {
    Pending: "bg-green-50 text-black",
    Accepted: "bg-green-200 text-black font-semibold",
    Rejected: "bg-red-100 text-red-700 font-semibold",
  };

  return (
    <div className="flex-1 bg-white min-h-screen p-4 md:p-10 font-poppins">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-4 mt-4">
          Proposal Management
        </h1>
        <p className="text-green-600 mt-1">
          Manage and send proposals to landowners.
        </p>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading proposals...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={fetchProposals}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Proposals Table */}
      {!loading && (
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-green-50 text-left text-sm text-gray-700">
                <th className="py-3 px-4">Proposal ID</th>
                <th className="py-3 px-4">Landowner Name</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Profit Estimate</th>
                <th className="py-3 px-4 text-green-600">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {proposals.length === 0 && !error ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
                    No proposals found in the database
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
                    Unable to load proposals. Please check your backend connection.
                  </td>
                </tr>
              ) : (
                proposals.map((proposal, index) => (
                  <tr
                    key={proposal.proposal_id || index}
                    className="border-t border-gray-200 hover:bg-green-50 transition"
                  >
                    <td className="py-3 px-4">{proposal.id}</td>
                    <td className="py-3 px-4 text-green-700">{proposal.name}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm ${statusStyles[proposal.status]}`}
                      >
                        {proposal.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-green-700">{proposal.profit}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleViewDetails(proposal)}
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
      )}
    </div>
  );
};

export default ProposalManagement;
