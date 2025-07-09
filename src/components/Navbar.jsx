import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { Menu, X, Search, ShoppingCart, User } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const location = useLocation();

  const isMarketplace = location.pathname.startsWith("/marketplace");

  const activeLinkStyle =
    "bg-green-600 text-white px-4 py-2 rounded-full shadow-md transition duration-300";
  const normalLinkStyle =
    "text-black hover:text-green-700 px-4 py-2 rounded-full hover:bg-green-100 transition duration-300";

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

      {/* Center: Main Menu (always centered) */}
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

      {/* Right: Icons or Buttons */}
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
            <div className="flex items-center space-x-8">
              <Search
                className="hover:text-green-700 cursor-pointer transition"
                onClick={() => setShowSearch(!showSearch)}
              />
              <ShoppingCart className="hover:text-green-700 cursor-pointer transition" />
              <User className="hover:text-green-700 cursor-pointer transition" />
            </div>
          </div>
        ) : (
          <>
            <NavLink to="/register">
              <button className="bg-green-500 text-white font-bold px-4 py-2 rounded-full shadow-md hover:bg-green-600 transition">
                Register
              </button>
            </NavLink>
            <NavLink to="/Login">
              <button className="bg-white text-black font-bold border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-100 transition">
                Log In
              </button>
            </NavLink>
          </>
        )}
      </div>

      {/* Mobile Right Side Icons and Toggle grouped */}
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
          <ShoppingCart className="hover:text-green-700 cursor-pointer transition" />
          <User className="hover:text-green-700 cursor-pointer transition" />

          {/* Hamburger button moved here to reduce gap */}
          <button onClick={() => setIsOpen(!isOpen)} className="ml-2">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      )}

      {/* Mobile Menu Toggle (for non-marketplace) */}
      {!isMarketplace && (
        <div className="md:hidden z-50">
          <button onClick={() => setIsOpen(!isOpen)}>
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
                <button className="bg-green-500 text-white font-bold px-4 py-2 rounded-full w-full shadow-md hover:bg-green-600 transition">
                  Register
                </button>
              </NavLink>
              <NavLink
                to="/login"
                className="w-4/5"
                onClick={() => setIsOpen(false)}
              >
                <button className="bg-white text-black font-bold border border-gray-300 px-4 py-2 rounded-full w-full hover:bg-gray-100 transition">
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
