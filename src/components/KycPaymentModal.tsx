/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Copy } from "lucide-react";
import * as QRCodeLib from "qrcode.react";
import Cookies from "js-cookie";
import axios from "axios";
import { useCryptoRates } from "./useCryptoRates";

const QRCode = QRCodeLib.QRCodeSVG;

interface Token {
  symbol: string;
  depositAddress: string;
}

interface KycPaymentModalProps {
  show: boolean;
  availableTokens: Token[];
  onClose: () => void;
  KYC_FEE_USDT?: any;
}

const KycPaymentModal: React.FC<KycPaymentModalProps> = ({
  show,
  availableTokens,
  onClose,
  KYC_FEE_USDT = 500,
}) => {
  const { ethToUsdt, usdtToUsdt, solToUsdt, btcToUsdt, usdcToUsdt } =
    useCryptoRates();

  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [tokenAuth] = useState<string | undefined>(Cookies.get("authToken"));

  useEffect(() => {
    if (show) {
      setSuccess("");
      setError("");
      setSelectedToken(null);
      setAmount(0);
    }
  }, [show]);

  useEffect(() => {
    if (!selectedToken) return;

    let converted = 0;
    switch (selectedToken.symbol.toUpperCase()) {
      case "ETH":
        converted = KYC_FEE_USDT / ethToUsdt;
        break;
      case "SOL":
        converted = KYC_FEE_USDT / solToUsdt;
        break;
      case "BTC":
        converted = KYC_FEE_USDT / btcToUsdt;
        break;
      case "USDC":
        converted = KYC_FEE_USDT / usdcToUsdt;
        break;
      case "USDT":
        converted = KYC_FEE_USDT / usdtToUsdt;
        break;
      default:
        converted = 0;
    }
    setAmount(Number(converted.toFixed(6)));
  }, [selectedToken, ethToUsdt, solToUsdt, btcToUsdt, usdcToUsdt, usdtToUsdt]);

  const handleConfirmPayment = async () => {
    if (!selectedToken) {
      setError("Please select a token to proceed");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.post(
        `${import.meta.env.VITE_DEVE_URL}/transaction/deposit/confirm`,
        {
          amount: parseFloat((amount as any) ?? 0),
          currency: selectedToken.symbol,
          type: "kyc_fee",
        },
        {
          headers: { Authorization: `Bearer ${tokenAuth}` },
        }
      );

      setSuccess("✅ Payment request submitted, awaiting confirmation");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to confirm payment");
    } finally {
      setLoading(false);
    }
  };

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
          <h2 className="text-xl font-bold text-white">Pay KYC Fee</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white disabled:opacity-50"
            disabled={loading}
          >
            ✕
          </button>
        </div>

        <p className="text-gray-300 mb-4">
          KYC Verification Fee:{" "}
          <span className="font-semibold">{KYC_FEE_USDT} USDT</span>
        </p>

        {/* Token selector */}
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Pay With
        </label>
        <select
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none mb-4"
          onChange={(e) =>
            setSelectedToken(
              availableTokens.find((t) => t.symbol === e.target.value) || null
            )
          }
          value={selectedToken?.symbol || ""}
          disabled={loading}
        >
          <option value="">-- Select Token --</option>
          {availableTokens.map((token) => (
            <option key={token.symbol} value={token.symbol}>
              {token.symbol}
            </option>
          ))}
        </select>

        {/* Payment details */}
        {selectedToken && (
          <div className="space-y-4">
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

            <p className="text-center text-gray-300">
              Please send{" "}
              <span className="font-bold">
                {amount} {selectedToken.symbol}
              </span>{" "}
              (equivalent to {KYC_FEE_USDT} USDT) to the address above.
            </p>

            <p className="text-xs text-gray-400 text-center">
              Only send {selectedToken.symbol}. Sending other assets may result
              in loss.
            </p>
          </div>
        )}

        {/* Feedback */}
        {success && (
          <p className="text-green-500 mt-4 text-center">{success}</p>
        )}
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

        {/* Confirm button */}
        {success ? (
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 hover:bg-blue-700"
          >
            Okay
          </button>
        ) : (
          <button
            onClick={handleConfirmPayment}
            className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 hover:bg-blue-700 disabled:opacity-50"
            disabled={loading || !selectedToken}
          >
            {loading ? "Confirming..." : "I've Paid"}
          </button>
        )}
      </div>
    </div>
  );
};

export default KycPaymentModal;
