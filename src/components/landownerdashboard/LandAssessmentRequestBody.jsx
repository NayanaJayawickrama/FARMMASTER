import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; 

const LandAssessmentRequestPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [size, setSize] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const rootUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setMessage("⚠️ User not logged in. Please log in first.");
      return;
    }

    if (!size || !location) {
      setMessage("⚠️ Please fill in all fields.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(`${rootUrl}/insert_land.php`, {
        user_id: user.id,
        size,
        location,
      });

      setLoading(false);

      if (response.data.status === "success") {
        // Go to payment page
        navigate("/landassessmentpayment");
      } else {
        setMessage("❌ " + response.data.message);
      }
    } catch (error) {
      setLoading(false);
      setMessage("❌ Server error. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen bg-white justify-center items-center p-4">
      <div className="w-full max-w-lg bg-white rounded-lg p-8 shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Land Assessment Request</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Land Size (Acres)</label>
            <input
              type="text"
              placeholder="Enter land size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded bg-green-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Land Location</label>
            <input
              type="text"
              placeholder="Enter land location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded bg-green-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded mt-4 transition"
          >
            {loading ? "Submitting..." : "Continue to Payment"}
          </button>

          {message && <p className="mt-2 text-center text-red-600">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default LandAssessmentRequestPage;
