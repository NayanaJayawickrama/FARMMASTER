import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { Menu, X, Search, ShoppingCart, User } from "lucide-react";
import { useCart } from "./cart/CartContext";
import { useAuth } from "../context/AuthContext";
import { useSearch } from "../context/SearchContext";
import ConfirmationModal from "./ConfirmationModal";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [tempSearchQuery, setTempSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  const { searchQuery, updateSearchQuery, clearSearch } = useSearch();

  const isMarketplace = location.pathname.startsWith("/marketplace");

  const roleToPath = {
    Landowner: "/landownerdashboard",
    Supervisor: "/fieldsupervisordashboard",
    Buyer: "/buyerdashboard",
    "Operational Manager": "/operationalmanagerdashboard",
    "Financial Manager": "/financialmanagerdashboard",
  };

  const profilePath = user ? roleToPath[user.role] || "/profile" : "/login";

  const activeLinkStyle =
    "bg-green-600 text-white px-4 py-2 rounded-full shadow-md transition duration-300";
  const normalLinkStyle =
    "text-black hover:text-green-700 px-4 py-2 rounded-full hover:bg-green-100 transition duration-300";

  const totalItems = cartItems.length;

  const handleCartClick = (e) => {
    e.preventDefault();
    if (!user || user.role !== "Buyer") {
      setShowPopup(true);
    } else {
      navigate("/buyercart");
    }
  };

  const handleLogout = async () => {
    try {
      console.log("Navbar logout initiated...");
      await logout();
      console.log("Navbar logout successful, navigating to home...");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Navbar logout failed:", error);
      // Still navigate to home even if logout fails
      navigate("/", { replace: true });
    } finally {
      setShowLogoutModal(false);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateSearchQuery(tempSearchQuery);
    // Scroll to vegetables section
    const vegetablesSection = document.getElementById('vegetables');
    if (vegetablesSection) {
      vegetablesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setTempSearchQuery(value);
    // Real-time search - update search query as user types
    updateSearchQuery(value);
  };

  const handleSearchToggle = () => {
    // If search bar is open and there's text, perform search instead of closing
    if (showSearch && tempSearchQuery.trim()) {
      updateSearchQuery(tempSearchQuery);
      // Scroll to vegetables section
      const vegetablesSection = document.getElementById('vegetables');
      if (vegetablesSection) {
        vegetablesSection.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    
    // Otherwise toggle search bar visibility
    setShowSearch(!showSearch);
    if (showSearch) {
      // When closing search, clear the search
      setTempSearchQuery('');
      clearSearch();
    }
  };

  return (
    <nav
      style={{ backgroundColor: "#F0FFED" }}
      className="fixed top-0 w-full z-50 py-2 px-6 md:px-12 flex items-center justify-between shadow-sm font-poppins"
    >
      
      <div className="flex items-center space-x-2 z-50">
        <NavLink to="/" onClick={() => setIsOpen(false)}>
          <img src={logo} alt="FarmMaster Logo" className="h-20 w-auto" />
        </NavLink>
      </div>

    
      <ul
        className="hidden md:flex space-x-6 font-semibold text-lg items-center absolute left-1/2 transform -translate-x-1/2"
        style={{ pointerEvents: isOpen ? "none" : "auto" }}
      >
        {["/", "/marketplace", "/about", "/contact"].map((path, index) => (
          <li key={index}>
            <NavLink
              to={path}
              className={({ isActive }) =>
                isActive ? activeLinkStyle : normalLinkStyle
              }
            >
              {path === "/"
                ? "Home"
                : path.charAt(1).toUpperCase() + path.slice(2)}
            </NavLink>
          </li>
        ))}
      </ul>

      
      {/* Desktop Search */}
      <div className="hidden md:flex items-center space-x-6 z-50">
        {isMarketplace && (
          <>
            {showSearch && (
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  type="text"
                  value={tempSearchQuery}
                  onChange={handleSearchInputChange}
                  placeholder="Search products..."
                  className="border border-gray-300 rounded-full px-4 py-1 w-48 outline-none focus:ring-2 focus:ring-green-300 transition duration-300"
                  autoFocus
                />
              </form>
            )}
            <Search
              className={`cursor-pointer transition ${
                showSearch && tempSearchQuery.trim() 
                  ? 'text-green-600 hover:text-green-800' 
                  : 'hover:text-green-700'
              }`}
              onClick={handleSearchToggle}
              title={showSearch && tempSearchQuery.trim() ? 'Search products' : 'Toggle search'}
            />
            <button onClick={handleCartClick} className="relative">
              <ShoppingCart className="hover:text-green-700 cursor-pointer transition" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </>
        )}
        {user ? (
          <div className="flex items-center space-x-4">
            <NavLink to={profilePath} className="text-green-700 hover:underline">
              <User />
            </NavLink>
            <button
              onClick={handleLogoutClick}
              className="bg-white text-black font-bold border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <NavLink to="/register">
              <button className="bg-green-500 text-white font-bold px-4 py-2 rounded-full shadow-md hover:bg-green-600 transition cursor-pointer">
                Register
              </button>
            </NavLink>
            <NavLink to="/login">
              <button className="bg-white text-black font-bold border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-100 transition cursor-pointer">
                Log In
              </button>
            </NavLink>
          </div>
        )}
      </div>

      
      {/* Mobile Search */}
      <div className="flex md:hidden items-center space-x-5 z-50">
        {isMarketplace && (
          <>
            {showSearch && (
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  type="text"
                  value={tempSearchQuery}
                  onChange={handleSearchInputChange}
                  placeholder="Search products..."
                  className="border border-gray-300 rounded-full px-4 py-1 w-40 outline-none focus:ring-2 focus:ring-green-300 transition duration-300"
                  autoFocus
                />
              </form>
            )}
            <Search
              className={`cursor-pointer transition ${
                showSearch && tempSearchQuery.trim() 
                  ? 'text-green-600 hover:text-green-800' 
                  : 'hover:text-green-700'
              }`}
              onClick={handleSearchToggle}
              title={showSearch && tempSearchQuery.trim() ? 'Search products' : 'Toggle search'}
            />
            <button onClick={handleCartClick} className="relative">
              <ShoppingCart className="hover:text-green-700 cursor-pointer transition" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </>
        )}
        <NavLink to={user ? profilePath : "/login"} className="text-green-700">
          <User />
        </NavLink>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="ml-2 cursor-pointer"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

    
      {isOpen && (
        <div className="absolute top-20 left-0 w-full bg-green-50 shadow-md flex flex-col items-center space-y-4 py-4 md:hidden z-40">
          {["/", "/marketplace", "/about", "/contact"].map((path, index) => (
            <NavLink
              key={index}
              to={path}
              className={({ isActive }) =>
                isActive ? activeLinkStyle : normalLinkStyle
              }
              onClick={() => setIsOpen(false)}
            >
              {path === "/"
                ? "Home"
                : path.charAt(1).toUpperCase() + path.slice(2)}
            </NavLink>
          ))}
          {user ? (
            <button
              onClick={() => {
                handleLogoutClick();
                setIsOpen(false);
              }}
              className="bg-white text-black font-bold border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
            >
              Logout
            </button>
          ) : (
            <div className="flex flex-col items-center space-y-2 w-4/5">
              <NavLink
                to="/register"
                onClick={() => setIsOpen(false)}
                className="w-full"
              >
                <button className="bg-green-500 text-white font-bold px-4 py-2 rounded-full w-full shadow-md hover:bg-green-600 transition cursor-pointer">
                  Register
                </button>
              </NavLink>
              <NavLink
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full"
              >
                <button className="bg-white text-black font-bold border border-gray-300 px-4 py-2 rounded-full w-full hover:bg-gray-100 transition cursor-pointer">
                  Log In
                </button>
              </NavLink>
            </div>
          )}
        </div>
      )}

      
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-[999]">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center border border-green-600">
            <h2 className="text-lg font-bold mb-2 text-gray-800">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-4">
              Only registered buyers can access the cart.
            </p>
            <div className="flex justify-center gap-4">
              {!user && (
                <button
                  onClick={() => {
                    navigate("/register");
                    setShowPopup(false);
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  Go to Register
                </button>
              )}
              <button
                onClick={() => setShowPopup(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout? You will be redirected to the home page and will need to login again to access your dashboard."
        confirmText="Yes, Logout"
        cancelText="Cancel"
        type="warning"
      />
    </nav>
  );
}
