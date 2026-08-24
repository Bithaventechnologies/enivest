import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import SearchInput from "../components/Searchinput";

import Binace from "../assets/binance_dark.png";
import trust from "../assets/trust_dark.png";
import coinbase from "../assets/coinbase_dark.png";
import others from "../assets/others.svg";

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

/* ----------------------------------
   Animation Variants
---------------------------------- */

const containerVariants = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 35,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const walletContainerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const walletVariants = {
  hidden: {
    opacity: 0,
    y: 35,
    scale: 0.96,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const Hero: React.FC = () => {
  const nav = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
      {/* Gradient Orbs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.2, scale: 1 }}
        transition={{
          duration: 1.5,
          ease: "easeOut",
        }}
        className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500/30 rounded-full filter blur-[120px]"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.2, scale: 1 }}
        transition={{
          duration: 1.5,
          delay: 0.2,
          ease: "easeOut",
        }}
        className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-500/30 rounded-full filter blur-[120px]"
      />

      {/* Main Content */}
      <div className="relative container mx-auto px-6 pt-20 pb-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="max-w-4xl mx-auto text-center"
        >
          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent"
          >
            The Global Banking System Is Being Rewritten
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-400 mb-8 leading-relaxed"
          >
            This isn't about hype or speculation. It's about discipline,
            structure, and long-term positioning.

            <br />
            <br />

            The{" "}
            <span className="text-orange-400 font-medium">
              EntriVest Cryptography Ledger System
            </span>{" "}
            was built to help individuals secure wealth, outpace inflation,
            and prepare for the next monetary era — with protection first,
            consistency second, and strategy always.
          </motion.p>

          {/* Tagline */}
          <motion.p
            variants={itemVariants}
            className="mt-4 text-orange-400 font-semibold tracking-wide mb-8"
          >
            Get your shit together
          </motion.p>

          {/* Search */}
          <motion.div
            variants={itemVariants}
            className="mb-16 w-full flex justify-center items-center"
          >
            <SearchInput />
          </motion.div>

          {/* Wallets */}
          <motion.div
            variants={walletContainerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-wrap justify-center sm:grid sm:grid-cols-2 md:grid-cols-4 gap-6"
          >
            {wallets.map((wallet) => (
              <motion.div
                key={wallet.name}
                variants={walletVariants}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  transition: {
                    duration: 0.25,
                  },
                }}
                whileTap={{
                  scale: 0.98,
                }}
                className="group relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-orange-500/50 shadow-lg hover:shadow-orange-500/20 transition-all duration-300 cursor-pointer"
                onClick={() => {
                  if (wallet.name === "More") {
                    setIsOpen(true);
                    return;
                  }

                  if (wallet.path) {
                    nav(wallet.path);
                  }
                }}
              >
                {/* Hover Glow */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-transparent to-orange-500/5 rounded-2xl"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />

                <div className="relative space-y-4">
                  {/* Wallet Image */}
                  <div className="h-20 flex items-center justify-center">
                    <motion.img
                      src={wallet.image}
                      alt={wallet.name}
                      className="w-16 h-16 object-contain"
                      whileHover={{
                        scale: 1.15,
                        rotate: 3,
                      }}
                      transition={{
                        duration: 0.3,
                        ease: "easeOut",
                      }}
                    />
                  </div>

                  {/* Wallet Name */}
                  <p className="text-gray-300 font-medium">
                    {wallet.name}
                  </p>

                  {/* Connect */}
                  <motion.button
                    className="flex items-center justify-center gap-2 text-orange-400 hover:text-orange-300 transition-colors group/connect"
                    whileHover={{ x: 3 }}
                  >
                    <span>Connect</span>

                    <FiArrowRight className="group-hover/connect:translate-x-1 transition-transform" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8"
          >
            {[
              {
                label: "Total Value Locked",
                value: "$1.2B+",
              },
              {
                label: "Active Users",
                value: "100K+",
              },
              {
                label: "Supported Chains",
                value: "20+",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 1.6 + index * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{
                  y: -4,
                  transition: {
                    duration: 0.2,
                  },
                }}
                className="text-center"
              >
                <p className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-transparent">
                  {stat.value}
                </p>

                <p className="text-sm text-gray-400 mt-2">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Others Modal */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.25,
              }}
              className="fixed inset-0 z-50"
            >
              <Others
                onClose={() => setIsOpen(false)}
                otherWallets={OtherWallet}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Hero;