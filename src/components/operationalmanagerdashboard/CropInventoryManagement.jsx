import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";

const rootUrl = import.meta.env.VITE_API_URL;
const allowedCrops = ["Carrot", "Leeks", "Tomato", "Cabbage"];

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

  // Delete crop
  const handleDeleteCrop = async (cropId) => {
    if (!window.confirm("Are you sure you want to delete this crop?")) return;
    try {
      const res = await axios.delete(`${rootUrl}/api/crops/${cropId}`, {
        withCredentials: true
      });
      if (res.data.status === 'success') {
        fetchCrops();
      } else {
        alert(res.data.message || "Failed to delete crop.");
      }
    } catch {
      alert("Server error while deleting crop.");
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
      const res = await axios.put(`${rootUrl}/api/crops/${editCrop.crop_id}`, formData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });

      if (res.data.status === 'success') {
        alert("Crop updated successfully");
        setShowForm(false);
        fetchCrops();
      } else {
        alert(res.data.message || "Failed to update crop");
      }
    } catch {
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

  // Crop edit form component
  const CropEditForm = ({ cropData, onCancel, onSubmit }) => {
    const [quantity, setQuantity] = useState(cropData?.quantity || "");

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!quantity || quantity <= 0) {
        alert("Please enter a valid quantity.");
        return;
      }
      onSubmit({
        crop_name: cropData.crop_name, // Keep the same crop name
        quantity: parseFloat(quantity),
      });
    };

    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Edit Crop Inventory</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Crop Name</label>
            <input
              type="text"
              value={cropData.crop_name}
              className="w-full border px-3 py-2 rounded bg-gray-100"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">Crop name cannot be changed</p>
          </div>
          
          <div>
            <label className="block font-medium">Current Quantity</label>
            <input
              type="text"
              value={`${cropData.quantity} kg`}
              className="w-full border px-3 py-2 rounded bg-gray-100"
              disabled
            />
          </div>

          <div>
            <label className="block font-medium">New Quantity (kg)*</label>
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter new quantity in kg"
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
              Update Quantity
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="flex-1 bg-white min-h-screen p-4 md:p-10 font-poppins">
      {showForm ? (
        <CropEditForm
          cropData={editCrop}
          onCancel={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
        />
      ) : (
        <>
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-4 mt-4">Crop Inventory Management</h1>
          <p className="text-gray-600 mb-6">Update quantities of existing crops in inventory</p>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
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
            <div className="overflow-x-auto bg-white border rounded-xl shadow-sm">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-green-50 text-black font-semibold">
                  <tr>
                    <th className="px-6 py-4">Crop Name</th>
                    <th className="px-6 py-4">Quantity (kg)</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-green-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCrops.map((crop) => (
                    <tr key={crop.crop_id} className="border-t hover:bg-green-50 transition-colors">
                      <td className="px-6 py-4 font-medium">{crop.crop_name}</td>
                      <td className="px-6 py-4">
                        <span className="font-semibold">{crop.quantity}</span> kg
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          crop.quantity > 50 
                            ? 'bg-green-100 text-green-800' 
                            : crop.quantity > 10 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {crop.quantity > 50 ? 'In Stock' : crop.quantity > 10 ? 'Low Stock' : 'Very Low'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3">
                          <button
                            onClick={() => openEditCropForm(crop)}
                            className="text-green-600 hover:text-green-800 hover:underline text-sm font-medium transition-colors"
                          >
                            Update Quantity
                          </button>
                          <button
                            onClick={() => handleDeleteCrop(crop.crop_id)}
                            className="text-red-600 hover:text-red-800 hover:underline text-sm font-medium transition-colors"
                          >
                            Delete
                          </button>
                        </div>
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Total Crops:</span>
                  <span className="ml-2 font-semibold">{filteredCrops.length}</span>
                </div>
                <div>
                  <span className="text-gray-600">Total Quantity:</span>
                  <span className="ml-2 font-semibold">
                    {filteredCrops.reduce((sum, crop) => sum + parseFloat(crop.quantity), 0).toFixed(1)} kg
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Low Stock:</span>
                  <span className="ml-2 font-semibold text-yellow-600">
                    {filteredCrops.filter(crop => crop.quantity <= 50 && crop.quantity > 10).length}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Very Low Stock:</span>
                  <span className="ml-2 font-semibold text-red-600">
                    {filteredCrops.filter(crop => crop.quantity <= 10).length}
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