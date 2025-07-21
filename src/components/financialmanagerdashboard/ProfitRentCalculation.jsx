import React, { useState } from "react";

export default function ProfitRentCalculation() {
  const [selectedContract, setSelectedContract] = useState("");
  const [manualRent, setManualRent] = useState("");
  const [manualProfitShare, setManualProfitShare] = useState("");

  // Dummy static financial data
  const financialData = {
    harvestValue: 22500,
    operationalCosts: 4500,
    rent: 3000,
    profitShare: 5000,
  };

  return (
    <div className="flex-1 bg-white min-h-screen p-4 md:p-10 font-poppins">
      {/* Heading */}
      <h1 className="text-3xl md:text-4xl font-bold text-black mb-2 mt-4">
        Profit & Rent Calculation
      </h1>
      <p className="text-green-700 text-sm mb-6">
        Select a land or contract to view detailed financial information.
      </p>

      {/* Dropdown */}
      <div className="mb-8">
        <select
          value={selectedContract}
          onChange={(e) => setSelectedContract(e.target.value)}
          className="w-full md:w-1/2 bg-green-50 border border-green-200 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-green-400"
        >
          <option value="">Select Land or Contract</option>
          <option value="land1">Land A - Paddy Field</option>
          <option value="contract1">Contract 101 - Veg Supply</option>
        </select>
      </div>

      {/* Financial Overview */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-black mb-4">
          Financial Overview
        </h2>
        <div className="space-y-3 text-sm">
          {[
            { label: "Harvest Value", value: financialData.harvestValue },
            {
              label: "Operational Costs",
              value: financialData.operationalCosts,
            },
            { label: "Rent", value: financialData.rent },
            { label: "Profit Share", value: financialData.profitShare },
          ].map((item, index) => (
            <div key={index} className="grid grid-cols-2 items-center">
              <span className="text-green-700">{item.label}</span>
              <span className="text-black font-medium text-left w-32 truncate">
                {item.value.toLocaleString()} LKR
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Manual Adjustments */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-black mb-4">
          Manual Adjustments
        </h2>
        <div className="space-y-4 w-full md:w-1/2">
          <div>
            <label className="block text-sm font-medium mb-1">Rent</label>
            <input
              type="number"
              value={manualRent}
              onChange={(e) => setManualRent(e.target.value)}
              className="w-full bg-green-50 border border-green-200 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-400"
              placeholder="Enter manual rent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Profit Share
            </label>
            <input
              type="number"
              value={manualProfitShare}
              onChange={(e) => setManualProfitShare(e.target.value)}
              className="w-full bg-green-50 border border-green-200 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-400"
              placeholder="Enter manual profit share"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button className="bg-green-600 text-white px-6 py-2 rounded-md text-sm font-semibold hover:bg-green-700">
          Generate Summary
        </button>
        <button className="bg-gray-100 text-black px-6 py-2 rounded-md text-sm font-semibold hover:bg-gray-200">
          Export as PDF
        </button>
      </div>
    </div>
  );
}
