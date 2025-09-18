import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 


const ResetPassword = () => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const email = params.get('email');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg('');
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/reset-password`,
        { email, token, password },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      alert(res.data.message);
      //setMsg(res.data.message);
      if (res.data.status === 'success') {
        setTimeout(() => {
          navigate('/login');
        }, 1500); 
      }
    } catch {
      setMsg('❌ Server error. Please try again.');
      alert('❌ Server error. Please try again.');
    }
    setLoading(false);
  };

  if (!token || !email) return <div>Invalid reset link.</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>
        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New password"
            className="w-full border px-3 py-2 rounded pr-10"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <div
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
            tabIndex={-1}
          >
            {showPassword ? (
              // EyeOff SVG
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.236.938-4.675m1.675-1.675A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.657-.336 3.236-.938 4.675m-1.675 1.675A9.956 9.956 0 0112 21c-1.657 0-3.236-.336-4.675-.938m-1.675-1.675A9.956 9.956 0 013 12c0-1.657.336-3.236.938-4.675m1.675-1.675A9.956 9.956 0 0112 3c1.657 0 3.236.336 4.675.938m1.675 1.675A9.956 9.956 0 0121 12c0 1.657-.336 3.236-.938 4.675m-1.675 1.675A9.956 9.956 0 0112 21c-1.657 0-3.236-.336-4.675-.938m-1.675-1.675A9.956 9.956 0 013 12" />
              </svg>
            ) : (
              // Eye SVG
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
        {msg && <div className="mt-3 text-center">{msg}</div>}
      </form>
    </div>
  );
};

export default ResetPassword;