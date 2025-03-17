import React from "react";
import {
  Menu,
  X,
  User,
  Settings,
  Home as HomeIcon,
  HelpCircle,
} from "lucide-react";

const Sidebar = ({ isOpen, onClose, onToggle }) => {
  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gray-900 bg-opacity-95 backdrop-blur-md text-white shadow-lg transition-all duration-300 ease-in-out z-20 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      <div className="p-4">
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

        {/* Sidebar content */}
        <div className="mt-8">
          <ul className="space-y-4 font-subheading">
            <li className="hover:bg-gray-800 p-2 rounded cursor-pointer flex items-center gap-3 text-white">
              <HomeIcon size={20} />
              <span
                className={`transition-opacity duration-300 ${
                  isOpen ? "opacity-100" : "opacity-0"
                }`}
              >
                Dashboard
              </span>
            </li>
            <li className="hover:bg-gray-800 p-2 rounded cursor-pointer flex items-center gap-3 text-white">
              <User size={20} />
              <span
                className={`transition-opacity duration-300 ${
                  isOpen ? "opacity-100" : "opacity-0"
                }`}
              >
                Profile
              </span>
            </li>
            <li className="hover:bg-gray-800 p-2 rounded cursor-pointer flex items-center gap-3 text-white">
              <Settings size={20} />
              <span
                className={`transition-opacity duration-300 ${
                  isOpen ? "opacity-100" : "opacity-0"
                }`}
              >
                Settings
              </span>
            </li>
            <li className="hover:bg-gray-800 p-2 rounded cursor-pointer flex items-center gap-3 text-white">
              <HelpCircle size={20} />
              <span
                className={`transition-opacity duration-300 ${
                  isOpen ? "opacity-100" : "opacity-0"
                }`}
              >
                Help
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
