import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading while verifying authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          <p className="mt-4 text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!user) {
    // Redirect to login page with the current location as state
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check if user has required role (if specified)
  if (requiredRoles.length > 0) {
    const userRole = user.role;
    
    // Map display names to database role names for compatibility
    const roleMapping = {
      'Landowner': 'Landowner',
      'Supervisor': 'Supervisor', 
      'Buyer': 'Buyer',
      'Operational Manager': 'Operational_Manager',
      'Financial Manager': 'Financial_Manager',
      // Also handle database format directly
      'Operational_Manager': 'Operational_Manager',
      'Financial_Manager': 'Financial_Manager'
    };

    const normalizedUserRole = roleMapping[userRole] || userRole;
    const hasRequiredRole = requiredRoles.some(role => 
      roleMapping[role] === normalizedUserRole || role === normalizedUserRole
    );

    if (!hasRequiredRole) {
      // Redirect to appropriate dashboard based on user's actual role
      const dashboardRoutes = {
        'Landowner': '/landownerdashboard',
        'Supervisor': '/fieldsupervisordashboard',
        'Buyer': '/buyerdashboard',
        'Operational_Manager': '/operationalmanagerdashboard',
        'Operational Manager': '/operationalmanagerdashboard',
        'Financial_Manager': '/financialmanagerdashboard',
        'Financial Manager': '/financialmanagerdashboard'
      };

      const redirectTo = dashboardRoutes[userRole] || '/';
      return <Navigate to={redirectTo} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;