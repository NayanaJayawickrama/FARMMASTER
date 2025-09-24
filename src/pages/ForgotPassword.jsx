import React, { useState } from 'react';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/images/logo.png';
import PopupMessage from '../components/alerts/PopupMessage';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Popup message state
  const [popup, setPopup] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  });

  const showPopup = (type, title, message) => {
    setPopup({
      isOpen: true,
      type,
      title,
      message
    });
  };

  const closePopup = () => {
    setPopup(prev => ({ ...prev, isOpen: false }));
  };

  const rootUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      showPopup('error', 'Error', 'Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${rootUrl}/api/users/forgot-password`, {
        email: email
      });

      if (response.data.status === 'success') {
        setEmailSent(true);
        showPopup('success', 'Email Sent', response.data.message);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send password reset email. Please try again.';
      showPopup('error', 'Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
          <div className="text-center mb-6">
            <img src={logo} alt="FARMMASTER Logo" className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Check Your Email</h1>
          </div>

          <div className="text-center">
            <div className="mb-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                We've sent a password reset link to your email address.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Please check your email and follow the instructions to reset your password. 
                The link will expire in 1 hour.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => {
                  setEmailSent(false);
                  setEmail('');
                }}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
              >
                Send Another Email
              </button>
              
              <Link
                to="/login"
                className="block w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors text-center"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      {popup.isOpen && (
        <PopupMessage
          type={popup.type}
          title={popup.title}
          message={popup.message}
          onClose={closePopup}
        />
      )}

      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <img src={logo} alt="FARMMASTER Logo" className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password</h1>
          <p className="text-gray-600 text-sm">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                placeholder="Enter your email"
                disabled={loading}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending...
              </div>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="inline-flex items-center text-sm text-gray-600 hover:text-green-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;