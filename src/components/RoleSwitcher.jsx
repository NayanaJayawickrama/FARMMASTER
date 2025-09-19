import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Repeat, Loader } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const RoleSwitcher = ({ className = "" }) => {
  const { user, canSwitchRole, getAvailableRole, switchRole } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  if (!canSwitchRole()) {
    return null; // Don't render if user can't switch roles
  }

  const availableRole = getAvailableRole();
  
  const handleRoleSwitch = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const result = await switchRole(availableRole);
      
      if (result.success) {
        // Navigate to appropriate dashboard based on new role
        const dashboardRoutes = {
          'Buyer': '/buyerdashboard',
          'Landowner': '/landownerdashboard'
        };
        
        const targetRoute = dashboardRoutes[availableRole];
        if (targetRoute) {
          navigate(targetRoute);
        }
      } else {
        alert(result.error || "Failed to switch role");
      }
    } catch (error) {
      alert("An error occurred while switching roles");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleRoleSwitch}
      disabled={isLoading}
      className={`border border-black px-4 py-2 rounded-md hover:bg-gray-100 flex items-center gap-2 font-bold text-black transition-colors ${
        isLoading ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      {isLoading ? (
        <Loader size={20} className="animate-spin" />
      ) : (
        <Repeat size={20} />
      )}
      {isLoading ? 'Switching...' : `Switch to ${availableRole}`}
    </button>
  );
};

export default RoleSwitcher;