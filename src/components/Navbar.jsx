import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { Menu, X, Search, ShoppingCart, User } from "lucide-react";
import { useCart } from "./cart/CartContext"; // ✅ import cart context

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const location = useLocation();
  const { cartItems } = useCart(); // ✅ get cart items from context

  const isMarketplace = location.pathname.startsWith("/marketplace");

  const activeLinkStyle =
    "bg-green-600 text-white px-4 py-2 rounded-full shadow-md transition duration-300";
  const normalLinkStyle =
    "text-black hover:text-green-700 px-4 py-2 rounded-full hover:bg-green-100 transition duration-300";

  const totalItems = cartItems.length;

  return (
    <nav
      style={{ backgroundColor: "#F0FFED" }}
      className="fixed top-0 w-full z-50 py-2 px-6 md:px-12 flex items-center justify-between shadow-sm font-poppins"
    >
      {/* Left: Logo */}
      <div className="flex items-center space-x-2 z-50">
        <NavLink to="/" onClick={() => setIsOpen(false)}>
          <img src={logo} alt="FarmMaster Logo" className="h-20 w-auto" />
        </NavLink>
      </div>

      {/* Center: Main Menu */}
      <ul
        className="hidden md:flex space-x-6 font-semibold text-lg items-center absolute left-1/2 transform -translate-x-1/2"
        style={{ pointerEvents: isOpen ? "none" : "auto" }}
      >
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? activeLinkStyle : normalLinkStyle
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/marketplace"
            className={({ isActive }) =>
              isActive ? activeLinkStyle : normalLinkStyle
            }
          >
            Marketplace
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? activeLinkStyle : normalLinkStyle
            }
          >
            About
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? activeLinkStyle : normalLinkStyle
            }
          >
            Contact
          </NavLink>
        </li>
      </ul>

      {/* Right: Icons */}
      <div className="hidden md:flex items-center space-x-4 z-50">
        {isMarketplace ? (
          <div className="flex items-center space-x-6">
            {showSearch && (
              <input
                type="text"
                placeholder="Search products..."
                className="border border-gray-300 rounded-full px-4 py-1 w-48 outline-none focus:ring-2 focus:ring-green-300 transition duration-300"
              />
            )}
            <div className="flex items-center space-x-8 relative">
              <Search
                className="hover:text-green-700 cursor-pointer transition"
                onClick={() => setShowSearch(!showSearch)}
              />

              {/* ✅ Cart Icon with Badge */}
              <NavLink to="/buyercart" className="relative">
                <ShoppingCart className="hover:text-green-700 cursor-pointer transition" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </NavLink>

              <User className="hover:text-green-700 cursor-pointer transition" />
            </div>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>

      {/* Mobile Right Side Icons */}
      {isMarketplace && (
        <div className="flex md:hidden items-center space-x-3 z-50">
          {showSearch && (
            <input
              type="text"
              placeholder="Search products..."
              className="border border-gray-300 rounded-full px-4 py-1 w-40 outline-none focus:ring-2 focus:ring-green-300 transition duration-300"
            />
          )}
          <Search
            className="hover:text-green-700 cursor-pointer transition"
            onClick={() => setShowSearch(!showSearch)}
          />

          {/* ✅ Cart Icon with Badge */}
          <NavLink to="/buyercart" className="relative">
            <ShoppingCart className="hover:text-green-700 cursor-pointer transition" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </NavLink>

          <User className="hover:text-green-700 cursor-pointer transition" />

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="ml-2 cursor-pointer"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      )}

      {/* Mobile Menu Toggle */}
      {!isMarketplace && (
        <div className="md:hidden z-50">
          <button onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      )}

      {/* Mobile Menu Items */}
      {isOpen && (
        <div className="absolute top-20 left-0 w-full bg-green-50 shadow-md flex flex-col items-center space-y-4 py-4 md:hidden z-40">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? activeLinkStyle : normalLinkStyle
            }
            onClick={() => setIsOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/marketplace"
            className={({ isActive }) =>
              isActive ? activeLinkStyle : normalLinkStyle
            }
            onClick={() => setIsOpen(false)}
          >
            Marketplace
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? activeLinkStyle : normalLinkStyle
            }
            onClick={() => setIsOpen(false)}
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? activeLinkStyle : normalLinkStyle
            }
            onClick={() => setIsOpen(false)}
          >
            Contact
          </NavLink>

          {!isMarketplace && (
            <>
              <NavLink
                to="/register"
                className="w-4/5"
                onClick={() => setIsOpen(false)}
              >
                <button className="bg-green-500 text-white font-bold px-4 py-2 rounded-full w-full shadow-md hover:bg-green-600 transition cursor-pointer">
                  Register
                </button>
              </NavLink>
              <NavLink
                to="/login"
                className="w-4/5"
                onClick={() => setIsOpen(false)}
              >
                <button className="bg-white text-black font-bold border border-gray-300 px-4 py-2 rounded-full w-full hover:bg-gray-100 transition cursor-pointer">
                  Log In
                </button>
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
