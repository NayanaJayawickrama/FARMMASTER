import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  ShoppingCart,
  History,
  LogOut,
  Menu,
  X,
  Store,
  ArrowLeftCircle,
} from "lucide-react";
import logo from "../../assets/images/logo.png";
import profilePic from "../../assets/images/userProfile.png";
import { useCart } from "../cart/CartContext";
import { useAuth } from "../../context/AuthContext";
import ConfirmationModal from "../ConfirmationModal";

export default function BuyerSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Fetch user info from localStorage on mount
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
  const totalItems = cartItems.length;

  const handleLogout = async () => {
    try {
      console.log("Buyer logout initiated...");
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
      {/* Mobile Top Bar */}
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
        {/* Logo and Close */}
        <div className="flex items-center justify-between mb-6">
          <NavLink to="/" onClick={() => setIsOpen(false)}>
            <img src={logo} alt="FarmMaster Logo" className="h-20 w-auto" />
          </NavLink>
          <button
            className="md:hidden cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* Profile */}
        <div className="flex items-center mb-8">
          <img
            src={profilePic}
            alt="Buyer"
            className="w-14 h-14 rounded-full object-cover mr-4"
          />
          <div>
            <p className="text-base font-semibold">
              {user?.name || "Guest Buyer"}
            </p>
            <p className="text-sm text-green-600">Buyer</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2">
          <NavLink
            to="/buyerdashboard"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeLink : normalLink}`
            }
            onClick={() => setIsOpen(false)}
          >
            <Home size={16} />
            Dashboard
          </NavLink>

          <NavLink
            to="/marketplace"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeLink : normalLink}`
            }
            onClick={() => setIsOpen(false)}
          >
            <Store size={16} />
            Marketplace
          </NavLink>

          <NavLink
            to="/buyercart"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeLink : normalLink}`
            }
            onClick={() => setIsOpen(false)}
          >
            <div className="relative flex items-center gap-3">
              <ShoppingCart size={16} />
              Cart
              {totalItems > 0 && (
                <span className="absolute left-3 -top-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </div>
          </NavLink>

          <NavLink
            to="/buyerorders"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeLink : normalLink}`
            }
            onClick={() => setIsOpen(false)}
          >
            <History size={16} />
            Orders
          </NavLink>
        </nav>

        {/* Footer Section */}
        <div className="mt-6 pt-6 border-t border-gray-200">
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
        message="Are you sure you want to logout from your Buyer account? Your cart will be saved for when you log back in."
        confirmText="Yes, Logout"
        cancelText="Cancel"
        type="warning"
      />
    </>
  );
}
