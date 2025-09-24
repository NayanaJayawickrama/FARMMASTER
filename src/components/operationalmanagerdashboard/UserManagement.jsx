import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiSearch, FiEdit2 } from "react-icons/fi";
import PopupMessage from "../alerts/PopupMessage";
import ConfirmationModal from "../ConfirmationModal";

const rootUrl = import.meta.env.VITE_API_URL;

export default function UserManagementPage() {
  // Helper function to map backend role names to frontend display names
  const getRoleDisplayName = (role) => {
    const roleMapping = {
      'Supervisor': 'Field Supervisor',
      'Financial_Manager': 'Financial Manager',
      'Operational_Manager': 'Operational Manager'
    };
    return roleMapping[role] || role.replace('_', ' ');
  };

  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // Confirmation modal state
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationData, setConfirmationData] = useState({
    userId: null,
    currentStatus: "",
    userName: "",
    newStatus: ""
  });

  // Edit user modal state
  const [showEditUserForm, setShowEditUserForm] = useState(false);
  const [editUserData, setEditUserData] = useState({
    user_id: null,
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    user_role: ""
  });

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

  // Handle adding new users (Field Supervisor and Financial Manager only)
  const handleAddUser = async (userData) => {
    try {
      const res = await axios.post(`${rootUrl}/api/users`, userData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      if (res.data.status === 'success') {
        showPopup('success', 'Success', 'User added successfully');
        fetchUsers();
      } else {
        showPopup('error', 'Add Failed', res.data.message || 'Failed to add user');
      }
    } catch (err) {
      console.error("Add user error:", err);
      let errorMessage = "Server error. Please try again.";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      showPopup('error', 'Error', errorMessage);
    }
  };

  const handleToggleStatus = (userId, currentStatus, userName) => {
    const newStatus = currentStatus === "Active" ? "inactive" : "active";
    
    // Set confirmation data and show modal
    setConfirmationData({
      userId,
      currentStatus,
      userName,
      newStatus
    });
    setShowConfirmationModal(true);
  };

  const confirmStatusToggle = async () => {
    const { userId, newStatus } = confirmationData;
    
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
    } finally {
      // Close confirmation modal
      setShowConfirmationModal(false);
      setConfirmationData({
        userId: null,
        currentStatus: "",
        userName: "",
        newStatus: ""
      });
    }
  };

  const handleEditUser = (user) => {
    setEditUserData({
      user_id: user.user_id,
      first_name: user.name.split(' ')[0] || '',
      last_name: user.name.split(' ').slice(1).join(' ') || '',
      email: user.email,
      phone: user.phone || '',
      user_role: user.role
    });
    setShowEditUserForm(true);
  };

  const handleUpdateUser = async (userData) => {
    try {
      const res = await axios.put(`${rootUrl}/api/users/${userData.user_id}`, userData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      if (res.data.status === 'success') {
        showPopup('success', 'Success', 'User updated successfully');
        fetchUsers();
      } else {
        showPopup('error', 'Update Failed', res.data.message || 'Failed to update user');
      }
    } catch (err) {
      console.error("Update user error:", err);
      let errorMessage = "Server error. Please try again.";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
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

  return (
    <div className="flex-1 bg-white min-h-screen p-4 md:p-10 font-poppins">
      <h1 className="text-3xl md:text-4xl font-bold text-black mb-4 mt-4">
        User Management
      </h1>

          {/* Search Bar, Role Filter, and Add New User Button - All in one row */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-green-600" />
              <input
                type="text"
                placeholder="Search users"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-green-50 rounded-md pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-green-400"
              />
            </div>

            {/* Role Filter Dropdown */}
            <div className="flex-shrink-0">
              <select
                className="bg-green-50 text-sm rounded-md px-4 py-3 focus:outline-none min-w-[180px]"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="Landowner">Landowner</option>
                <option value="Supervisor">Field Supervisor</option>
                <option value="Buyer">Buyer</option>
                <option value="Operational_Manager">Operational Manager</option>
                <option value="Financial_Manager">Financial Manager</option>
              </select>
            </div>

            {/* Add New User Button */}
            <div className="flex-shrink-0">
              <button
                onClick={() => setShowAddUserForm(true)}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 shadow-md hover:shadow-lg whitespace-nowrap"
              >
                + Add New User
              </button>
            </div>
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
                    <tr key={user.user_id} className="border-b border-black hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 hover:shadow-sm transition-all duration-300 group">
                      <td className="px-6 py-5 text-center font-medium text-gray-900">{user.name}</td>
                      <td className="px-6 py-5 text-center font-medium text-gray-900">{user.email}</td>
                      <td className="px-6 py-5 text-center">
                        <span className="bg-green-100 text-black-800 font-semibold px-4 py-2 rounded-full inline-block">
                          {getRoleDisplayName(user.role || "")}
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
                        <div className="flex items-center justify-center gap-6">
                          {/* Interactive Edit Button */}
                          <button
                            onClick={() => handleEditUser(user)}
                            className="group relative bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                            title="Edit User Information"
                          >
                            <div className="flex items-center space-x-2">
                              <FiEdit2 className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                              <span className="group-hover:tracking-wider transition-all duration-300">
                                Edit
                              </span>
                            </div>
                            
                            {/* Animated background effect */}
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
                            
                            {/* Ripple effect on click */}
                            <div className="absolute inset-0 rounded-lg overflow-hidden">
                              <div className="absolute inset-0 bg-white opacity-0 group-active:opacity-20 group-active:animate-ping"></div>
                            </div>
                          </button>

                          {/* Interactive Toggle switch for status */}
                          <label className="inline-flex items-center cursor-pointer group/toggle hover:scale-105 transition-transform duration-200">
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={user.status === "Active"}
                              onChange={() =>
                                handleToggleStatus(user.user_id, user.status, user.name)
                              }
                            />
                            <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 shadow-lg group-hover/toggle:shadow-xl ${
                              user.status === "Active" 
                                ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700" 
                                : "bg-gradient-to-r from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-500"
                            }`}>
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-all duration-300 group-hover/toggle:scale-110 ${
                                user.status === "Active" ? "translate-x-6" : "translate-x-1"
                              }`} />
                            </div>
                            <span className={`ml-3 text-sm font-medium transition-all duration-300 group-hover/toggle:font-semibold ${
                              user.status === "Active" ? "text-green-700" : "text-gray-600"
                            }`}>
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
                {['Landowner', 'Supervisor', 'Buyer', 'Financial_Manager'].map(role => {
                  const count = userList.filter(user => user.role === role).length;
                  const displayName = getRoleDisplayName(role);
                  return (
                    <div key={role} className="bg-white p-3 rounded-lg shadow-sm border text-center">
                      <h4 className="text-xs font-medium text-gray-600 mb-1">
                        {displayName}
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

      {/* Add New User Form Modal */}
      {showAddUserForm && (
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
                Add New User
              </h2>
              <p style={{ 
                color: '#6b7280', 
                textAlign: 'center',
                fontSize: '14px'
              }}>
                Add Field Supervisor or Financial Manager to the system
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
                First Name *
              </label>
              <input
                id="user-firstname-input"
                type="text"
                placeholder="Enter first name"
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
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Last Name *
              </label>
              <input
                id="user-lastname-input"
                type="text"
                placeholder="Enter last name"
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
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Email *
              </label>
              <input
                id="user-email-input"
                type="email"
                placeholder="Enter email address"
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
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Phone
              </label>
              <input
                id="user-phone-input"
                type="text"
                placeholder="Enter phone number"
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
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Password *
              </label>
              <input
                id="user-password-input"
                type="password"
                placeholder="Enter password (min 6 characters)"
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
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Role *
              </label>
              <select
                id="user-role-select"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '16px',
                  border: '2px solid #d1d5db',
                  borderRadius: '8px',
                  boxSizing: 'border-box',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: 'white'
                }}
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              >
                <option value="">Select Role</option>
                <option value="Supervisor">Field Supervisor</option>
                <option value="Financial_Manager">Financial Manager</option>
              </select>
              <p style={{ 
                fontSize: '12px', 
                color: '#6b7280', 
                marginTop: '4px' 
              }}>
                Only Field Supervisors and Financial Managers can be added
              </p>
            </div>

            {/* Action Buttons */}
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              justifyContent: 'flex-end' 
            }}>
              <button
                onClick={() => setShowAddUserForm(false)}
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
                  const firstName = document.getElementById('user-firstname-input').value.trim();
                  const lastName = document.getElementById('user-lastname-input').value.trim();
                  const email = document.getElementById('user-email-input').value.trim();
                  const phone = document.getElementById('user-phone-input').value.trim();
                  const password = document.getElementById('user-password-input').value.trim();
                  const role = document.getElementById('user-role-select').value.trim();
                  
                  // Validation
                  if (!firstName) {
                    alert('Please enter a first name');
                    document.getElementById('user-firstname-input').focus();
                    return;
                  }
                  
                  if (!lastName) {
                    alert('Please enter a last name');
                    document.getElementById('user-lastname-input').focus();
                    return;
                  }
                  
                  if (!email) {
                    alert('Please enter an email address');
                    document.getElementById('user-email-input').focus();
                    return;
                  }
                  
                  if (!password) {
                    alert('Please enter a password');
                    document.getElementById('user-password-input').focus();
                    return;
                  }
                  
                  if (password.length < 6) {
                    alert('Password must be at least 6 characters long');
                    document.getElementById('user-password-input').focus();
                    return;
                  }
                  
                  if (!role) {
                    alert('Please select a role');
                    document.getElementById('user-role-select').focus();
                    return;
                  }
                  
                  // Submit the form
                  handleAddUser({
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    phone: phone,
                    password: password,
                    user_role: role
                  });
                  
                  // Close modal and clear form
                  setShowAddUserForm(false);
                  document.getElementById('user-firstname-input').value = '';
                  document.getElementById('user-lastname-input').value = '';
                  document.getElementById('user-email-input').value = '';
                  document.getElementById('user-phone-input').value = '';
                  document.getElementById('user-password-input').value = '';
                  document.getElementById('user-role-select').value = '';
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
                Add User to System
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Form Modal */}
      {showEditUserForm && (
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
                Edit User
              </h2>
              <p style={{ 
                color: '#6b7280', 
                textAlign: 'center',
                fontSize: '14px'
              }}>
                Update user information
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
                First Name *
              </label>
              <input
                id="edit-user-firstname-input"
                type="text"
                placeholder="Enter first name"
                defaultValue={editUserData.first_name}
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
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Last Name *
              </label>
              <input
                id="edit-user-lastname-input"
                type="text"
                placeholder="Enter last name"
                defaultValue={editUserData.last_name}
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
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Email *
              </label>
              <input
                id="edit-user-email-input"
                type="email"
                placeholder="Enter email address"
                defaultValue={editUserData.email}
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
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Phone
              </label>
              <input
                id="edit-user-phone-input"
                type="text"
                placeholder="Enter phone number"
                defaultValue={editUserData.phone}
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
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Role
              </label>
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
                {getRoleDisplayName(editUserData.user_role)}
              </div>
              <p style={{ 
                fontSize: '12px', 
                color: '#6b7280', 
                marginTop: '4px' 
              }}>
                User role cannot be changed through editing
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
                  setShowEditUserForm(false);
                  setEditUserData({
                    user_id: null,
                    first_name: "",
                    last_name: "",
                    email: "",
                    phone: "",
                    user_role: ""
                  });
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
                  const firstName = document.getElementById('edit-user-firstname-input').value.trim();
                  const lastName = document.getElementById('edit-user-lastname-input').value.trim();
                  const email = document.getElementById('edit-user-email-input').value.trim();
                  const phone = document.getElementById('edit-user-phone-input').value.trim();
                  
                  // Validation
                  if (!firstName) {
                    alert('Please enter a first name');
                    document.getElementById('edit-user-firstname-input').focus();
                    return;
                  }
                  
                  if (!lastName) {
                    alert('Please enter a last name');
                    document.getElementById('edit-user-lastname-input').focus();
                    return;
                  }
                  
                  if (!email) {
                    alert('Please enter an email address');
                    document.getElementById('edit-user-email-input').focus();
                    return;
                  }
                  
                  // Submit the form with existing role (role cannot be changed)
                  handleUpdateUser({
                    user_id: editUserData.user_id,
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    phone: phone,
                    user_role: editUserData.user_role // Keep existing role
                  });
                  
                  // Close modal and clear form
                  setShowEditUserForm(false);
                  setEditUserData({
                    user_id: null,
                    first_name: "",
                    last_name: "",
                    email: "",
                    phone: "",
                    user_role: ""
                  });
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
                Update User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Change Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => {
          setShowConfirmationModal(false);
          setConfirmationData({
            userId: null,
            currentStatus: "",
            userName: "",
            newStatus: ""
          });
        }}
        onConfirm={confirmStatusToggle}
        title="Confirm Status Change"
        message={`Are you sure you want to ${confirmationData.currentStatus === "Active" ? "deactivate" : "activate"} the user "${confirmationData.userName}"? This will ${confirmationData.currentStatus === "Active" ? "restrict their access to the system" : "allow them to access the system again"}.`}
        confirmText={`Yes, ${confirmationData.currentStatus === "Active" ? "Deactivate" : "Activate"}`}
        cancelText="Cancel"
        type="warning"
      />
    </div>
  );
}
