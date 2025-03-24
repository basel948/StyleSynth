import React from "react";
import {
  Menu,
  X,
  User,
  Settings,
  Home as HomeIcon,
  HelpCircle,
  Scissors,
} from "lucide-react";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen, onClose, onToggle }) => {
  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gray-900 bg-opacity-95 backdrop-blur-md text-white shadow-lg transition-all duration-300 ease-in-out z-20 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      <div className="flex flex-col h-full p-4">
        {/* Top Section */}
        <div>
          <div className="flex items-center justify-between">
            <button
              className={`text-white hover:text-gray-300 transition-opacity duration-300 ${
                isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              onClick={onToggle}
            >
              <X size={24} />
            </button>
          </div>

          <div className="mt-8">
            <ul className="space-y-4 font-subheading">
              <li className="hover:bg-gray-800 p-2 rounded cursor-pointer flex items-center gap-3 text-white">
                <Link to="/" className="flex items-center gap-3 w-full">
                  <HomeIcon size={20} /> {isOpen && <span>Dashboard</span>}
                </Link>
              </li>
              <li className="hover:bg-gray-800 p-2 rounded cursor-pointer flex items-center gap-3 text-white">
                <Link
                  to="/manual-tryon"
                  className="flex items-center gap-3 w-full"
                >
                  <Scissors size={20} />
                  {isOpen && <span>Manual Try On</span>}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        {/* Bottom Section */}
        <div className="mt-auto">
          {/* Separator */}
          <div className="border-t border-gray-700 my-4"></div>
          <ul className="space-y-4 font-subheading">
            <li className="hover:bg-gray-800 p-2 rounded cursor-pointer flex items-center gap-3 text-white">
              <User size={20} />
              {isOpen && <span>Profile</span>}
            </li>
            <li className="hover:bg-gray-800 p-2 rounded cursor-pointer flex items-center gap-3 text-white">
              <Settings size={20} />
              {isOpen && <span>Settings</span>}
            </li>
            <li className="hover:bg-gray-800 p-2 rounded cursor-pointer flex items-center gap-3 text-white">
              <HelpCircle size={20} />
              {isOpen && <span>Help</span>}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
