import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import AddNewUserForm from "./AddNewUserForm"; // adjust path if needed

const initialUsers = [
  {
    name: "Anika Silva",
    email: "anika.silva@email.com",
    role: "Landowner",
    status: "Active",
  },
  {
    name: "Rohan Perera",
    email: "rohan.perera@email.com",
    role: "Supervisor",
    status: "Active",
  },
  {
    name: "Lakshmi Fernando",
    email: "lakshmi.fernando@email.com",
    role: "Buyer",
    status: "Active",
  },
  {
    name: "Chamara De Silva",
    email: "chamara.desilva@email.com",
    role: "Landowner",
    status: "Inactive",
  },
  {
    name: "Priya Rajapaksa",
    email: "priya.rajapaksa@email.com",
    role: "Supervisor",
    status: "Active",
  },
  {
    name: "Arjun Kumar",
    email: "arjun.kumar@email.com",
    role: "Buyer",
    status: "Active",
  },
  {
    name: "Samanthi Wijesinghe",
    email: "samanthi.wijesinghe@email.com",
    role: "Landowner",
    status: "Active",
  },
  {
    name: "Nimal Jayawardena",
    email: "nimal.jayawardena@email.com",
    role: "Supervisor",
    status: "Inactive",
  },
  {
    name: "Deepa Chandrasekaran",
    email: "deepa.chandrasekaran@email.com",
    role: "Buyer",
    status: "Active",
  },
  {
    name: "Kamal Ratnayake",
    email: "kamal.ratnayake@email.com",
    role: "Landowner",
    status: "Active",
  },
];

export default function UserManagementPage() {
  const [showForm, setShowForm] = useState(false);
  const [userList, setUserList] = useState(initialUsers);

  const handleAddUser = (user) => {
    setUserList((prevList) => [...prevList, user]);
    setShowForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 font-poppins">
      {showForm ? (
        <AddNewUserForm
          onCancel={() => setShowForm(false)}
          onSubmit={handleAddUser}
        />
      ) : (
        <>
          <h1 className="text-2xl md:text-3xl font-bold text-black mb-4">
            User Management
          </h1>
          {/* Search Bar */}
          <div className="relative mb-6">
            <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-green-600" />
            <input
              type="text"
              placeholder="Search users"
              className="w-full bg-green-50 rounded-md pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-green-400"
            />
          </div>

          {/* Filters & Add Button */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-3">
              <select className="bg-green-50 text-sm rounded-md px-3 py-2 focus:outline-none">
                <option>Landowner</option>
              </select>
              <select className="bg-green-50 text-sm rounded-md px-3 py-2 focus:outline-none">
                <option>Supervisor</option>
              </select>
              <select className="bg-green-50 text-sm rounded-md px-3 py-2 focus:outline-none">
                <option>Buyer</option>
              </select>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-green-700"
            >
              Add New User
            </button>
          </div>

          {/* User Table */}
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
                {userList.map((user, idx) => (
                  <tr key={idx} className="border-t hover:bg-green-50">
                    <td className="px-6 py-4">{user.name}</td>
                    <td className="px-6 py-4 text-green-600">{user.email}</td>
                    <td className="px-6 py-4 w-32">
                      <span className="bg-green-50 text-black font-semibold px-4 py-1 rounded-md block text-center">
                        {user.role}
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
                    <td className="px-6 py-4 text-black font-semibold text-sm">
                      <button className="hover:underline hover:text-green-600 cursor-pointer">
                        View
                      </button>
                      <span className="mx-1">|</span>
                      <button className="hover:underline hover:text-green-600 cursor-pointer">
                        Edit
                      </button>
                      <span className="mx-1">|</span>
                      <button className="hover:underline hover:text-green-600 cursor-pointer">
                        Delete
                      </button>
                      <span className="mx-1">|</span>
                      <button className="hover:underline hover:text-green-600 cursor-pointer">
                        Change Role
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
