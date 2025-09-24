import React, { useState } from "react";
import { Leaf, CheckCircle, Circle, ArrowLeft } from "lucide-react";

export default function LandReportReview({ onBack, report, onReviewSubmit }) {
  const [decision, setDecision] = useState("approved");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async () => {
    if (!report || !report.report_id) {
      alert('No report selected for review');
      return;
    }

    if (onReviewSubmit) {
      await onReviewSubmit(report.report_id, decision, feedback);
    }
  };

  // Default report data if none provided
  const reportData = report || {
    id: "#2025-LR-002",
    name: "Mr. Ruwan Perera",
    location: "Badulla",
    date: "2025-10-19",
    supervisor: "Mr. Silva",
    supervisorId: "SR0023",
    report_details: {
      land_description: "Sample land description",
      crop_recommendation: "Sample crop recommendations"
    }
  };

  return (
    <div className="flex bg-white min-h-screen">
      <div className="flex-1 p-4 md:p-10 font-poppins">
        <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-xl p-6 md:p-10 shadow-sm">

         
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Land Report Review & Approve
          </h1>

         
          <div className="flex flex-col text-sm mt-6 mb-8 divide-y divide-green-200 border border-green-300 rounded-md">
            {[
              ["Land Report ID", reportData.id],
              ["Landowner Name", reportData.name],
              ["Location", reportData.location],
              ["Requested Date", reportData.date],
              ["Field Supervisor Name", reportData.supervisor],
              ["Field Supervisor ID", reportData.supervisorId],
              ["Current Status", reportData.status || "Pending Review"],
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
                  ["Soil pH Value", reportData.report_details?.ph_value || "N/A"],
                  ["Organic Matter (%)", reportData.report_details?.organic_matter ? `${reportData.report_details.organic_matter}%` : "N/A"],
                  ["Nitrogen (N) Level", reportData.report_details?.nitrogen_level || "N/A"],
                  ["Phosphorus (P) Level", reportData.report_details?.phosphorus_level || "N/A"],
                  ["Potassium (K) Level", reportData.report_details?.potassium_level || "N/A"],
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
              {reportData.report_details?.crop_recommendation || "Based on the land assessment, we recommend the following crops for optimal yield and profitability:"}
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-base font-semibold text-gray-800 mb-2">
              Land Description & Notes
            </h2>
            <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-700">
              <p className="mb-3">
                <strong>Land Description:</strong><br />
                {reportData.report_details?.land_description || "No description available"}
              </p>
              <p>
                <strong>Environmental Notes:</strong><br />
                <pre className="whitespace-pre-wrap text-xs mt-2 max-h-40 overflow-y-auto">
                  {reportData.report_details?.environmental_notes || "No environmental notes available"}
                </pre>
              </p>
            </div>
          </div>

         
          <div className="mb-10">
            <h2 className="text-base font-semibold text-gray-800 mb-4">
              Review Decision
            </h2>

            <div className="space-y-3">
              {[
                { label: "Approve", value: "approved" },
                { label: "Request Revisions", value: "rejected" }
              ].map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => setDecision(opt.value)}
                  className={`flex items-center border px-4 py-2 rounded-md cursor-pointer ${
                    decision === opt.value
                      ? "border-green-600 bg-green-50"
                      : "border-gray-300"
                  }`}
                >
                  <span className="mr-3 text-green-600">
                    {decision === opt.value ? <CheckCircle size={18} /> : <Circle size={18} />}
                  </span>
                  <span className="text-sm">{opt.label}</span>
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

            <button 
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md text-sm font-semibold transition">
              Submit Decision
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
