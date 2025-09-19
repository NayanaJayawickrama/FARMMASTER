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
              timeout: 5000 // 5 second timeout
            });
            
            if (response.data.status === 'success') {
              // Session is valid, use the server's user data which might be more up-to-date
              const serverUserData = response.data.data.user_data;
              setUser(serverUserData);
              
              // Update localStorage with the fresh data
              localStorage.setItem("user", JSON.stringify(serverUserData));
            } else {
              // Session invalid, clear storage including cart
              if (userData?.id) {
                localStorage.removeItem(`cartItems_${userData.id}`);
              }
              localStorage.removeItem("user");
              setUser(null);
            }
          } catch (error) {
            // Handle different types of errors appropriately
            if (error.response?.status === 401) {
              // 401 is expected when no valid session exists - don't log as error
              console.log("No active session found");
            } else {
              // Other errors might indicate real problems
              console.warn("Session verification failed:", error.response?.status || error.message);
            }
            // Clear cart data for the user if we had their data
            if (userData?.id) {
              localStorage.removeItem(`cartItems_${userData.id}`);
            }
            localStorage.removeItem("user");
            setUser(null);
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
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  const login = (userData) => {
    // Use localStorage to persist across page refreshes
    localStorage.setItem("user", JSON.stringify(userData));
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
