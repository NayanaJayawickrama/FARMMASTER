import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot password states
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const rootUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const route = roleToPath[user.role];
      if (route) navigate(route);
    }
  }, []);

  const roleToPath = {
    'Landowner': '/landownerdashboard',
    'Supervisor': '/fieldsupervisordashboard',
    'Buyer': '/buyerdashboard',
    'Operational Manager': '/operationalmanagerdashboard',
    'Financial Manager': '/financialmanagerdashboard'
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    // Frontend validation
    if (!email || !password) {
      alert('⚠️ Please fill in all fields.');
      return;
    }

    if (!email.includes('@')) {
      alert('⚠️ Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      alert('⚠️ Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${rootUrl}/login.php`, {
        email,
        password
      });

      setLoading(false);

      if (response.data.status === 'success') {
        const user = {
          id: response.data.user_id,
          role: response.data.user_role,
          name: response.data.first_name + ' ' + response.data.last_name,
          email: response.data.email,
          phone: response.data.phone
        };

        localStorage.setItem("user", JSON.stringify(user));
        alert('✅ Login successful...!!!');

        setTimeout(() => {
          navigate(roleToPath[user.role]);
        }, 1000);
      } else {
        alert('❌ ' + response.data.message);
      }
    } catch (error) {
      setLoading(false);
      console.error('Login error:', error);
      alert('❌ Server error. Please try again.');
    }
  };

  // Forgot Password Handler
  
const handleForgotPassword = async (e) => {
  e.preventDefault();
  setForgotMsg('');
  if (!forgotEmail || !forgotEmail.includes('@')) {
    alert('⚠️ Please enter a valid email address.');
    setForgotMsg('⚠️ Please enter a valid email address.');
    return;
  }
  setForgotLoading(true);
  try {
    // Send the current frontend URL to the backend
    const res = await axios.post(`${rootUrl}/forgot_password.php`, {
      email: forgotEmail,
      frontendUrl: window.location.origin 
    });
    alert(res.data.message);
    setForgotMsg(res.data.message);
  } catch {
    alert('❌ Server error. Please try again.');
    setForgotMsg('❌ Server error. Please try again.');
  }
  setForgotLoading(false);
};

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="fixed inset-0 bg-white bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold mb-2">Forgot Password</h2>
            <form onSubmit={handleForgotPassword} className="space-y-3">
              <input
                type="email"
                value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <button
                type="submit"
                disabled={forgotLoading}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-md transition"
              >
                {forgotLoading ? "Sending..." : "Send Reset Link"}
              </button>
              {forgotMsg && (
                <div className={`text-center text-sm ${forgotMsg.toLowerCase().includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                  {forgotMsg}
                </div>
              )}
              <button
                type="button"
                className="w-full mt-2 text-gray-500 hover:underline"
                onClick={() => { setShowForgot(false); setForgotMsg(''); setForgotEmail(''); }}
              >
                Cancel
              </button>
            </form>
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
            <button
              type="button"
              className="text-green-600 hover:underline inline-block"
              onClick={() => setShowForgot(true)}
            >
              Forgot your password?
            </button>
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