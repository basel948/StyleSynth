import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import LiveTryOn from "./components/LiveTryOn";
import Sidebar from "./components/Sidebar";
import { Menu } from "lucide-react";

function App() {
  // Set default state to closed
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="flex min-h-screen">
      {/* Global Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      {/* Main Content Area */}
      <div className="flex-grow p-4 overflow-y-auto relative">
        {/* Hamburger button to toggle Sidebar */}
        <button
          className="absolute top-4 left-4 z-30 bg-gray-900 bg-opacity-70 backdrop-blur-sm text-white p-2 rounded-md hover:bg-gray-800 transition-colors"
          onClick={toggleSidebar}
        >
          <Menu size={24} />
        </button>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/manual-tryon" element={<LiveTryOn />} />
          {/* Add more routes here as needed */}
        </Routes>
      </div>
    </div>
  );
}

export default App;
