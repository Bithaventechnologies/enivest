/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Menu,
} from "lucide-react";
import useSimulatedTrade from "./SimuTrade";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../../helpers/Config";
import Skeleton from "../components/Skeleton";

const ResponsiveAssets: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const { isLoading, data } = useQuery({
    queryKey: ["user-profile", refresh],
    queryFn: () => apiRequest("/user/get-profile"),
    staleTime: 0,
  });

  // const handleRefresh = async () => {
  //   const { data: newData } = await refetch();
  //   if (newData) setRefresh((prev) => !prev);
  // };

  useEffect(() => {
    if (refresh) {
      setTimeout(() => {
        setRefresh(false);
      }, 2000);
    }
  }, [refresh]);

  return (
    <div className="bg-[#0a0a1a] text-white font-mono min-h-screen p-4 md:p-6">
      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Wallet className="text-purple-500 w-6 h-6" />
          <h1 className="text-xl font-bold">Crypto Vault</h1>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Action Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#1a1a2e] rounded-lg p-4 mb-4 space-y-3">
          <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 rounded-xl">
            Connect Wallet
          </button>
          <button className="w-full border border-purple-500 text-purple-500 px-4 py-2 rounded-xl">
            Refresh
          </button>
        </div>
      )}

      {/* Glassmorphic Header */}
      <div className="hidden md:block bg-[#1a1a2e]/50 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-[#3a3a4e]">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center space-x-4">
              <Wallet className="text-purple-500" />
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-600">
                Crypto Vault
              </h1>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Total Portfolio:
              <span className="ml-2 font-bold text-lg text-green-400">
                ${data?.data.totalPortfolio}
              </span>
            </p>
          </div>
          <div className="flex space-x-3">
            {/* <button className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 rounded-xl hover:opacity-80 transition">
              Connect Wallet
            </button> */}
            <button className="border border-purple-500 text-purple-500 px-4 py-2 rounded-xl hover:bg-purple-500/20 transition">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Assets View */}
      <div className="md:hidden space-y-4">
        {data?.data.assets.map((asset: any) => (
          <div
            key={asset.asset}
            className="bg-[#1a1a2e]/50 rounded-2xl p-4 flex justify-between items-center"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mr-4"></div>
              <div>
                <div className="font-bold">{asset.asset}</div>
                <div className="text-sm text-gray-400">{asset.symbol}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold">${asset.totalValue.toFixed(2)}</div>
              <div
                className={`text-xs ${
                  asset.change24h > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {asset.change24h > 0 ? "▲" : "▼"}
                {Math.abs(asset.change24h).toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Assets Table */}
      <div className="hidden md:block bg-[#1a1a2e]/50 backdrop-blur-xl rounded-2xl border border-[#3a3a4e] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#2a2a3e]/50 text-gray-300">
            <tr>
              {[
                "Asset",
                "Amount",
                "24h Change",
                "Price",
                "Total",
                "Avg Buy",
                "Profit",
              ].map((header) => (
                <th
                  key={header}
                  className="py-4 px-6 text-left text-sm font-semibold whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr className="">
                <td className="p-4 flex items-center gap-4">
                  <Skeleton
                    width="2.5rem"
                    height="2.5rem"
                    className="rounded-full"
                  />
                  <div>
                    <Skeleton width="6rem" />
                    <Skeleton width="2rem" />
                  </div>
                </td>
                <td>
                  <Skeleton width="4rem" />
                </td>
                <td>
                  <Skeleton width="4rem" />
                </td>
                <td>
                  <Skeleton width="4rem" />
                </td>
                <td>
                  <Skeleton width="4rem" />
                </td>
                <td>
                  <Skeleton width="4rem" />
                </td>
                <td>
                  <Skeleton width="4rem" />
                </td>
              </tr>
            )}
            {data?.data.assets.map((asset: any) => (
              <tr
                key={asset.asset}
                className="border-b border-[#3a3a4e] hover:bg-[#2a2a3e]/50 transition"
              >
                <td className="py-4 px-6 flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mr-4"></div>
                  <div>
                    <div className="font-bold text-xs whitespace-nowrap">
                      {asset.asset}
                    </div>
                    <div className="text-xs text-gray-400">{asset.symbol}</div>
                  </div>
                </td>
                <td className="py-4 px-6 text-right text-xs">
                  {asset.amount.toLocaleString()}
                </td>
                <TableTradeVal change24h={asset.change24h} />
                <td className="py-4 px-6 text-right text-xs">
                  ${asset.price.toFixed(6)}
                </td>
                <td className="py-4 px-6 text-right text-xs">
                  ${asset.totalValue.toFixed(2)}
                </td>
                <td className="py-4 px-6 text-right text-xs">
                  ${asset.avgBuyPrice}
                </td>
                <TableTradeVal change24h={asset.profit} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResponsiveAssets;

export const TableTradeVal = ({ change24h }: { change24h: number }) => {
  const simulatedChange = useSimulatedTrade(change24h);

  return (
    <td
      className={`py-4 px-6 text-xs text-right whitespace-nowrap ${
        simulatedChange > 0 ? "text-green-500" : "text-red-500"
      }`}
    >
      {simulatedChange > 0 ? (
        <TrendingUp className="inline mr-2" />
      ) : (
        <TrendingDown className="inline mr-2" />
      )}
      {simulatedChange}%
    </td>
  );
};
