import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verify session with backend on app initialization
  useEffect(() => {
    const verifySession = async () => {
      try {
        // Use sessionStorage instead of localStorage for better security
        const stored = sessionStorage.getItem("user");
        if (stored) {
          const userData = JSON.parse(stored);
          
          // Verify the session is still valid with backend
          const rootUrl = import.meta.env.VITE_API_URL;
          try {
            const response = await axios.get(`${rootUrl}/api/users/${userData.id}`, {
              withCredentials: true,
              timeout: 5000 // 5 second timeout
            });
            
            if (response.data.status === 'success') {
              // Session is valid, keep user logged in
              setUser(userData);
            } else {
              // Session invalid, clear storage
              sessionStorage.removeItem("user");
              setUser(null);
            }
          } catch (error) {
            // If verification fails, clear the session for security
            console.warn("Session verification failed, logging out for security");
            sessionStorage.removeItem("user");
            setUser(null);
          }
        }
      } catch (e) {
        console.error("Failed to parse stored user", e);
        sessionStorage.removeItem("user");
        setUser(null);
      }
      setLoading(false);
    };

    verifySession();

    // Add cleanup on browser close/refresh
    const handleBeforeUnload = () => {
      // Clear session data when browser is closed
      sessionStorage.removeItem("user");
    };

    // Add event listener for browser close
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup event listener
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const login = (userData) => {
    // Use sessionStorage instead of localStorage for better security
    // This ensures logout when browser is closed
    sessionStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    try {
      // Call backend logout endpoint to invalidate session
      const rootUrl = import.meta.env.VITE_API_URL;
      await axios.post(`${rootUrl}/api/auth/logout`, {}, {
        withCredentials: true,
        timeout: 3000
      });
    } catch (error) {
      console.warn("Backend logout failed:", error.message);
    }
    
    // Always clear session storage and state
    sessionStorage.removeItem("user");
    setUser(null);
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const hasRole = (requiredRoles) => {
    if (!user || !requiredRoles || requiredRoles.length === 0) return false;
    
    const userRole = user.role;
    // Map display names to database role names for compatibility
    const roleMapping = {
      'Landowner': 'Landowner',
      'Supervisor': 'Supervisor', 
      'Buyer': 'Buyer',
      'Operational Manager': 'Operational_Manager',
      'Financial Manager': 'Financial_Manager',
      'Operational_Manager': 'Operational_Manager',
      'Financial_Manager': 'Financial_Manager'
    };

    const normalizedUserRole = roleMapping[userRole] || userRole;
    return requiredRoles.some(role => 
      roleMapping[role] === normalizedUserRole || role === normalizedUserRole
    );
  };

  if (loading) {
    // Show a loading spinner while verifying authentication
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          <p className="mt-4 text-gray-600">Verifying session...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated, 
      hasRole,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
