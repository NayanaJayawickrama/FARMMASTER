import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import PopupMessage from "../alerts/PopupMessage";

const rootUrl = import.meta.env.VITE_API_URL;

export default function UserManagementPage() {
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // Popup message state
  const [popup, setPopup] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  });

  const showPopup = (type, title, message) => {
    setPopup({
      isOpen: true,
      type,
      title,
      message
    });
  };

  const closePopup = () => {
    setPopup(prev => ({ ...prev, isOpen: false }));
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${rootUrl}/api/users`, {
        withCredentials: true
      });
      if (response.data.status === 'success') {
        // Transform backend data to match frontend expectations
        const transformedUsers = response.data.data.map(user => ({
          ...user,
          name: `${user.first_name} ${user.last_name}`,
          role: user.user_role,
          status: user.is_active ? "Active" : "Inactive"
        }));
        setUserList(transformedUsers);
      } else {
        setError(response.data.message || "Failed to load users.");
      }
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
        const res = await axios.put(`${rootUrl}/api/users/${editUser.user_id}`, formData, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        });
        if (res.data.status === 'success') {
          showPopup('success', 'Success', 'User updated successfully');
          setShowForm(false);
          fetchUsers();
        } else {
          showPopup('error', 'Update Failed', res.data.message || 'Failed to update user');
        }
      } else {
        const res = await axios.post(`${rootUrl}/api/users`, formData, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        });
        if (res.data.status === 'success') {
          showPopup('success', 'Success', 'User added successfully');
          setShowForm(false);
          fetchUsers();
        } else {
          showPopup('error', 'Add Failed', res.data.message || 'Failed to add user');
        }
      }
    } catch (err) {
      console.error("User management error:", err);
      
      // Show more detailed error message
      let errorMessage = "Server error. Please try again.";
      
      if (err.response) {
        // Server responded with error
        if (err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        } else {
          errorMessage = `Server error (${err.response.status}): ${err.response.statusText}`;
        }
      } else if (err.request) {
        // Network error
        errorMessage = "Network error. Please check your connection.";
      } else {
        // Other error
        errorMessage = err.message || "Unknown error occurred.";
      }
      
      showPopup('error', 'Error', errorMessage);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "inactive" : "active";
    try {
      const res = await axios.put(`${rootUrl}/api/users/${userId}/status`, {
        status: newStatus,
      }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      if (res.data.status === 'success') {
        showPopup('success', 'Success', 'User status updated successfully');
        fetchUsers();
      } else {
        showPopup('error', 'Update Failed', res.data.message || 'Failed to update user status');
      }
    } catch (err) {
      console.error("Status toggle error:", err);
      
      // Show more detailed error message
      let errorMessage = "Server error. Please try again.";
      
      if (err.response) {
        // Server responded with error
        if (err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        } else {
          errorMessage = `Server error (${err.response.status}): ${err.response.statusText}`;
        }
      } else if (err.request) {
        // Network error
        errorMessage = "Network error. Please check your connection.";
      } else {
        // Other error
        errorMessage = err.message || "Unknown error occurred.";
      }
      
      showPopup('error', 'Error', errorMessage);
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

  const UserForm = ({ initialData, onCancel, onSubmit, showPopup }) => {
    const [firstName, setFirstName] = useState(initialData?.first_name || "");
    const [lastName, setLastName] = useState(initialData?.last_name || "");
    const [email, setEmail] = useState(initialData?.email || "");
    const [phone, setPhone] = useState(initialData?.phone || "");
    const [userRole, setUserRole] = useState(initialData?.user_role || initialData?.role || "");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!firstName || !lastName || !email || !userRole) {
        showPopup('warning', 'Missing Information', 'Please fill in all required fields.');
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
          showPopup('warning', 'Password Required', 'Password is required for new users.');
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
              <option value="Field Supervisor">Field Supervisor</option>
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
          showPopup={showPopup}
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
              <option value="Field Supervisor">Field Supervisor</option>
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
            <div className="overflow-x-auto bg-white border border-black rounded-xl shadow-lg">
              <table className="min-w-full text-sm">
                <thead className="bg-gradient-to-r from-green-50 to-green-100 text-black font-semibold">
                  <tr>
                    <th className="px-6 py-5 text-center border-b border-black">Name</th>
                    <th className="px-6 py-5 text-center border-b border-black">Email</th>
                    <th className="px-6 py-5 text-center border-b border-black">Role</th>
                    <th className="px-6 py-5 text-center border-b border-black">Status</th>
                    <th className="px-6 py-5 text-center border-b border-black">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.user_id} className="border-b border-black hover:bg-green-50 transition-colors duration-200">
                      <td className="px-6 py-5 text-center font-medium text-gray-900">{user.name}</td>
                      <td className="px-6 py-5 text-center font-medium text-gray-900">{user.email}</td>
                      <td className="px-6 py-5 text-center">
                        <span className="bg-green-100 text-black-800 font-semibold px-4 py-2 rounded-full inline-block">
                          {(user.role || "").replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span
                          className={`font-semibold px-4 py-2 rounded-full inline-block transition-colors duration-200 ${
                            user.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex items-center justify-center gap-4">
                          <button
                            onClick={() => openEditUserForm(user)}
                            className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors duration-200"
                          >
                            Edit
                          </button>

                          {/* Toggle switch for status */}
                          <label className="inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={user.status === "Active"}
                              onChange={() =>
                                handleToggleStatus(user.user_id, user.status)
                              }
                            />
                            <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                              user.status === "Active" ? "bg-green-600" : "bg-gray-300"
                            }`}>
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                                user.status === "Active" ? "translate-x-6" : "translate-x-1"
                              }`} />
                            </div>
                            <span className="ml-2 text-sm font-medium text-gray-700">
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

          {/* User Summary */}
          <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">User Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-600">Total Users</h3>
                <p className="text-2xl font-bold text-blue-600">{userList.length}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-600">Active Users</h3>
                <p className="text-2xl font-bold text-green-600">
                  {userList.filter(user => user.status === 'Active').length}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-600">Inactive Users</h3>
                <p className="text-2xl font-bold text-red-600">
                  {userList.filter(user => user.status === 'Inactive').length}
                </p>
              </div>
            </div>
            
            {/* Role Breakdown */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Role Distribution</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Landowner', 'Field Supervisor', 'Buyer', 'Financial_Manager'].map(role => {
                  const count = userList.filter(user => user.role === role).length;
                  return (
                    <div key={role} className="bg-white p-3 rounded-lg shadow-sm border text-center">
                      <h4 className="text-xs font-medium text-gray-600 mb-1">
                        {role.replace('_', ' ')}
                      </h4>
                      <p className="text-lg font-bold text-gray-800">{count}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <p className="text-center mt-8 text-sm text-gray-400">
            © 2025 Farm Master. All rights reserved.
          </p>
        </>
      )}
      
      {/* Popup Message */}
      <PopupMessage
        isOpen={popup.isOpen}
        onClose={closePopup}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        autoClose={popup.type === 'success'}
        autoCloseDelay={2000}
      />
    </div>
  );
}
