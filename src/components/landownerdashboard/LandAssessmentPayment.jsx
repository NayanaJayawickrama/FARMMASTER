import React from "react";

export default function LandAssessmentPayment() {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar is assumed to be rendered outside this component */}

      {/* Main Content */}
      <div className="flex-1 flex justify-center items-center p-4">
        <div className="w-full max-w-md bg-white p-8 shadow-md rounded-lg">

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-4">
            Land Assessment Request
          </h1>

          {/* Subtitle */}
          <p className="text-m text-center mb-6">
            Enter your card details to pay
          </p>

          {/* Payment Form */}
          <form className="space-y-4">
            {/* Card Number */}
            <div>
              <label className="block text-sm font-medium mb-1">Card Number</label>
              <input
                type="text"
                placeholder="0000 0000 0000 0000"
                className="w-full px-4 py-2 border border-gray-300 rounded placeholder-gray-500 bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {/* Expiry and CVV */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Card Expiry</label>
                <input
                  type="text"
                  placeholder="MM / YY"
                  className="w-full px-4 py-2 border border-gray-300 rounded placeholder-gray-500 bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full px-4 py-2 border border-gray-300 rounded placeholder-gray-500 bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
            </div>

            {/* Pay Button */}
            <button
              type="button"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded transition"
            >
              Pay 5000 LKR
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full border border-black text-black font-semibold py-2 rounded transition hover:bg-gray-100"
            >
              Submit Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
