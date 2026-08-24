import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  RefreshCcw,
  Wallet,
  ArrowUpRight,
  Clock,
  BarChart3,
  Settings,
  Download,
} from "lucide-react";

// Enhanced data with more crypto tokens and higher values
const portfolioData = [
  { date: "21 Feb", usd: 345000, btc: 3.5, eth: 25.8, sol: 420 },
  { date: "22 Feb", usd: 352000, btc: 3.6, eth: 26.4, sol: 435 },
  { date: "23 Feb", usd: 368000, btc: 3.7, eth: 27.2, sol: 445 },
  { date: "24 Feb", usd: 375000, btc: 3.8, eth: 28.1, sol: 460 },
  { date: "25 Feb", usd: 388000, btc: 3.9, eth: 29.4, sol: 480 },
  { date: "26 Feb", usd: 410000, btc: 4.1, eth: 30.8, sol: 510 },
  { date: "27 Feb", usd: 440000, btc: 4.4, eth: 32.5, sol: 540 },
];

// Recent transactions data
const recentTransactions = [
  {
    id: "0x8a3d...4f9e",
    type: "Swap",
    token: "ETH → SOL",
    amount: "2.4 ETH",
    value: "$4,850",
    time: "2h ago",
  },
  {
    id: "0x7c1e...9a2d",
    type: "Receive",
    token: "BTC",
    amount: "0.15 BTC",
    value: "$15,230",
    time: "5h ago",
  },
  {
    id: "0x3f5b...7d1c",
    type: "Stake",
    token: "ETH",
    amount: "5.0 ETH",
    value: "$10,120",
    time: "1d ago",
  },
  {
    id: "0x2e9a...6b3f",
    type: "Send",
    token: "USDC",
    amount: "2,500 USDC",
    value: "$2,500",
    time: "2d ago",
  },
];

const Web3Portfolio = () => {
  const [showUSD, setShowUSD] = useState(true);
  const [showBTC, setShowBTC] = useState(true);
  const [showETH, setShowETH] = useState(true);
  const [showSOL, setShowSOL] = useState(false);
  const [timeframe, setTimeframe] = useState("7D");
  const [isLoading, setIsLoading] = useState(false);

  // Simulate data refresh
  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="min-h-screen w-full bg-black text-white p-6 mt-16">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-lg">
            <Wallet className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 text-transparent bg-clip-text">
            My Porfolio
          </h2>
        </div>
        <div className="flex gap-3">
          <button className="bg-[#0D0D0D] hover:bg-gray-900 text-gray-300 p-2 rounded-lg">
            <Settings className="h-5 w-5" />
          </button>
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium">
            <span>Connect Wallet</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Stats & Assets */}
        <div className="lg:col-span-1 space-y-6">
          {/* Statistics Card */}
          <div className="bg-[#0D0D0D] backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-800">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-400" />
              <span>Portfolio Overview</span>
            </h3>
            <div className="flex flex-col gap-6">
              {/* Portfolio Value */}
              <div>
                <p className="text-sm text-gray-400 mb-1">
                  Total Portfolio Value
                </p>
                <div className="flex items-baseline gap-3">
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 text-transparent bg-clip-text">
                    $438,625.79
                  </p>
                  <span className="text-sm text-green-400 flex items-center">
                    +10.34% <ArrowUpRight className="h-3 w-3 ml-1" />
                  </span>
                </div>
                <p className="text-gray-400 mt-1 text-sm">
                  ≈ 4.45 BTC • 32.76 ETH • 538 SOL
                </p>
              </div>

              {/* Additional Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black p-4 rounded-xl">
                  <p className="text-xs text-gray-400 mb-1">24h Change</p>
                  <p className="text-xl font-semibold text-green-400">
                    +$28,625
                  </p>
                  <p className="text-xs text-green-400">+6.98%</p>
                </div>
                <div className="bg-black p-4 rounded-xl">
                  <p className="text-xs text-gray-400 mb-1">30d Change</p>
                  <p className="text-xl font-semibold text-green-400">
                    +$94,175
                  </p>
                  <p className="text-xs text-green-400">+27.34%</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium">
                  Deposit
                </button>
                <button className="flex-1 bg-[#0D0D0D] hover:bg-gray-900 text-white py-2 rounded-lg text-sm font-medium border border-gray-800">
                  Withdraw
                </button>
                <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-sm font-medium">
                  Swap
                </button>
              </div>
            </div>
          </div>

          {/* Asset Allocation */}
          <div className="bg-[#0D0D0D] backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-800">
            <h3 className="text-lg font-semibold mb-4">Asset Allocation</h3>
            <div className="space-y-4">
              {/* BTC */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-xs font-bold">
                    BTC
                  </div>
                  <div>
                    <p className="font-medium">Bitcoin</p>
                    <p className="text-xs text-gray-400">4.45 BTC</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">$438,625</p>
                  <p className="text-xs text-green-400">+2.4%</p>
                </div>
              </div>

              {/* ETH */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">
                    ETH
                  </div>
                  <div>
                    <p className="font-medium">Ethereum</p>
                    <p className="text-xs text-gray-400">32.76 ETH</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">$66,184</p>
                  <p className="text-xs text-green-400">+5.7%</p>
                </div>
              </div>

              {/* SOL */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-xs font-bold">
                    SOL
                  </div>
                  <div>
                    <p className="font-medium">Solana</p>
                    <p className="text-xs text-gray-400">538 SOL</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">$51,472</p>
                  <p className="text-xs text-green-400">+12.8%</p>
                </div>
              </div>

              {/* View All Button */}
              <button className="w-full mt-4 py-2 bg-black hover:bg-gray-900 rounded-lg text-sm font-medium border border-gray-800">
                View All Assets
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Chart & Transactions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart Section */}
          <div className="bg-[#0D0D0D] backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-800">
            <div className="flex flex-wrap justify-between items-center mb-6">
              {/* Chart Title */}
              <h3 className="text-lg font-semibold">Portfolio Performance</h3>

              {/* Timeframe Selector */}
              <div className="flex bg-black rounded-lg p-1 text-sm">
                {["24H", "7D", "30D", "90D", "1Y", "All"].map((period) => (
                  <button
                    key={period}
                    className={`px-3 py-1 rounded-md ${
                      timeframe === period
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                    onClick={() => setTimeframe(period)}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart */}
            <div className="relative">
              {isLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              )}
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={portfolioData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorUsd" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorBtc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorEth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorSol" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    stroke="#6b7280"
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis stroke="#6b7280" axisLine={false} tickLine={false} />
                  <CartesianGrid
                    stroke="#1f2937"
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.95)",
                      borderColor: "#374151",
                      borderRadius: "0.5rem",
                      color: "white",
                    }}
                  />
                  <Legend />
                  {showUSD && (
                    <Area
                      type="monotone"
                      name="USD Value"
                      dataKey="usd"
                      stroke="#6366f1"
                      fillOpacity={1}
                      fill="url(#colorUsd)"
                    />
                  )}
                  {showBTC && (
                    <Area
                      type="monotone"
                      name="BTC"
                      dataKey="btc"
                      stroke="#f59e0b"
                      fillOpacity={1}
                      fill="url(#colorBtc)"
                    />
                  )}
                  {showETH && (
                    <Area
                      type="monotone"
                      name="ETH"
                      dataKey="eth"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorEth)"
                    />
                  )}
                  {showSOL && (
                    <Area
                      type="monotone"
                      name="SOL"
                      dataKey="sol"
                      stroke="#8b5cf6"
                      fillOpacity={1}
                      fill="url(#colorSol)"
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Toggle Buttons and Actions */}
            <div className="flex flex-wrap justify-between items-center mt-4">
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={showUSD}
                    onChange={() => setShowUSD(!showUSD)}
                    className="accent-indigo-500 w-4 h-4 rounded"
                  />
                  <span className="text-indigo-400">USD</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={showBTC}
                    onChange={() => setShowBTC(!showBTC)}
                    className="accent-amber-500 w-4 h-4 rounded"
                  />
                  <span className="text-amber-400">BTC</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={showETH}
                    onChange={() => setShowETH(!showETH)}
                    className="accent-blue-500 w-4 h-4 rounded"
                  />
                  <span className="text-blue-400">ETH</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={showSOL}
                    onChange={() => setShowSOL(!showSOL)}
                    className="accent-purple-500 w-4 h-4 rounded"
                  />
                  <span className="text-purple-400">SOL</span>
                </label>
              </div>

              <div className="flex gap-2 mt-2 sm:mt-0">
                <button
                  className="p-2 bg-black hover:bg-gray-900 rounded-lg text-gray-300 border border-gray-800"
                  onClick={refreshData}
                >
                  <RefreshCcw
                    className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`}
                  />
                </button>
                <button className="p-2 bg-black hover:bg-gray-900 rounded-lg text-gray-300 border border-gray-800">
                  <Download className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-[#0D0D0D] backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-400" />
                <span>Recent Transactions</span>
              </h3>
              <button className="text-sm text-blue-400 hover:text-blue-300">
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 text-sm border-b border-gray-800">
                    <th className="pb-3 font-medium">Transaction</th>
                    <th className="pb-3 font-medium">Token</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Value</th>
                    <th className="pb-3 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((tx, index) => (
                    <tr
                      key={tx.id}
                      className={
                        index !== recentTransactions.length - 1
                          ? "border-b border-gray-800"
                          : ""
                      }
                    >
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                              tx.type === "Swap"
                                ? "bg-purple-600"
                                : tx.type === "Receive"
                                ? "bg-green-600"
                                : tx.type === "Send"
                                ? "bg-red-600"
                                : "bg-blue-600"
                            }`}
                          >
                            {tx.type.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{tx.type}</p>
                            <p className="text-xs text-gray-400">{tx.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">{tx.token}</td>
                      <td className="py-3">{tx.amount}</td>
                      <td className="py-3">{tx.value}</td>
                      <td className="py-3 text-gray-400">{tx.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Web3Portfolio;
