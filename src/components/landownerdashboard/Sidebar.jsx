import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, FileText, Handshake, Leaf, Menu, X, ArrowLeftCircle, LogOut} from "lucide-react";
import logo from "../../assets/images/logo.png";
import profilePic from "../../assets/images/profile.png";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const linkBase =
    "flex items-center gap-3 px-4 py-2 rounded-md transition text-sm font-medium";
  const activeLink = "bg-green-100 text-green-700 font-semibold";
  const normalLink = "text-black hover:bg-green-50";

  return (
    <>
      {/* Top Bar for Small Screens */}
      <div className="md:hidden flex items-start bg-white shadow px-4 py-6">
        <button onClick={() => setIsOpen(true)}>
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-sm font-poppins flex flex-col px-4 py-6 z-50 transform transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Logo & Close Icon */}
        <div className="flex items-center justify-between mb-6">
          <NavLink to="/" onClick={() => setIsOpen(false)}>
            <img src={logo} alt="FarmMaster Logo" className="h-20 w-auto" />
          </NavLink>{" "}
          <button
            className="md:hidden text-gray-600 cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* Profile Section */}
        <div className="flex items-center mb-8">
          <img
            src={profilePic}
            alt="Profile"
            className="w-14 h-14 rounded-full object-cover mr-4"
          />
          <div>
            <p className="text-base font-semibold">Nila Perera</p>
            <p className="text-sm text-green-600">Landowner</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2">
          <NavLink
            to="/landownerdashboard"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeLink : normalLink}`
            }
            onClick={() => setIsOpen(false)}
          >
            <Home size={16} />
            Dashboard
          </NavLink>

          <NavLink
            to="/landreport"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeLink : normalLink}`
            }
            onClick={() => setIsOpen(false)}
          >
            <FileText size={16} />
            Land Reports
          </NavLink>

          <NavLink
            to="/leaseproposal"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeLink : normalLink}`
            }
            onClick={() => setIsOpen(false)}
          >
            <Handshake size={16} />
            Proposals
          </NavLink>

          <NavLink
            to="/harvest"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeLink : normalLink}`
            }
            onClick={() => setIsOpen(false)}
          >
            <Leaf size={16} />
            Harvests
          </NavLink>

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
              onClick={() => alert("Logging out...")}
            >
              <LogOut size={16} />
              Log out
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}
