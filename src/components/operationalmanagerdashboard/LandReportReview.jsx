import React, { useState } from "react";
import { Leaf, CheckCircle, Circle, ArrowLeft } from "lucide-react";

export default function LandReportReview({ onBack }) {
  const [decision, setDecision] = useState("Approve");
  const [feedback, setFeedback] = useState("");

  return (
    <div className="flex bg-white min-h-screen">
      <div className="flex-1 p-4 md:p-10 font-poppins">
        <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-xl p-6 md:p-10 shadow-sm">

         
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Land Report Review & Approve
          </h1>

         
          <div className="flex flex-col text-sm mt-6 mb-8 divide-y divide-green-200 border border-green-300 rounded-md">
            {[
              ["Land Report ID", "#2025-LR-002"],
              ["Landowner Name", "Mr. Ruwan Perera"],
              ["Location", "Badulla"],
              ["Requested Date", "2025-10-19"],
              ["Supervisor Name", "Mr. Silva"],
              ["Supervisor ID", "SR0023"],
              ["Submitted Date", "2025-10-30"],
            ].map(([label, value], idx) => (
              <div key={idx} className="flex justify-between px-4 py-3">
                <span className="text-gray-600 font-medium">{label}</span>
                <span className="text-gray-900">{value}</span>
              </div>
            ))}
          </div>

        
          <div className="mb-8">
            <h2 className="text-base font-semibold text-gray-800 mb-3">
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
                  <tr key={index} className="border-b border-gray-300">
                    <td className="py-2 text-green-600">{label}</td>
                    <td className="py-2 text-right text-gray-800">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        
          <div className="mb-8">
            <h2 className="text-base font-semibold text-gray-800 mb-3">
              Environmental Data
            </h2>
            <table className="w-full text-sm">
              <tbody>
                {[
                  ["Average Rainfall (mm)", "1500"],
                  ["Temperature (°C)", "28"],
                  ["Sunlight Hours (per day)", "7"],
                  ["Water Source", "Well"],
                ].map(([label, value], index) => (
                  <tr key={index} className="border-b border-gray-300">
                    <td className="py-2 text-green-600">{label}</td>
                    <td className="py-2 text-right text-gray-800">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mb-8">
            <h2 className="text-base font-semibold text-gray-800 mb-2">
              Crop Recommendations
            </h2>
            <p className="text-sm text-gray-700 mb-4">
              Based on the land assessment, we recommend the following crops for
              optimal yield and profitability:
            </p>

            <div className="space-y-3">
              {[
                "Organic Rice",
                "Vegetables (Beans, Tomatoes)",
                "Fruits (Bananas, Papayas)",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="bg-green-100 rounded-sm p-1">
                    <Leaf className="text-green-700" size={16} />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

         
          <div className="mb-10">
            <h2 className="text-base font-semibold text-gray-800 mb-4">
              Review Decision
            </h2>

            <div className="space-y-3">
              {["Approve", "Request Revisions"].map((opt) => (
                <div
                  key={opt}
                  onClick={() => setDecision(opt)}
                  className={`flex items-center border px-4 py-2 rounded-md cursor-pointer ${
                    decision === opt
                      ? "border-green-600 bg-green-50"
                      : "border-gray-300"
                  }`}
                >
                  <span className="mr-3 text-green-600">
                    {decision === opt ? <CheckCircle size={18} /> : <Circle size={18} />}
                  </span>
                  <span className="text-sm">{opt}</span>
                </div>
              ))}
            </div>

            <textarea
              rows="4"
              placeholder="Enter feedback or revision requests"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="mt-4 w-full border border-green-300 rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

         
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <button
              onClick={onBack}
              className="flex items-center text-sm text-green-600 hover:text-green-700 font-medium transition"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back
            </button>

            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md text-sm font-semibold transition">
              Submit Decision
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
