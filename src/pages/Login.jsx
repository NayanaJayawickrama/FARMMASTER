import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/images/logo.png';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Custom popup states
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const rootUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const { login: authLogin, user: currentUser } = useAuth();

  // Get the intended destination from location state
  const from = location.state?.from || null;

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      const route = roleToPath[currentUser.role];
      if (route) navigate(route);
    }
  }, [currentUser, navigate]);

  const roleToPath = {
    'Landowner': '/landownerdashboard',
    'Supervisor': '/fieldsupervisordashboard',
    'Buyer': '/buyerdashboard',
    'Operational Manager': '/operationalmanagerdashboard',
    'Financial Manager': '/financialmanagerdashboard'
  };

  // Helper function to show custom error popup
  const showCustomError = (message) => {
    setErrorMessage(message);
    setShowErrorPopup(true);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    // Frontend validation
    if (!email || !password) {
      showCustomError('Please fill in all fields.');
      return;
    }

    if (!email.includes('@')) {
      showCustomError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      showCustomError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${rootUrl}/api/users/login`, {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true // Important for session management
      });

      setLoading(false);

      if (response.data.status === 'success') {
        const user = {
          id: response.data.data.user_id,
          role: response.data.data.user_role,
          name: response.data.data.first_name + ' ' + response.data.data.last_name,
          email: response.data.data.email,
          phone: response.data.data.phone
        };

        // Use AuthContext login method to update both localStorage and state
        authLogin(user);

        // Navigate to intended page or default dashboard
        const redirectTo = from || roleToPath[user.role];
        navigate(redirectTo);
      } else {
        // Show specific error message for invalid credentials
        if (response.data.message.toLowerCase().includes('invalid') || 
            response.data.message.toLowerCase().includes('incorrect') ||
            response.data.message.toLowerCase().includes('wrong')) {
          showCustomError('Invalid credentials. Please check your email and password.');
        } else {
          showCustomError(response.data.message);
        }
      }
    } catch (error) {
      setLoading(false);
      console.error('Login error:', error);
      
      // More specific error handling
      if (error.response && error.response.data && error.response.data.message) {
        if (error.response.data.message.toLowerCase().includes('invalid') || 
            error.response.data.message.toLowerCase().includes('incorrect') ||
            error.response.data.message.toLowerCase().includes('wrong') ||
            error.response.data.message.toLowerCase().includes('not found')) {
          showCustomError('Invalid credentials. Please check your email and password.');
        } else {
          showCustomError(error.response.data.message);
        }
      } else if (error.response && error.response.status === 401) {
        showCustomError('Invalid credentials. Please check your email and password.');
      } else {
        showCustomError('Server error. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      {/* Custom Error Popup */}
      {showErrorPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4 border-l-4 border-red-500">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-gray-900">Error</h3>
              </div>
            </div>
            <p className="text-gray-700 mb-6">{errorMessage}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowErrorPopup(false)}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md transition duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-10 mb-6 text-center">
        <img src={logo} alt="FarmMaster" className="w-32 h-auto mx-auto mb-1" />
        <p className="text-xl text-gray-600">Welcome back to your farming journey</p>
      </div>

      <div className="bg-white shadow-md rounded-xl w-full max-w-md p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Sign In</h2>
          <p className="text-l text-gray-500">Enter your credentials to access your account</p>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Enter your email" 
              className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Enter your password" 
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
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-semibold py-2 rounded-md transition"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          {message && (
            <div className={`text-center mt-2 text-sm ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </div>
          )}

          <div className="text-center text-sm text-gray-600 space-y-1">
            <p>
              Don't have an account? <a href="/register" className="text-green-600 font-medium hover:underline">Sign Up</a>
            </p>
          </div>
        </form>
      </div>

      <p className="mt-8 text-sm text-gray-400 text-center">© 2025 Farm Master. All rights reserved.</p>
    </div>
  );
};

export default Login;