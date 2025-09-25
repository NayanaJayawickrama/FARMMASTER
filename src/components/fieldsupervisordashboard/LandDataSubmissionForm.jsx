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

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = "";

    if (value === "") return ""; // Allow empty values

    switch (name) {
      case "phValue":
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
          error = "Please enter a valid pH value";
        } else if (numValue < 4.0 || numValue > 9.5) {
          error = "pH value must be between 4.0 and 9.5";
        }
        break;
      case "organicMatter":
        const organicValue = parseFloat(value);
        if (isNaN(organicValue)) {
          error = "Please enter a valid percentage";
        } else if (organicValue < 0.5 || organicValue > 15.0) {
          error = "Organic matter must be between 0.5% and 15%";
        }
        break;
      case "nitrogen":
      case "phosphorus":
      case "potassium":
        // For dropdown selections, no validation needed as options are predefined
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Validate the field and update errors
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (key !== "notes") { // Skip notes validation
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

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
          <label className="block font-semibold text-black mb-1">
            pH Value <span className="text-sm text-gray-600">(4.0 - 9.5)</span>
          </label>
          <input
            type="number"
            name="phValue"
            value={formData.phValue}
            onChange={handleChange}
            placeholder="e.g., 6.5 (optimal for most crops)"
            min="4.0"
            max="9.5"
            step="0.1"
            className={`w-full bg-green-50 text-green-700 p-3 rounded-md border ${
              errors.phValue ? 'border-red-500' : 'border-green-500'
            } placeholder-[#5E964F] focus:outline-none focus:ring-2 ${
              errors.phValue ? 'focus:ring-red-400' : 'focus:ring-green-400'
            }`}
          />
          {errors.phValue && (
            <p className="text-red-500 text-sm mt-1">{errors.phValue}</p>
          )}
        </div>

        {/* Organic Matter */}
        <div>
          <label className="block font-semibold text-black mb-1">
            Organic Matter (%) <span className="text-sm text-gray-600">(0.5% - 15%)</span>
          </label>
          <input
            type="number"
            name="organicMatter"
            value={formData.organicMatter}
            onChange={handleChange}
            placeholder="e.g., 3.5 (good for organic farming)"
            min="0.5"
            max="15"
            step="0.1"
            className={`w-full bg-green-50 text-green-700 p-3 rounded-md border ${
              errors.organicMatter ? 'border-red-500' : 'border-green-500'
            } placeholder-[#5E964F] focus:outline-none focus:ring-2 ${
              errors.organicMatter ? 'focus:ring-red-400' : 'focus:ring-green-400'
            }`}
          />
          {errors.organicMatter && (
            <p className="text-red-500 text-sm mt-1">{errors.organicMatter}</p>
          )}
        </div>

        {/* Nitrogen */}
        <div>
          <label className="block font-semibold text-black mb-1">
            Nitrogen (N) Level
          </label>
          <select
            name="nitrogen"
            value={formData.nitrogen}
            onChange={handleChange}
            className={`w-full bg-green-50 text-green-700 p-3 rounded-md border ${
              errors.nitrogen ? 'border-red-500' : 'border-green-500'
            } focus:outline-none focus:ring-2 ${
              errors.nitrogen ? 'focus:ring-red-400' : 'focus:ring-green-400'
            }`}
          >
            <option value="">Select nitrogen level</option>
            <option value="low">Low (10-25 ppm)</option>
            <option value="medium">Medium (25-40 ppm)</option>
            <option value="high">High (40+ ppm)</option>
          </select>
          {errors.nitrogen && (
            <p className="text-red-500 text-sm mt-1">{errors.nitrogen}</p>
          )}
        </div>

        {/* Phosphorus */}
        <div>
          <label className="block font-semibold text-black mb-1">
            Phosphorus (P) Level
          </label>
          <select
            name="phosphorus"
            value={formData.phosphorus}
            onChange={handleChange}
            className={`w-full bg-green-50 text-green-700 p-3 rounded-md border ${
              errors.phosphorus ? 'border-red-500' : 'border-green-500'
            } focus:outline-none focus:ring-2 ${
              errors.phosphorus ? 'focus:ring-red-400' : 'focus:ring-green-400'
            }`}
          >
            <option value="">Select phosphorus level</option>
            <option value="low">Low (5-15 ppm)</option>
            <option value="medium">Medium (15-30 ppm)</option>
            <option value="high">High (30+ ppm)</option>
          </select>
          {errors.phosphorus && (
            <p className="text-red-500 text-sm mt-1">{errors.phosphorus}</p>
          )}
        </div>

        {/* Potassium */}
        <div>
          <label className="block font-semibold text-black mb-1">
            Potassium (K) Level
          </label>
          <select
            name="potassium"
            value={formData.potassium}
            onChange={handleChange}
            className={`w-full bg-green-50 text-green-700 p-3 rounded-md border ${
              errors.potassium ? 'border-red-500' : 'border-green-500'
            } focus:outline-none focus:ring-2 ${
              errors.potassium ? 'focus:ring-red-400' : 'focus:ring-green-400'
            }`}
          >
            <option value="">Select potassium level</option>
            <option value="low">Low (50-100 ppm)</option>
            <option value="medium">Medium (100-200 ppm)</option>
            <option value="high">High (200+ ppm)</option>
          </select>
          {errors.potassium && (
            <p className="text-red-500 text-sm mt-1">{errors.potassium}</p>
          )}
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
