import React, { useState } from "react";

export default function AddNewUserForm({ onCancel, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    status: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedData = {
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim(),
    };
    onSubmit(trimmedData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 md:p-10 rounded-xl shadow max-w-2xl mx-auto font-poppins"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-black mb-8 text-center">
        Add a New User
      </h2>

      {/* Name */}
      <div className="mb-4">
        <label className="block font-semibold mb-1 text-black">Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter full name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full bg-green-50 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      {/* Email */}
      <div className="mb-4">
        <label className="block font-semibold mb-1 text-black">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter email address"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full bg-green-50 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      {/* Role */}
      <div className="mb-4">
        <label className="block font-semibold mb-1 text-black">Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
          className="w-full bg-green-50 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="" disabled hidden>
            Select role
          </option>
          <option value="Landowner">Landowner</option>
          <option value="Supervisor">Supervisor</option>
          <option value="Buyer">Buyer</option>
        </select>
      </div>

      {/* Status */}
      <div className="mb-6">
        <label className="block font-semibold mb-1 text-black">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
          className="w-full bg-green-50 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="" disabled hidden>
            Select status
          </option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
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
          Add New User
        </button>
      </div>
    </form>
  );
}
