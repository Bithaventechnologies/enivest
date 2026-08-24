import React from "react";
import { RefreshCw, ArrowDownUp } from "lucide-react";

interface Token {
  symbol: string;
  balance: number;
  price: number;
}

interface SwapTokenModalProps {
  show: boolean;
  isSwapping: boolean;
  fromToken: Token | null;
  toToken: Token | null;
  availableTokens: Token[];
  fromAmount: string;
  toAmount: string;
  onSelectFromToken: (symbol: string) => void;
  onSelectToToken: (symbol: string) => void;
  setFromAmount: (value: string) => void;
  setToAmount: (value: string) => void;
  onSwap: () => void;
  onClose: () => void;
}

const SwapTokenModal: React.FC<SwapTokenModalProps> = ({
  show,
  isSwapping,
  fromToken,
  toToken,
  availableTokens,
  fromAmount,
  toAmount,
  onSelectFromToken,
  onSelectToToken,
  setFromAmount,
  setToAmount,
  onSwap,
  onClose,
}) => {
  const isFormValid =
    fromToken &&
    toToken &&
    fromToken.symbol !== toToken.symbol &&
    parseFloat(fromAmount) > 0 &&
    fromToken.balance >= parseFloat(fromAmount);

  const handleSwapTokens = () => {
    if (fromToken || toToken) {
      const tempFrom = fromToken;
      const tempFromAmount = fromAmount;

      onSelectFromToken(toToken?.symbol || "");
      onSelectToToken(tempFrom?.symbol || "");
      setFromAmount(toAmount);
      setToAmount(tempFromAmount);
    }
  };

  const filteredFromTokens = availableTokens.filter(
    (token) => token.symbol !== toToken?.symbol
  );
  const filteredToTokens = availableTokens.filter(
    (token) => token.symbol !== fromToken?.symbol
  );

  return (
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-200 ${
        show
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Swap</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            disabled={isSwapping}
          >
            ✕
          </button>
        </div>

        {/* From token */}
        <label className="block text-sm font-medium text-gray-300 mb-1">
          From
        </label>
        <div className="flex space-x-2 mb-3">
          <div className="px-2 bg-gray-800 border border-gray-700 rounded-lg w-full overflow-hidden flex justify-center items-center">
            <select
              className="flex-1 w-full text-white outline-none border-none"
              onChange={(e) => onSelectFromToken(e.target.value)}
              value={fromToken?.symbol || ""}
            >
              <option value="">-- Select --</option>
              {filteredFromTokens.map((token) => (
                <option key={token.symbol} value={token.symbol}>
                  {token.symbol}
                </option>
              ))}
            </select>
          </div>
          <input
            type="number"
            className="w-28 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white no-arrows"
            value={fromAmount}
            onChange={(e) => setFromAmount(e.target.value)}
          />
        </div>
        {fromToken && (
          <p className="text-xs text-gray-400 mb-4">
            Balance: {fromToken.balance} {fromToken.symbol}
          </p>
        )}

        {/* Swap arrow */}
        <div className="flex justify-center mb-4">
          <button
            onClick={handleSwapTokens}
            className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition"
          >
            <ArrowDownUp className="text-gray-300" />
          </button>
        </div>

        {/* To token */}
        <label className="block text-sm font-medium text-gray-300 mb-1">
          To
        </label>
        <div className="flex space-x-2 mb-6">
          <div className="px-2 bg-gray-800 border border-gray-700 rounded-lg w-full overflow-hidden flex justify-center items-center">
            <select
              className="flex-1 w-full text-white outline-none border-none"
              onChange={(e) => onSelectToToken(e.target.value)}
              value={toToken?.symbol || ""}
            >
              <option value="">-- Select --</option>
              {filteredToTokens.map((token) => (
                <option key={token.symbol} value={token.symbol}>
                  {token.symbol}
                </option>
              ))}
            </select>
          </div>
          <input
            type="text"
            readOnly
            className="w-28 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-400"
            value={toAmount}
          />
        </div>

        {/* Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
            disabled={isSwapping}
          >
            Cancel
          </button>
          <button
            onClick={onSwap}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center"
            disabled={!isFormValid || isSwapping}
          >
            {isSwapping ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Swapping...
              </>
            ) : (
              "Swap"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwapTokenModal;
