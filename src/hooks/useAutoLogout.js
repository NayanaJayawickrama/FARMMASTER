import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const useAutoLogout = (timeoutMinutes = 60, warningMinutes = 2) => {
  const { logout, user } = useAuth();
  const timeoutRef = useRef(null);
  const warningRef = useRef(null);
  const [showWarning, setShowWarning] = useState(false);
  
  const resetTimeout = () => {
    // Clear existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningRef.current) {
      clearTimeout(warningRef.current);
    }
    
    // Hide warning if showing
    setShowWarning(false);
    
    if (user) {
      // Set warning timeout (show warning before actual logout)
      warningRef.current = setTimeout(() => {
        setShowWarning(true);
      }, (timeoutMinutes - warningMinutes) * 60 * 1000);
      
      // Set actual logout timeout
      timeoutRef.current = setTimeout(() => {
        console.log('Auto-logout due to inactivity');
        logout();
      }, timeoutMinutes * 60 * 1000);
    }
  };

  const handleActivity = () => {
    if (user) {
      resetTimeout();
    }
  };

  const handleStayLoggedIn = () => {
    setShowWarning(false);
    resetTimeout();
  };

  const handleLogoutNow = () => {
    setShowWarning(false);
    logout();
  };

  useEffect(() => {
    if (user) {
      // Set initial timeout
      resetTimeout();

      // Activity events to monitor
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
      
      // Add event listeners
      events.forEach(event => {
        document.addEventListener(event, handleActivity, true);
      });

      return () => {
        // Cleanup
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        if (warningRef.current) {
          clearTimeout(warningRef.current);
        }
        events.forEach(event => {
          document.removeEventListener(event, handleActivity, true);
        });
      };
    } else {
      // User logged out, clear warning
      setShowWarning(false);
    }
  }, [user, timeoutMinutes, warningMinutes]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningRef.current) {
        clearTimeout(warningRef.current);
      }
    };
  }, []);

  return {
    showWarning,
    onStayLoggedIn: handleStayLoggedIn,
    onLogout: handleLogoutNow
  };
};

export default useAutoLogout;