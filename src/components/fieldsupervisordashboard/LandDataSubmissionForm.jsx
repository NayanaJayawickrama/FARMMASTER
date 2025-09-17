import React, { useState } from "react";

export default function LandDataSubmissionForm() {
  const [formData, setFormData] = useState({
    phValue: "",
    organicMatter: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
    
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white min-h-screen p-4 md:p-10 font-poppins"
    >
      {/* Heading */}
      <h2 className="text-3xl md:text-4xl font-bold text-black mb-10">
        Land Data Submission
      </h2>

      {/* Form Fields */}
      <div className="max-w-xl space-y-6">
        {/* pH Value */}
        <div>
          <label className="block font-semibold text-black mb-1">pH Value</label>
          <input
            type="text"
            name="phValue"
            value={formData.phValue}
            onChange={handleChange}
            placeholder="Enter pH value"
            className="w-full bg-green-50 text-green-700 p-3 rounded-md border border-green-500 placeholder-[#5E964F] focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Organic Matter */}
        <div>
          <label className="block font-semibold text-black mb-1">
            Organic Matter (%)
          </label>
          <input
            type="text"
            name="organicMatter"
            value={formData.organicMatter}
            onChange={handleChange}
            placeholder="Enter organic matter percentage"
            className="w-full bg-green-50 text-green-700 p-3 rounded-md border border-green-500 placeholder-[#5E964F] focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Nitrogen */}
        <div>
          <label className="block font-semibold text-black mb-1">
            Nitrogen (N)
          </label>
          <input
            type="text"
            name="nitrogen"
            value={formData.nitrogen}
            onChange={handleChange}
            placeholder="Enter nitrogen level"
            className="w-full bg-green-50 text-green-700 p-3 rounded-md border border-green-500 placeholder-[#5E964F] focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Phosphorus */}
        <div>
          <label className="block font-semibold text-black mb-1">
            Phosphorus (P)
          </label>
          <input
            type="text"
            name="phosphorus"
            value={formData.phosphorus}
            onChange={handleChange}
            placeholder="Enter phosphorus level"
            className="w-full bg-green-50 text-green-700 p-3 rounded-md border border-green-500 placeholder-[#5E964F] focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Potassium */}
        <div>
          <label className="block font-semibold text-black mb-1">
            Potassium (K)
          </label>
          <input
            type="text"
            name="potassium"
            value={formData.potassium}
            onChange={handleChange}
            placeholder="Enter potassium level"
            className="w-full bg-green-50 text-green-700 p-3 rounded-md border border-green-500 placeholder-[#5E964F] focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Environmental Notes */}
        <div>
          <label className="block font-semibold text-black mb-1">
            Environmental Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Enter notes"
            rows={5}
            className="w-full bg-green-50 text-green-700 p-3 rounded-md border border-green-500 placeholder-[#5E964F] focus:outline-none focus:ring-2 focus:ring-green-400"
          ></textarea>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-10 flex justify-end">
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
        >
          Submit Report
        </button>
      </div>
    </form>
  );
}
