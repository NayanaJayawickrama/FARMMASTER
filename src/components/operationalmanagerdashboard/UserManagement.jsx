import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";

const rootUrl = import.meta.env.VITE_API_URL;

export default function UserManagementPage() {
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${rootUrl}/get_users.php`);
      setUserList(response.data);
    } catch (err) {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // No delete button, so no delete handler needed

  const openAddUserForm = () => {
    setEditUser(null);
    setShowForm(true);
  };

  const openEditUserForm = (user) => {
    setEditUser(user);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editUser) {
        const res = await axios.post(`${rootUrl}/update_user.php`, {
          user_id: editUser.user_id,
          ...formData,
        });
        if (res.data.success) {
          alert("User updated successfully");
          setShowForm(false);
          fetchUsers();
        } else {
          alert(res.data.error || "Failed to update user");
        }
      } else {
        const res = await axios.post(`${rootUrl}/add_user.php`, formData);
        if (res.data.success) {
          alert("User added successfully");
          setShowForm(false);
          fetchUsers();
        } else {
          alert(res.data.error || "Failed to add user");
        }
      }
    } catch (err) {
      alert("Server error. Please try again.");
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "inactive" : "active";
    try {
      const res = await axios.post(`${rootUrl}/update_user_status.php`, {
        user_id: userId,
        status: newStatus,
      });
      if (res.data.success) {
        alert("User status updated successfully");
        fetchUsers();
      } else {
        alert(res.data.error || "Failed to update user status");
      }
    } catch {
      alert("Server error. Please try again.");
    }
  };

  const filteredUsers = userList.filter((user) => {
    const matchesRole = roleFilter ? user.role === roleFilter : true;
    const matchesSearch = searchTerm
      ? user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesRole && matchesSearch;
  });

  const UserForm = ({ initialData, onCancel, onSubmit }) => {
    const [firstName, setFirstName] = useState(initialData?.first_name || "");
    const [lastName, setLastName] = useState(initialData?.last_name || "");
    const [email, setEmail] = useState(initialData?.email || "");
    const [phone, setPhone] = useState(initialData?.phone || "");
    const [userRole, setUserRole] = useState(initialData?.role || "");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!firstName || !lastName || !email || !userRole) {
        alert("Please fill in all required fields.");
        return;
      }
      const data = {
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        user_role: userRole,
      };
      if (!initialData) {
        if (!password) {
          alert("Password is required for new users.");
          return;
        }
        data.password = password;
      }
      onSubmit(data);
    };

    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">
          {initialData ? "Edit User" : "Add New User"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">First Name*</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Last Name*</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Email*</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
              disabled={!!initialData}
            />
          </div>
          {!initialData && (
            <div>
              <label className="block font-medium">Password*</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
          )}
          <div>
            <label className="block font-medium">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Role*</label>
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Select Role</option>
              <option value="Landowner">Landowner</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Buyer">Buyer</option>
              <option value="Operational_Manager">Operational Manager</option>
              <option value="Financial_Manager">Financial Manager</option>
            </select>
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
              {initialData ? "Update User" : "Add User"}
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="flex-1 bg-white min-h-screen p-4 md:p-10 font-poppins">
      {showForm ? (
        <UserForm
          initialData={editUser}
          onCancel={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
        />
      ) : (
        <>
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-4 mt-4">
            User Management
          </h1>

          {/* Search Bar */}
          <div className="relative mb-6 max-w-md">
            <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-green-600" />
            <input
              type="text"
              placeholder="Search users"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-green-50 rounded-md pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-green-400"
            />
          </div>

          {/* Filters + Add Button */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 max-w-md">
            <select
              className="bg-green-50 text-sm rounded-md px-4 py-2 focus:outline-none w-full md:w-auto"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="Landowner">Landowner</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Buyer">Buyer</option>
              <option value="Operational_Manager">Operational Manager</option>
              <option value="Financial_Manager">Financial Manager</option>
            </select>

            <button
              onClick={openAddUserForm}
              className="bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-green-700 w-full md:w-auto"
            >
              Add New User
            </button>
          </div>

          {/* User Table */}
          {loading ? (
            <p className="text-center text-gray-600">Loading users...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : filteredUsers.length === 0 ? (
            <p className="text-center text-gray-600">No users found.</p>
          ) : (
            <div className="overflow-x-auto bg-white border rounded-xl shadow-sm">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-green-50 text-black font-semibold">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-green-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.user_id} className="border-t hover:bg-green-50">
                      <td className="px-6 py-4">{user.name}</td>
                      <td className="px-6 py-4 text-green-600">{user.email}</td>
                      <td className="px-6 py-4 w-32">
                        <span className="bg-green-50 text-black font-semibold px-4 py-1 rounded-md block text-center">
                          {user.role.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 w-28">
                        <span
                          className={`font-semibold px-3 py-1 rounded-full block text-center ${
                            user.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-200 text-red-600"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-black font-semibold text-sm whitespace-nowrap">
                        <div className="flex flex-wrap gap-3 items-center">
                          <button
                            onClick={() => openEditUserForm(user)}
                            className="hover:underline hover:text-green-600 cursor-pointer"
                          >
                            Edit
                          </button>

                          {/* Toggle switch for status */}
                          <label className="inline-flex items-center cursor-pointer ml-2">
                            <input
                              type="checkbox"
                              className="form-checkbox h-5 w-5 text-green-600"
                              checked={user.status === "Active"}
                              onChange={() =>
                                handleToggleStatus(user.user_id, user.status)
                              }
                            />
                            <span className="ml-2 text-sm">
                              {user.status === "Active" ? "Active" : "Inactive"}
                            </span>
                          </label>
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
