import React, { useState } from "react";

export default function AddNewUserForm({ onCancel, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Landowner",
    status: "Active",
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
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded mb-4 max-w-xl mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-black text-center">Add New User</h2>

      {/* Name */}
      <div className="mb-2">
        <label className="block font-semibold">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 rounded bg-white focus:outline-none focus:ring-1 focus:ring-green-400"
          required
        />
      </div>

      {/* Email */}
      <div className="mb-2">
        <label className="block font-semibold">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-2 rounded bg-white focus:outline-none focus:ring-1 focus:ring-green-400"
          required
        />
      </div>

      {/* Role */}
      <div className="mb-2">
        <label className="block font-semibold">Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full border p-2 rounded bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-green-400"
          required
        >
          <option value="Landowner">Landowner</option>
          <option value="Supervisor">Supervisor</option>
          <option value="Buyer">Buyer</option>
        </select>
      </div>

      {/* Status */}
      <div className="mb-4">
        <label className="block font-semibold">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full border p-2 rounded bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-green-400"
          required
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div className="space-x-2">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add User
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-600 px-4 py-2 hover:underline"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
