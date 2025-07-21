import React from "react";

export default function FinancialReportForm({ onCancel }) {
  return (
    <div className="flex-1 bg-white min-h-screen p-4 md:p-10 font-poppins">
      <h1 className="text-3xl md:text-4xl font-bold text-black mb-2 mt-4">
        Financial Report Editor
      </h1>
      <p className="text-green-700 text-sm mb-6">
        Review and edit the financial terms of the proposal before approval.
      </p>

      <form className="max-w-md space-y-5">
        <div>
          <label className="block mb-1 text-sm font-medium">Date</label>
          <input
            type="date"
            className="w-full bg-green-50 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-green-400"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Category</label>
          <input
            type="text"
            className="w-full bg-green-50 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-green-400"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Description</label>
          <input
            type="text"
            className="w-full bg-green-50 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-green-400"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Amount</label>
          <input
            type="number"
            className="w-full bg-green-50 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-green-400"
          />
        </div>

        <div className="flex gap-4 mt-4">
          <button
            type="submit"
            className="bg-green-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-green-700 cursor-pointer"
          >
            Add to Financial Report
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 text-black font-semibold px-6 py-2 rounded-md hover:bg-gray-300 cursor-pointer"
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
}
