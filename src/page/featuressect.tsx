import { motion } from "framer-motion";
import Heropack from "../assets/darkHead.web.svg";
import wallet from "../assets/wallet.svg";
import defi from "../assets/coinstat_logo.png";
import bitcoin from "../assets/Bitcoin.svg";

const FeaturesSection = () => {
  return (
    <section className="relative w-full bg-black min-h-screen text-white py-24 px-6 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl -top-48 -left-24 animate-pulse" />
        <div className="absolute w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl -bottom-32 -right-16 animate-pulse" />
      </div>

      {/* Header Section */}
      <div className="relative w-full flex justify-center items-center mb-20">
        <div className="w-full max-w-2xl">
          <h2 className="text-4xl md:text-5xl text-center font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-6">
            All-In-One Crypto & Bitcoin Tracker
          </h2>
          <p className="text-lg text-center text-gray-300 backdrop-blur-sm">
            The only platform supporting all major crypto ecosystems and DeFi
            protocols
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        {/* Features List */}
        <div className="w-full lg:w-1/2 space-y-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="group flex items-center gap-6 p-6 rounded-xl backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-purple-500/50"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 p-2.5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <img
                  src={feature.icon}
                  alt=""
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full lg:w-1/2 flex justify-center relative py-14"
        >
          <div className="relative w-full max-w-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-blue-500/30 blur-3xl rounded-full" />
            <img
              src={Heropack}
              alt="Hero visualization"
              className="relative w-full h-auto drop-shadow-2xl"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const features = [
  {
    icon: wallet,
    title: "300+ Wallets/Exchanges",
    description:
      "Track everything wherever you keep it: Binance, Trust Wallet, and others.",
  },
  {
    icon: defi,
    title: "1,000+ DeFi Protocols",
    description:
      "Track and manage all your DeFi on 1000+ protocols and 10+ chains.",
  },
  {
    icon: bitcoin,
    title: "20,000+ Cryptocurrencies",
    description:
      "Research, track, and manage any coin, set custom crypto alerts and more.",
  },
];

export default FeaturesSection;
