import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock } from 'lucide-react';

const LogoutWarningModal = ({ isVisible, onStayLoggedIn, onLogout, countdownSeconds = 30 }) => {
  const [countdown, setCountdown] = useState(countdownSeconds);

  useEffect(() => {
    if (isVisible && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            onLogout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isVisible, countdown, onLogout]);

  useEffect(() => {
    if (isVisible) {
      setCountdown(countdownSeconds);
    }
  }, [isVisible, countdownSeconds]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Session Timeout Warning
            </h3>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            You have been inactive for a while. For your security, you will be logged out automatically.
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-yellow-800">
              <Clock className="h-4 w-4" />
              <span className="font-medium">
                Auto-logout in {countdown} seconds
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onStayLoggedIn}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Stay Logged In
          </button>
          <button
            onClick={onLogout}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Logout Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutWarningModal;