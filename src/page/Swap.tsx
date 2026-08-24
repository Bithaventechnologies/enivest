import { useState } from "react";
import { Settings, ArrowDownCircle, Wallet } from "lucide-react";

const Swap = () => {
  const [payCoin, setPayCoin] = useState("");
  const [receiveCoin, setReceiveCoin] = useState("");
  const [payAmount, setPayAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [slippage, setSlippage] = useState("0.5");
  console.log(setSlippage);

  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const handleSwap = () => {
    const temp = payCoin;
    setPayCoin(receiveCoin);
    setReceiveCoin(temp);
  };

  const handleConnectWallet = () => {
    setIsWalletConnected(true);
  };

  const isSwapEnabled =
    isWalletConnected &&
    payCoin &&
    receiveCoin &&
    payAmount &&
    Number(payAmount) > 0;
  const estimatedGas = "0.002 ETH";
  const priceImpact = "0.05%";

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 ">
      <div className="w-full max-w-md">
        {/* Main Swap Card */}
        <div className="bg-[#1A1A1A] rounded-2xl p-3 sm:p-4 shadow-xl border border-gray-700">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-white">Swap</h2>
            <button className="p-1.5 sm:p-2 hover:bg-gray-700 rounded-lg transition-colors">
              <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            </button>
          </div>

          {/* Pay Input */}
          <div className="bg-[#262626] p-3 sm:p-4 rounded-xl mb-2">
            <div className="flex justify-between mb-2">
              <label className="text-xs sm:text-sm text-gray-400">
                You Pay
              </label>
              <span className="text-xs sm:text-sm text-gray-400">
                Balance: 0.0
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <button
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 py-1.5 sm:py-2 px-2 sm:px-3 rounded-full text-sm sm:text-base"
                disabled={!isWalletConnected}
              >
                {payCoin ? (
                  <span className="font-semibold text-white">{payCoin}</span>
                ) : (
                  <span className="text-gray-400">Select Coin</span>
                )}
              </button>
              <input
                type="text"
                className="flex-1 bg-transparent text-right text-lg sm:text-xl font-semibold text-white placeholder-gray-600 focus:outline-none min-w-[100px]"
                placeholder="0.0"
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                disabled={!isWalletConnected}
              />
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center -my-2 relative z-10">
            <button
              onClick={handleSwap}
              className="bg-gray-800 p-1.5 sm:p-2 rounded-xl border border-gray-700 hover:bg-gray-700 transition-colors"
              disabled={!isWalletConnected}
            >
              <ArrowDownCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
            </button>
          </div>

          {/* Receive Input */}
          <div className="bg-[#262626] p-3 sm:p-4 rounded-xl mt-2">
            <div className="flex justify-between mb-2">
              <label className="text-xs sm:text-sm text-gray-400">
                You Receive
              </label>
              <span className="text-xs sm:text-sm text-gray-400">
                Balance: 0.0
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <button
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 py-1.5 sm:py-2 px-2 sm:px-3 rounded-full text-sm sm:text-base"
                disabled={!isWalletConnected}
              >
                {receiveCoin ? (
                  <span className="font-semibold text-white">
                    {receiveCoin}
                  </span>
                ) : (
                  <span className="text-gray-400">Select coin</span>
                )}
              </button>
              <input
                type="text"
                className="flex-1 bg-transparent text-right text-lg sm:text-xl font-semibold text-white placeholder-gray-600 focus:outline-none min-w-[100px]"
                placeholder="0.0"
                value={receiveAmount}
                onChange={(e) => setReceiveAmount(e.target.value)}
                disabled={!isWalletConnected}
              />
            </div>
          </div>

          {/* Swap Details */}
          <div className="mt-4 p-2.5 sm:p-3 bg-[#262626] rounded-xl space-y-2">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-400">Price Impact</span>
              <span className="text-gray-300">{priceImpact}</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-400">Network Fee</span>
              <span className="text-gray-300">{estimatedGas}</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-400">Slippage Tolerance</span>
              <span className="text-gray-300">{slippage}%</span>
            </div>
          </div>

          {/* Action Button */}
          {!isWalletConnected ? (
            <button
              onClick={handleConnectWallet}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
              Connect Wallet
            </button>
          ) : (
            <button
              className={`w-full mt-4 font-semibold py-2.5 sm:py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm sm:text-base
                ${
                  isSwapEnabled
                    ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
              disabled={!isSwapEnabled}
            >
              Select Coin
            </button>
          )}
        </div>

        {/* Premium Banner */}
        <div className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-white text-sm sm:text-base">
                Premium Trader
              </h3>
              <p className="text-xs sm:text-sm text-blue-200">
                Get 0% trading fees
              </p>
            </div>
            <button className="bg-white text-blue-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base font-medium hover:bg-gray-100 transition-colors">
              Upgrade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Swap;
