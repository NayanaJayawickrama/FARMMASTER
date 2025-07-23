import React, { useState } from "react";
import axios from "axios";

export default function LandDataSubmissionForm() {
  const [formData, setFormData] = useState({
    phValue: "",
    organicMatter: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    notes: "",
  });

  const [recommendedCrops, setRecommendedCrops] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost/FARMMASTER-Backend/submit_land_data.php",
        formData
      );

      if (res.data.status === "success") {
        setRecommendedCrops(res.data.recommendedCrops);
        setResponseMessage("Crop suggestions based on soil data:");
      } else {
        setResponseMessage("Submission failed. Please try again.");
        setRecommendedCrops([]);
      }
    } catch (err) {
      console.error(err);
      setResponseMessage("Server error. Please check your backend.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white min-h-screen p-4 md:p-10 font-poppins"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-black mb-10">
        Land Data Submission
      </h2>

      <div className="max-w-xl space-y-6">
        {[
          { label: "pH Value", name: "phValue", placeholder: "Enter pH value" },
          {
            label: "Organic Matter (%)",
            name: "organicMatter",
            placeholder: "Enter organic matter",
          },
          {
            label: "Nitrogen (N)",
            name: "nitrogen",
            placeholder: "Enter nitrogen level",
          },
          {
            label: "Phosphorus (P)",
            name: "phosphorus",
            placeholder: "Enter phosphorus level",
          },
          {
            label: "Potassium (K)",
            name: "potassium",
            placeholder: "Enter potassium level",
          },
        ].map((field) => (
          <div key={field.name}>
            <label className="block font-semibold text-black mb-1">
              {field.label}
            </label>
            <input
              type="text"
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="w-full bg-green-50 text-green-700 p-3 rounded-md border border-green-500 placeholder-[#5E964F] focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        ))}

        {/* Notes */}
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

      <div className="mt-10 flex justify-end">
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
        >
          Submit Report
        </button>
      </div>

      {/* Suggestions */}
      {responseMessage && (
        <div className="mt-8 text-green-800">
          <h3 className="font-bold">{responseMessage}</h3>
          {recommendedCrops.length > 0 ? (
            <ul className="list-disc ml-6 mt-2">
              {recommendedCrops.map((crop, index) => (
                <li key={index}>{crop}</li>
              ))}
            </ul>
          ) : (
            <p className="text-red-600 mt-2">No suitable crops found.</p>
          )}
        </div>
      )}
    </form>
  );
}
