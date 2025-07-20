import React, { useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import axios from "axios";
import logo from "../assets/images/logo.png";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accountType, setAccountType] = useState("");

  const rootUrl = import.meta.env.VITE_API_URL;

  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password || !accountType) {
      setMessage("⚠️ Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("❌ Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        `${rootUrl}/register.php`,
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: phone,
          password: password,
          account_type: accountType,
        }
      );

      console.log(response.data);

      if (response.data.status === "success") {
        setMessage("✅ Registration successful!");
        // Optional: clear form
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setPassword("");
        setConfirmPassword("");
        setAccountType("");
      } else {
        setMessage("❌ " + response.data.message);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setMessage("❌ Server error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="mt-10 mb-6 text-center">
        <img src={logo} alt="FarmMaster" className="w-32 h-auto mx-auto mb-1" />
        <p className="text-xl text-gray-600">
          Start your organic farming journey today
        </p>
      </div>

      <div className="bg-white shadow-md rounded-xl w-full max-w-2xl p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Create Account</h2>
          <p className="text-l text-gray-500">
            Join Farm Master and unlock your land's potential
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleRegister}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                className="w-full border rounded-md px-4 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className="w-full border rounded-md px-4 py-2"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="w-full border rounded-md px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+94 77 123 4567"
              className="w-full border rounded-md px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Account Type</label>
            <select
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Select your account type</option>
              <option value="Landowner">Landowner</option>
              <option value="Buyer">Buyer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full border rounded-md px-4 py-2 pr-10"
                required
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full border rounded-md px-4 py-2 pr-10"
                required
              />
              <div
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-md transition"
          >
            Create Account
          </button>

          {message && <p className="text-center text-sm text-red-600">{message}</p>}
        </form>
           <div className="text-center text-sm text-gray-600 space-y-1">
            <p>
              Already have an account? <a href="/login" className="text-green-600 font-medium hover:underline">Sign In</a>
            </p>
           </div>
      </div>

      <div className="mt-6">
        <a
          href="/"
          className="flex items-center justify-center gap-2 border border-green-600 text-green-600 font-medium px-4 py-2 rounded-md hover:bg-green-600 hover:text-white transition"
        >
          <ArrowLeft size={18} />
          Back to Home
        </a>
      </div>

      <p className="mt-8 text-sm text-gray-400 text-center">
        © 2025 Farm Master. All rights reserved.
      </p>
    </div>
  );
};

export default Register;
