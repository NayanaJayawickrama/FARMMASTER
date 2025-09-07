import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Add this import

const ResetPassword = () => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const email = params.get('email');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg('');
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/reset_password.php`,
        { email, token, password }
      );
      setMsg(res.data.message);
      if (res.data.status === 'success') {
        setTimeout(() => {
          navigate('/login');
        }, 1500); // Redirect after 1.5 seconds
      }
    } catch {
      setMsg('❌ Server error. Please try again.');
    }
    setLoading(false);
  };

  if (!token || !email) return <div>Invalid reset link.</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>
        <input
          type="password"
          placeholder="New password"
          className="w-full border px-3 py-2 mb-3 rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          minLength={6}
        />
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