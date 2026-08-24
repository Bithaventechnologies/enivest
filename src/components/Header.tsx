import { useEffect, useState } from "react";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal"; // Import modal component
import Cookies from "js-cookie";
import TickerTape from "./TickerTape";
import logo from "../assets/coinstat_logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [token] = useState<string | undefined>(Cookies.get("authToken"));
  const location = useLocation();

  const menuItems = [
    { title: "Portfolio Tracker", isPrimary: true, path: "portfolio" },
    { title: "Swap", path: "swap" },
    { title: "Cryptocurrencies", path: "allcurrency" },
    { title: "About", path: "about" },
  ];

  const nav = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const showModal =
      queryParams.get("auth") === "true" || queryParams.get("modal") === "1";

    if (showModal && !token) {
      setIsAuthModalOpen(true);
    }
  }, [location.search, token]);

  return (
    <>
      <TickerTape />
      <nav className="fixed top-0 w-full z-50">
        {/* Glassmorphism backdrop */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-lg border-b border-white/10" />

        <div className="relative flex items-center justify-between px-6 py-4">
          {/* Left Side */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-3 text-lg font-bold"
              onClick={() => nav("/")}
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                <img
                  src={logo}
                  alt="EntriVest Cryptography Ledger System"
                  className="w-16 h-w-16"
                />
              </div>
              <p className="text-sm text-gray-400">EntriVest</p>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-6">
              {menuItems.map((item, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className={`px-4 py-2 ${
                    item.isPrimary
                      ? "bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg font-medium"
                      : "text-gray-300 hover:text-white transition-colors"
                  }`}
                  onClick={() => nav(item.path)}
                >
                  {item.title}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <motion.div
            className={`hidden md:flex items-center px-4 py-2.5 rounded-xl border transition-all duration-300 ${
              isSearchFocused
                ? "bg-white/10 border-orange-500/50"
                : "bg-white/5 border-white/10"
            }`}
          >
            <FaSearch
              className={`${
                isSearchFocused ? "text-orange-500" : "text-gray-400"
              }`}
            />
            <input
              type="text"
              placeholder="Search assets, wallets, domains..."
              className="bg-transparent w-64 ml-3 outline-none text-white placeholder-gray-400"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </motion.div>

          {/* Right Side */}
          <div className="flex items-center gap-6">
            {/* <SettingsDropdown /> */}

            {!token ? (
              <div className="hidden md:flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  Login
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-5 py-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg font-medium"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  Get Started
                </motion.button>
              </div>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-5 py-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg font-medium"
                  onClick={() => nav("/user/overview")}
                >
                  Dashboard
                </motion.button>
              </>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="lg:hidden text-white text-xl p-2 hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden absolute top-full left-0 w-full bg-black/90 backdrop-blur-lg border-b border-white/10"
            >
              <div className="flex flex-col p-6 gap-4">
                {menuItems.map((item, index) => (
                  <motion.button
                    onClick={() => nav(item.path)}
                    key={index}
                    whileTap={{ scale: 0.98 }}
                    className={`py-2 px-4 rounded-lg text-center ${
                      item.isPrimary
                        ? "bg-gradient-to-r from-orange-500 to-pink-500 font-medium"
                        : "text-gray-300 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {item.title}
                  </motion.button>
                ))}

                {!token ? (
                  <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsAuthModalOpen(true)}
                      className="py-2 text-gray-300 hover:text-white transition-colors"
                    >
                      Login
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      className="py-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg font-medium"
                      onClick={() => setIsAuthModalOpen(true)}
                    >
                      Get Started
                    </motion.button>
                  </div>
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="py-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg font-medium"
                    onClick={() => nav("/user/overview")}
                  >
                    Dashboard
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 🟢 Auth Modal (Signup/Login) */}
      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
    </>
  );
};

export default Header;
