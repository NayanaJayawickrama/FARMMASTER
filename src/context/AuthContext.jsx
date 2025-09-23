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
        // Use localStorage to persist across page refreshes
        const stored = localStorage.getItem("user");
        if (stored) {
          const userData = JSON.parse(stored);
          
          // Verify the session is still valid with backend
          const rootUrl = import.meta.env.VITE_API_URL;
          try {
            const response = await axios.get(`${rootUrl}/api/users/session`, {
              withCredentials: true,
              timeout: 10000 // Increased timeout to 10 seconds
            });
            
            if (response.data.status === 'success') {
              // Session is valid, use the server's user data which might be more up-to-date
              const serverUserData = response.data.data.user_data;
              
              // Create the full user object with name property for frontend compatibility
              const fullUserData = {
                id: serverUserData.user_id,
                role: serverUserData.user_role,
                name: serverUserData.first_name + ' ' + serverUserData.last_name,
                first_name: serverUserData.first_name,
                last_name: serverUserData.last_name,
                email: serverUserData.email,
                phone: serverUserData.phone
              };
              
              setUser(fullUserData);
              
              // Update localStorage with the fresh data
              localStorage.setItem("user", JSON.stringify(fullUserData));
            } else {
              // Session invalid, clear storage including cart
              console.log("Session verification failed:", response.data.message || "Unknown error");
              if (userData?.id) {
                localStorage.removeItem(`cartItems_${userData.id}`);
              }
              localStorage.removeItem("user");
              setUser(null);
            }
          } catch (error) {
            // Handle different types of errors appropriately
            if (error.response?.status === 401) {
              // 401 means session expired or unauthorized - clear user data
              console.log("Session expired or unauthorized - clearing user data");
              if (userData?.id) {
                localStorage.removeItem(`cartItems_${userData.id}`);
              }
              localStorage.removeItem("user");
              setUser(null);
            } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
              // Network/server connection issues - keep user logged in locally
              console.warn("Cannot connect to server for session verification, keeping user logged in locally");
              setUser(userData);
            } else {
              // Other errors might indicate real problems
              console.warn("Session verification failed:", error.response?.status || error.message);
              // Only clear session for server-side errors, not network issues
              if (error.response) {
                if (userData?.id) {
                  localStorage.removeItem(`cartItems_${userData.id}`);
                }
                localStorage.removeItem("user");
                setUser(null);
              } else {
                // Network error - keep user logged in locally
                setUser(userData);
              }
            }
            // Note: Removed automatic session clearing for network errors
          }
        }
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem("user");
        setUser(null);
      }
      setLoading(false);
    };

    verifySession();

    // Set up periodic session validation every 2 minutes when user is logged in
    let sessionCheckInterval;
    if (user) {
      sessionCheckInterval = setInterval(async () => {
        try {
          const rootUrl = import.meta.env.VITE_API_URL;
          const response = await axios.get(`${rootUrl}/api/users/session`, {
            withCredentials: true,
            timeout: 5000
          });
          
          if (response.data.status !== 'success') {
            // Session expired, clear user data
            console.log("Periodic session check failed - logging out user");
            if (user?.id) {
              localStorage.removeItem(`cartItems_${user.id}`);
            }
            localStorage.removeItem("user");
            setUser(null);
          }
        } catch (error) {
          if (error.response?.status === 401) {
            // Session expired
            console.log("Session expired during periodic check - logging out user");
            if (user?.id) {
              localStorage.removeItem(`cartItems_${user.id}`);
            }
            localStorage.removeItem("user");
            setUser(null);
          }
          // For network errors, we don't logout automatically
        }
      }, 120000); // Check every 2 minutes
    }

    // Handle browser close (but not page refresh)
    const handleBeforeUnload = (e) => {
      // Set a flag in sessionStorage to detect if it's a browser close or refresh
      sessionStorage.setItem("closingBrowser", "true");
    };

    const handleLoad = () => {
      // Check if we're loading after a browser close or just a refresh
      const wasClosingBrowser = sessionStorage.getItem("closingBrowser");
      if (!wasClosingBrowser) {
        // This was a browser close and reopen, logout the user
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            if (userData?.id) {
              localStorage.removeItem(`cartItems_${userData.id}`);
            }
          } catch (e) {
            console.warn("Failed to parse user data for cart cleanup", e);
          }
        }
        localStorage.removeItem("user");
        setUser(null);
      }
      // Clear the flag
      sessionStorage.removeItem("closingBrowser");
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('load', handleLoad);

    return () => {
      if (sessionCheckInterval) {
        clearInterval(sessionCheckInterval);
      }
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('load', handleLoad);
    };
  }, [user]);

  const login = (userData) => {
    // Ensure userData has both name and individual name fields for compatibility
    const fullUserData = {
      ...userData,
      first_name: userData.first_name || userData.name?.split(' ')[0] || '',
      last_name: userData.last_name || userData.name?.split(' ').slice(1).join(' ') || '',
      name: userData.name || (userData.first_name && userData.last_name ? userData.first_name + ' ' + userData.last_name : '')
    };
    
    // Use localStorage to persist across page refreshes
    localStorage.setItem("user", JSON.stringify(fullUserData));
    setUser(fullUserData);
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
    
    // Clear user-specific cart data
    if (user?.id) {
      localStorage.removeItem(`cartItems_${user.id}`);
    }
    
    // Clear localStorage and state
    localStorage.removeItem("user");
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

  const switchRole = async (newRole) => {
    try {
      const rootUrl = import.meta.env.VITE_API_URL;
      const response = await axios.post(`${rootUrl}/api/users/switch-role`, {
        role: newRole
      }, {
        withCredentials: true
      });

      if (response.data.status === 'success') {
        const updatedUser = {
          ...user,
          role: newRole,
          switched_from: user.role
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || "Failed to switch role" 
      };
    }
  };

  const resetRole = async () => {
    try {
      const rootUrl = import.meta.env.VITE_API_URL;
      const response = await axios.post(`${rootUrl}/api/users/reset-role`, {}, {
        withCredentials: true
      });

      if (response.data.status === 'success') {
        const resetUser = {
          ...user,
          role: response.data.data.role,
          switched_from: undefined
        };
        localStorage.setItem("user", JSON.stringify(resetUser));
        setUser(resetUser);
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || "Failed to reset role" 
      };
    }
  };

  const canSwitchRole = () => {
    if (!user) return false;
    return user.role === 'Buyer' || user.role === 'Landowner';
  };

  const getAvailableRole = () => {
    if (!user || !canSwitchRole()) return null;
    return user.role === 'Buyer' ? 'Landowner' : 'Buyer';
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
      switchRole,
      resetRole,
      canSwitchRole,
      getAvailableRole,
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
