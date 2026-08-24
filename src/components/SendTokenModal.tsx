/* eslint-disable @typescript-eslint/no-explicit-any */
// components/SendTokenModal.tsx
import React from "react";
import { RefreshCw } from "lucide-react";

interface Token {
  symbol: string;
  balance: number;
  price: number;
}

interface SendTokenModalProps {
  show: boolean;
  isSending: boolean;
  totalValue: string;
  loading: boolean;
  selectedToken: Token | null;
  sendAmount: string;
  recipientAddress: string;
  setSendAmount: (value: string) => void;
  setRecipientAddress: (value: string) => void;
  onSend: () => void;
  onClose: () => void;
}

const SendTokenModal: React.FC<SendTokenModalProps> = ({
  show,
  isSending,
  totalValue,
  loading,
  selectedToken,
  sendAmount,
  recipientAddress,
  setSendAmount,
  setRecipientAddress,
  onSend,
  onClose,
}) => {
  const isFormValid =
    sendAmount &&
    recipientAddress &&
    parseFloat(sendAmount) > 0 &&
    parseFloat(sendAmount) <= parseFloat(totalValue || "0");

  const formatCurrency = (amount: any | bigint) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  return (
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-200 ${
        show
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Withdraw</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white disabled:opacity-50"
            disabled={isSending}
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Total Portfolio
            </label>
            <div className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white pointer-events-none">
              {loading ? "Loading..." : formatCurrency(Number(totalValue) || 0)}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Amount
            </label>
            <input
              type="number"
              inputMode="decimal"
              className="no-spinner w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              value={sendAmount}
              onChange={(e) => setSendAmount(e.target.value)}
              disabled={isSending}
            />
            {selectedToken && (
              <p className="text-xs text-gray-400 mt-1">
                Available: {selectedToken.balance} {selectedToken.symbol}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Recipient Address
            </label>
            <input
              type="text"
              placeholder="0x..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              disabled={isSending}
            />
          </div>

          {selectedToken && sendAmount && (
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Estimated gas fee:</span>
                <span className="text-white">~$2.50</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-400">Total cost:</span>
                <span className="text-white">
                  {formatCurrency(
                    parseFloat(sendAmount) * selectedToken.price + 2.5
                  )}
                </span>
              </div>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSending}
            >
              Cancel
            </button>
            <button
              onClick={onSend}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={!isFormValid || isSending}
            >
              {isSending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendTokenModal;
