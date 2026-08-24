/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Copy } from "lucide-react";
import * as QRCodeLib from "qrcode.react";
import axios from "axios";
import Cookies from "js-cookie";

const QRCode = QRCodeLib.QRCodeSVG;

interface Token {
  symbol: string;
  depositAddress: string;
}

interface DepositTokenModalProps {
  show: boolean;
  isGenerating: boolean;
  selectedToken: Token | null;
  availableTokens: Token[];
  onSelectToken: (symbol: string) => void;
  onClose: () => void;
}

const DepositTokenModal: React.FC<DepositTokenModalProps> = ({
  show,
  isGenerating,
  selectedToken,
  availableTokens,
  onSelectToken,
  onClose,
}) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [tokenAuth] = useState<string | undefined>(Cookies.get("authToken"));

  const handleConfirmDeposit = async () => {
    if (!amount || !selectedToken) {
      setError("Please enter amount and select token");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.post(
        `${import.meta.env.VITE_DEVE_URL}/transaction/deposit/confirm`,
        {
          amount: parseFloat(amount),
          currency: selectedToken.symbol,
        },
        {
          headers: { Authorization: `Bearer ${tokenAuth}` },
        }
      );

      setSuccess("Deposit request submitted, awaiting administrative approval");
      setAmount("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to confirm deposit");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSuccess("");
  }, [show]);

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
          <h2 className="text-xl font-bold text-white">Deposit</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white disabled:opacity-50"
            disabled={isGenerating || loading}
          >
            ✕
          </button>
        </div>

        {/* Token selector */}
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Select Currency
        </label>
        <select
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none mb-4"
          onChange={(e) => onSelectToken(e.target.value)}
          value={selectedToken?.symbol || ""}
          disabled={isGenerating || loading}
        >
          <option value="">-- Select --</option>
          {availableTokens.map((token) => (
            <option key={token.symbol} value={token.symbol}>
              {token.symbol}
            </option>
          ))}
        </select>

        {/* Amount input */}

        {/* Deposit address */}
        {selectedToken && (
          <>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Amount
            </label>
            <input
              type="number"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none mb-4"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              disabled={isGenerating || loading}
              onWheel={(e) => e.currentTarget.blur()}
            />
            <div className="space-y-3">
              <div className="bg-gray-800 rounded-lg p-3 flex justify-between items-center">
                <span className="text-white break-all">
                  {selectedToken.depositAddress}
                </span>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(selectedToken.depositAddress)
                  }
                  className="text-gray-400 hover:text-white ml-2"
                >
                  <Copy size={16} />
                </button>
              </div>

              {/* QR code */}
              <div className="flex justify-center">
                <div className="bg-white p-3 rounded-lg">
                  <QRCode
                    value={selectedToken.depositAddress}
                    size={112}
                    level={"H"}
                    includeMargin={true}
                    className="text-black"
                  />
                </div>
              </div>

              <p className="text-xs text-gray-400 text-center">
                Send only {selectedToken.symbol} to this address. Sending any
                other asset may result in loss.
              </p>
            </div>
          </>
        )}

        {/* Feedback messages */}
        {success && (
          <p className="text-green-500 mt-4 text-center">{success}</p>
        )}
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

        {/* Confirm button */}
        {success && (
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 hover:bg-blue-700 disabled:opacity-50"
          >
            Okay
          </button>
        )}
        {!success && (
          <button
            onClick={handleConfirmDeposit}
            className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 hover:bg-blue-700 disabled:opacity-50"
            disabled={loading || isGenerating || !amount || !selectedToken}
          >
            {loading ? "Confirming..." : "I've Sent"}
          </button>
        )}
      </div>
    </div>
  );
};

export default DepositTokenModal;
