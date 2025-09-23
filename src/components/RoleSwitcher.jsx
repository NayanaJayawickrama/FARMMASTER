import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Repeat, Loader } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ConfirmationModal from "./ConfirmationModal";

const RoleSwitcher = ({ className = "" }) => {
  const { user, canSwitchRole, getAvailableRole, switchRole } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false);
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
      setShowSwitchModal(false);
    }
  };

  const handleSwitchClick = () => {
    setShowSwitchModal(true);
  };

  return (
    <>
      <button
        onClick={handleSwitchClick}
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

      {/* Role Switch Confirmation Modal */}
      <ConfirmationModal
        isOpen={showSwitchModal}
        onClose={() => setShowSwitchModal(false)}
        onConfirm={handleRoleSwitch}
        title="Confirm Role Switch"
        message={`Are you sure you want to switch from ${user?.role} to ${availableRole}? You will be redirected to the ${availableRole} dashboard.`}
        confirmText={`Yes, Switch to ${availableRole}`}
        cancelText="Cancel"
        type="info"
      />
    </>
  );
};

export default RoleSwitcher;