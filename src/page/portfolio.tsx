/* eslint-disable react-refresh/only-export-components */
import { motion } from "framer-motion";

type Wallet = {
  name: string;
  img: string;
  path: string;
  icon: string;
  category: string;
  link?: string;
};
import Binace from "../assets/binance_dark.png";
import coinbase from "../assets/coinbase_dark.png";
import others from "../assets/others.svg";
import backgroundVideo from "../assets/portfolio-landing-intro-video.webm";
import phonemock from "../assets/portfolio-total-asset-banner.avif";
import existstrategy from "../assets/exit-strategy.avif";
import { useNavigate } from "react-router-dom";
import bybit from "../assets/bybit_dark.png";
import bitget from "../assets/bitget_dark.png";
import trustWallet from "../assets/trust_dark.png";
import exodus from "../assets/exodus_dark.png";
import phontom from "../assets/phantom_dark.png";
import kucoin from "../assets/kucoin_dark.png";
import mexc from "../assets/mexcglobal_dark.png";
import okx from "../assets/okex_dark.png";
import blofin from "../assets/blofin_dark.png";

const wallets = [
  {
    name: "Binance",
    img: Binace,
    path: "/connect/binance",
    icon: "binance-icon",
    category: "exchange",
    link: "https://www.binance.com",
  },
  { name: "TrustWallet", img: trustWallet, path: "/connect/trustWallet" },

  {
    name: "Coinbase (Individual)",
    img: coinbase,
    path: "/connect/coinbase",
    icon: "coinbase-icon",
    category: "exchange",
    link: "https://www.coinbase.com",
  },
  {
    name: "More",
    img: others,
    icon: "others-icon",
    category: "other",
    link: "#",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.15, duration: 0.5, ease: "easeOut" },
  }),
};

export const OtherWallet: Wallet[] = [
  {
    name: "Bybit",
    img: bybit,
    path: "/connect/bybit",
    icon: "binance-icon",
    category: "exchange",
  },
  {
    name: "Binance",
    img: Binace,
    path: "/connect/binance",
    icon: "binance-icon",
    category: "exchange",
  },
  {
    name: "Coinbase",
    img: coinbase,
    path: "/connect/coinbase",
    icon: "binance-icon",
    category: "exchange",
  },
  {
    name: "Bitget",
    img: bitget,
    path: "/connect/bitgit",
    icon: "binance-icon",
    category: "exchange",
  },
  {
    name: "Phantom",
    img: phontom,
    path: "/connect/phatom",
    icon: "binance-icon",
    category: "exchange",
  },
  {
    name: "Kucoin",
    img: kucoin,
    path: "/connect/kucoin",
    icon: "binance-icon",
    category: "exchange",
  },
  {
    name: "MEXC",
    img: mexc,
    path: "/connect/mexc",
    icon: "binance-icon",
    category: "exchange",
  },
  {
    name: "OKX",
    img: okx,
    path: "/connect/okwallet",
    icon: "binance-icon",
    category: "exchange",
  },
  {
    name: "Blofin",
    img: blofin,
    path: "/connect/blofin",
    icon: "binance-icon",
    category: "exchange",
  },
  {
    name: "TrustWallet",
    img: trustWallet,
    path: "/connect/trustWallet",
    icon: "binance-icon",
    category: "exchange",
  },
  {
    name: "Exodus",
    img: exodus,
    path: "/connect/exodus",
    icon: "binance-icon",
    category: "exchange",
  },
  {
    name: "BingX",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQol_rzdCIrM9zcwVzSv5mDX0Lpne77cou-mXlfkUpiztII0fFy-24iCDWLc-ZXYruvK1o&usqp=CAU",
    path: "/connect/bingx",
    icon: "binance-icon",
    category: "exchange",
  },
  {
    name: "Phemex",
    img: "https://s1.coincarp.com/logo/1/phemex.png?style=200&v=1701501621",
    path: "/connect/phemex",
    icon: "binance-icon",
    category: "exchange",
  },
  {
    name: "Kraken",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbfVZmxs6cBknPlLnAQqk_X4AH9Ew3iP-t1BgfuIClIYPnSYAbllvHqQ880ENoCgYRNmg&usqp=CAU",
    path: "/connect/kraken",
    icon: "binance-icon",
    category: "exchange",
  },
  {
    name: "Gate",
    img: "data:image/png;base64,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",
    path: "/connect/gate",
    icon: "binance-icon",
    category: "exchange",
  },
  {
    name: "Bitrue",
    img: "data:image/jpeg;base64,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",
    path: "/connect/bitrue",
    icon: "binance-icon",
    category: "exchange",
  },
  {
    name: "Bitunix",
    img: "data:image/png;base64,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",
    path: "/connect/bitunix",
    icon: "binance-icon",
    category: "exchange",
  },
  {
    name: "Xrp",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNnjQoGek75tF1K_et9B5sHXEM4xBGUXjSkQ&s",
    path: "/connect/xrp",
    icon: "binance-icon",
    category: "exchange",
  },
];

const Portfolio = () => {
  const [isOpen, setIsOpen] = useState(false);

  const nav = useNavigate();

  return (
    <div className="relative w-full min- flex flex-col items-center text-white ">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src={backgroundVideo} type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/80 backdrop-blur-md" />

      {/* Main Content */}
      <div className="relative flex flex-col items-center text-center px-6 z-10 mt-16">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          The Ultimate Crypto Portfolio Tracker
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-300 mt-4 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Connect all your wallets and exchanges in a few clicks. Start managing
          your entire portfolio - crypto, DeFi, and NFTs - from a single
          dashboard.
        </motion.p>

        {/* Wallet Cards */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
          initial="hidden"
          animate="visible"
        >
          {wallets.map((wallet, index) => (
            <motion.div
              key={wallet.name}
              className="bg-white/10 backdrop-blur-lg border border-white/15 p-6 rounded-2xl shadow-lg flex flex-col items-center text-center hover:scale-105 transition-transform"
              variants={cardVariants}
              custom={index}
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
              <img
                src={wallet.img}
                alt={wallet.name}
                className="w-16 h-16 mb-3"
              />
              <p className="text-lg font-medium">{wallet.name}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 bg-gradient-to-r from-orange-500 to-pink-500 px-5 py-2 rounded-lg font-semibold text-white shadow-lg"
              >
                Connect →
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
        <DeFiAssetsSection />
        <AIExitStrategy />
        <SecurityFeatures />
        <PortfolioTrackerSection />
        {isOpen && (
          <Others onClose={() => setIsOpen(false)} otherWallets={OtherWallet} />
        )}
      </div>
    </div>
  );
};

export default Portfolio;

const DeFiAssetsSection = () => {


  const nav = useNavigate()
  return (
    <motion.div
      className="w-full flex flex-col md:flex-row items-center  text-white py-12 px-6 md:px-16 mt-20 rounded-3xl shadow-xl "
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {/* Right: Phone Mockup */}
      <div className="w-full md:w-1/2 flex justify-center items-center mt-10 md:mt-0">
        <img
          src={phonemock}
          alt="Phone Mockup"
          className="w-64 md:w-80 max-w-sm md:max-w-md"
        />
      </div>

      {/* Right: Text Content */}
      <div className="w-full md:w-1/2 text-center md:text-left">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
          Total DeFi Assets
        </h2>
        <p className="text-gray-400 text-sm mt-2">
          Search for coins and protocols
        </p>

        <motion.h1
          className="text-4xl font-bold leading-tight mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          Track & Manage All Your <br />{" "}
          <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            DeFi Assets
          </span>
        </motion.h1>

        <p className="text-gray-300 text-md mt-4">
          EntriVest Cryptography Ledger System supports over{" "}
          <strong>1,000+ DeFi protocols</strong>, including Uniswap, AAVE,
          Compound, GMX, Curve, SushiSwap, and Lido.
        </p>
        <p className="text-gray-300 text-md mt-2">
          Track your entire DeFi portfolio from a single dashboard and access
          data and analytics for decentralized lending protocols, stablecoins,
          margin trading platforms, and DEXes.
        </p>

        <motion.button
        onClick={()=> nav('/connect/binance')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md"
        >
          Connect Portfolio
        </motion.button>
      </div>
    </motion.div>
  );
};

const AIExitStrategy = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between text-white px-6 md:px-20 py-16 rounded-3xl shadow-lg overflow-hidden">
      {/* Left Content */}
      <motion.div
        className="md:w-1/2 text-center md:text-left"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h1 className="text-4xl font-bold leading-tight">
          Use{" "}
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            AI
          </span>{" "}
          for Your Exit Strategy &{" "}
          <span className="text-orange-400">Price</span>{" "}
          <span className="text-pink-400">Predictions</span> ✨
        </h1>
        <p className="text-gray-300 mt-4 text-lg">
          Exit strategy lets you set up pre-determined sell prices for all your
          crypto assets. This kind of planning will help you avoid making
          emotional decisions and take profits at the right time.
        </p>
        <p className="text-gray-400 mt-4">
          If you're not sure what price targets to set, let our AI help. It uses
          advanced algorithms to offer price estimates based on market history
          and comparison.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md"
        >
          Set up Your Exit Strategy
        </motion.button>
      </motion.div>

      {/* Right Side - Phone Mockup */}
      <motion.div
        className="md:w-1/2 flex justify-center md:justify-end mt-10 md:mt-0"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <img
          src={existstrategy}
          alt="Phone Mockup"
          className="w-72 md:w-96 lg:w-[400px] h-auto drop-shadow-lg"
        />
      </motion.div>
    </div>
  );
};

const SecurityFeatures = () => {
  const features = [
    {
      icon: "🔒",
      title: "Military-Grade Encryption",
      description:
        "We value our users' privacy, so we use the most advanced military-grade encryption to securely store data.",
    },
    {
      icon: "🛡️",
      title: "Secure and Audited",
      description:
        "We're defending against external threats and guarding against misuse of insider access.",
    },
    {
      icon: "⚡",
      title: "Industry Best Practices",
      description:
        "We take the most advanced security measures to ensure that your account is as safe as possible.",
    },
  ];

  return (
    <div className="flex flex-col md:flex-row items-center justify-between w-full mt-6 text-white p-12 rounded-3xl shadow-xl ">
      {/* Left Section - Text */}
      <div className="md:w-1/2 text-left">
        <motion.h2
          className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          The Ultimate Security for Your Digital Assets
        </motion.h2>
        <p className="text-gray-400 text-md mt-4">
          EntriVest Cryptography Ledger System is equipped with a top-quality
          security infrastructure designed to ensure maximum protection of
          assets at all times. Since we ask for read-only access only, your
          holdings are perfectly safe under any conditions.
        </p>
      </div>

      {/* Right Section - Features */}
      <motion.div
        className="md:w-1/2 grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 md:mt-0"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {features.map((feature) => (
          <div
            key={feature.title}
            className="bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-700 text-center hover:shadow-purple-500/30 transition-all"
          >
            <div className="text-3xl mb-4">{feature.icon}</div>
            <h3 className="text-lg font-semibold text-white">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-400 mt-2">{feature.description}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

import { FaCheckCircle } from "react-icons/fa";
import { useState } from "react";
import Others from "./Connect/Others";

const CryptoPortfolioTrackerDescription = () => {
  return (
    <div className="text-white p-6 rounded-xl shadow-lg border border-gray-700">
      <h2 className="text-2xl font-bold mb-4">
        What's a crypto portfolio tracker?
      </h2>
      <p className="text-sm">
        A crypto tracker is a tool or application that helps crypto investors
        track the prices and performance of their crypto assets. Crypto
        portfolio trackers provide real-time updates on the current crypto
        prices, market caps, and other relevant data about cryptocurrencies.
      </p>
      <p className="text-sm mt-2">
        Some crypto trackers also offer features such as price alerts, portfolio
        management, and analysis tools that help crypto investors make informed
        decisions. Many crypto trackers allow users to monitor multiple
        exchanges simultaneously, providing a comprehensive overview of the
        cryptocurrency market.
      </p>
    </div>
  );
};

const PortfolioTrackerFeatures = () => {
  const features = [
    "Integration with many wallets and exchanges",
    "Real-time tracking & advanced alerts",
    "An intuitive interface",
    "Top-notch security",
    "In-depth analytics",
    "Fair cost",
  ];

  return (
    <div className="text-white p-6 rounded-xl shadow-lg border border-gray-700">
      <h2 className="text-2xl font-bold mb-4">
        What to look for in a good portfolio tracker?
      </h2>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="text-sm flex items-center">
            <FaCheckCircle className="text-pink-400 mr-2" /> {feature}
          </li>
        ))}
      </ul>
    </div>
  );
};

const PortfolioTrackerSection = () => {
  return (
    <div className="py-16 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <CryptoPortfolioTrackerDescription />
          <PortfolioTrackerFeatures />
        </div>
      </div>
    </div>
  );
};
