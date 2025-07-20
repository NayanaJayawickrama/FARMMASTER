import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const rootUrl = import.meta.env.VITE_API_URL;
  console.log(rootUrl)

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password || !accountType) {
      setMessage('⚠️ Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${rootUrl}/login.php`, 
        {
        email,
        password,
        user_role: accountType
      });

      setLoading(false);
      if (response.data.status === 'success') {
        setMessage('✅ Login successful!');
        const user = {
          id: response.data.user_id,
          role: response.data.user_role

        };

        switch (user.role) {
          case 'Landowner':
            navigate('/landowner', { state: { user } });
            break;
          case 'Supervisor':
            navigate('/supervisor', { state: { user } });
            break;
          case 'Buyer':
            navigate('/buyer', { state: { user } });
            break;
          case 'Operational Manager':
            navigate('/operational-manager', { state: { user } });
            break;
          case 'Financial Manager':
            navigate('/financial-manager', { state: { user } });
            break;
          default:
            setMessage('❌ Invalid role.');
        }
      } else {
        setMessage('❌ ' + response.data.message);
      }
    } catch (error) {
      setLoading(false);
      setMessage('❌ Server error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
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
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="w-full border rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500" required />
              <div onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Account Type</label>
            <select value={accountType} onChange={(e) => setAccountType(e.target.value)} className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" required>
              <option value="">Select your account type</option>
              <option value="Landowner">Landowner</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Buyer">Buyer</option>
              <option value="Operational Manager">Operational Manager</option>
              <option value="Financial Manager">Financial Manager</option>
            </select>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-md transition">
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          {message && (
            <div className={`text-center mt-2 text-sm ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </div>
          )}

          <div className="text-center text-sm text-gray-600 space-y-1">
            <a href="#" className="text-green-600 hover:underline block">Forgot your password?</a>
            <p>
              Don’t have an account? <a href="/register" className="text-green-600 font-medium hover:underline">Sign Up</a>
            </p>
          </div>
        </form>
      </div>

      <p className="mt-8 text-sm text-gray-400 text-center">© 2025 Farm Master. All rights reserved.</p>
    </div>
  );
};

export default Login;
