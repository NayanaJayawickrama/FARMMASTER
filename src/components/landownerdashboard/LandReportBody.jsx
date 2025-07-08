import React from "react";
import { Leaf } from "lucide-react";

export default function LandReportBody() {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar is already rendered outside this component */}

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10">
        <div className="max-w-4xl mx-auto bg-white border-1 border-green-600 p-6 md:p-10 rounded-md shadow-sm">
          {/* Header */}
          <h1 className="text-3xl md:text-3xl font-bold text-gray-800 mb-2">
            Land Report for Mrs. Perera's Property
          </h1>
          <p className="text-sm text-green-600 mb-8">Generated on 2025-07-26</p>

          {/* Section: Land Assessment Summary */}
          <div className="mb-8">
            <h2 className="text-base font-semibold text-gray-800 mb-4">
              Land Assessment Summary
            </h2>
            <table className="w-full text-sm">
              <tbody>
                {[
                  ["Soil pH Value", "6.5"],
                  ["Organic Matter (%)", "4.2%"],
                  ["Nitrogen (N) Level", "Medium"],
                  ["Phosphorus (P) Level", "High"],
                  ["Potassium (K) Level", "Medium"],
                ].map(([label, value], index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-2 pl-2 text-green-600">{label}</td>
                    <td className="py-2 pr-2 text-right text-gray-800">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section: Environmental Data */}
          <div className="mb-8">
            <h2 className="text-base font-semibold text-gray-800 mb-4">
              Environmental Data
            </h2>
            <table className="w-full text-sm table-fixed">
              <tbody>
                {[
                  ["Average Rainfall (mm)", "1500"],
                  ["Temperature (°C)", "28"],
                  ["Sunlight Hours (per day)", "7"],
                  ["Water Source", "Well"],
                ].map(([label, value], index) => (
                  <tr key={index} className="border-b border-gray-300">
                    <td className="py-3 pl-4 text-green-600 w-2/3">{label}</td>
                    <td className="py-3 pr-4 text-right text-gray-800 w-1/3">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section: Crop Recommendations */}
          <div className="mb-6">
            <h2 className="text-base font-semibold text-gray-800 mb-2">
              Crop Recommendations
            </h2>
            <p className="text-sm text-gray-700 mb-4">
              Based on the land assessment, we recommend the following crops for
              optimal yield and profitability:
            </p>

            <div>
              {[
                "Organic Rice",
                "Vegetables (Beans, Tomatoes)",
                "Fruits (Bananas, Papayas)",
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm mt-4"
                >
                  <div className="bg-green-50 rounded-sm p-1">
                    <Leaf className="text-green-700" size={18} />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Download Button */}
          <div className="flex justify-end">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 text-sm font-semibold rounded-md transition">
              Download Land Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
