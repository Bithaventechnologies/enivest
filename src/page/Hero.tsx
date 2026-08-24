import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import SearchInput from "../components/Searchinput";
import Binace from "../assets/binance_dark.png";
import trust from "../assets/trust_dark.png";
import coinbase from "../assets/coinbase_dark.png";
import others from "../assets/others.svg";

// import others from "../assets/others.svg";
import { useNavigate } from "react-router-dom";
import Others from "./Connect/Others";
import { OtherWallet } from "./portfolio";

interface Wallet {
  name: string;
  image: string;
  path?: string;
}

const wallets: Wallet[] = [
  { name: "Binance", image: Binace, path: "/connect/binance" },
  { name: "TrustWallet", image: trust, path: "/connect/trustWallet" },
  { name: "Coinbase", image: coinbase, path: "/connect/coinbase" },
  { name: "More", image: others, path: "#" },
];

const Hero: React.FC = () => {
  const nav = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
      {/* Gradient Orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500/30 rounded-full filter blur-[120px] opacity-20" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-500/30 rounded-full filter blur-[120px] opacity-20" />

      {/* Main Content */}
      <div className="relative container mx-auto px-6 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            The Global Banking System Is Being Rewritten
          </motion.h1>

          <motion.p
            className="text-xl text-gray-400 mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            This isn't about hype or speculation. It's about discipline,
            structure, and long-term positioning.
            <br />
            <br />
            The{" "}
            <span className="text-orange-400 font-medium">
              EntriVest Cryptography Ledger System
            </span>{" "}
            was built to help individuals secure wealth, outpace inflation, and
            prepare for the next monetary era — with protection first,
            consistency second, and strategy always.
          </motion.p>

          <p className="mt-6 text-orange-400 font-semibold tracking-wide mb-4">
            Get your shit together
          </p>

          {/* Search Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-16 w-full flex justify-center items-center"
          >
            <SearchInput />
          </motion.div>

          {/* Wallets Grid */}
          <div className=" flex flex-wrap justify-center sm:grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {wallets.map((wallet, index) => (
              <motion.div
                key={wallet.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-6 
                          border border-gray-800 hover:border-orange-500/50
                          shadow-lg hover:shadow-orange-500/20
                          transition-all duration-300"
                onClick={() => {
                  if (wallet.name === "More") {
                    setIsOpen(true);
                  } else {
                    if (wallet.path) {
                      nav(wallet.path);
                    }
                  }
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-orange-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative space-y-4">
                  <div className="h-20 flex items-center justify-center">
                    <img
                      src={wallet.image}
                      alt={wallet.name}
                      className="w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  <p className="text-gray-300 font-medium">{wallet.name}</p>

                  <button className="flex items-center justify-center gap-2 text-orange-400 hover:text-orange-300 transition-colors group">
                    <span>Connect</span>
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-20 grid grid-cols-3 gap-8"
          >
            {[
              { label: "Total Value Locked", value: "$1.2B+" },
              { label: "Active Users", value: "100K+" },
              { label: "Supported Chains", value: "20+" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-400 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {isOpen && (
          <Others onClose={() => setIsOpen(false)} otherWallets={OtherWallet} />
        )}
      </div>
    </section>
  );
};

export default Hero;
