import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import logo from "../assets/images/logo.png";
import { ArrowLeft } from "lucide-react";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      {/* Logo + Tagline */}
      <div className="mt-10 mb-6 text-center">
        <img src={logo} alt="FarmMaster" className="w-32 h-auto mx-auto mb-1" />
        <p className="text-xl text-gray-600">
          Start your organic farming journey today
        </p>
      </div>

      {/* Card */}
      <div className="bg-white shadow-md rounded-xl w-full max-w-2xl p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Create Account</h2>
          <p className="text-l text-gray-500">
            Join Farm Master and unlock your land's potential
          </p>
        </div>

        <form className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                First Name
              </label>
              <input
                type="text"
                placeholder="John"
                className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Doe"
                className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="john@example.com"
              className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="+94 77 123 4567"
              className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Account Type */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Account Type
            </label>
            <select className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
              <option>Select your account type</option>
              <option>Farmer</option>
              <option>Buyer</option>
            
            </select>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                className="w-full border rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm your password"
                className="w-full border rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <div
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start">
            <input type="checkbox" id="terms" className="mt-1 mr-2" />
            <label htmlFor="terms" className="text-sm text-gray-700">
              I agree to the{" "}
              <a href="#" className="text-green-600 underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-green-600 underline">
                Privacy Policy
              </a>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-md transition"
          >
            Create Account
          </button>

          {/* Already have an account */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-green-600 font-medium">
              Sign In
            </a>
          </p>
        </form>
      </div>

      {/* Back to Home Button */}
      <div className="mt-6">
        <a
          href="/"
          className="flex items-center justify-center gap-2 border border-green-600 text-green-600 font-medium px-4 py-2 rounded-md hover:bg-green-600 hover:text-white transition"
        >
          <ArrowLeft size={18} />
          Back to Home
        </a>
      </div>

      {/* Footer */}
      <p className="mt-8 text-sm text-gray-400 text-center">
        © 2025 Farm Master. All rights reserved.
      </p>
    </div>
  );
};

export default Register;
