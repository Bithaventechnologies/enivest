/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { Star, TrendingUp } from "lucide-react";

interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
}

const CryptoMarketTable = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [activeTab, setActiveTab] = useState("coins");
  const TOP_COINS_CACHE_KEY = "top_5_coins_cache";
  const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

  // Mock sparkline data
  const generateSparklineData = () => {
    return Array.from({ length: 20 }, () => ({
      value: Math.random() * 100,
    }));
  };

  useEffect(() => {
    const fetchTopCoins = async () => {
      try {
        const cached = localStorage.getItem(TOP_COINS_CACHE_KEY);

        if (cached) {
          const parsed = JSON.parse(cached);
          const isValid = Date.now() - parsed.timestamp < CACHE_TTL;

          if (isValid) {
            setCryptoData(parsed.data);
            return;
          }
        }

        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false"
        );

        if (!res.ok) throw new Error("Failed to fetch top coins");

        const data = await res.json();

        setCryptoData(data);

        localStorage.setItem(
          TOP_COINS_CACHE_KEY,
          JSON.stringify({
            data,
            timestamp: Date.now(),
          })
        );
      } catch (err) {
        console.log(err);
        const cached = localStorage.getItem(TOP_COINS_CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          setCryptoData(parsed.data);
        } else {
          console.error("Unable to load top coins");
        }
      }
    };

    fetchTopCoins();
  }, []);

  return (
    <div className="relative h-[45rem] bg-black text-white  shadow-2xl overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1f1f1f] via-[#111111] to-black opacity-90" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex flex-col items-center px-10 py-8"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4 mb-6">
          <h2 className="text-2xl font-extrabold bg-gradient-to-r from-orange-500 to-purple-500 bg-clip-text text-transparent">
            Market Overview
          </h2>

          <div className="flex space-x-4">
            {["coins", "nfts"].map((tab) => (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg transition-all duration-300 text-sm font-medium ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-orange-500/20 to-purple-500/20 border border-orange-500/50 text-white"
                    : "hover:bg-white/10 border border-transparent text-gray-400"
                }`}
              >
                {tab === "coins" ? (
                  <Star size={16} />
                ) : (
                  <TrendingUp size={16} />
                )}
                {tab === "coins" ? "Favorites" : "NFTs"}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto border border-white/10 rounded-lg shadow-lg">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-[#161616] border-b border-white/10 text-left text-gray-400 text-sm">
                <th className="py-3 pl-6">#</th>
                <th className="py-3">Name</th>
                <th className="py-3">Price</th>
                <th className="py-3">24h Change</th>
                <th className="py-3 pr-6">Chart</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {cryptoData.map((coin, index) => (
                  <motion.tr
                    key={coin.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-white/10 bg-[#121212] hover:bg-[#1a1a1a] transition-all duration-300"
                  >
                    <td className="py-4 pl-6 font-semibold text-gray-300">
                      {index + 1}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={coin.image}
                          alt={coin.name}
                          className="w-8 h-8 rounded-full border border-white/10 p-1"
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">{coin.name}</span>
                          <span className="text-sm text-gray-400 uppercase">
                            {coin.symbol}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="font-semibold text-lg text-white">
                      ${coin.current_price.toLocaleString()}
                    </td>
                    <td>
                      <span
                        className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold ${
                          coin.price_change_percentage_24h < 0
                            ? "text-red-400 bg-red-600/20"
                            : "text-green-400 bg-green-600/20"
                        }`}
                      >
                        {coin.price_change_percentage_24h.toFixed(2)}%
                      </span>
                    </td>
                    <td className="pr-6">
                      <div className="w-32 h-10">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={generateSparklineData()}>
                            <Line
                              type="monotone"
                              dataKey="value"
                              stroke={
                                coin.price_change_percentage_24h < 0
                                  ? "#f87171"
                                  : "#4ade80"
                              }
                              strokeWidth={2}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default CryptoMarketTable;
