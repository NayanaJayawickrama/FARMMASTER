import React, { useState } from "react";

export default function AddNewCropForm({ onCancel, onSubmit }) {
  const [formData, setFormData] = useState({
    crop: "",
    location: "",
    supervisor: "",
    expectedYield: "",
    status: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      crop: formData.crop.trim(),
      supervisor: formData.supervisor.trim(),
      expectedYield: formData.expectedYield.trim(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 md:p-10 rounded-xl shadow max-w-2xl mx-auto font-poppins"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-black mb-8 text-center">Add a New Crop</h2>

      {/* Crop Type */}
      <div className="mb-4">
        <label className="block font-semibold mb-1 text-black">Crop Type</label>
        <input
          type="text"
          name="crop"
          placeholder="Enter crop type"
          value={formData.crop}
          onChange={handleChange}
          required
          className="w-full bg-green-50 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      {/* Location */}
      <div className="mb-4">
        <label className="block font-semibold mb-1 text-black">Location</label>
        <select
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
          className="w-full bg-green-50 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="">Select Location</option>
          <option value="Kandy">Kandy</option>
          <option value="Nuwara Eliya">Nuwara Eliya</option>
          <option value="Kurunegala">Kurunegala</option>
          <option value="Matara">Matara</option>
          <option value="Matale">Matale</option>
        </select>
      </div>

      {/* Supervisor */}
      <div className="mb-4">
        <label className="block font-semibold mb-1 text-black">Supervisor</label>
        <input
          type="text"
          name="supervisor"
          placeholder="Enter Supervisor name"
          value={formData.supervisor}
          onChange={handleChange}
          required
          className="w-full bg-green-50 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      {/* Expected Yield */}
      <div className="mb-4">
        <label className="block font-semibold mb-1 text-black">Expected Yield</label>
        <input
          type="text"
          name="expectedYield"
          placeholder="Enter expected yield"
          value={formData.expectedYield}
          onChange={handleChange}
          required
          className="w-full bg-green-50 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      {/* Inventory Status */}
      <div className="mb-6">
        <label className="block font-semibold mb-1 text-black">Inventory Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
          className="w-full bg-green-50 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="">Select Inventory Status</option>
          <option value="Active">Active</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="bg-green-100 text-black px-5 py-2 rounded-md hover:bg-green-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700"
        >
          Add New Crop
        </button>
      </div>
    </form>
  );
}
