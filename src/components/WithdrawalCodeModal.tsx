import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDownToLine,
  Check,
  Info,
  Wallet,
  X,
} from "lucide-react";

interface WithdrawalCodeModalProps {
  show: boolean;
  isVerifying: boolean;
  onVerify: (withdrawal: WithdrawalData) => void;
  onClose: () => void;

  // User's actual available balance
  availableBalance?: number;
}

export interface WithdrawalData {
  asset: "BTC" | "ETH" | "XRP" | "USDT";
  network: "Bitcoin" | "Ethereum" | "XRP Ledger" | "TRON (TRC20)";
  amount: number;
  walletAddress: string;
  destinationTag?: string;
}

type Asset = {
  symbol: "BTC" | "ETH" | "XRP" | "USDT";
  name: string;
  network: string;
  icon: string;
  fee: number;
  decimals: number;
  color: string;
  bgColor: string;
  borderColor: string;
};

const assets: Asset[] = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    network: "Bitcoin",
    icon: "₿",
    fee: 0.0001,
    decimals: 8,
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/40",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    network: "Ethereum",
    icon: "Ξ",
    fee: 0.002,
    decimals: 6,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/40",
  },
  {
    symbol: "XRP",
    name: "XRP",
    network: "XRP Ledger",
    icon: "X",
    fee: 0.25,
    decimals: 6,
    color: "text-gray-200",
    bgColor: "bg-gray-500/10",
    borderColor: "border-gray-400/40",
  },
  {
    symbol: "USDT",
    name: "Tether",
    network: "TRON (TRC20)",
    icon: "₮",
    fee: 1,
    decimals: 2,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/40",
  },
];

const WithdrawalCodeModal: React.FC<WithdrawalCodeModalProps> = ({
  show,
  isVerifying,
  onVerify,
  onClose,
  availableBalance = 0,
}) => {
  const [selectedAsset, setSelectedAsset] = useState<Asset>(assets[0]);
  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [destinationTag, setDestinationTag] = useState("");
  const [touched, setTouched] = useState(false);

  /*
   * Reset the form whenever the modal is closed.
   */
  useEffect(() => {
    if (!show) {
      setSelectedAsset(assets[0]);
      setAmount("");
      setWalletAddress("");
      setDestinationTag("");
      setTouched(false);
    }
  }, [show]);

  /*
   * Convert amount safely to a number.
   */
  const numericAmount = useMemo(() => {
    if (!amount.trim()) {
      return 0;
    }

    const parsed = Number(amount);

    return Number.isFinite(parsed) ? parsed : 0;
  }, [amount]);

  const fee = selectedAsset.fee;

  /*
   * Amount must:
   * - exist
   * - be greater than zero
   * - not exceed available balance
   * - be greater than the withdrawal fee
   */
  const isAmountValid =
    numericAmount > 0 &&
    Number.isFinite(numericAmount) &&
    numericAmount <= availableBalance &&
    numericAmount > fee;

  /*
   * Amount validation used specifically for enabling
   * the Continue CTA.
   *
   * This is intentionally NOT checking the wallet address.
   *
   * UX:
   *
   * Select asset
   *      ↓
   * Enter valid amount
   *      ↓
   * Continue becomes active
   *      ↓
   * User clicks Continue
   *      ↓
   * Wallet/address validation happens
   */
  const canContinue = isAmountValid;

  /*
   * Calculate how much the user will receive after the fee.
   */
  const receivedAmount = useMemo(() => {
    if (!isAmountValid) {
      if (numericAmount <= 0) {
        return 0;
      }

      return Math.max(numericAmount - fee, 0);
    }

    return numericAmount - fee;
  }, [numericAmount, fee, isAmountValid]);

  /*
   * Wallet address validation.
   */
  const isAddressValid = useMemo(() => {
    const address = walletAddress.trim();

    if (!address) {
      return false;
    }

    switch (selectedAsset.symbol) {
      case "BTC":
        /*
         * Basic Bitcoin validation.
         * Supports:
         * - Legacy addresses: 1...
         * - P2SH addresses: 3...
         * - Bech32 addresses: bc1...
         */
        return /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,87}$/.test(address);

      case "ETH":
        /*
         * Ethereum address:
         * 0x + 40 hexadecimal characters
         */
        return /^0x[a-fA-F0-9]{40}$/.test(address);

      case "XRP":
        /*
         * XRP Ledger classic address.
         */
        return /^r[1-9A-HJ-NP-Za-km-z]{24,34}$/.test(address);

      case "USDT":
        /*
         * USDT on TRON/TRC20.
         */
        return /^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(address);

      default:
        return false;
    }
  }, [walletAddress, selectedAsset.symbol]);

  /*
   * XRP destination tag is optional.
   *
   * If supplied, it must contain numbers only.
   */
  const isXrpTagValid =
    selectedAsset.symbol !== "XRP" ||
    destinationTag.trim() === "" ||
    /^\d+$/.test(destinationTag.trim());

  /*
   * Full form validation.
   *
   * This is intentionally separate from canContinue.
   */
  const isFormValid =
    isAmountValid && isAddressValid && isXrpTagValid;

  /*
   * Change selected asset.
   */
  const handleAssetChange = (asset: Asset) => {
    if (isVerifying) {
      return;
    }

    setSelectedAsset(asset);
    setWalletAddress("");
    setDestinationTag("");
    setAmount("");
    setTouched(false);
  };

  /*
   * Handle amount input.
   *
   * Allows:
   * 123
   * 123.
   * 123.45
   *
   * Rejects:
   * 12abc
   * 1..2
   * -10
   */
  const handleAmountChange = (value: string) => {
    if (isVerifying) {
      return;
    }

    if (!/^\d*\.?\d*$/.test(value)) {
      return;
    }

    setAmount(value);
  };

  /*
   * Submit.
   *
   * The button can become active after a valid amount,
   * but we perform the complete validation here.
   */
  const handleSubmit = () => {
    setTouched(true);

    /*
     * Do not continue if amount itself is invalid.
     */
    if (!isAmountValid) {
      return;
    }

    /*
     * Wallet address is required.
     */
    if (!walletAddress.trim()) {
      return;
    }

    /*
     * Wallet address must match the selected network.
     */
    if (!isAddressValid) {
      return;
    }

    /*
     * XRP tag must be valid if provided.
     */
    if (!isXrpTagValid) {
      return;
    }

    const withdrawalData: WithdrawalData = {
      asset: selectedAsset.symbol,
      network: selectedAsset.network as WithdrawalData["network"],
      amount: numericAmount,
      walletAddress: walletAddress.trim(),
      ...(selectedAsset.symbol === "XRP" && destinationTag.trim()
        ? {
            destinationTag: destinationTag.trim(),
          }
        : {}),
    };

    onVerify(withdrawalData);
  };

  /*
   * Set amount to available balance.
   */
  const handleMaxAmount = () => {
    if (isVerifying || availableBalance <= 0) {
      return;
    }

    setAmount(availableBalance.toFixed(selectedAsset.decimals));
    setTouched(true);
  };

  /*
   * Address placeholder based on selected asset.
   */
  const getAddressPlaceholder = () => {
    switch (selectedAsset.symbol) {
      case "BTC":
        return "Enter Bitcoin wallet address";

      case "ETH":
        return "Enter Ethereum wallet address (0x...)";

      case "XRP":
        return "Enter XRP wallet address (r...)";

      case "USDT":
        return "Enter TRON wallet address (T...)";

      default:
        return "Enter wallet address";
    }
  };

  /*
   * Get wallet address error.
   */
  const getAddressError = () => {
    if (!touched) {
      return null;
    }

    const address = walletAddress.trim();

    if (!address) {
      return "Please enter a destination wallet address.";
    }

    if (!isAddressValid) {
      switch (selectedAsset.symbol) {
        case "BTC":
          return "Please enter a valid Bitcoin address.";

        case "ETH":
          return "Please enter a valid Ethereum address.";

        case "XRP":
          return "Please enter a valid XRP address.";

        case "USDT":
          return "Please enter a valid TRON (TRC20) address.";

        default:
          return "Please enter a valid wallet address.";
      }
    }

    return null;
  };

  /*
   * Amount error.
   */
  const getAmountError = () => {
    if (!touched) {
      return null;
    }

    if (!amount.trim()) {
      return "Please enter a withdrawal amount.";
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return "Please enter a valid withdrawal amount.";
    }

    if (numericAmount > availableBalance) {
      return "Amount exceeds your available balance.";
    }

    if (numericAmount <= fee) {
      return `Amount must be greater than the withdrawal fee of ${fee} ${selectedAsset.symbol}.`;
    }

    return null;
  };

  /*
   * Close modal.
   */
  const handleClose = () => {
    if (isVerifying) {
      return;
    }

    onClose();
  };

  return (
    <div
      className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-200 ${
        show
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-800 px-6 py-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-blue-600/10 border border-blue-500/20">
                <ArrowDownToLine className="w-5 h-5 text-blue-400" />
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-white">
                  Withdraw Funds
                </h2>

                <p className="text-gray-400 text-xs sm:text-sm mt-1">
                  Select an asset and enter your withdrawal details.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              disabled={isVerifying}
              className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg p-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Close withdrawal modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Security Information */}
          <div className="flex items-start gap-3 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <Info className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />

            <div>
              <p className="text-sm font-medium text-blue-300">
                Verify your withdrawal details
              </p>

              <p className="text-xs text-blue-200/70 mt-1 leading-relaxed">
                Make sure the wallet address and network are correct before
                continuing. Cryptocurrency transactions cannot usually be
                reversed once submitted.
              </p>
            </div>
          </div>

          {/* Asset Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Select Asset
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {assets.map((asset) => {
                const isSelected =
                  selectedAsset.symbol === asset.symbol;

                return (
                  <button
                    key={asset.symbol}
                    type="button"
                    onClick={() => handleAssetChange(asset)}
                    disabled={isVerifying}
                    className={`relative p-3 rounded-xl border transition-all text-left ${
                      isSelected
                        ? "border-blue-500 bg-blue-500/10 ring-1 ring-blue-500/30"
                        : "border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    )}

                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-xl mb-2 text-xl font-bold border ${asset.bgColor} ${asset.borderColor} ${asset.color}`}
                    >
                      {asset.icon}
                    </div>

                    <p className="text-white font-semibold text-sm">
                      {asset.symbol}
                    </p>

                    <p className="text-gray-500 text-xs mt-0.5">
                      {asset.name}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Network */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Network
            </label>

            <div className="flex items-center justify-between bg-gray-800 border border-gray-700 rounded-xl px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-700">
                  <Wallet className="w-4 h-4 text-gray-300" />
                </div>

                <div>
                  <p className="text-sm font-medium text-white">
                    {selectedAsset.network}
                  </p>

                  <p className="text-xs text-gray-500">
                    {selectedAsset.symbol} withdrawal network
                  </p>
                </div>
              </div>

              <Check className="w-4 h-4 text-green-400" />
            </div>
          </div>

          {/* Amount */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="withdrawal-amount"
                className="text-sm font-medium text-gray-300"
              >
                Withdrawal Amount
              </label>

              <span className="text-xs text-gray-500">
                Available:{" "}
                <span className="text-gray-300">
                  {availableBalance.toFixed(selectedAsset.decimals)}{" "}
                  {selectedAsset.symbol}
                </span>
              </span>
            </div>

            <div className="relative">
              <input
                id="withdrawal-amount"
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                onBlur={() => setTouched(true)}
                disabled={isVerifying}
                placeholder="0.00"
                autoComplete="off"
                className={`w-full bg-gray-800 border rounded-xl pl-4 pr-24 py-3.5 text-white text-lg focus:outline-none focus:ring-1 transition-all ${
                  getAmountError()
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : isAmountValid
                      ? "border-green-500/50 focus:border-green-500 focus:ring-green-500"
                      : "border-gray-700 focus:border-blue-500 focus:ring-blue-500"
                } disabled:opacity-50`}
              />

              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleMaxAmount}
                  disabled={isVerifying || availableBalance <= 0}
                  className="text-xs font-medium text-blue-400 hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  MAX
                </button>

                <span className="text-sm font-semibold text-gray-300 pr-2">
                  {selectedAsset.symbol}
                </span>
              </div>
            </div>

            {getAmountError() && (
              <p className="text-xs text-red-400 mt-2">
                {getAmountError()}
              </p>
            )}

            {!getAmountError() && isAmountValid && (
              <p className="text-xs text-green-400 mt-2">
                Amount is valid. You can continue.
              </p>
            )}
          </div>

          {/* Wallet Address */}
          <div>
            <label
              htmlFor="withdrawal-wallet-address"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Destination Wallet Address
            </label>

            <input
              id="withdrawal-wallet-address"
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              onBlur={() => setTouched(true)}
              disabled={isVerifying}
              placeholder={getAddressPlaceholder()}
              autoComplete="off"
              spellCheck={false}
              className={`w-full bg-gray-800 border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 transition-all ${
                getAddressError()
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : isAddressValid
                    ? "border-green-500/50 focus:border-green-500 focus:ring-green-500"
                    : "border-gray-700 focus:border-blue-500 focus:ring-blue-500"
              } disabled:opacity-50`}
            />

            {getAddressError() && (
              <p className="text-xs text-red-400 mt-2">
                {getAddressError()}
              </p>
            )}

            {isAddressValid && (
              <p className="text-xs text-green-400 mt-2">
                Wallet address looks valid.
              </p>
            )}

            {selectedAsset.symbol === "USDT" && (
              <div className="flex items-start gap-2 mt-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />

                <p className="text-xs text-yellow-400/90">
                  Only send USDT to a TRON (TRC20) compatible address.
                  Sending USDT through another network may result in permanent
                  loss of funds.
                </p>
              </div>
            )}
          </div>

          {/* XRP Destination Tag */}
          {selectedAsset.symbol === "XRP" && (
            <div>
              <label
                htmlFor="xrp-destination-tag"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Destination Tag / Memo
                <span className="text-gray-500 font-normal ml-1">
                  (if required)
                </span>
              </label>

              <input
                id="xrp-destination-tag"
                type="text"
                inputMode="numeric"
                value={destinationTag}
                onChange={(e) => {
                  const value = e.target.value;

                  if (/^\d*$/.test(value)) {
                    setDestinationTag(value);
                  }
                }}
                disabled={isVerifying}
                placeholder="Enter destination tag"
                autoComplete="off"
                className={`w-full bg-gray-800 border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 transition-all ${
                  touched && !isXrpTagValid
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-700 focus:border-blue-500 focus:ring-blue-500"
                } disabled:opacity-50`}
              />

              <p className="text-xs text-gray-500 mt-2">
                Some XRP exchanges and custodial wallets require a destination
                tag. Check your receiving wallet before submitting.
              </p>

              {touched && !isXrpTagValid && (
                <p className="text-xs text-red-400 mt-2">
                  Destination tag must contain numbers only.
                </p>
              )}
            </div>
          )}

          {/* Withdrawal Summary */}
          <div className="rounded-xl border border-gray-700 bg-gray-800/50 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-700">
              <h3 className="text-sm font-semibold text-white">
                Withdrawal Summary
              </h3>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  Asset
                </span>

                <span className="text-sm font-medium text-white">
                  {selectedAsset.name} ({selectedAsset.symbol})
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  Network
                </span>

                <span className="text-sm text-gray-300">
                  {selectedAsset.network}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  Withdrawal amount
                </span>

                <span className="text-sm font-medium text-white">
                  {numericAmount > 0
                    ? numericAmount.toFixed(selectedAsset.decimals)
                    : "0.00"}{" "}
                  {selectedAsset.symbol}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  Network / withdrawal fee
                </span>

                <span className="text-sm text-gray-300">
                  {fee} {selectedAsset.symbol}
                </span>
              </div>

              <div className="border-t border-gray-700 pt-3 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-300">
                  You will receive
                </span>

                <span className="text-base font-semibold text-green-400">
                  {receivedAmount > 0
                    ? receivedAmount.toFixed(selectedAsset.decimals)
                    : "0.00"}{" "}
                  {selectedAsset.symbol}
                </span>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" />

            <p className="text-xs text-yellow-200/80 leading-relaxed">
              Please carefully verify the destination address and network.
              Cryptocurrency withdrawals are generally irreversible once
              confirmed.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
            {/* Cancel */}
            <button
              type="button"
              onClick={handleClose}
              disabled={isVerifying}
              className="flex-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-medium py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>

            {/* Continue */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canContinue || isVerifying}
              className={`flex-1 font-medium py-3 px-4 rounded-xl transition-all shadow-lg ${
                canContinue && !isVerifying
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed opacity-60"
              }`}
            >
              {isVerifying ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                "Continue Withdrawal"
              )}
            </button>
          </div>

          {/* Helpful CTA message */}
          {!canContinue && !isVerifying && (
            <p className="text-center text-xs text-gray-500">
              Enter a valid withdrawal amount to continue.
            </p>
          )}

          {canContinue &&
            !isFormValid &&
            !isVerifying && (
              <p className="text-center text-xs text-gray-500">
                Enter and verify your destination wallet address before
                submitting.
              </p>
            )}
        </div>
      </div>
    </div>
  );
};

export default WithdrawalCodeModal;