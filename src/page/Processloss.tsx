import { motion } from "framer-motion";
import Videobac from "../assets/profit-loss-banner.webm";
import { useNavigate } from "react-router-dom";
const ProfitLossAnalysis = () => {


  const nav = useNavigate()
  return (
    <section className="relative bg-gradient-to-b from-black via-gray-900 to-black text-white py-24 px-6 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-3xl top-0 right-0 animate-pulse" />
        <div className="absolute w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl bottom-0 left-0 animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative">
        {/* Left Side: Video */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-full lg:w-1/2"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-purple-500/20 blur-2xl rounded-2xl transform -rotate-6" />
          <div className="relative bg-red-500  rounded-2xl  flex justify-center items-center">
            <video
              src={Videobac}
              autoPlay
              loop
              muted
              playsInline
              className="w-full rounded-xl shadow-2xl transform hover:scale-[1.02] transition-transform duration-300"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-xl" />
          </div>
        </motion.div>

        {/* Right Side: Content */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-1/2 text-center lg:text-left space-y-8"
        >
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Get In-Depth Profit &
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
                Loss Analysis
              </span>
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              Connect your wallet to get 24h, daily, weekly, and cumulative
              Profit & Loss analysis. Level up your crypto investing strategy.
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
            {["24h Analysis", "Daily Reports", "Weekly Insights"].map(
              (stat, index) => (
                <div
                  key={index}
                  className="px-4 py-2 bg-white/5 backdrop-blur-lg rounded-lg border border-white/10 hover:border-orange-500/50 transition-colors duration-300"
                >
                  <span className="text-orange-400">{stat}</span>
                </div>
              )
            )}
          </div>

          {/* Button */}
          <motion.button
            onClick={() => nav('/connect/binance')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-8 py-4 overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold shadow-lg"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative flex items-center gap-2">
              Connect Portfolio
              <svg
                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ProfitLossAnalysis;
