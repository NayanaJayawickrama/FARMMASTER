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
  const [phone, setPhone] = useState("+94");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accountType, setAccountType] = useState("");

  const rootUrl = import.meta.env.VITE_API_URL;

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Validation functions
  const validateName = (name, fieldName) => {
    if (!name.trim()) {
      return `${fieldName} is required.`;
    }
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      return `${fieldName} should contain only letters and spaces.`;
    }
    return null;
  };

  const validateEmail = (email) => {
    if (!email.trim()) {
      return "Email is required.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email address.";
    }
    return null;
  };

  const validatePassword = (password) => {
    if (!password) {
      return "Password is required.";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters long.";
    }
    if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
      return "Password must contain at least one letter and one number.";
    }
    return null;
  };

  const validatePhone = (phone) => {
    if (!phone || phone === "+94") {
      return null; // Phone is optional
    }
    
    // Remove +94 prefix for validation
    let phoneDigits = phone;
    if (phone.startsWith('+94')) {
      phoneDigits = phone.substring(3);
    }
    
    if (!/^\d{9}$/.test(phoneDigits)) {
      return "Phone number must be 9 digits after +94.";
    }
    return null;
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value;
    
    // Always ensure it starts with +94
    if (!value.startsWith('+94')) {
      value = '+94' + value.replace(/^\+?94?/, '');
    }
    
    // Remove any non-digit characters except +94 prefix
    const digits = value.substring(3).replace(/\D/g, '');
    
    // Limit to 9 digits after +94
    if (digits.length <= 9) {
      setPhone('+94' + digits);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    // Frontend validation
    const firstNameError = validateName(firstName, "First name");
    if (firstNameError) {
      setMessage("⚠️ " + firstNameError);
      alert("⚠️ " + firstNameError);
      return;
    }

    const lastNameError = validateName(lastName, "Last name");
    if (lastNameError) {
      setMessage("⚠️ " + lastNameError);
      alert("⚠️ " + lastNameError);
      return;
    }

    const emailError = validateEmail(email);
    if (emailError) {
      setMessage("⚠️ " + emailError);
      alert("⚠️ " + emailError);
      return;
    }

    const phoneError = validatePhone(phone);
    if (phoneError) {
      setMessage("⚠️ " + phoneError);
      alert("⚠️ " + phoneError);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setMessage("⚠️ " + passwordError);
      alert("⚠️ " + passwordError);
      return;
    }

    if (!accountType) {
      setMessage("⚠️ Please select an account type.");
      alert("⚠️ Please select an account type.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("❌ Passwords do not match.");
      alert("❌ Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${rootUrl}/api/users/register`, {
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone === "+94" ? "" : phone, // Send empty if only +94
        password: password,
        user_role: accountType, // Changed from account_type to user_role
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setLoading(false);

      if (response.data.status === "success") {
        setMessage("✅ Registration successful! You can now login.");
        // Clear form
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("+94");
        setPassword("");
        setConfirmPassword("");
        setAccountType("");
      } else {
        setMessage("❌ " + response.data.message);
        alert("❌ " + response.data.message);
      }
    } catch (error) {
      setLoading(false);
      console.error("Registration failed:", error);
      setMessage("❌ Server error. Please try again.");
      alert("❌ Server error. Please try again.");
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
              <label className="block text-sm font-medium mb-1">First Name *</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name *</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone (Optional)</label>
            <input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="+94 771234567"
              className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              maxLength="12"
            />
            <p className="text-xs text-gray-500 mt-1">Format: +94 followed by 9 digits</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Account Type *</label>
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
            <label className="block text-sm font-medium mb-1">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full border rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                minLength="6"
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">At least 6 characters with one letter and one number</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password *</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full border rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500"
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
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-semibold py-2 rounded-md transition"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          {message && (
            <div className={`text-center mt-2 text-sm ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </div>
          )}
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