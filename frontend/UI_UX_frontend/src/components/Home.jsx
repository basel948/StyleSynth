import React, { useState } from "react";
import { Menu, Camera, Image } from "lucide-react";
import Sidebar from "./Sidebar";
import "./fonts.css";
import "./background.css";

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="relative h-screen w-full bg-container overflow-hidden">
      {/* Background elements */}
      <div className="background-design">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
        <div className="circle circle-4"></div>
      </div>

      {/* Main content */}
      <div className="flex flex-col h-screen w-full items-center justify-center gap-8 z-10 relative">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-2 font-heading drop-shadow-sm">
          Classify Your Face Shape
        </h1>

        {/* Subtitle */}
        <p className="text-gray-700 text-center max-w-md mb-6 font-subheading px-4">
          Choose a method to analyze your face shape and get personalized
          hairstyle recommendations
        </p>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-6">
          <button className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg shadow-lg transform transition-all hover:scale-105 hover:shadow-xl w-64 font-button">
            <Camera size={24} />
            <span className="font-medium">Live Webcam</span>
          </button>

          <button className="flex items-center justify-center gap-3 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg shadow-lg transform transition-all hover:scale-105 hover:shadow-xl w-64 font-button">
            <Image size={24} />
            <span className="font-medium">Via Images</span>
          </button>
        </div>
      </div>

      {/* Sidebar toggle button */}
      <button
        className="absolute top-4 left-4 z-30 bg-gray-900 bg-opacity-70 backdrop-blur-sm text-white p-2 rounded-md hover:bg-gray-800 transition-colors"
        onClick={toggleSidebar}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar component */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onToggle={toggleSidebar}
      />
    </div>
  );
};

export default Home;
