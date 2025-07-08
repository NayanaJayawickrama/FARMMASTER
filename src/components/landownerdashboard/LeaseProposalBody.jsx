import React from "react";

export default function LeaseProposalBody() {
  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 p-4 md:p-10">
        <div className="max-w-4xl mx-auto bg-white border border-green-600 p-6 md:p-10 rounded-md shadow-sm">
          {/* Header */}
          <h1 className="text-3xl md:text-3xl font-bold text-gray-800 mb-2">
            Lease Proposal Details
          </h1>
          <p className="text-sm text-green-600 mb-8">
            Review the terms and conditions of the lease proposal for your land.
          </p>

          {/* Proposal Summary */}
          <div className="mb-8">
            <h2 className="text-base font-semibold text-gray-800 mb-4">
              Proposal Summary
            </h2>
            <table className="w-full text-sm table-auto">
              <tbody>
                {[
                  ["Land Size", "5 acres"],
                  ["Recommended Crops", "Organic Vegetables (Tomato, Carrot)"],
                  ["Estimated Yield", "10,000 kg"],
                  ["Lease Duration", "3 years"],
                  ["Rental Value", "Rs. 50,000 per acre per year"],
                  ["Profit Sharing", "60% (FarmMaster) / 40% (Landowner)"],
                  [
                    "Estimated Profit (Landowner)",
                    "Rs. 80,000 per acre per year",
                  ],
                ].map(([label, value], index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-3 pl-2 text-green-600 w-1/2">{label}</td>
                    <td className="py-3 pr-2 text-right text-gray-800 w-1/2">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Terms and Conditions */}
          <div className="mb-10">
            <h2 className="text-base font-semibold text-gray-800 mb-4">
              Terms and Conditions
            </h2>
            <ul className="text-sm text-gray-700 list-decimal pl-5 space-y-2">
              <li>
                <strong>Rent:</strong> FarmMaster agrees to pay the landowner a
                rental value of Rs. 50,000 per acre per year, payable quarterly.
              </li>
              <li>
                <strong>Profit Sharing:</strong> Profits from the sale of crops
                will be shared between FarmMaster and the landowner on a 60/40
                basis, respectively.
              </li>
              <li>
                <strong>Crop Failure:</strong> In the event of crop failure due
                to unforeseen circumstances (e.g., natural disasters),
                FarmMaster will bear the initial losses. Further actions will be
                determined through mutual agreement.
              </li>
              <li>
                <strong>Land Maintenance:</strong> FarmMaster is responsible for
                all farming operations and land maintenance during the lease
                period.
              </li>
              <li>
                <strong>Termination:</strong> Either party may terminate the
                agreement with a six-month written notice.
              </li>
              <li>
                <strong>Dispute Resolution:</strong> Any disputes will be
                resolved through mediation.
              </li>
            </ul>
            <p className="text-sm font-semibold text-gray-700 mt-3">
              By accepting this proposal, you agree to abide by these terms and conditions.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-end">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 text-sm font-semibold rounded-md transition">
              Accept Proposal
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 text-sm font-semibold rounded-md transition">
              Reject Proposal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
