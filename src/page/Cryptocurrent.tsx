/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_1h_in_currency: number;
  price_change_percentage_24h_in_currency: number;
  price_change_percentage_7d_in_currency: number;
  sparkline_in_7d: { price: number[] };
}

const CryptoMarketOverview: React.FC = React.memo(() => {
  const [coins, setCoins] = useState<Coin[] | null>(null);
  const [globalData, setGlobalData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const CACHE_KEY = "crypto_market_cache";
  const CACHE_TTL = 24 * 60 * 60 * 1000;

  useEffect(() => {
    const loadMarketData = async () => {
      try {
        setLoading(true);

        const cached = localStorage.getItem(CACHE_KEY);

        if (cached) {
          const parsed = JSON.parse(cached);
          const isValid = Date.now() - parsed.timestamp < CACHE_TTL;

          if (isValid) {
            setGlobalData(parsed.globalData);
            setCoins(parsed.coins);
            setLoading(false);
            return;
          }
        }

        const [globalRes, coinsRes] = await Promise.all([
          fetch("https://api.coingecko.com/api/v3/global"),
          fetch(
            "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=1h,24h,7d"
          ),
        ]);

        if (!globalRes.ok || !coinsRes.ok)
          throw new Error("Failed to fetch market data");

        const globalJson = await globalRes.json();
        const coinsJson = await coinsRes.json();

        setGlobalData(globalJson.data);
        setCoins(coinsJson);

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            globalData: globalJson.data,
            coins: coinsJson,
            timestamp: Date.now(),
          })
        );
      } catch (err: any) {
        console.log(err);
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          setGlobalData(parsed.globalData);
          setCoins(parsed.coins);
        } else {
          setError("Market data unavailable");
        }
      } finally {
        setLoading(false);
      }
    };

    loadMarketData();
  }, []);

  const formatCurrency = (value: number) =>
    value.toLocaleString("en-US", { style: "currency", currency: "USD" });

  const formatPercentage = (value?: number | null) => {
    if (value === null || value === undefined) return "—";
    return `${value?.toFixed(2)}%`;
  };

  if (loading) {
    return <div className="text-gray-400 text-center py-6">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-6">Error: {error}</div>;
  }

  return (
    <div className="bg-black text-white p-6  mt-16 w-full">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Crypto Market Overview
      </h2>

      {/* Global Market Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Market Cap"
          value={formatCurrency(globalData.total_market_cap.usd)}
          change={globalData.market_cap_change_percentage_24h_usd}
        />
        <StatCard
          title="Volume 24h"
          value={formatCurrency(globalData.total_volume.usd)}
          change={globalData.total_volume.usd}
        />
        <StatCard
          title="BTC Dominance"
          value={formatPercentage(globalData.market_cap_percentage.btc)}
          change={globalData.market_cap_change_percentage_24h}
        />
      </div>

      {/* Coins Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse border border-gray-800">
          <thead>
            <tr className="bg-gray-800 text-gray-400 text-left">
              <th className="p-3">#</th>
              <th className="p-3">Name</th>
              <th className="p-3">1h%</th>
              <th className="p-3">24h%</th>
              <th className="p-3">7d%</th>
              <th className="p-3">Price</th>
              <th className="p-3">Market Cap</th>
              <th className="p-3">Volume 24h</th>
              <th className="p-3">7d Trend</th>
            </tr>
          </thead>
          <tbody>
            {coins &&
              coins.map((coin) => (
                <tr
                  key={coin.id}
                  className="border-b border-gray-800 hover:bg-gray-800"
                >
                  <td className="p-3">{coin.market_cap_rank}</td>
                  <td className="p-3 flex items-center">
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="h-6 w-6 mr-2"
                    />
                    <div>
                      <p className="font-medium">{coin.name}</p>
                      <p className="text-gray-400 text-sm uppercase">
                        {coin.symbol}
                      </p>
                    </div>
                  </td>
                  <td
                    className={`p-3 font-medium ${
                      coin.price_change_percentage_1h_in_currency !== null &&
                      coin.price_change_percentage_1h_in_currency < 0
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {formatPercentage(
                      coin.price_change_percentage_1h_in_currency
                    )}
                  </td>
                  <td
                    className={`p-3 font-medium ${
                      coin.price_change_percentage_24h_in_currency < 0
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {formatPercentage(
                      coin.price_change_percentage_24h_in_currency
                    )}
                  </td>
                  <td
                    className={`p-3 font-medium ${
                      coin.price_change_percentage_7d_in_currency < 0
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {formatPercentage(
                      coin.price_change_percentage_7d_in_currency
                    )}
                  </td>
                  <td className="p-3 font-medium">
                    {formatCurrency(coin.current_price)}
                  </td>
                  <td className="p-3">{formatCurrency(coin.market_cap)}</td>
                  <td className="p-3">{formatCurrency(coin.total_volume)}</td>
                  <td className="p-3">
                    <SparklineGraph data={coin.sparkline_in_7d?.price} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

const StatCard: React.FC<{ title: string; value: string; change?: number }> = ({
  title,
  value,
  change,
}) => {
  const bgColor =
    change !== undefined && change < 0 ? "bg-red-100" : "bg-green-100"; // Light red or light green
  const formattedChange =
    change !== undefined ? `${change.toFixed(2)}%` : "N/A"; // Prevents error

  return (
    <div className={`rounded-lg p-4 ${bgColor}`}>
      <p className="text-gray-600 text-sm font-medium">{title}</p>
      <div className="flex items-center">
        <p className="text-lg font-semibold text-gray-900">{value}</p>
        <p
          className={`text-sm ml-2 ${
            change !== undefined && change < 0
              ? "text-red-600"
              : "text-green-600"
          }`}
        >
          {formattedChange}
        </p>
      </div>
    </div>
  );
};

const SparklineGraph: React.FC<{ data?: number[] }> = ({ data }) => {
  if (!data || data.length === 0)
    return <span className="text-gray-500">No Data</span>;

  return (
    <div className="w-24 h-8">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data.map((price, index) => ({ index, price }))}>
          <Line
            type="monotone"
            dataKey="price"
            stroke="#4ade80"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CryptoMarketOverview;
