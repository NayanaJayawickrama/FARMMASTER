import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function LandReportReview({ onBack, report, onSendToLandOwner }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSendToLandOwner = async () => {
    if (!report || !report.report_id) {
      alert('No report selected');
      return;
    }

    setIsLoading(true);
    try {
      if (onSendToLandOwner) {
        await onSendToLandOwner(report.report_id);
      }
    } catch (error) {
      console.error('Error sending report to land owner:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Use the provided report data or show no data message
  const reportData = report;

  // If no report data is provided, show an error message
  if (!reportData) {
    return (
      <div className="flex bg-white min-h-screen">
        <div className="flex-1 p-4 md:p-10 font-poppins">
          <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-xl p-6 md:p-10 shadow-sm">
            <button
              onClick={onBack}
              className="flex items-center text-sm text-green-600 hover:text-green-700 font-medium transition mb-6"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back
            </button>
            
            <div className="text-center py-10">
              <div className="text-red-500 text-6xl mb-4">Warning</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">No Report Data Available</h2>
              <p className="text-gray-600 mb-4">
                Unable to load report information. Please go back and try selecting a report again.
              </p>
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
            Land Report Review & Forward
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
            <div className="text-sm text-gray-700 mb-4">
              {reportData.report_details?.crop_recommendation ? (
                <p>{reportData.report_details.crop_recommendation}</p>
              ) : (
                <div className="text-gray-500 italic">No crop recommendations available</div>
              )}
            </div>
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

          {/* Report Summary Notice */}
          <div className="mb-10 bg-green-50 border border-green-200 rounded-lg p-4">
            <h2 className="text-base font-semibold text-green-800 mb-2">
              Report Summary
            </h2>
            <p className="text-sm text-green-700">
              This land report has been completed by the field supervisor and is ready to be sent to the land owner. 
              Review the details above and click "Send to Land Owner" to forward this report.
            </p>
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
              onClick={handleSendToLandOwner}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded-md text-sm font-semibold transition flex items-center gap-2">
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Send to Land Owner
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
