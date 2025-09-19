import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const LandReportDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchReportDetails();
  }, [id]);

  const fetchReportDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost/FARMMASTER-Backend/api.php/land-reports/${id}/public`, {
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
        setReport(data.data);
      } else {
        setError(data.message || 'Failed to fetch land report details');
      }
    } catch (err) {
      setError('Failed to connect to backend: ' + err.message);
      console.error('Error fetching land report details:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateReportStatus = async (newStatus) => {
    try {
      setUpdatingStatus(true);
      const response = await fetch(`http://localhost/FARMMASTER-Backend/api.php/land-reports/${id}/status-public`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === 'success') {
        setReport(prev => ({ ...prev, status: newStatus }));
        alert(`Land report status updated to ${newStatus}`);
      } else {
        alert(data.message || 'Failed to update land report status');
      }
    } catch (err) {
      alert('Failed to update status: ' + err.message);
      console.error('Error updating land report status:', err);
    } finally {
      setUpdatingStatus(false);
    }
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
      case 'Approved':
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
          <p className="text-gray-600">Loading land report details...</p>
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
              onClick={fetchReportDetails}
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

  if (!report) {
    return (
      <div className="flex-1 bg-white min-h-screen p-4 md:p-10 font-poppins">
        <div className="text-center py-8">
          <p className="text-gray-600">Land report not found</p>
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
            ← Back to Land Reports
          </button>
          <div className={`px-4 py-2 rounded-full border text-sm font-semibold ${getStatusColor(report.status)}`}>
            {report.status}
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
          Land Report #{report.report_id}
        </h1>
        <p className="text-green-600">
          Detailed land assessment report and recommendations
        </p>
      </div>

      {/* Status Update Actions */}
      {(report.status === 'Pending' || report.status === '') && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">Update Report Status</h3>
          <div className="flex space-x-3">
            <button
              onClick={() => updateReportStatus('Approved')}
              disabled={updatingStatus}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {updatingStatus ? 'Updating...' : 'Approve Report'}
            </button>
            <button
              onClick={() => updateReportStatus('Rejected')}
              disabled={updatingStatus}
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 disabled:opacity-50"
            >
              {updatingStatus ? 'Updating...' : 'Reject Report'}
            </button>
          </div>
        </div>
      )}

      {/* Report Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Landowner Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-black mb-4">Landowner Information</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-600">Name</label>
              <p className="text-lg text-black">{report.first_name} {report.last_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-lg text-black">{report.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Phone</label>
              <p className="text-lg text-black">{report.landowner_phone || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">User ID</label>
              <p className="text-lg text-black">#{report.user_id}</p>
            </div>
          </div>
        </div>

        {/* Land Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-black mb-4">Land Information</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-600">Land ID</label>
              <p className="text-lg text-black">#{report.land_id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Location</label>
              <p className="text-lg text-black">{report.location}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Land Size</label>
              <p className="text-lg text-black">{report.land_size} acres</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Payment Status</label>
              <p className="text-lg text-black capitalize">{report.land_payment_status}</p>
            </div>
          </div>
        </div>

        {/* Soil Analysis */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-black mb-4">Soil Analysis</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-600">pH Value</label>
              <p className="text-lg text-black">{report.ph_value || 'Not tested'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Organic Matter (%)</label>
              <p className="text-lg text-black">{report.organic_matter || 'Not tested'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Nitrogen Level</label>
              <p className="text-lg text-black">{report.nitrogen_level || 'Not tested'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Phosphorus Level</label>
              <p className="text-lg text-black">{report.phosphorus_level || 'Not tested'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Potassium Level</label>
              <p className="text-lg text-black">{report.potassium_level || 'Not tested'}</p>
            </div>
          </div>
        </div>

        {/* Report Timeline */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-black mb-4">Report Timeline</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-600">Report Date</label>
              <p className="text-lg text-black">{formatDate(report.report_date)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Created At</label>
              <p className="text-lg text-black">{formatDate(report.created_at)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Last Updated</label>
              <p className="text-lg text-black">{formatDate(report.updated_at)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Land Description */}
      <div className="bg-gray-50 rounded-lg p-6 mt-6">
        <h2 className="text-xl font-semibold text-black mb-4">Land Description</h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {report.land_description || 'No description provided'}
        </p>
      </div>

      {/* Crop Recommendations */}
      <div className="bg-gray-50 rounded-lg p-6 mt-6">
        <h2 className="text-xl font-semibold text-black mb-4">Crop Recommendations</h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {report.crop_recomendation || 'No recommendations provided'}
        </p>
      </div>

      {/* Environmental Notes */}
      {report.environmental_notes && (
        <div className="bg-gray-50 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold text-black mb-4">Environmental Notes</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {report.environmental_notes}
          </p>
        </div>
      )}

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
          Print Report
        </button>
      </div>
    </div>
  );
};

export default LandReportDetails;