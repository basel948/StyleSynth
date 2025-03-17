import React from "react";
import { Menu, Settings, User, Home, HelpCircle } from "lucide-react";

const IconDebug = () => {
  return (
    <div className="p-4 flex gap-4">
      <Menu size={24} />
      <Settings size={24} />
      <User size={24} />
      <Home size={24} />
      <HelpCircle size={24} />
    </div>
  );
};

export default IconDebug;
