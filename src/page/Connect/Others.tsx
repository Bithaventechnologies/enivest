import React, { useState, useEffect, useRef } from "react";
import { FiSearch, FiX } from "react-icons/fi";

interface Wallet {
  name: string;
  icon: string;
  category: string;
  path: string;
  link?: string;
}

type OthersProps = {
  onClose: () => void;
  otherWallets: {
    name: string;
    img: string;
    path: string;
    icon: string;
    category: string;
    link?: string;
  }[];
};

const Others: React.FC<OthersProps> = ({ onClose, otherWallets }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [filteredWallets, setFilteredWallets] = useState(otherWallets);
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Get unique categories
  // const categories = Array.from(
  //   new Set(otherWallets.map((wallet) => wallet.category))
  // );

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }

    // Close modal when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    let filtered = otherWallets;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((wallet) =>
        wallet.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (activeCategory) {
      filtered = filtered.filter(
        (wallet) => wallet.category === activeCategory
      );
    }

    setFilteredWallets(filtered);
  }, [searchTerm, activeCategory, otherWallets]);

  const handleWalletClick = (wallet: Wallet) => {
    setConnectingWallet(wallet.name);
    console.log("testiiiiiiiiiiiiiiiiiii");

    // Simulate connection process
    // setTimeout(() => {
    setConnectingWallet(null);
    console.log(`Connected to: ${wallet.path}`);
    // Navigate or perform action
    window.location.href = wallet.path;
    onClose();
    // }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-opacity-70 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div
        ref={modalRef}
        className="bg-[#1A1A1A] mt-16 rounded-xl border border-purple-500/30 shadow-lg shadow-purple-500/20 p-6 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Connect Wallet</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            ref={searchInputRef}
            className="bg-gray-800 w-full text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-transparent"
            placeholder="Search wallets and exchanges"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category filter */}
        <div className="flex space-x-2 mb-4 overflow-x-auto py-2 scrollbar-hide">
          <button
            className={`px-3 py-1.5 rounded-full text-sm flex-shrink-0 transition-colors duration-200 ${
              activeCategory === null
                ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
            onClick={() => setActiveCategory(null)}
          >
            All
          </button>
          {/* {categories.map((category) => (
            <button
              key={category}
              className={`px-3 py-1.5 rounded-full text-sm flex-shrink-0 transition-colors duration-200 ${
                activeCategory === category
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))} */}
        </div>

        {/* Wallet grid layout */}
        <div className="overflow-y-auto max-h-60 rounded-lg border border-gray-700 bg-black p-2 hide-scrollbar">
          {filteredWallets.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
              {filteredWallets.map((wallet) => (
                <div
                  key={wallet.name}
                  className={`p-3 hover:bg-gray-700/50 cursor-pointer transition-all duration-200 rounded-lg border border-gray-700 ${
                    connectingWallet === wallet.name
                      ? "bg-gray-700/70"
                      : "bg-gray-800/30"
                  }`}
                >
                  <button
                    className="w-full h-full"
                    onClick={() => handleWalletClick(wallet as Wallet)}
                    disabled={connectingWallet !== null}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-full bg-black p-1.5 flex items-center justify-center mb-2 overflow-hidden">
                        <img
                          src={wallet.img}
                          alt={wallet.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm truncate w-full">
                          {wallet.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate w-full capitalize">
                          {wallet.category}
                        </p>
                      </div>

                      {connectingWallet === wallet.name && (
                        <div className="h-4 w-4 mt-2 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                      )}
                    </div>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-gray-400">
              <p>No wallets found matching your search.</p>
              <p className="text-sm mt-1">
                Try a different search term or category.
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 text-center text-xs text-gray-500">
          <p>
            By connecting a wallet, you agree to our Terms of Service and
            Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Others;
