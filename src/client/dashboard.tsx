/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Send,
  Repeat,
  Eye,
  EyeOff,
  Copy,
  Check,
  RefreshCw,
  LogOut,
  AlertCircle,
  BarChart3,
  PieChart as any,
  Activity,
  DollarSign,
  Coins,
  LucideArrowDownCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Bar,
  ComposedChart,
  Legend,
} from "recharts";
import { Menu } from "@headlessui/react";
import { ChevronDownIcon, LogOutIcon, WalletIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { OtherWallet } from "../page/portfolio";
import Cookies from "js-cookie";
import Others from "../page/Connect/Others";
import axios from "axios";
import { Disclosure } from "@headlessui/react";
import { MenuIcon, XIcon } from "lucide-react";
import { PiHandWithdraw, PiHandWithdrawFill } from "react-icons/pi";
import SendTokenModal from "../components/SendTokenModal";
import TradingView from "../components/TradingView";
import TradingViewWidget from "../components/TradingView";
import MarketData from "../components/MarketData";
import MarketView from "../components/MarketView";
import CryptoMarketTable from "../page/Cryptosec";
import TickerTape from "../components/TickerTape";
import { FaSearch } from "react-icons/fa";
import dayjs from "dayjs";
import DepositTokenModal from "../components/DepositTokenModal";
import SwapTokenModal from "../components/SwapTokenModal";
import { useCryptoRates } from "../components/useCryptoRates";
import Transactions from "../components/Transaction";
import KycModal from "../components/KycModal";
import WithdrawalCodeModal, { WithdrawalRequest } from "../components/WithdrawalCodeModal";
import TokenDistributionModal from "../components/TokenDistributionModal";
import usdcIcon from '../assets/usdc.png'

// Utility functions for mock fluctuations
const fluctuate = (value: number, range: number) =>
  +(value + (Math.random() - 0.5) * range).toFixed(4);

const generatePriceHistory = (days: number, currentPrice: number) => {
  const history = [];
  for (let i = 0; i < days; i++) {
    history.push({
      date: Date.now() - i * 86400000,
      price: fluctuate(currentPrice, currentPrice * 0.05),
    });
  }
  return history.reverse();
};

const prepareChartData = (tokens: any[]) => {
  // Example: just mock last 7 days fluctuation based on current price
  const days = 7;
  const data = [];

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));

    const entry: any = {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    };

    tokens.forEach((token: any) => {
      const randomPrice: any = token.price * (1 + (Math.random() - 0.5) * 0.05); // ±5% fluctuation
      entry[token.symbol] = Number(randomPrice.toFixed(2));
    });

    data.push(entry);
  }

  return data;
};

const generateVolumeData = () => {
  return Array.from({ length: 7 }).map((_, i) => ({
    date: Date.now() - i * 86400000,
    volume: fluctuate(10000000, 5000000),
  }));
};

const generatePortfolioHistory = (tokens: any[]) => {
  return Array.from({ length: 30 })
    .map((_, i) => ({
      date: Date.now() - i * 86400000,
      value: tokens.reduce(
        (acc, t) => acc + fluctuate(parseFloat(t.balance) * t.price, 500),
        0,
      ),
    }))
    .reverse();
};

const useBlockchainData = (address: string, chainId: number) => {
  const [balance, setBalance] = useState("0");
  const [tokens, setTokens] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [nfts, setNfts] = useState<any[]>([]);
  const [defiPositions, setDefiPositions] = useState<any[]>([]);
  const [portfolioHistory, setPortfolioHistory] = useState<any[]>([]);
  const [priceHistory, setPriceHistory] = useState<any>({});
  const [volumeData, setVolumeData] = useState<any[]>([]);
  const [walletAge, setWalletAge] = useState<number>(0);
  const [totalTransactions, setTotalTransactions] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [token] = useState<string | undefined>(Cookies.get("authToken"));
  const [walletAddresses, setWalletAddresses] = useState({
    eth: "",
    usdt: "",
    usdc: "",
    sol: "",
    btc: "",
  });
  const fetchBalance = async () => {
    setBalance(fluctuate(2.4567, 0.05).toString());
  };

  const [user, setUser] = useState<any>([]);

  const TOKEN_IDS = ["bitcoin", "ethereum", "tether", "solana", "ripple"];


  


  const getUserProfile = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_DEVE_URL}/user/get-profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setUser(response.data.data);
    } catch (error: any) {
      console.error("Error fetching users:", error.message);
      setError(error.message);
    }
  };

  useEffect(() => {
    if (!token) return;

    getUserProfile();
  }, [token]);

  const fetchWalletAddresses = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_DEVE_URL}/wallet/get-wallets-addresses`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (
        response.data.data &&
        Array.isArray(response.data.data) &&
        response.data.data.length > 0
      ) {
        const walletData = response.data.data[0];
        const newAddresses = {
          eth: walletData.eth || "",
          usdt: walletData.usdt || "",
          usdc: walletData.usdc || "",
          sol: walletData.sol || "",
          xrp: walletData.xrp || "",
          btc: walletData.btc || "",
        };
        setWalletAddresses(newAddresses);

        return newAddresses;
      }
      return null;
    } catch (error: any) {
      console.error("Error fetching wallet addresses:", error.message);
      setError("Failed to load wallet addresses");
      return null;
    }
  };
  const fetchCryptoPrices = async () => {
    const lastFetch = localStorage.getItem("prices_last_fetch");
    const now = Date.now();

    if (lastFetch && now - parseInt(lastFetch) < 24 * 60 * 60 * 1000) {
      const cached = localStorage.getItem("prices_cache");
      if (cached) {
        return JSON.parse(cached);
      }
    }

    // Fetch from CoinGecko
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${TOKEN_IDS.join(
      ",",
    )}&vs_currencies=usd`;
    const res = await fetch(url);
    const data = await res.json();

    // Store in localStorage
    localStorage.setItem("prices_cache", JSON.stringify(data));
    localStorage.setItem("prices_last_fetch", now.toString());

    return data;
  };

  (async () => {
    const prices = await fetchCryptoPrices();
  })();

  const fetchTokens = async () => {
    setIsLoading(true);
    try {
      const [prices, addresses] = await Promise.all([
        fetchCryptoPrices(),
        fetchWalletAddresses(),
      ]);

      if (!addresses) {
        throw new Error("Failed to fetch wallet addresses");
      }

      const liveTokens = [
        {
          symbol: "BTC",
          name: "Bitcoin",
          depositAddress: addresses?.btc,
          balance: user?.btcBalance ?? 0,
          decimals: 8,
          price: prices.bitcoin.usd,
          change: fluctuate(0, 0).toFixed(1),
          icon: "₿",
        },
        {
          symbol: "ETH",
          name: "Ethereum",
          balance: user?.ethBalance ?? 0,
          depositAddress: addresses?.eth,
          decimals: 18,
          price: prices.ethereum.usd,
          change: fluctuate(0, 0).toFixed(1),
          icon: "⟠",
        },
        {
          symbol: "USDT",
          name: "Tether",
          balance: user?.usdtBalance ?? 0,
          decimals: 6,
          depositAddress: addresses?.usdt,
          price: prices.tether.usd,
          change: "0.0",
          icon: "💵",
        },
        {
          symbol: "USDC",
          name: "Tether",
          balance: user?.usdcBalance ?? 0,
          decimals: 6,
          depositAddress: addresses?.usdc,
          price: prices.tether.usd,
          change: "0.0",
          icon: "💵",
        },
        {
          symbol: "SOL",
          name: "Solana",
          balance: user?.solBalance ?? 0,
          decimals: 9,
          price: prices.solana.usd,
          depositAddress: addresses?.sol,
          change: fluctuate(0, 0).toFixed(1),
          icon: "🔆",
        },
        {
          symbol: "XRP",
          name: "Ripple",
          balance: user?.xrpBalance ?? 0,
          decimals: 9,
          price: prices.ripple.usd,
          depositAddress: addresses?.xrp,
          change: fluctuate(0, 0).toFixed(1),
          icon: "💵",
        },
      ];

      setTokens(liveTokens);
    } catch (err) {
      // setError("Failed to fetch token data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_DEVE_URL}/transaction/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setTransactions(response.data?.data);

      setTotalTransactions(150 + Math.floor(Math.random() * 20));
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };




  const fetchNFTs = async () => {
    const mockNFTs = [
      {
        tokenId: "1234",
        name: "CryptoPunk #1234",
        collection: "CryptoPunks",
        image: "🎭",
        floorPrice: fluctuate(45, 5),
        lastSale: fluctuate(50, 4),
      },
      {
        tokenId: "5678",
        name: "Bored Ape #5678",
        collection: "Bored Ape Yacht Club",
        image: "🐵",
        floorPrice: fluctuate(25, 3),
        lastSale: fluctuate(27, 2),
      },
    ];
    setNfts(mockNFTs);
  };

  const fetchDeFiPositions = async () => {
    const mockPositions = [
      {
        protocol: "Aave",
        type: "Lending",
        asset: "USDC",
        amount: fluctuate(500, 30).toFixed(2),
        apy: fluctuate(4.2, 1.0),
        value: fluctuate(500, 40),
      },
      {
        protocol: "Uniswap V3",
        type: "Liquidity Pool",
        asset: "ETH/USDC",
        amount: fluctuate(1.5, 0.2).toFixed(2),
        apy: fluctuate(15.8, 3.0),
        value: fluctuate(3000, 250),
      },
    ];
    setDefiPositions(mockPositions);
  };

  const fetchHistoricalData = async () => {
    const portfolio = generatePortfolioHistory(tokens);

    setPortfolioHistory(portfolio);

    const chartData = prepareChartData(tokens);

    setPriceHistory(chartData);

    setVolumeData(generateVolumeData());
    setWalletAge(400 + Math.floor(Math.random() * 300));
  };

  const refreshData = async () => {
    await fetchBalance();
    await fetchTokens();
    await fetchNFTs();
    await fetchDeFiPositions();
  };

  // Initial + periodic data loading
  useEffect(() => {
    if (address) {
      refreshData();
      const interval = setInterval(refreshData, 6000); // every 8s
      return () => clearInterval(interval);
    }
  }, [address, chainId]);

  useEffect(() => {
    if (tokens.length > 0) fetchHistoricalData();
  }, [tokens]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    balance,
    tokens,
    transactions,
    nfts,
    defiPositions,
    portfolioHistory,
    priceHistory,
    volumeData,
    walletAge,
    totalTransactions,
    isLoading,
    error,
    refreshData,
    fetchTransactions,
  };
};
const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
];

const formatNumber = (num: number | bigint) =>
  new Intl.NumberFormat("en-US").format(num);

export default function CryptoWalletDashboard() {
  const FAKE_ADDRESS = "0x1234567890abcdef1234567890abcdef12345678";
  const FAKE_CHAIN_ID = 1;

  const {
    balance,
    tokens,
    transactions,
    nfts,
    defiPositions,
    portfolioHistory,
    priceHistory,
    volumeData,
    walletAge,
    totalTransactions,
    isLoading,
    fetchTransactions,
    error: dataError,
  } = useBlockchainData(FAKE_ADDRESS, FAKE_CHAIN_ID);

  const [hideBalance, setHideBalance] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showKycModal, setShowKycModal] = useState(false);
  const [selectedToken, setSelectedToken] = useState<any>(null);
  const [sendAmount, setSendAmount] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [activeChart, setActiveChart] = useState("portfolio");
  const [user, setUser] = useState<any>([]);
  const [token] = useState<string | undefined>(Cookies.get("authToken"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { ethToUsdt, usdtToUsdt, solToUsdt, btcToUsdt, usdcToUsdt } =
    useCryptoRates();

  const handleLogout = () => {
    Cookies.remove("authToken");
    Cookies.remove("userId");

    nav("/");
  };

  useEffect(() => {
    if (!token) return;
    setLoading(true);

    const getUserProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_DEVE_URL}/user/get-profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        // if (!Array.isArray(response.data)) {
        //   throw new Error("Unexpected response format");
        // }

        setUser(response.data.data);
        // toast.success("All users successfully loaded");
      } catch (error: any) {
        console.error("Error fetching users:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getUserProfile();
  }, [token]);

  const [totalValue, setTotalValue] = useState<any>(
    (user.ethBalance || 0) * ethToUsdt +
      (user.usdtBalance || 0) * usdtToUsdt +
      (user.usdcBalance || 0) * usdcToUsdt +
      (user.solBalance || 0) * solToUsdt +
      (user.btcBalance || 0) * btcToUsdt,
  );

  useEffect(() => {
    const baseValue =
      (user.ethBalance || 0) * ethToUsdt +
      (user.usdtBalance || 0) * usdtToUsdt +
      (user.usdcBalance || 0) * usdcToUsdt +
      (user.solBalance || 0) * solToUsdt +
      (user.btcBalance || 0) * btcToUsdt;
    // const interval = setInterval(() => {
    //   const fluctuation = (Math.random() - 0.5) * 0.006 * baseValue;
    //   setTotalValue(() => parseFloat((baseValue + fluctuation).toFixed(2)));
    // }, 3000);
    setTotalValue(baseValue);

    // return () => clearInterval(interval);
  }, [user]);

  const totalChange = tokens.reduce((sum: any, token: any) => {
    const value = parseFloat(token.balance) * token.price;
    const change = (value * token.change) / 100;
    return sum + (isNaN(change) ? 0 : change);
  }, 0);

  const changePercent = totalValue > 0 ? (totalChange / totalValue) * 100 : 0;

  // Calculate DeFi TVL
  const defiTVL = defiPositions.reduce(
    (sum: any, position: any) => sum + position.value,
    0,
  );

  const avgAPY =
    defiPositions.length > 0
      ? defiPositions.reduce((sum: any, pos: any) => sum + pos.apy, 0) /
        defiPositions.length
      : 0;

  const formatAddress = (addr: string | any[]) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  const formatCurrency = (amount: any | bigint) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  const formatTime = (timestamp: string | number | Date) =>
    new Date(timestamp).toLocaleTimeString();

  const TokenCard = ({ token }: any) => {
    const value = parseFloat(token.balance) * token.price;
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 hover:bg-gray-800/70 transition-all duration-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            {/* <div className="text-2xl">{token.icon}</div> */}
            <img
              src={token.icon}
              alt="icon"
              className="w-10 h-10 rounded-full overflow-hidden items-center justify-center flex"
            />
            <div>
              <h3 className="font-semibold text-white mt-1.5">
                {token.symbol}
              </h3>
              {/* <p className="text-sm text-gray-400">{token.name}</p> */}
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold text-white">{token.balance}</p>
            {/* <p className="text-sm text-gray-400">{formatCurrency(value)}</p> */}
          </div>
        </div>
        <div className="hidden items-center justify-between">
          <p className="text-sm text-gray-400">{formatCurrency(token.price)}</p>
          <div
            className={`flex items-center text-sm ${
              token.change >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {token.change >= 0 ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            {Math.abs(token.change).toFixed(2)}%
          </div>
        </div>
      </div>
    );
  };

  // const SendTokenModal = () => {
  //   const isFormValid =
  //     sendAmount &&
  //     recipientAddress &&
  //     parseFloat(sendAmount) > 0 &&
  //     parseFloat(sendAmount) <=
  //       Math.min(parseFloat(sendAmount || "0"), parseFloat(totalValue || "0"));

  //   const handleSendToken = async () => {
  //     setIsSending(true);
  //     try {
  //       await new Promise((resolve) => setTimeout(resolve, 2000));
  //       setSelectedToken(null);
  //       setSendAmount("");
  //       setRecipientAddress("");
  //       setShowSendModal(false);
  //       setIsOpen(true);
  //       console.log("Transaction sent successfully!");
  //     } catch (error) {
  //       console.error("Transaction failed:", error);
  //     } finally {
  //       setIsSending(false);
  //     }
  //   };

  //   const closeSendModal = () => {
  //     if (!isSending) {
  //       setShowSendModal(false);
  //       setSelectedToken(null);
  //       setSendAmount("");
  //       setRecipientAddress("");
  //     }
  //   };

  //   return (
  //     showSendModal && (
  //       <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
  //         <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md mx-4">
  //           <div className="flex items-center justify-between mb-6">
  //             <h2 className="text-xl font-bold text-white">Withdraw</h2>
  //             <button
  //               onClick={closeSendModal}
  //               className="text-gray-400 hover:text-white disabled:opacity-50"
  //               disabled={isSending}
  //             >
  //               ✕
  //             </button>
  //           </div>

  //           <div className="space-y-4">
  //             <div>
  //               <label className="block text-sm font-medium text-gray-300 mb-2">
  //                 Total Portfolio
  //               </label>
  //               <div className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none pointer-events-none">
  //                 {loading
  //                   ? "Loading..."
  //                   : formatCurrency(totalValue ?? 0) || 0}
  //               </div>
  //             </div>

  //             <div>
  //               <label className="block text-sm font-medium text-gray-300 mb-2">
  //                 Amount
  //               </label>
  //               <input
  //                 type="number"
  //                 inputMode="decimal"
  //                 className="no-spinner w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
  //                 value={sendAmount}
  //                 onChange={(e) => setSendAmount(e.target.value)}
  //                 disabled={isSending}
  //               />

  //               {selectedToken && (
  //                 <p className="text-xs text-gray-400 mt-1">
  //                   Available: {selectedToken.balance} {selectedToken.symbol}
  //                 </p>
  //               )}
  //             </div>

  //             <div>
  //               <label className="block text-sm font-medium text-gray-300 mb-2">
  //                 Recipient Address
  //               </label>
  //               <input
  //                 type="text"
  //                 placeholder="0x..."
  //                 className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
  //                 value={recipientAddress}
  //                 onChange={(e) => setRecipientAddress(e.target.value)}
  //                 disabled={isSending}
  //               />
  //             </div>

  //             {selectedToken && sendAmount && (
  //               <div className="bg-gray-800/50 rounded-lg p-3">
  //                 <div className="flex justify-between text-sm">
  //                   <span className="text-gray-400">Estimated gas fee:</span>
  //                   <span className="text-white">~$2.50</span>
  //                 </div>
  //                 <div className="flex justify-between text-sm mt-1">
  //                   <span className="text-gray-400">Total cost:</span>
  //                   <span className="text-white">
  //                     {formatCurrency(
  //                       parseFloat(sendAmount) * selectedToken.price + 2.5
  //                     )}
  //                   </span>
  //                 </div>
  //               </div>
  //             )}

  //             <div className="flex space-x-3 pt-4">
  //               <button
  //                 onClick={closeSendModal}
  //                 className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  //                 disabled={isSending}
  //               >
  //                 Cancel
  //               </button>
  //               <button
  //                 onClick={handleSendToken}
  //                 className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
  //                 disabled={!isFormValid || isSending}
  //               >
  //                 {isSending ? (
  //                   <>
  //                     <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
  //                     Sending...
  //                   </>
  //                 ) : (
  //                   "Send"
  //                 )}
  //               </button>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     )
  //   );
  // };

  const nav = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const allowedCodes = [
    "482917",
    "735604",
    "928341",
    "560293",
    "817425",
    "394672",
    "670189",
    "245986",
  ];

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showSwap, setShowSwap] = useState(false);
  const [isSelectedToken, setIsSelectedToken] = useState<any>(null);
  const [isSwapping, setIsSwapping] = useState<any>(false);
  const [fromToken, setFromToken] = useState<any>(null);
  const [toToken, setToToken] = useState<any>(null);
  const [fromAmount, setFromAmount] = useState<any>("");
  const [toAmount, setToAmount] = useState<any>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTokenDistributionModal, setShowTokenDistributionModal] =
    useState(false);
  const [tokenDistributionAmount, setTokenDistributionAmount] =
    useState<number>(5000);
  const [tokenDistributionMinAmount, setTokenDistributionMinAmount] =
    useState<number>(5000);
  const [tokenDistributionMaxAmount, setTokenDistributionMaxAmount] =
    useState<number>(500000);
  const [isSlotSecured, setIsSlotSecured] = useState(false);
  const [tokenDistributionLoading, setTokenDistributionLoading] =
    useState(false);
  const [tokenDistributionError, setTokenDistributionError] = useState("");
  const [settingsLoadError, setSettingsLoadError] = useState("");
  const [statusLoadError, setStatusLoadError] = useState("");

  const handleStartWithdraw = () => {
    setShowCodeModal(true);
  };

  const handleWithdrawalSubmit = async (withdrawal: WithdrawalRequest) => {
  setIsVerifying(true);

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_DEVE_URL}/withdrawals`,
      withdrawal,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("authToken")}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Withdrawal created:", response.data);

    setShowCodeModal(false);
    setIsOpen(true);
  } catch (error: any) {
    console.error(
      "Withdrawal failed:",
      error.response?.data || error.message
    );

    alert(
      error.response?.data?.message ||
        "Withdrawal request failed. Please try again."
    );
  } finally {
    setIsVerifying(false);
  }
};

  const fetchTokenDistributionSettings = async () => {
    try {
      setSettingsLoadError("");
      const response = await axios.get(
        `${tokenDistributionBaseUrl}/admin/settings`,
        {
          headers: { Authorization: `Bearer ${Cookies.get("authToken")}` },
        },
      );

      const settings = response.data?.data || {};
      const min = Number(settings.minInvestmentAmount ?? 5000);
      const max = Number(settings.maxInvestmentAmount ?? 500000);

      setTokenDistributionMinAmount(min);
      setTokenDistributionMaxAmount(max);
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Failed to load event settings. Please try again.";
      setSettingsLoadError(message);
      console.error("Failed to load token distribution settings:", error);
    }
  };

  const fetchTokenDistributionStatus = async () => {
    try {
      setStatusLoadError("");
      const response = await axios.get(
        `${tokenDistributionBaseUrl}/slot-status`,
        {
          headers: { Authorization: `Bearer ${Cookies.get("authToken")}` },
        },
      );

      const data = response.data?.data || {};
      if (data.hasSecuredSlot) {
        setIsSlotSecured(true);
        setTokenDistributionAmount(Number(data.amount || 5000));
      } else {
        setIsSlotSecured(false);
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Failed to check your slot status. Please try again.";
      setStatusLoadError(message);
      console.error("Failed to load slot status:", error);
    }
  };

  useEffect(() => {
    fetchTokenDistributionSettings();
    fetchTokenDistributionStatus();
  }, []);

  const handleTokenSlotSecured = async (amount: number) => {
    try {
      setTokenDistributionLoading(true);
      setTokenDistributionError("");

      const response = await axios.post(
        `${tokenDistributionBaseUrl}/secure-slot`,
        {
          amount,
          currency: "USD",
        },
        {
          headers: { Authorization: `Bearer ${Cookies.get("authToken")}` },
        },
      );

      // Check if the backend returned success: false
      if (response.data?.success === false) {
        const errorMsg =
          response.data?.message ||
          "Unable to secure your token distribution slot.";
        setTokenDistributionError(errorMsg);
        setTokenDistributionLoading(false);
        throw new Error(errorMsg);
      }

      const secureData = response.data?.data || {};
      const securedAmount = Number(secureData.amount ?? amount ?? 0);

      setTokenDistributionAmount(securedAmount);
      setIsSlotSecured(true);
      setTokenDistributionLoading(false);
    } catch (error: any) {
      const message =
        error.message ||
        error.response?.data?.message ||
        "Unable to secure your token distribution slot.";
      setTokenDistributionError(message);
      setIsSlotSecured(false);
      setTokenDistributionLoading(false);
      console.error("Secure slot failed:", error);
      throw error;
    }
  };

  const handleVerifyCode = async (code: string) => {
    setIsVerifying(true);

    // simulate API verification
    setTimeout(() => {
      if (allowedCodes.includes(code)) {
        setShowCodeModal(false);
        setShowSendModal(true);
      } else {
        alert("❌ Invalid verification code!");
      }
      setIsVerifying(false);
    }, 1500);
  };
  const handleSendToken = async () => {
    setIsSending(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // if (user?.kyc?.status !== "approved") {
      if (!user) {
        setShowKycModal(true);

        return;
      }
      setSelectedToken(null);
      setSendAmount("");
      setRecipientAddress("");
      setShowSendModal(false);
      setIsOpen(true);
      console.log("Transaction sent successfully!");
    } catch (error) {
      console.error("Transaction failed:", error);
    } finally {
      setIsSending(false);
    }
  };

  const closeSendModal = () => {
    if (!isSending) {
      setShowSendModal(false);
      setShowKycModal(false);
      setSelectedToken(null);
      setSendAmount("");
      setRecipientAddress("");
    }
  };

  const tokenDistributionBaseUrl = (() => {
    const baseUrl = (import.meta.env.VITE_DEVE_URL || "").replace(/\/+$/, "");

    return `${baseUrl}/token-distribution`;
  })();

  const generateChartData = (totalValue: number) => {
    const now = new Date();
    return Array.from({ length: 7 }).map((_, idx) => ({
      date: new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - (6 - idx),
      ).toISOString(),
      value: totalValue * (0.9 + Math.random() * 0.2),
    }));
  };

  const chartData = generateChartData(totalValue);

  const pieData = volumeData.map((item: any) => ({
    name: dayjs(item.date).format("MMM D"), // e.g., "Aug 9"
    value: parseFloat(item.volume.toFixed(2)),
  }));

  const COLORS = [
    "#4F46E5", // indigo
    "#06B6D4", // cyan
    "#10B981", // emerald
    "#F59E0B", // amber
    "#EF4444", // red
    "#8B5CF6", // violet
    "#14B8A6", // teal
  ];

  const handleSelectToken = (symbol: string) => {
    const token = tokens.find((t) => t.symbol === symbol) || null;
    setIsSelectedToken(token);
  };

  const handleSelectFromToken = (symbol: string) => {
    const token = tokens.find((t) => t.symbol === symbol) || null;
    setFromToken(token);
    // Auto calculate toAmount if toToken selected
    if (token && toToken) {
      setToAmount(
        (((parseFloat(fromAmount) || 0) * token.price) / toToken.price).toFixed(
          4,
        ),
      );
    }
  };

  const handleSelectToToken = (symbol: string) => {
    const token = tokens.find((t) => t.symbol === symbol) || null;
    setToToken(token);
    // Auto calculate toAmount if fromToken selected
    if (token && fromToken) {
      setToAmount(
        (
          ((parseFloat(fromAmount) || 0) * fromToken.price) /
          token.price
        ).toFixed(4),
      );
    }
  };

  const handleSwap = () => {
    if (!fromToken || !toToken) return;
    setIsSwapping(true);
    setTimeout(() => {
      console.log(
        `Swapped ${fromAmount} ${fromToken.symbol} to ${toAmount} ${toToken.symbol}`,
      );
      setIsSwapping(false);
      setShowSwap(false);
    }, 1500);
  };

  return (
    <>
      <TickerTape />

      <section className="relative min-h-screen bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden pt-16">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500/30 rounded-full filter blur-[120px] opacity-20" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-500/30 rounded-full filter blur-[120px] opacity-20" />

        <div className="min-h-screen text-white">
          {/* Header */}

          <Disclosure
            as="header"
            className="fixed top-0 left-0 right-0 z-50 bg-gray-900/70 border-b border-gray-800/50 backdrop-blur-md"
          >
            {({ open }) => (
              <>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <motion.div
                      className="flex items-center gap-3 text-lg font-bold cursor-pointer"
                      onClick={() => nav("/")}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <img
                          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAArlBMVEUwMDAqLzApLjAqLTAZJS9JOzBmRzANJjAaKTAQIS5eSzTLkUD/nTL/lzL/kzLEdTFZQTAkLDD/u0lPRjT0jjL/lTI6NjH1rUb/uUj/s0eaczvNeDGjZDGFYzgAHC5sSjDHjkDohzL+ske8cTGLWTFQPjBlUDXfnkNHMDGKOjMJLS/BSTXzVDcbLjB2OzLqUjdhNzEULS/tUzfYTDZQNTHjUTcAIS7JSzY9MjBsOTLzcIzuAAABK0lEQVR4Aa3SVYLCMBQF0NQ1YeoN7jAkwXX/G+MBffgnt97Txslvoum69l0Mk1i2bTmu/mmeH1ghpZTV/pz336IgjpOUQTJai4wXy4uSx/VGBgic5vozFpyXQdK8IegTekHJy1Y76lBWacO5/+fHYCYhUcaqUBv/NbucB224cXrs/quLpfZ56Rtw4w4yhnGqUq2Y99sEEg0pGh0ZNxyXfOLdPgtpVmFHf0OiW8NBj9IsqxCLxZFyHb3TbLAQisUGxT7cY6Lp/3SED2bAeeA9cCakFAoHYRzzuOWiqblcyKX2NHyFNV9dn7UV2FqsyCMTspFiO1NqthVgu5cFsT/AK7k7HHZyDXZErCLg7WJ9OaTQ0DCrpVhLyFosV1+WnlLb02mrFP727hDyk5wBH40gNwN2LO4AAAAASUVORK5CYII="
                          alt="EntriVest Cryptography Ledger System"
                          className="w-6 h-6"
                        />
                      </div>
                      <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                        EntriVest Cryptography Ledger System
                      </span>
                    </motion.div>
                    <motion.div
                      className={`hidden lg:flex items-center px-4 py-2.5 rounded-xl border transition-all duration-300 ${
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

                    {/* Always show hamburger icon */}
                    <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-white">
                      {open ? (
                        <XIcon className="block h-6 w-6" />
                      ) : (
                        <MenuIcon className="block h-6 w-6" />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>

                {/* Always visible dropdown panel (when open) */}
                <Disclosure.Panel className="absolute right-[6%] top-17 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-xl p-2 space-y-2 z-50">
                  <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 rounded-md"
                  >
                    <WalletIcon size={16} /> Connect Wallet
                  </button>

                  <button
                    onClick={handleStartWithdraw}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 rounded-md"
                  >
                    <Send size={16} /> Withdraw
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 rounded-md"
                  >
                    <LogOutIcon size={16} /> Logout
                  </button>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>

          {/* Error Messages */}
          {/* {dataError && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
              <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-300">{dataError}</span>
              </div>
            </div>
          )} */}

          <main className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-[10rem]">
            <div className="mb-8 rounded-2xl border border-orange-500/30 bg-gradient-to-r from-orange-950/40 via-gray-900 to-pink-950/40 p-5 sm:p-6 shadow-[0_0_30px_rgba(249,115,22,0.15)]">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div className="space-y-2 xl:max-w-[78%]">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-300">
                    Annual Global Token Distribution
                  </p>
                  <h2 className="text-2xl font-bold text-white xl:text-[2rem]">
                    EntriVest Wealth Transfer Event
                  </h2>
                  <p className="text-sm text-gray-300 xl:text-base">
                    {isSlotSecured
                      ? `Your slot is secured. You are now part of the premium EntriVest token access group with an investment of $${tokenDistributionAmount.toLocaleString()}.`
                      : "Secure a limited slot for the World Liberty Finance token distribution and position yourself for long-term wealth, disciplined cash flow, and legacy-building growth."}
                  </p>

                  {(tokenDistributionError ||
                    settingsLoadError ||
                    statusLoadError) && (
                    <div className="space-y-2">
                      {tokenDistributionError && (
                        <p className="text-xs text-red-300">
                          ❌ {tokenDistributionError}
                        </p>
                      )}
                      {settingsLoadError && (
                        <p className="text-xs text-red-300">
                          ❌ Settings: {settingsLoadError}
                        </p>
                      )}
                      {statusLoadError && (
                        <p className="text-xs text-red-300">
                          ❌ Status: {statusLoadError}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-stretch gap-3 xl:min-w-[260px] z-50">
                  {isSlotSecured ? (
                    <>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition"
                      >
                        Slot Secured ✓
                      </button>

                      <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-left">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-300">
                          Premium Member
                        </p>
                        <p className="mt-1 text-lg font-bold text-white">
                          ${tokenDistributionAmount.toLocaleString()}
                        </p>
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={() => setShowTokenDistributionModal(true)}
                      className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:from-orange-600 hover:to-pink-600 xl:px-6 xl:py-3.5"
                    >
                      Secure My Slot
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Enhanced Portfolio Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 w-full">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 ">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-300">
                    Total Portfolio
                  </h3>
                  <button
                    onClick={() => setHideBalance(!hideBalance)}
                    className="text-gray-400 hover:text-white"
                  >
                    {hideBalance ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl lg:text-3xl font-bold text-white">
                    {loading
                      ? "Loading..."
                      : hideBalance
                        ? "••••••"
                        : formatCurrency(totalValue)}
                  </p>
                  <div
                    className={`flex items-center text-sm ${
                      changePercent >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {changePercent >= 0 ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    {Math.abs(changePercent).toFixed(2)}% (24h)
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hidden">
                <div className="flex items-center space-x-3 mb-4">
                  <DollarSign className="w-6 h-6 text-green-400" />
                  <h3 className="text-lg font-semibold text-gray-300">
                    DeFi TVL
                  </h3>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(defiTVL)}
                  </p>
                  <p className="text-sm text-gray-400">
                    Avg APY: {avgAPY.toFixed(2)}%
                  </p>
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hidden">
                <div className="flex items-center space-x-3 mb-4">
                  <Activity className="w-6 h-6 text-blue-400" />
                  <h3 className="text-lg font-semibold text-gray-300">
                    Transactions
                  </h3>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-white">
                    {formatNumber(totalTransactions)}
                  </p>
                  <p className="text-sm text-gray-400">
                    Wallet age: {walletAge} days
                  </p>
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hidden">
                <div className="flex items-center space-x-3 mb-4">
                  <Coins className="w-6 h-6 text-purple-400" />
                  <h3 className="text-lg font-semibold text-gray-300">
                    Assets
                  </h3>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-white">
                    {tokens.length}
                  </p>
                  <p className="text-sm text-gray-400">NFTs: {nfts.length}</p>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6 flex-wrap lg:flex-nowrap gap-3">
                <h2 className="text-2xl font-bold">Analytics</h2>
                <div className="flex space-x-2 z-50">
                  <button
                    onClick={() => setActiveChart("portfolio")}
                    className={`px-4 py-2 cursor-pointer rounded-lg text-xs sm:text-sm font-medium transition-colors z-50 ${
                      activeChart === "portfolio"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800/50 text-gray-400 hover:text-white"
                    }`}
                  >
                    Portfolio
                  </button>
                  <button
                    onClick={() => setActiveChart("tokens")}
                    className={`px-4 py-2 cursor-pointer rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                      activeChart === "tokens"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800/50 text-gray-400 hover:text-white"
                    }`}
                  >
                    Token Prices
                  </button>
                  <button
                    onClick={() => setActiveChart("volume")}
                    className={`px-4 py-2 cursor-pointer rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                      activeChart === "volume"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800/50 text-gray-400 hover:text-white"
                    }`}
                  >
                    Volume
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart */}
                <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
                  <div className="h-80">
                    {activeChart === "portfolio" && (
                      <>
                        <div style={{ width: "100%", height: 250 }}>
                          <div></div>
                          <p className="text-1xl font-bold text-white mb-2.5">
                            <span className="text-sm font-semibold text-gray-300">
                              Portfolio:{" "}
                            </span>

                            {loading
                              ? "Loading..."
                              : hideBalance
                                ? "••••••"
                                : formatCurrency(totalValue)}
                          </p>
                          <ResponsiveContainer>
                            <AreaChart
                              data={chartData}
                              margin={{
                                top: 20,
                                right: 20,
                                left: 0,
                                bottom: 0,
                              }}
                            >
                              <defs>
                                <linearGradient
                                  id="balanceGradient"
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop
                                    offset="5%"
                                    stopColor="#10B981"
                                    stopOpacity={0.4}
                                  />
                                  <stop
                                    offset="95%"
                                    stopColor="#10B981"
                                    stopOpacity={0}
                                  />
                                </linearGradient>
                              </defs>
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#E5E7EB"
                              />
                              <XAxis
                                dataKey="date"
                                stroke="#6B7280"
                                fontSize={12}
                                tickFormatter={(value) =>
                                  new Date(value).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })
                                }
                              />
                              <YAxis
                                stroke="#6B7280"
                                fontSize={12}
                                tickFormatter={(value) => {
                                  if (Math.abs(value) >= 1_000_000_000) {
                                    return (
                                      (value / 1_000_000_000)
                                        .toFixed(1)
                                        .replace(/\.0$/, "") + "B"
                                    );
                                  } else if (Math.abs(value) >= 1_000_000) {
                                    return (
                                      (value / 1_000_000)
                                        .toFixed(1)
                                        .replace(/\.0$/, "") + "M"
                                    );
                                  } else if (Math.abs(value) >= 1_000) {
                                    return (
                                      (value / 1_000)
                                        .toFixed(1)
                                        .replace(/\.0$/, "") + "K"
                                    );
                                  }
                                  return value.toLocaleString();
                                }}
                              />

                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "#111827",
                                  border: "1px solid #374151",
                                  borderRadius: "8px",
                                  color: "#F9FAFB",
                                }}
                                formatter={(value: number) => [
                                  `$${value.toLocaleString()}`,
                                  "Balance",
                                ]}
                                labelFormatter={(label) =>
                                  new Date(label).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })
                                }
                              />
                              <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#10B981"
                                fillOpacity={1}
                                fill="url(#balanceGradient)"
                                strokeWidth={2}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </>
                    )}

                    {activeChart === "tokens" && (
                      <ResponsiveContainer>
                        <LineChart data={priceHistory}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#374151"
                          />
                          <XAxis dataKey="date" stroke="#9CA3AF" />
                          <YAxis
                            stroke="#9CA3AF"
                            tickFormatter={formatNumber}
                          />
                          <Tooltip
                            formatter={(value: any) => formatNumber(value | 0)}
                            contentStyle={{
                              background: "#1F2937",
                              borderRadius: 8,
                              border: "1px solid #374151",
                            }}
                          />
                          <Legend />
                          {tokens.map((token, index) => (
                            <Line
                              key={token.symbol}
                              type="monotone"
                              dataKey={token.symbol}
                              stroke={
                                ["#f7931a", "#3b82f6", "#22c55e", "#9333ea"][
                                  index
                                ]
                              }
                              strokeWidth={2}
                              dot={false}
                            />
                          ))}
                        </LineChart>
                      </ResponsiveContainer>
                    )}

                    {activeChart === "volume" && (
                      <>
                        <ResponsiveContainer>
                          <PieChart>
                            <Pie
                              data={pieData}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={100}
                              innerRadius={50}
                              fill="#8884d8"
                              label
                            >
                              {pieData.map((_, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value) =>
                                `${value.toLocaleString(undefined, {
                                  maximumFractionDigits: 0,
                                })} Vol`
                              }
                            />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </>
                    )}
                  </div>
                </div>
                {/* Portfolio Distribution */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-300 mb-4">
                    Asset Distribution
                  </h3>
                  {tokens.length > 0 ? (
                    <>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={tokens.map((token: any) => ({
                                ...token,
                                value: parseFloat(token.balance) * token.price,
                              }))}
                              cx="50%"
                              cy="50%"
                              innerRadius={40}
                              outerRadius={80}
                              dataKey="value"
                              stroke="none"
                            >
                              {tokens.map((entry: any, index: any) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value) => formatCurrency(value)}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-2 mt-4">
                        {tokens.slice(0, 5).map((token: any, index: any) => (
                          <div
                            key={token.symbol}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center space-x-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{
                                  backgroundColor:
                                    COLORS[index % COLORS.length],
                                }}
                              ></div>
                              <span className="text-sm text-gray-300">
                                {token.symbol}
                              </span>
                            </div>
                            <span className="text-sm text-white">
                              {(
                                ((parseFloat(token.balance) * token.price) /
                                  totalValue) *
                                100
                              ).toFixed(1)}
                              %
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="h-48 flex items-center justify-center text-gray-400">
                      {isLoading ? "Loading..." : "No tokens found"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4 mb-82">
              <button
                onClick={handleStartWithdraw}
                className="flex cursor-pointer items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <Send className="w-5 h-5" />
                <span>Withdraw</span>
              </button>
              <button
                onClick={() => setShowSwap(true)}
                className="cursor-pointer items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors hidden"
              >
                <Repeat className="w-5 h-5" />
                <span>Swap</span>
              </button>

              <button
                onClick={() => setShowDeposit(true)}
                className="flex cursor-pointer items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <LucideArrowDownCircle className="w-5 h-5" />
                <span>Deposit</span>
              </button>
            </div>

            <div className="w-full">
              {/* Assets */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Your Assets </h2>
                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="bg-gray-800/50 rounded-xl p-4 animate-pulse"
                        >
                          <div className="h-16 bg-gray-700/50 rounded"></div>
                        </div>
                      ))}
                    </div>
                  ) : tokens.length > 0 ? (
                    <div className="space-y-4">
                      {[
                        {
                          symbol: "USDT",
                          name: "USDT",
                          balance: formatNumber(user?.usdtBalance ?? 0),
                          decimals: 18,
                          price: formatNumber(fluctuate(totalValue || 0, 100)),
                          change: fluctuate(0, 5),
                          icon: "data:image/png;base64,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",
                        },
                        {
                          symbol: "USDC",
                          name: "USDC",
                          balance: formatNumber(user?.usdcBalance ?? 0),
                          decimals: 18,
                          price: formatNumber(fluctuate(totalValue || 0, 100)),
                          change: fluctuate(0, 5),
                          icon: usdcIcon,
                        },
                        {
                          symbol: "BTC",
                          name: "Bitcoin",
                          balance: formatNumber(user?.btcBalance ?? 0),
                          decimals: 8,
                          price: 0,
                          change: 0,
                          icon: "data:image/png;base64,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",
                        },
                        {
                          symbol: "ETH",
                          name: "Ethereum",
                          balance: formatNumber(user?.ethBalance ?? 0),
                          decimals: 18,
                          price: 0,
                          change: 0,
                          icon: "data:image/png;base64,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",
                        },
                        {
                          symbol: "SOL",
                          name: "Solana",
                          balance: formatNumber(user?.solBalance ?? 0),
                          decimals: 9,
                          price: 0,
                          change: 0,
                          icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAABgFBMVEUAAACZRf+IUfSPTPmLT/WNTvdGrswk5rI7wMUZ+pprd+Ii6a4e8aVJqM9vcuUi660/u8hOoNFXk9d+Xe4t171tdOR6ZOtci9qVSPxfiNw5xMRQnNM0zMBajtk3x8M9vcZEsstmf+CDV/FzbOcx0b92aelUltUp3bpOo9Ec9aJAt8kl47Zpe+JmOKYu1r1Iq85jg918YO1VldUnpnEa+Z5FsMxkgd8o4Lke8qQrnHsutI8VHiBfPKEYFCQWGCIRIyNvRLxaYLBJe6UtmH5Oc6dFg6M/lZsWGyAaESVTTZk3goY0iYUxjoMpoHdYY7BUaa5DhqNBjJ47m5k4opcyrJVmTrZhVrNYRpsqXmQ5fIYUYEYZkmMwXWwnRVQhOEMmrXgixoUk141WjcBSf7kPEREHIxkUPy9IXpQWUj1HS4EedVM/OXQ1N2EqtosUMyshGDl6T9Uxy6UpHEY5JmFGL3cXSjgtaG5NLYQzH1s2c4dOkbuIRd9xPMAYJjgsO1tOVJVOy6tcAAAIF0lEQVR4nO2c+1cTRxTHlyQgTYPE8AovgQAxAgIiBBSIWLWg1mpfVlvtw9paqy2+WuzD+q93drO7mZm9M7tRz117zvejrbS/fc69c+887uo4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMD/kJu3Lt+6LLjS5KMW5yVOq1y9Kn6rnLp6KpavUvC7PTc3VyxOTHR3d4+MHD16dGxsbGZmZnGxv7//2LH19fX5gEM+7wt6Awo+Gy7Hm6x6vCd+R1n9ml9wcnLOdZxoOjYVJUdXcp1wJCwLLUnfknA8zi64NrnmOQZhPKqHUVI0GEqKhVjFVWbBO12CyUnX0ZipQnFej+Kh+Cgepw2Zs/TO0pIwXJtUotjK1EXX0Y8imantR5FZ8JuepSXX0agoFZwgUefthjFr8RSzYK2npyeMou9IK8pFlY5iLxHFiOO3vIIva65hTxhFfy3SJXU9Wm8SKK6uKo7f8Qpu1o7UarVAMcxUT3GELqn2KFoStanILNg4IqgFYZTrTdFYUmlFajUWtPa/yi94b3TUqBjWmzBRF0293xJGXfF7XkHn7qinWKtpi5HcwhF7OFpRMtSiyC9YrVZDR0O9sXaN2HojkBYju+APKyueoZ6pYdewKdpLqtT7C60osguWSivVULEmL8ZJOVNHlMXo15v55CU1UFwt3OMVvDA+3lSsRqOoKtpLalwU3SB6jhs/MgsODXmKahgt9WYsqDcJj1NKogrFArPg/WHXUCiWKEXjRpxWpDO1oIbxJ17BC8vDQnEokaLe+4mNuBpFqm1wC96vC8PhYVKxFknUolxSZxKUVCKMP3ML1hMprqklleoa80k24hsbzIIPFqam6svLy76iWlJrxsU4QpdUrd6QdxvMd2sPFoShQTFxvWlrI/4Lr+DDfD6vKA69qaJ9LfZyCz4aGHAVfcdhqqTWDPXGVFIjd6nKYuQWdA4ftilW6ZJKXsIl24gXTjMLCsOIYky90btGZJdqvYRjF3QuTbuOnuLClNs1gt4vHKldald0I64eipUT4yFJsTcdQVFpbpzz+Njlms8Fnw8CLnpcd/mkyYcBn3p81uTzgDMEv57+LQVBAAAAAAAAAHg7bAsaHtsyjcbubkNmV/yPkM3NTfef5r9anG3S+kmB+R7fZ/9xRdDX13fy5MnBwcHZ2dnpae9QLE7+7qF4qm64vqkRr1PF5vUNeex3D8TraRyAH2cyTcNQcTpQlO42Yi795ecp+1PxOn8cMxlP0XcMozhtUCSvb5aUMFpGU4TiE+ZHQ8fZyWXCKJoU68brYvONuGH6RihyG7ppaoriYS2K5uvipTbeUdkVtys5XVGuN0EU60oUV/RLONsoXLAY313FPPGuEfcCZ70uPsOtuFdRE1UtqflIphpf4FprUZvb0Esqu+K+p0h1Db3eJL70Nw80pqP4VFHssyhqXWNUKalkvaFLagqKuUhJHUzaNeLfUYmxVPbdzbNMJnnvJ+qNrTG+U4qVjD2KCZ+Ko41Rnb7xEvU8t+JzIorhYhyw1ZvET8VjvqJfb7ifSp3nuYyta1CPjOa5Dd+xaC2p7IoHuQzVNahMTdA1FEXDRpz9eydJUT8xtllSiXdU8szIPFfjOFudoWE7JZUeaFyLU3Qd01KM7RpTSRQTnTV+51Y84Scq3TUkx2XDwZ9ujMVIYwwzlV1xp1NXtJbUIWksVa83XabRlLHWcUo4sr/ty4qVSGOkFcetA43yRpyqN6krakdGW70hjlPm/U1rMZ7lVnycMyhaSqq5McYqiiiy304lVdQb4wqtGD/tl8LtlClRlXoTuaEqvfZAI/tx0anYoiiFsf42NuJuorIbNvqCKOolNZKpy6TiqKGk0t+j9vOnqdjdVHKCSPOfbd3C5VvvGtLdRkmOohdEcqCxladuX3ySzrzb9t729p6L+4P2MOX+d0Nnd9d7rgofpzzkn+X3KeV5KhU/AAAAAAAAAHgb7G/tGPki5EbAufDjqWv6t1O2j6f8z6f+SEFwK1vO+nSG5HLBqdgw7ZfP26b9joQfa+o3VN1X+AU1v5abfn1D3ohrA0beDVVVu/SXP9YsTqQnGDjmCEebYpuPjNyGB0JQcuzMGsKY/F2D/FtTpL/37ia3YJMslak5IlObipZL/1LMtN9tXsHnZd1QSVSjov6uUae/KpbvUruWPEVmwWflskExkqj6PWP8pf8oNZrC3CtelMtmxU6boj6aIj8V2+Y2/kxR0BRFKlHpelNXnoqJmc0ebsH9crktxQpVUol31GHy6cbt/cyCT8sd4pfVkao3cTPi8oCRNl18nVdwL9vRoQu2X1ITPzIKxYu8gtuuYNTQoEht4cgxeH1GXMpUZsF7nR1NtETNttc1iI34lEHxL15B5++OwFCPYayi9amYHk0RhqkJJkhU+w4uZjQlUExRMEkYTSXV1jVa76iu4t1UBV9T0bZLVTfiK6Vqg1fwn44IuqGqmEtUUolP4Px6s7KbumDixhjfNQaiA42ll++AoLXeZOMTVRowChTD/c04s+AOKUgYRu429LZBr0U/igthFLkFT9CChGQ2Yqgfp6izxrSk2NzC/csruFW2GEbqje6Y5IZK36UyCx6Y/RLVG9P+xjzpzyzoZNs0zEZuqKyLUR9oXJjiFnQsOUrHsM0tnH7WeMAt6BzEKVKe2axi2qmbVsJU1TrjwiN2Qcd5caJ9trb8P8x8GXDJ59WlV68epuAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALwx/wEOmnyLoXOcnwAAAABJRU5ErkJggg==",
                        },
                      ].map((token: any) => (
                        <TokenCard key={token.symbol} token={token} />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-800/50 rounded-xl p-8 text-center">
                      <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">
                        No tokens found in this wallet
                      </p>
                    </div>
                  )}
                </div>
                <div className="w-full h-[600px]">
                  <CryptoMarketTable />
                </div>

                {transactions.length > 0 && (
                  <div className="pt-30">
                    <Transactions transactions={transactions ?? []} />
                  </div>
                )}
                {/* NFTs Section */}
                {nfts.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">NFT Collection</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {nfts.map((nft: any) => (
                        <div
                          key={nft.tokenId}
                          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4"
                        >
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="text-3xl">{nft.image}</div>
                            <div>
                              <h3 className="font-semibold text-white">
                                {nft.name}
                              </h3>
                              <p className="text-sm text-gray-400">
                                {nft.collection}
                              </p>
                            </div>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Floor Price:</span>
                            <span className="text-white">
                              {nft.floorPrice} ETH
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Last Sale:</span>
                            <span className="text-white">
                              {nft.lastSale} ETH
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* DeFi Positions */}
                {/* DeFi Positions */}
                {defiPositions.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">DeFi Positions</h2>
                    <div className="space-y-4">
                      {defiPositions.map((position: any, index: any) => (
                        <div
                          key={index}
                          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-white">
                                {position.protocol}
                              </h3>
                              <p className="text-sm text-gray-400">
                                {position.type}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-white">
                                {formatCurrency(position.value)}
                              </p>
                              <p className="text-sm text-green-400">
                                APY: {position.apy}%
                              </p>
                            </div>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">
                              {position.asset}
                            </span>
                            <span className="text-white">
                              {position.amount}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>

        <WithdrawalCodeModal
  show={showCodeModal}
  transactions={transactions}



  onClose={() => setShowCodeModal(false)}
/> 

          <SendTokenModal
            show={showSendModal}
            isSending={isSending}
            totalValue={totalValue}
            loading={loading}
            selectedToken={selectedToken}
            sendAmount={sendAmount}
            recipientAddress={recipientAddress}
            setSendAmount={setSendAmount}
            setRecipientAddress={setRecipientAddress}
            onSend={handleSendToken}
            onClose={closeSendModal}
          />

          <KycModal
            show={showKycModal}
            onClose={closeSendModal}
            availableTokens={tokens as any}
          />

          <DepositTokenModal
            show={showDeposit}
            isGenerating={isGenerating}
            selectedToken={isSelectedToken as any}
            availableTokens={tokens as any}
            onSelectToken={handleSelectToken}
            onClose={() => {
              fetchTransactions();
              setShowDeposit(false);
            }}
          />

          <TokenDistributionModal
            show={showTokenDistributionModal}
            onClose={() => setShowTokenDistributionModal(false)}
            onSlotSecured={handleTokenSlotSecured}
            hasSecuredSlot={isSlotSecured}
            minAmount={tokenDistributionMinAmount}
            maxAmount={tokenDistributionMaxAmount}
          />

          <SwapTokenModal
            show={showSwap}
            isSwapping={isSwapping}
            fromToken={fromToken}
            toToken={toToken}
            availableTokens={tokens}
            fromAmount={fromAmount}
            toAmount={toAmount}
            onSelectFromToken={handleSelectFromToken}
            onSelectToToken={handleSelectToToken}
            setFromAmount={(val: any) => {
              setFromAmount(val);
              if (fromToken && toToken) {
                setToAmount(
                  (
                    ((parseFloat(val) || 0) * fromToken.price) /
                    toToken.price
                  ).toFixed(4),
                );
              }
            }}
            onSwap={handleSwap}
            onClose={() => setShowSwap(false)}
            setToAmount={setToAmount}
          />

          {isOpen && (
            <Others
              onClose={() => setIsOpen(false)}
              otherWallets={OtherWallet}
            />
          )}
        </div>
      </section>
    </>
  );
}
