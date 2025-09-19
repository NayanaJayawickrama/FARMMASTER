import React, { useState } from "react";
import { Leaf, CheckCircle, Circle, ArrowLeft } from "lucide-react";

export default function LandReportReview({ report, onBack }) {
  const [decision, setDecision] = useState("Approve");
  const [feedback, setFeedback] = useState("");

  // Helper function to extract supervisor info from environmental_notes
  const extractSupervisorInfo = (environmentalNotes) => {
    if (!environmentalNotes) return { name: 'Not assigned', id: 'N/A' };
    
    const matches = environmentalNotes.match(/Assigned to: ([^(]+) \(ID: ([^)]+)\)/);
    if (matches) {
      return {
        name: matches[1].trim(),
        id: matches[2].trim()
      };
    }
    return { name: 'Not assigned', id: 'N/A' };
  };

  const supervisorInfo = report ? extractSupervisorInfo(report.environmental_notes) : { name: 'N/A', id: 'N/A' };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!report) {
    return (
      <div className="flex bg-white min-h-screen">
        <div className="flex-1 p-4 md:p-10 font-poppins">
          <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-xl p-6 md:p-10 shadow-sm">
            <div className="text-center py-8">
              <p className="text-gray-500">No report selected for review</p>
              <button 
                onClick={onBack}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Back to Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-white min-h-screen">
      <div className="flex-1 p-4 md:p-10 font-poppins">
        <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-xl p-6 md:p-10 shadow-sm">

         
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Land Report Review & Approve
          </h1>

         
          <div className="flex flex-col text-sm mt-6 mb-8 divide-y divide-green-200 border border-green-300 rounded-md">
            {[
              ["Land Report ID", `#${report.report_id}`],
              ["Landowner Name", `${report.first_name} ${report.last_name}`],
              ["Location", report.location || 'N/A'],
              ["Requested Date", formatDate(report.report_date)],
              ["Supervisor Name", supervisorInfo.name],
              ["Supervisor ID", supervisorInfo.id],
              ["Status", report.status || 'Pending'],
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
                  ["Soil pH Value", report.ph_value || 'Not tested'],
                  ["Organic Matter (%)", report.organic_matter ? `${report.organic_matter}%` : 'Not tested'],
                  ["Nitrogen (N) Level", report.nitrogen_level || 'Not tested'],
                  ["Phosphorus (P) Level", report.phosphorus_level || 'Not tested'],
                  ["Potassium (K) Level", report.potassium_level || 'Not tested'],
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
              Environmental Notes
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {report.environmental_notes || 'No environmental notes available'}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-base font-semibold text-gray-800 mb-2">
              Land Description
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                {report.land_description || 'No land description available'}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-base font-semibold text-gray-800 mb-2">
              Crop Recommendations
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {report.crop_recomendation || 'No crop recommendations available'}
              </p>
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
