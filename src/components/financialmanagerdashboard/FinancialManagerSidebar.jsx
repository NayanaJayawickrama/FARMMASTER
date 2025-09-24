import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  LogOut,
  Menu,
  X,
  FileText,
  DollarSign,
  ArrowLeftCircle,
  Calculator,
  Package,
  CreditCard,
  ClipboardList,
} from "lucide-react";

import logo from "../../assets/images/logo.png";
import profilePic from "../../assets/images/userProfile.png";
import { useAuth } from "../../context/AuthContext";
import ConfirmationModal from "../ConfirmationModal";

export default function FinancialManagerSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Load user data from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const linkBase =
    "flex items-center gap-3 px-4 py-2 rounded-md transition text-sm font-medium";
  const activeLink = "bg-green-100 text-green-700 font-semibold";
  const normalLink = "text-black hover:bg-green-50";

  // Logout 
  const handleLogout = async () => {
    try {
      console.log("Financial Manager logout initiated...");
      await logout();
      console.log("Logout successful, navigating to home...");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      // Still navigate to home even if logout fails to avoid user getting stuck
      navigate("/", { replace: true });
    } finally {
      setShowLogoutModal(false);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  return (
    <>
      
      <div className="md:hidden flex items-start bg-white shadow px-4 py-6">
        <button className="cursor-pointer" onClick={() => setIsOpen(true)}>
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-sm font-poppins flex flex-col px-4 py-6 z-50 transform transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
       
        <div className="flex items-center justify-between mb-6">
          <NavLink to="/" onClick={() => setIsOpen(false)}>
            <img src={logo} alt="FarmMaster Logo" className="h-20 w-auto" />
          </NavLink>
          <button
            className="md:hidden text-gray-600 cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        
        <div className="flex items-center mb-8">
          <img
            src={profilePic}
            alt="Financial Manager"
            className="w-14 h-14 rounded-full object-cover mr-4"
          />
          <div>
            <p className="text-base font-semibold">
              {user?.name || "Financial Manager"}
            </p>
            <p className="text-sm text-green-600">Financial Manager</p>
          </div>
        </div>

     
        <nav className="flex flex-col gap-2">
          <NavLink
            to="/financialmanagerdashboard"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeLink : normalLink}`
            }
            onClick={() => setIsOpen(false)}
          >
            <Home size={16} />
            Dashboard
          </NavLink>

          <NavLink
            to="/financialmanagerpaymentmanagement"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeLink : normalLink}`
            }
            onClick={() => setIsOpen(false)}
          >
            <CreditCard size={16} />
            Payment Management
          </NavLink>

          <NavLink
            to="/financialmanagerproposals"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeLink : normalLink}`
            }
            onClick={() => setIsOpen(false)}
          >
            <ClipboardList size={16} />
            Proposal Management
          </NavLink>

          <NavLink
            to="/financialmanagerprofitrentcalculation"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeLink : normalLink}`
            }
            onClick={() => setIsOpen(false)}
          >
            <Calculator size={16} />
            Profit Calculation
          </NavLink>

        
          <NavLink
            to="/financialmanagermarketplaceproducts"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeLink : normalLink}`
            }
            onClick={() => setIsOpen(false)}
          >
            <Package size={16} />
            Marketplace Products
          </NavLink>

          <NavLink
            to="/financialmanagerharvestincome"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeLink : normalLink}`
            }
            onClick={() => setIsOpen(false)}
          >
            <DollarSign size={16} />
            Harvest Income Reports
          </NavLink>
        </nav>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeLink : normalLink}`
            }
            onClick={() => setIsOpen(false)}
          >
            <ArrowLeftCircle size={16} />
            Go to Home
          </NavLink>

          <button
            className={`${linkBase} text-red-600 hover:bg-red-50 mt-2 cursor-pointer`}
            onClick={handleLogoutClick}
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout from your Financial Manager account? You will be redirected to the home page."
        confirmText="Yes, Logout"
        cancelText="Cancel"
        type="warning"
      />
    </>
  );
}
