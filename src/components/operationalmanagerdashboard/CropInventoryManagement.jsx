import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import AddNewCropForm from "./AddNewCropForm"; // 👉 You need to create this form similar to AddNewUserForm

const initialCrops = [
  {
    crop: "Carrot",
    location: "Kandy",
    supervisor: "Mr. Perera",
    expectedYield: "5000 kg",
    status: "Active",
  },
  {
    crop: "Cabbage",
    location: "Nuwara Eliya",
    supervisor: "Ms. Silva",
    expectedYield: "3000 kg",
    status: "Active",
  },
  {
    crop: "Leeks",
    location: "Kurunegala",
    supervisor: "Mr. Fernando",
    expectedYield: "2000 nuts",
    status: "Upcoming",
  },
  {
    crop: "Tomato",
    location: "Matara",
    supervisor: "Ms. De Silva",
    expectedYield: "1500 kg",
    status: "Completed",
  },
  {
    crop: "Carrot",
    location: "Matale",
    supervisor: "Mr. Perera",
    expectedYield: "1000 kg",
    status: "Active",
  },
];

export default function CropInventoryManagement() {
  const [cropList, setCropList] = useState(initialCrops);
  const [showForm, setShowForm] = useState(false);

  const locations = [...new Set(initialCrops.map((crop) => crop.location))];
  const supervisors = [...new Set(initialCrops.map((crop) => crop.supervisor))];

  const handleAddCrop = (newCrop) => {
    setCropList((prev) => [...prev, newCrop]);
    setShowForm(false);
  };

  return (
    <div className="flex-1 bg-white min-h-screen p-4 md:p-10 font-poppins">
      {showForm ? (
        <AddNewCropForm
          onCancel={() => setShowForm(false)}
          onSubmit={handleAddCrop}
        />
      ) : (
        <>
          {/* Page Heading */}
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-4 mt-4">
            Crop Inventory Management
          </h1>
          <p className="text-green-600 mb-6 text-sm sm:text-base">
            Manage and monitor all cultivated crops across different locations.
          </p>

          {/* Search Bar */}
          <div className="relative mb-6">
            <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-green-600" />
            <input
              type="text"
              placeholder="Search crops by name or location"
              className="w-full bg-green-50 rounded-md pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-green-400"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <select className="bg-green-50 text-sm rounded-md px-4 py-2 focus:outline-none w-full sm:w-auto">
              <option disabled selected>
                Filter by Location
              </option>
              {locations.map((loc, idx) => (
                <option key={idx} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            <select className="bg-green-50 text-sm rounded-md px-4 py-2 focus:outline-none w-full sm:w-auto">
              <option disabled selected>
                Filter by Supervisor
              </option>
              {supervisors.map((sup, idx) => (
                <option key={idx} value={sup}>
                  {sup}
                </option>
              ))}
            </select>
          </div>

          {/* Crop Table */}
          <div className="overflow-x-auto bg-white border rounded-xl shadow-sm">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-green-50 text-black font-semibold">
                <tr>
                  <th className="px-4 py-3 whitespace-nowrap">Crop Type</th>
                  <th className="px-4 py-3 whitespace-nowrap">Location</th>
                  <th className="px-4 py-3 whitespace-nowrap">Supervisor</th>
                  <th className="px-4 py-3 whitespace-nowrap">Expected Yield</th>
                  <th className="px-4 py-3 whitespace-nowrap">Inventory Status</th>
                  <th className="px-4 py-3 text-green-700 whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cropList.map((crop, idx) => (
                  <tr key={idx} className="border-t hover:bg-green-50">
                    <td className="px-4 py-3">{crop.crop}</td>
                    <td className="px-4 py-3 text-green-600">{crop.location}</td>
                    <td className="px-4 py-3">{crop.supervisor}</td>
                    <td className="px-4 py-3">{crop.expectedYield}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`font-semibold px-3 py-1 rounded-full block text-center w-24 ${
                          crop.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : crop.status === "Upcoming"
                            ? "bg-yellow-100 text-yellow-700"
                            : crop.status === "Completed"
                            ? "bg-gray-200 text-gray-700"
                            : ""
                        }`}
                      >
                        {crop.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-black font-semibold cursor-pointer hover:underline hover:text-green-600">
                      View Details
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Crop Button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-600 text-white text-sm font-semibold px-5 py-2 rounded-md hover:bg-green-700"
            >
              Add New Crop
            </button>
          </div>
        </>
      )}
    </div>
  );
}
