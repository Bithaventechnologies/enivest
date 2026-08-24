/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  X,
  Check,
  Trophy,
  Zap,
  DollarSign,
  Crown,
  Shield,
  TrendingUp,
} from "lucide-react";
import logo from "../assets/coinstat_logo.png";

interface TokenDistributionModalProps {
  show: boolean;
  onClose: () => void;
  onSlotSecured: (amount: number) => void;
  hasSecuredSlot?: boolean;
  minAmount?: number;
  maxAmount?: number;
}

type FlowStep = "info" | "amount" | "securing" | "success";

const TokenDistributionModal: React.FC<TokenDistributionModalProps> = ({
  show,
  onClose,
  onSlotSecured,
  hasSecuredSlot = false,
  minAmount = 5000,
  maxAmount = 500000,
}) => {
  const [step, setStep] = useState<FlowStep>("info");
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const MIN_AMOUNT = minAmount;
  const MAX_AMOUNT = maxAmount;

  useEffect(() => {
    if (!show) {
      setStep("info");
      setAmount("");
      setError("");
    } else if (hasSecuredSlot) {
      setStep("success");
    }
  }, [show, hasSecuredSlot]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    setError("");
  };

  const handleProceedToSecure = () => {
    const numAmount = parseFloat(amount);

    if (!amount) {
      setError("Please enter an amount");
      return;
    }

    if (numAmount < MIN_AMOUNT) {
      setError(`Minimum investment amount is $${MIN_AMOUNT.toLocaleString()}`);
      return;
    }

    if (numAmount > MAX_AMOUNT) {
      setError(`Maximum investment amount is $${MAX_AMOUNT.toLocaleString()}`);
      return;
    }

    setStep("securing");
    setError("");
  };

  const handleSecureSlot = async () => {
    try {
      setIsProcessing(true);
      setError("");

      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        setError("Please enter a valid amount");
        setIsProcessing(false);
        return;
      }

      await onSlotSecured(numAmount);
      setIsProcessing(false);
      setStep("success");
    } catch (err: any) {
      setError(err.message || "Failed to secure slot. Please try again.");
      setIsProcessing(false);
      setStep("amount");
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300 p-3 sm:p-6 ${
        show
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto hide-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <img src={logo} alt="EntriVest Logo" className="w-10 h-10" />
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
              EntriVest Token Distribution
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            disabled={isProcessing}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* STEP 1: Info */}
        {step === "info" && (
          <div className="space-y-6">
            {/* Event Description */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">
                Annual Global Wealth Transfer Event
              </h3>
              <p className="text-gray-300 leading-relaxed">
                This is{" "}
                <span className="font-semibold text-orange-400">not just</span>{" "}
                another opportunity. This is about more than a single
                investment. It's about creating a solid cash-flow game plan,
                building financial discipline, and putting yourself in a
                position where your money works toward your long-term goals.
              </p>
              <p className="text-gray-300 leading-relaxed">
                The{" "}
                <span className="font-semibold text-pink-400">
                  World Liberty Finance Token Distribution Event
                </span>{" "}
                is an annual wealth-transfer opportunity designed for the{" "}
                <span className="font-semibold">1% of the 1%</span> — those
                serious about taking control of their financial future and
                positioning themselves for generational wealth.
              </p>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Trophy className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-white text-sm">
                      Limited Slots
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      Exclusive opportunity with limited availability
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-white text-sm">
                      Generational Returns
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      Long-term wealth building strategy
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-white text-sm">
                      Strategic Planning
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      Comprehensive wealth management strategy
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-white text-sm">
                      Secure & Verified
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      Enterprise-grade security protocols
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Minimum Amount Banner */}
            <div className="bg-gradient-to-r from-orange-900/30 to-pink-900/30 border border-orange-500/50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-orange-400" />
                <div>
                  <p className="text-white font-semibold">Minimum Investment</p>
                  <p className="text-orange-300 text-sm">
                    ${MIN_AMOUNT.toLocaleString()} required to participate
                  </p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <p className="text-center text-gray-400 text-sm italic">
              Get your strategy together. Build your wealth. Build your legacy.
            </p>

            {/* Button */}
            <button
              onClick={() => setStep("amount")}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Explore Opportunity
            </button>
          </div>
        )}

        {/* STEP 2: Amount Selection */}
        {step === "amount" && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">
              Enter Your Investment Amount
            </h3>

            {/* Amount Input */}
            <div className="space-y-3">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Investment Amount (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-12 text-gray-400 text-lg">
                    $
                  </span>
                  <input
                    type="number"
                    inputMode="decimal"
                    className="no-spinner w-full bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-4 py-3 text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-lg font-semibold"
                    placeholder="5000"
                    value={amount}
                    onChange={handleAmountChange}
                    min={MIN_AMOUNT}
                    max={MAX_AMOUNT}
                  />
                </div>
              </div>

              {/* Amount Info */}
              <div className="text-sm text-gray-400 space-y-1">
                <p>
                  <span className="text-gray-500">Minimum:</span> $
                  {MIN_AMOUNT.toLocaleString()}
                </p>
                <p>
                  <span className="text-gray-500">Maximum:</span> $
                  {MAX_AMOUNT.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Amount Presets */}
            <div>
              <p className="text-sm text-gray-400 mb-3">Quick select:</p>
              <div className="grid grid-cols-3 gap-3">
                {[5000, 10000, 25000, 50000, 100000, 250000].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setAmount(preset.toString())}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                      amount === preset.toString()
                        ? "bg-orange-500 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    ${(preset / 1000).toFixed(0)}k
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setStep("info")}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleProceedToSecure}
                disabled={!amount || isProcessing}
                className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Secure Slot
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Securing Slot */}
        {step === "securing" && (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full animate-pulse opacity-30"></div>
                  <div className="absolute inset-2 bg-gray-900 rounded-full flex items-center justify-center">
                    <Zap className="w-10 h-10 text-orange-400 animate-spin" />
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-white">
                Securing Your Slot
              </h3>
              <p className="text-gray-400">
                Processing your ${parseFloat(amount || "0").toLocaleString()}{" "}
                investment...
              </p>

              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mt-6">
                <p className="text-sm text-gray-300">
                  This is a limited-time exclusive opportunity. Please wait
                  while we secure your slot in the token distribution event.
                </p>
              </div>
            </div>

            <button
              onClick={handleSecureSlot}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Processing..." : "Confirm & Secure Slot"}
            </button>
          </div>
        )}

        {/* STEP 4: Success */}
        {step === "success" && (
          <div className="space-y-6">
            {/* Success Animation */}
            <div className="flex justify-center">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-2 bg-gray-900 rounded-full flex items-center justify-center">
                  <Check className="w-12 h-12 text-green-400" />
                </div>
              </div>
            </div>

            {/* Success Message */}
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-white">
                Slot Secured! 🎉
              </h3>
              <p className="text-gray-300">
                Congratulations! You've successfully secured your slot in the 3T
                Warrior Token Distribution Event.
              </p>
            </div>

            {/* Confirmation Details */}
            <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/50 rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Investment Amount:</span>
                <span className="text-white font-bold text-lg">
                  ${parseFloat(amount || "0").toLocaleString()}
                </span>
              </div>
              <div className="h-px bg-gray-700"></div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Status:</span>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-semibold">Active</span>
                </div>
              </div>
            </div>

            {/* Badge Section */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full blur-lg opacity-50"></div>
                    <div className="relative bg-gradient-to-br from-orange-500 to-pink-500 rounded-full p-6">
                      <Crown className="w-12 h-12 text-white" />
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-white font-bold text-lg">
                    Premium Token Holder
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    You are now part of the exclusive 1% of 1%
                  </p>
                </div>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="space-y-3">
              <p className="text-white font-semibold text-sm">
                Your Benefits Include:
              </p>
              <ul className="space-y-2">
                {[
                  "Early access to token distribution",
                  "Exclusive investment opportunities",
                  "VIP priority support",
                  "Quarterly wealth strategy consultations",
                  "Legacy building resources",
                ].map((benefit, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 text-gray-300 text-sm"
                  >
                    <Check className="w-4 h-4 text-green-400" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
            >
              Continue to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenDistributionModal;
