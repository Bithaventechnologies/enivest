import React, { useState } from "react";
import { FaCog, FaMoon, FaSun } from "react-icons/fa";

const SettingsDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="relative z-30">
      {/* Settings Icon */}
      <button
        onClick={toggleDropdown}
        className="relative p-2 rounded-full bg-gray-800 hover:bg-gray-700"
      >
        <FaCog className="text-white text-lg" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-gray-900 text-white shadow-lg rounded-lg p-3">
          {/* Theme Toggle */}
          <div
            className="flex justify-between items-center py-2 cursor-pointer"
            onClick={toggleTheme}
          >
            <span>Theme</span>
            <div className="flex items-center">
              {darkMode ? (
                <FaMoon className="text-orange-400" />
              ) : (
                <FaSun className="text-yellow-400" />
              )}
              <div
                className={`ml-2 w-10 h-5 flex items-center bg-gray-600 rounded-full p-1 transition-all duration-300 ${
                  darkMode ? "justify-end" : "justify-start"
                }`}
              >
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Language Option */}
          {/* <div className="flex justify-between items-center py-2 cursor-pointer hover:bg-gray-800 rounded-md px-2">
            <span>Language</span>
            <FaLanguage />
            <span className="ml-auto">English</span>
          </div> */}

          {/* Currency Option */}
          {/* <div className="flex justify-between items-center py-2 cursor-pointer hover:bg-gray-800 rounded-md px-2">
            <span>Currency</span>
            <FaFlagUsa />
            <span className="ml-auto">USD</span>
          </div> */}
        </div>
      )}
    </div>
  );
};

export default SettingsDropdown;
