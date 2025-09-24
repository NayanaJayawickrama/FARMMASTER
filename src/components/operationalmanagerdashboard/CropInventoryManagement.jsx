
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FiSearch, FiEdit3, FiPackage } from "react-icons/fi";
import PopupMessage from "../alerts/PopupMessage";

const rootUrl = import.meta.env.VITE_API_URL;
const allowedCrops = ["Carrot", "Leeks", "Tomato", "Cabbage"];
const statusOptions = ["Available", "Unavailable", "Sold"];

export default function CropInventoryManagement() {
  const [showForm, setShowForm] = useState(false);
  const [editCrop, setEditCrop] = useState(null);
  const [cropList, setCropList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [cropFilter, setCropFilter] = useState("");

  // Custom popup message state
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

  // Fetch crops list from backend
  const fetchCrops = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${rootUrl}/api/crops`, {
        withCredentials: true
      });
      if (res.data.status === 'success') {
        setCropList(res.data.data || []);
      } else {
        setError(res.data.message || "Failed to load crops.");
      }
    } catch {
      setError("Server error while fetching crops.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  // Update crop status
  const handleStatusChange = async (cropId, newStatus) => {
    try {
      const res = await axios.put(`${rootUrl}/api/crops/${cropId}/status`, 
        { status: newStatus }, 
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      if (res.data.status === 'success') {
        showPopup("Crop status updated successfully", 'success');
        fetchCrops();
      } else {
        showPopup(res.data.message || "Failed to update crop status.", 'error');
      }
    } catch {
      showPopup("Server error while updating crop status.", 'error');
    }
  };

  // Open Edit Crop Form
  const openEditCropForm = (crop) => {
    setEditCrop(crop);
    setShowForm(true);
  };

  // Handle Update Crop form submission
  const handleFormSubmit = async (formData) => {
    try {
      let res;
      if (editCrop) {
        // Update existing crop
        res = await axios.put(`${rootUrl}/api/crops/${editCrop.crop_id}`, formData, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        });
      } else {
        // Add new crop
        res = await axios.post(`${rootUrl}/api/crops`, formData, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        });
      }

      if (res.data.status === 'success') {
        showPopup(editCrop ? "Crop updated successfully" : "Crop added successfully", 'success');
        // Reset form state
        setEditCrop(null);
        setShowForm(false);
        // Refresh crops list
        await fetchCrops();
      } else {
        showPopup(res.data.message || (editCrop ? "Failed to update crop" : "Failed to add crop"), 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      console.error('Response:', error.response?.data);
      showPopup(error.response?.data?.message || "Server error. Please try again.", 'error');
    }
  };

  // Filter and search crops
  const filteredCrops = cropList.filter((crop) => {
    const matchesFilter = cropFilter ? crop.crop_name === cropFilter : true;
    const matchesSearch = searchTerm
      ? crop.crop_name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesFilter && matchesSearch;
  });



  return (
    <div className="flex-1 bg-white min-h-screen p-4 md:p-10 font-poppins">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-black mt-4 mb-2">Crop Inventory Management</h1>
        <p className="text-gray-600">Manage crops in inventory - add new crops or update existing ones</p>
      </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div className="flex gap-4 w-full md:w-auto">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search crops..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-green-50 text-sm rounded-md pl-10 pr-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <select
                value={cropFilter}
                onChange={(e) => setCropFilter(e.target.value)}
                className="bg-green-50 text-sm rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Crops</option>
                {allowedCrops.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => {
                setEditCrop(null);
                setShowForm(true);
              }}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              + Add New Crop
            </button>
          </div>

          {/* Crop Table */}
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <p className="text-gray-600 mt-2">Loading crops...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
            </div>
          ) : filteredCrops.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No crops found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white border border-black rounded-xl shadow-lg">
              <table className="min-w-full text-sm">
                <thead className="bg-gradient-to-r from-green-50 to-green-100 text-black font-semibold">
                  <tr>
                    <th className="px-6 py-5 text-center border-b border-black">Crop Name</th>
                    <th className="px-6 py-5 text-center border-b border-black">Quantity (kg)</th>
                    <th className="px-6 py-5 text-center border-b border-black">Stock Status</th>
                    <th className="px-6 py-5 text-center border-b border-black">Availability Status</th>
                    <th className="px-6 py-5 text-center border-b border-black ">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCrops.map((crop) => (
                    <tr key={crop.crop_id} className="border-b border-black hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:shadow-sm transition-all duration-300 group">
                      <td className="px-6 py-5 text-center font-medium text-gray-900">{crop.crop_name}</td>
                      <td className="px-6 py-5 text-center">
                        <span className="font-semibold text-lg text-gray-600">{crop.quantity}</span>
                        <span className="text-black-600 ml-1">kg</span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={`px-3 py-2 rounded-full text-sm font-medium inline-block transition-colors duration-200 ${
                          crop.quantity > 50 
                            ? 'bg-green-100 text-green-800' 
                            : crop.quantity > 10 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {crop.quantity > 50 ? 'In Stock' : crop.quantity > 10 ? 'Low Stock' : 'Very Low'}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <select
                          value={crop.quantity === 0 ? 'Sold' : (crop.status || 'Available')}
                          onChange={(e) => {
                            // Prevent changing to 'Sold' manually
                            if (e.target.value === 'Sold') return;
                            handleStatusChange(crop.crop_id, e.target.value);
                          }}
                          className={`px-3 py-2 rounded-full text-sm font-medium border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                            (crop.quantity === 0 || (crop.status || 'Available') === 'Sold')
                              ? 'bg-blue-100 text-blue-800'
                              : (crop.status || 'Available') === 'Available' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}
                          disabled={crop.quantity === 0}
                        >
                          <option value="Available">Available</option>
                          <option value="Unavailable">Unavailable</option>
                          <option value="Sold" disabled={crop.quantity !== 0}>Sold</option>
                        </select>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <button
                          onClick={() => openEditCropForm(crop)}
                          className="group relative bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                          title="Update Crop Quantity"
                        >
                          <div className="flex items-center space-x-2">
                            <FiPackage className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                            <span className="group-hover:tracking-wider transition-all duration-300">
                              Update Quantity
                            </span>
                          </div>
                          
                          {/* Animated background effect */}
                          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
                          
                          {/* Ripple effect on click */}
                          <div className="absolute inset-0 rounded-lg overflow-hidden">
                            <div className="absolute inset-0 bg-white opacity-0 group-active:opacity-20 group-active:animate-ping"></div>
                          </div>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Summary */}
          {!loading && !error && filteredCrops.length > 0 && (
            <div className="mt-6 bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Inventory Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Total Crops:</span>
                  <span className="ml-2 font-semibold">{filteredCrops.length}</span>
                </div>
                <div>
                  <span className="text-gray-600">Total Quantity:</span>
                  <span className="ml-2 font-semibold">
                    {filteredCrops.reduce((sum, crop) => sum + parseFloat(crop.quantity), 0).toFixed(3)} kg
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Available:</span>
                  <span className="ml-2 font-semibold text-green-600">
                    {filteredCrops.filter(crop => (crop.status || 'Available') === 'Available').length}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Unavailable:</span>
                  <span className="ml-2 font-semibold text-red-600">
                    {filteredCrops.filter(crop => (crop.status || 'Available') === 'Unavailable').length}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Sold:</span>
                  <span className="ml-2 font-semibold text-blue-600">
                    {filteredCrops.filter(crop => (crop.status || 'Available') === 'Sold').length}
                  </span>
                </div>
              </div>
            </div>
          )}

          <p className="text-center mt-8 text-sm text-gray-400">
            © 2025 Farm Master. All rights reserved.
          </p>

      {/* Add New Crop Form Modal */}
      {showForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '32px',
            width: '100%',
            maxWidth: '500px',
            margin: '20px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: '#1f2937',
                marginBottom: '8px',
                textAlign: 'center'
              }}>
                {editCrop ? 'Update Crop Quantity' : 'Add New Crop to Inventory'}
              </h2>
              <p style={{ 
                color: '#6b7280', 
                textAlign: 'center',
                fontSize: '14px'
              }}>
                {editCrop 
                  ? 'Update the quantity for this crop in your inventory' 
                  : 'Enter crop details to add to your inventory management system'
                }
              </p>
            </div>

            {/* Form Fields */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Crop Name {!editCrop && '*'}
              </label>
              {editCrop ? (
                // Read-only crop name display for editing
                <div
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    boxSizing: 'border-box',
                    backgroundColor: '#f9fafb',
                    color: '#6b7280',
                    fontWeight: '500'
                  }}
                >
                  {editCrop.crop_name}
                </div>
              ) : (
                // Editable crop name input for adding new crop
                <input
                  id="crop-name-input"
                  type="text"
                  placeholder="Enter crop name "
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '16px',
                    border: '2px solid #d1d5db',
                    borderRadius: '8px',
                    boxSizing: 'border-box',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#10b981'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              )}
              {editCrop && (
                <p style={{ 
                  fontSize: '12px', 
                  color: '#6b7280', 
                  marginTop: '4px' 
                }}>
                  Crop name cannot be changed when updating quantity
                </p>
              )}
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Quantity (kg) *
              </label>
              <input
                id="crop-quantity-input"
                type="number"
                min="0"
                step="0.001"
                placeholder="Enter quantity in kilograms"
                defaultValue={editCrop ? editCrop.quantity : ''}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '16px',
                  border: '2px solid #d1d5db',
                  borderRadius: '8px',
                  boxSizing: 'border-box',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
              <p style={{ 
                fontSize: '12px', 
                color: '#6b7280', 
                marginTop: '4px' 
              }}>
                {editCrop 
                  ? `Current quantity: ${editCrop.quantity} kg - Enter new quantity up to 3 decimal places`
                  : 'Enter quantity up to 3 decimal places'
                }
              </p>
            </div>

            {/* Action Buttons */}
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              justifyContent: 'flex-end' 
            }}>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditCrop(null);
                }}
                style={{
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  backgroundColor: 'white',
                  border: '2px solid #d1d5db',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#f9fafb';
                  e.target.style.borderColor = '#9ca3af';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.borderColor = '#d1d5db';
                }}
              >
                Cancel
              </button>
              
              <button
                onClick={() => {
                  const quantity = document.getElementById('crop-quantity-input').value.trim();
                  
                  // Validation for quantity
                  if (!quantity) {
                    showPopup('Please enter a quantity', 'error');
                    document.getElementById('crop-quantity-input').focus();
                    return;
                  }
                  
                  const numQuantity = parseFloat(quantity);
                  if (isNaN(numQuantity) || numQuantity < 0) {
                    showPopup('Please enter a valid quantity (0 or greater)', 'error');
                    document.getElementById('crop-quantity-input').focus();
                    return;
                  }
                  
                  if (editCrop) {
                    // For editing: only update quantity, keep existing crop name
                    handleFormSubmit({
                      crop_name: editCrop.crop_name,
                      quantity: numQuantity
                    });
                  } else {
                    // For adding new crop: validate crop name and submit both fields
                    const cropName = document.getElementById('crop-name-input').value.trim();
                    
                    if (!cropName) {
                      showPopup('Please enter a crop name', 'error');
                      document.getElementById('crop-name-input').focus();
                      return;
                    }
                    
                    handleFormSubmit({
                      crop_name: cropName,
                      quantity: numQuantity
                    });
                  }
                }}
                style={{
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'white',
                  backgroundColor: '#10b981',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
              >
                {editCrop ? 'Update Quantity' : 'Add Crop to Inventory'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Popup Message */}
      <PopupMessage
        isOpen={popupMessage.isOpen}
        message={popupMessage.message}
        type={popupMessage.type}
        onClose={closePopup}
      />

    </div>
  );
}