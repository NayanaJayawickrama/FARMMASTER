import React from "react";
import { NavLink } from "react-router-dom";

export default function LandAssessmentRequestBody() {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar is assumed to be already rendered outside this component */}

      {/* Main Content */}
      <div className="flex-1 flex justify-center items-center p-4">
        <div className="w-full max-w-lg bg-white rounded-lg p-8 shadow-md">
          {/* Heading */}
          <h1 className="text-3xl font-bold mb-6 text-center">
            Land Assessment Request
          </h1>

          {/* Form */}
          <form className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Land Name</label>
              <input
                type="text"
                placeholder="Enter land name"
                className="w-full px-4 py-2 border border-gray-300 rounded bg-green-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">
                Land Size (Acres)
              </label>
              <input
                type="text"
                placeholder="Enter land size"
                className="w-full px-4 py-2 border border-gray-300 rounded bg-green-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Land Location</label>
              <input
                type="text"
                placeholder="Enter land location"
                className="w-full px-4 py-2 border border-gray-300 rounded bg-green-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Contact Number</label>
              <input
                type="text"
                placeholder="Enter contact number"
                className="w-full px-4 py-2 border border-gray-300 rounded bg-green-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {/* Button */}
            <NavLink to="/landassessmentpayment">
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded mt-4 transition"
              >
                Continue to Payment
              </button>
            </NavLink>
          </form>
        </div>
      </div>
    </div>
  );
}
