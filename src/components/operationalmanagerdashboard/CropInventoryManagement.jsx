
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";

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
        fetchCrops();
      } else {
        alert(res.data.message || "Failed to update crop status.");
      }
    } catch {
      alert("Server error while updating crop status.");
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
        alert(editCrop ? "Crop updated successfully" : "Crop added successfully");
        setShowForm(false);
        fetchCrops();
      } else {
        alert(res.data.message || (editCrop ? "Failed to update crop" : "Failed to add crop"));
      }
    } catch (error) {
      console.error('Error:', error);
      alert("Server error. Please try again.");
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

  // Crop form component (for both adding and editing)
  const CropForm = ({ cropData, onCancel, onSubmit }) => {
    const [cropName, setCropName] = useState(cropData?.crop_name || "");
    const [quantity, setQuantity] = useState(cropData?.quantity || "");
    const isEditing = !!cropData;

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!cropName.trim()) {
        alert("Please enter a crop name.");
        return;
      }
      if (quantity === "" || quantity < 0) {
        alert("Please enter a valid quantity.");
        return;
      }
      onSubmit({
        crop_name: cropName.trim(),
        quantity: Number(quantity),
      });
    };

    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg border">
        <h2 className="text-2xl font-bold mb-4">
          {isEditing ? "Edit Crop Inventory" : "Add New Crop"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-2">Crop Name*</label>
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={cropName}
                  className="w-full border px-3 py-2 rounded bg-gray-100"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">Crop name cannot be changed</p>
              </>
            ) : (
              <input
                type="text"
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter crop name (e.g., Tomato, Carrot, Rice, etc.)"
                required
              />
            )}
          </div>
          
          {isEditing && (
            <div>
              <label className="block font-medium mb-2">Current Quantity</label>
              <input
                type="text"
                value={`${cropData.quantity} kg`}
                className="w-full border px-3 py-2 rounded bg-gray-100"
                disabled
              />
            </div>
          )}

          <div>
            <label className="block font-medium mb-2">
              {isEditing ? "New Quantity (kg)*" : "Quantity (kg)*"}
            </label>
            <input
              type="number"
              min="0"
              step="0.001"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter quantity in kg (up to 3 decimal places)"
              required
            />
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {isEditing ? "Update Quantity" : "Add Crop"}
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="flex-1 bg-white min-h-screen p-4 md:p-10 font-poppins">
      {showForm ? (
        <CropForm
          cropData={editCrop}
          onCancel={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
        />
      ) : (
        <>
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
                    <tr key={crop.crop_id} className="border-b border-black hover:bg-green-50 transition-colors duration-200">
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
                          className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium transition-colors duration-200 px-3 py-1 rounded-md hover:bg-blue-50"
                        >
                          Update Quantity
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
        </>
      )}
    </div>
  );
}