import React, { useState } from "react";
import { Eye, EyeOff, ArrowLeft, Check } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const navigate = useNavigate();

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

  // Field-specific error states
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    accountType: ""
  });

  // Clear specific field error
  const clearError = (fieldName) => {
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: "" }));
    }
  };

  // Set specific field error
  const setFieldError = (fieldName, errorMessage) => {
    setErrors(prev => ({ ...prev, [fieldName]: errorMessage }));
  };

  // Clear all errors
  const clearAllErrors = () => {
    setErrors({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      accountType: ""
    });
  };
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
      return "Phone number is required."; // Phone is now required
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
    
    // Clear phone error when user types
    clearError("phone");
  };

  // Success Modal Component
  const SuccessModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-10 max-w-lg w-full text-center shadow-2xl transform scale-100 transition-all duration-300">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Check className="w-12 h-12 text-white" strokeWidth={4} />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Registration Successful!</h2>
            <p className="text-lg text-gray-600 leading-relaxed px-4">
              Welcome to <span className="font-semibold text-green-600">FarmMaster</span>! Your account has been successfully created.
            </p>
            <p className="text-sm text-gray-500 px-4">
              Please check your email to verify your account and complete the registration process.
            </p>
          </div>
        </div>
        
        {/* Action Button */}
        <div className="space-y-3">
          <button
            onClick={handleGoToDashboard}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-xl text-lg transition duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Continue to Login
          </button>
          <p className="text-xs text-gray-400">You'll be redirected to the login page</p>
        </div>
      </div>
    </div>
  );

  const handleGoToDashboard = () => {
    setShowSuccessModal(false);
    navigate('/login');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    clearAllErrors();

    let hasErrors = false;

    // Frontend validation
    const firstNameError = validateName(firstName, "First name");
    if (firstNameError) {
      setFieldError("firstName", firstNameError);
      hasErrors = true;
    }

    const lastNameError = validateName(lastName, "Last name");
    if (lastNameError) {
      setFieldError("lastName", lastNameError);
      hasErrors = true;
    }

    const emailError = validateEmail(email);
    if (emailError) {
      setFieldError("email", emailError);
      hasErrors = true;
    }

    const phoneError = validatePhone(phone);
    if (phoneError) {
      setFieldError("phone", phoneError);
      hasErrors = true;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setFieldError("password", passwordError);
      hasErrors = true;
    }

    if (!accountType) {
      setFieldError("accountType", "Please select an account type.");
      hasErrors = true;
    }

    if (password !== confirmPassword) {
      setFieldError("confirmPassword", "Passwords do not match.");
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${rootUrl}/api/users/register`, {
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone, // Always send phone since it's required
        password: password,
        user_role: accountType, // Changed from account_type to user_role
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setLoading(false);

      if (response.data.status === "success") {
        // Clear form
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("+94");
        setPassword("");
        setConfirmPassword("");
        setAccountType("");
        // Show success modal
        setShowSuccessModal(true);
      } else {
        // Handle specific backend errors
        const errorMessage = response.data.message;
        const fieldErrors = response.data.errors;
        console.log("Backend error message:", errorMessage); // Debug log
        console.log("Backend field errors:", fieldErrors); // Debug log
        
        // If we have specific field errors, use them
        if (fieldErrors) {
          if (fieldErrors.email) {
            setFieldError("email", "This email address is already registered.");
          }
          if (fieldErrors.phone) {
            setFieldError("phone", "This phone number is already registered.");
          }
        } else {
          // Fallback to message parsing for backwards compatibility
          if (errorMessage === "Email already registered") {
            setFieldError("email", "This email address is already registered.");
          } else if (errorMessage === "Phone number already registered") {
            setFieldError("phone", "This phone number is already registered.");
          } else if (errorMessage.includes("Email") && errorMessage.includes("Phone")) {
            // Handle compound error message if backend sends both
            setFieldError("email", "This email address is already registered.");
            setFieldError("phone", "This phone number is already registered.");
          } else {
            setMessage("ERROR: " + response.data.message);
          }
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("Registration failed:", error);
      console.log("Error response:", error.response?.data); // Debug log
      
      // Check if it's a validation error from server
      if (error.response?.data?.message) {
        const errorMessage = error.response.data.message;
        const fieldErrors = error.response.data.errors;
        console.log("Server error message:", errorMessage); // Debug log
        console.log("Server field errors:", fieldErrors); // Debug log
        
        // If we have specific field errors, use them
        if (fieldErrors) {
          if (fieldErrors.email) {
            setFieldError("email", "This email address is already registered.");
          }
          if (fieldErrors.phone) {
            setFieldError("phone", "This phone number is already registered.");
          }
        } else {
          // Fallback to message parsing for backwards compatibility
          if (errorMessage === "Email already registered") {
            setFieldError("email", "This email address is already registered.");
          } else if (errorMessage === "Phone number already registered") {
            setFieldError("phone", "This phone number is already registered.");
          } else if (errorMessage.includes("Email") && errorMessage.includes("Phone")) {
            // Handle compound error message if backend sends both
            setFieldError("email", "This email address is already registered.");
            setFieldError("phone", "This phone number is already registered.");
          } else {
            setMessage("ERROR: " + errorMessage);
          }
        }
      } else {
        setMessage("❌ Server error. Please try again.");
      }
    }
  };

  return (
    <>
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
                onChange={(e) => {
                  setFirstName(e.target.value);
                  clearError("firstName");
                }}
                placeholder="John"
                className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.firstName ? 'border-red-500' : ''
                }`}
                required
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name *</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  clearError("lastName");
                }}
                placeholder="Doe"
                className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.lastName ? 'border-red-500' : ''
                }`}
                required
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearError("email");
              }}
              placeholder="john@example.com"
              className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.email ? 'border-red-500' : ''
              }`}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone Number *</label>
            <input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="+94 771234567"
              className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.phone ? 'border-red-500' : ''
              }`}
              maxLength="12"
              required
            />
            {errors.phone ? (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            ) : (
              <p className="text-xs text-gray-500 mt-1">Format: +94 followed by 9 digits</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Account Type *</label>
            <select
              value={accountType}
              onChange={(e) => {
                setAccountType(e.target.value);
                clearError("accountType");
              }}
              className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.accountType ? 'border-red-500' : ''
              }`}
              required
            >
              <option value="">Select your account type</option>
              <option value="Landowner">Landowner</option>
              <option value="Buyer">Buyer</option>
            </select>
            {errors.accountType && (
              <p className="text-red-500 text-xs mt-1">{errors.accountType}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearError("password");
                  // Clear confirm password error if passwords now match
                  if (confirmPassword && e.target.value === confirmPassword) {
                    clearError("confirmPassword");
                  }
                }}
                placeholder="Create a strong password"
                className={`w-full border rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.password ? 'border-red-500' : ''
                }`}
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
            {errors.password ? (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            ) : (
              <p className="text-xs text-gray-500 mt-1">At least 6 characters with one letter and one number</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password *</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  clearError("confirmPassword");
                  // Show immediate feedback if passwords don't match
                  if (password && e.target.value && password !== e.target.value) {
                    setFieldError("confirmPassword", "Passwords do not match.");
                  }
                }}
                placeholder="Confirm your password"
                className={`w-full border rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.confirmPassword ? 'border-red-500' : ''
                }`}
                required
              />
              <div
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
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

    {/* Success Modal */}
    {showSuccessModal && <SuccessModal />}
    </>
  );
};

export default Register;