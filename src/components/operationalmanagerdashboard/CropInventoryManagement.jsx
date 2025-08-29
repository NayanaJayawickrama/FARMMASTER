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
      const res = await axios.get(`${rootUrl}/get_crops.php`);
      console.log("Fetched crops:", res.data); // Debugging line
      if (Array.isArray(res.data)) {
        setCropList(res.data);
      } else if (res.data.success === false) {
        setError(res.data.error || "Failed to load crops.");
      } else {
        setCropList([]);
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
      const res = await axios.post(`${rootUrl}/delete_crop.php`, { crop_id: cropId });
      if (res.data.success) {
        await fetchCrops();
      } else {
        alert(res.data.error || "Failed to delete crop.");
      }
    } catch {
      alert("Server error while deleting crop.");
    }
  };

  // Open Add Crop Form
  const openAddCropForm = () => {
    setEditCrop(null);
    setShowForm(true);
  };

  // Open Edit Crop Form
  const openEditCropForm = (crop) => {
    setEditCrop(crop);
    setShowForm(true);
  };

  // Handle Add or Update Crop form submission
  const handleFormSubmit = async (formData) => {
    try {
      const endpoint = editCrop ? "update_crop.php" : "add_crop.php";
      const payload = editCrop ? { crop_id: editCrop.crop_id, ...formData } : formData;
      const res = await axios.post(`${rootUrl}/${endpoint}`, payload);

      if (res.data.success) {
        alert(`Crop ${editCrop ? "updated" : "added"} successfully`);
        await fetchCrops();        // ensure crop list updates before hiding form
        setShowForm(false);
      } else {
        alert(res.data.error || `Failed to ${editCrop ? "update" : "add"} crop`);
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

  // Crop add/edit form component
  const CropForm = ({ initialData, onCancel, onSubmit }) => {
    const [cropName, setCropName] = useState(initialData?.crop_name || "");
    const [cropDuration, setCropDuration] = useState(initialData?.crop_duration || "");
    const [quantity, setQuantity] = useState(initialData?.quantity || "");

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!cropName || !quantity) {
        alert("Please fill in all required fields.");
        return;
      }
      if (!allowedCrops.includes(cropName)) {
        alert("Invalid crop selected.");
        return;
      }
      onSubmit({
        crop_name: cropName,
        crop_duration: cropDuration,
        quantity: parseInt(quantity, 10),
      });
    };

    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">{initialData ? "Edit Crop" : "Add New Crop"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Crop Name*</label>
            <select
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Select Crop</option>
              {allowedCrops.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block font-medium">Quantity*</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full border px-3 py-2 rounded"
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
              {initialData ? "Update Crop" : "Add Crop"}
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
          initialData={editCrop}
          onCancel={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
        />
      ) : (
        <>
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-4 mt-4">Crop Inventory</h1>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 max-w-md">
            <input
              type="text"
              placeholder="Search crops"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-green-50 text-sm rounded-md px-4 py-2 w-full md:w-auto focus:outline-none"
            />
            <select
              value={cropFilter}
              onChange={(e) => setCropFilter(e.target.value)}
              className="bg-green-50 text-sm rounded-md px-4 py-2 w-full md:w-auto focus:outline-none"
            >
              <option value="">All Crops</option>
              {allowedCrops.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <button
              onClick={openAddCropForm}
              className="bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-green-700 w-full md:w-auto"
            >
              Add New Crop
            </button>
          </div>

          {/* Crop Table */}
          {loading ? (
            <p className="text-center text-gray-600">Loading crops...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : filteredCrops.length === 0 ? (
            <p className="text-center text-gray-600">No crops found.</p>
          ) : (
            <div className="overflow-x-auto bg-white border rounded-xl shadow-sm">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-green-50 text-black font-semibold">
                  <tr>
                    <th className="px-6 py-4">Crop</th>
                  
                    <th className="px-6 py-4">Quantity</th>
                    <th className="px-6 py-4 text-green-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCrops.map((crop) => (
                    <tr key={crop.crop_id} className="border-t hover:bg-green-50">
                      <td className="px-6 py-4">{crop.crop_name}</td>
                      
                      <td className="px-6 py-4">{crop.quantity}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditCropForm(crop)}
                            className="hover:underline hover:text-green-600 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCrop(crop.crop_id)}
                            className="hover:underline hover:text-green-600 text-sm"
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

          <p className="text-center mt-8 text-sm text-gray-400">
            © 2025 Farm Master. All rights reserved.
          </p>
        </>
      )}
    </div>
  );
}
