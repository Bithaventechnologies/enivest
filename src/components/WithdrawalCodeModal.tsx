import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDownToLine,
  Check,
  Info,
  Wallet,
  X,
} from "lucide-react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

/* =========================================================
   TYPES
========================================================= */

export type Currency = "BTC" | "ETH" | "XRP" | "USDT";

export type WithdrawalNetwork =
  | "Bitcoin"
  | "Ethereum"
  | "XRP Ledger"
  | "TRON (TRC20)";

export interface Transaction {
  _id: string;
  userId: string;
  type: string;
  amount: number;
  currency: Currency;
  status: string;
  depositAddress?: string | null;
  fee: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface WithdrawalRequest {
  currency: Currency;
  amount: number;
  walletAddress: string;
  network: WithdrawalNetwork;
}

export interface WithdrawalApiResponse {
  success?: boolean;
  status?: number;
  message?: string;
  data?: unknown;
  [key: string]: unknown;
}

interface WithdrawalCodeModalProps {
  show: boolean;

  transactions: Transaction[];

  onClose: () => void;

  onSuccess?: (
    response: WithdrawalApiResponse,
  ) => void;
}

/* =========================================================
   ASSET CONFIGURATION
========================================================= */

interface Asset {
  symbol: Currency;
  name: string;
  network: WithdrawalNetwork;
  icon: string;
  fee: number;
  decimals: number;
  textColor: string;
  bgColor: string;
  borderColor: string;
}

const assets: Asset[] = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    network: "Bitcoin",
    icon: "₿",
    fee: 0.0001,
    decimals: 8,
    textColor: "text-orange-400",
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
    textColor: "text-purple-400",
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
    textColor: "text-gray-200",
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
    textColor: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/40",
  },
];

/* =========================================================
   COMPONENT
========================================================= */

const WithdrawalCodeModal: React.FC<
  WithdrawalCodeModalProps
> = ({
  show,
  transactions,
  onClose,
  onSuccess,
}) => {
  const [selectedAsset, setSelectedAsset] =
    useState<Asset>(assets[0]);

  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] =
    useState("");

  const [destinationTag, setDestinationTag] =
    useState("");

  const [touched, setTouched] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [apiError, setApiError] =
    useState<string | null>(null);

  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);

     const [token] = useState<string | undefined>(Cookies.get("authToken"));



      

  /* =========================================================
     RESET MODAL
  ========================================================= */

  useEffect(() => {
    if (!show) {
      setSelectedAsset(assets[0]);
      setAmount("");
      setWalletAddress("");
      setDestinationTag("");
      setTouched(false);
      setApiError(null);
      setSuccessMessage(null);
      setIsSubmitting(false);
    }
  }, [show]);

  /* =========================================================
     CALCULATE AVAILABLE BALANCE
     
     Balance is calculated from approved transactions
     for the currently selected currency.
  ========================================================= */

  const availableBalance = useMemo(() => {
    return (transactions ?? [])
      .filter(
        (transaction) =>
          transaction.currency ===
            selectedAsset.symbol &&
          transaction.status.toLowerCase() ===
            "approved",
      )
      .reduce((total, transaction) => {
        const transactionType =
          transaction.type.toLowerCase();

        if (
          transactionType === "deposit"
        ) {
          return total + Number(transaction.amount);
        }

        if (
          transactionType === "withdrawal"
        ) {
          return total - Number(transaction.amount);
        }

        return total;
      }, 0);
  }, [
    transactions,
    selectedAsset.symbol,
  ]);

  /* =========================================================
     NUMBER FORMATTER
  ========================================================= */

  const formatAmount = (
    value: number,
  ) => {
    return value.toLocaleString(
      undefined,
      {
        minimumFractionDigits: 0,
        maximumFractionDigits:
          selectedAsset.decimals,
      },
    );
  };

  /* =========================================================
     NUMERIC AMOUNT
  ========================================================= */

  const numericAmount = useMemo(() => {
    if (!amount.trim()) {
      return 0;
    }

    const parsed = Number(amount);

    return Number.isFinite(parsed)
      ? parsed
      : 0;
  }, [amount]);

  /* =========================================================
     FEE
  ========================================================= */

  const withdrawalFee =
    selectedAsset.fee;

  /* =========================================================
     AMOUNT VALIDATION
  ========================================================= */

  const isAmountValid =
    numericAmount > 0 &&
    numericAmount <=
      availableBalance &&
    numericAmount >
      withdrawalFee;

  /* =========================================================
     RECEIVED AMOUNT
  ========================================================= */

  const receivedAmount = Math.max(
    numericAmount -
      withdrawalFee,
    0,
  );

  /* =========================================================
     WALLET ADDRESS VALIDATION
  ========================================================= */

  const isAddressValid =
    useMemo(() => {
      const address =
        walletAddress.trim();

      if (!address) {
        return false;
      }

      switch (
        selectedAsset.symbol
      ) {
        case "BTC":
          /*
           * Bitcoin:
           * Legacy: 1...
           * P2SH:    3...
           * Bech32:  bc1...
           */
          return /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,87}$/.test(
            address,
          );

        case "ETH":
          /*
           * Ethereum:
           * 0x + 40 hexadecimal characters
           */
          return /^0x[a-fA-F0-9]{40}$/.test(
            address,
          );

        case "XRP":
          /*
           * XRP Ledger address
           */
          return /^r[1-9A-HJ-NP-Za-km-z]{24,34}$/.test(
            address,
          );

        case "USDT":
          /*
           * TRON / TRC20
           */
          return /^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(
            address,
          );

        default:
          return false;
      }
    }, [
      walletAddress,
      selectedAsset.symbol,
    ]);

  /* =========================================================
     XRP DESTINATION TAG
  ========================================================= */

  const isXrpTagValid =
    selectedAsset.symbol !==
      "XRP" ||
    destinationTag.trim() === "" ||
    /^\d+$/.test(
      destinationTag.trim(),
    );

  /* =========================================================
     COMPLETE FORM VALIDATION
  ========================================================= */

  const isFormValid =
    isAmountValid &&
    isAddressValid &&
    isXrpTagValid;

  /* =========================================================
     AMOUNT ERROR
  ========================================================= */

  const getAmountError = () => {
    if (!touched) {
      return null;
    }

    if (!amount.trim()) {
      return "Please enter a withdrawal amount.";
    }

    if (
      !Number.isFinite(
        numericAmount,
      ) ||
      numericAmount <= 0
    ) {
      return "Please enter a valid withdrawal amount.";
    }

    if (
      availableBalance <= 0
    ) {
      return `You do not have any available ${selectedAsset.symbol} balance.`;
    }

    if (
      numericAmount >
      availableBalance
    ) {
      return `Insufficient ${selectedAsset.symbol} balance. Available: ${formatAmount(
        availableBalance,
      )} ${selectedAsset.symbol}.`;
    }

    if (
      numericAmount <=
      withdrawalFee
    ) {
      return `Amount must be greater than the withdrawal fee of ${withdrawalFee} ${selectedAsset.symbol}.`;
    }

    return null;
  };

  /* =========================================================
     ADDRESS ERROR
  ========================================================= */

  const getAddressError = () => {
    if (!touched) {
      return null;
    }

    if (!walletAddress.trim()) {
      return "Please enter a destination wallet address.";
    }

    if (!isAddressValid) {
      switch (
        selectedAsset.symbol
      ) {
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

  /* =========================================================
     SELECT ASSET
  ========================================================= */

  const handleAssetChange = (
    asset: Asset,
  ) => {
    if (isSubmitting) {
      return;
    }

    setSelectedAsset(asset);

    setAmount("");
    setWalletAddress("");
    setDestinationTag("");

    setTouched(false);

    setApiError(null);
    setSuccessMessage(null);
  };

  /* =========================================================
     AMOUNT CHANGE
  ========================================================= */

  const handleAmountChange = (
    value: string,
  ) => {
    if (isSubmitting) {
      return;
    }

    if (!/^\d*\.?\d*$/.test(value)) {
      return;
    }

    setAmount(value);

    setApiError(null);
    setSuccessMessage(null);
  };

  /* =========================================================
     MAX BUTTON
  ========================================================= */

  const handleMaxAmount = () => {
    if (
      isSubmitting ||
      availableBalance <= 0
    ) {
      return;
    }

    /*
     * We don't automatically subtract the fee here.
     *
     * The user is selecting the maximum amount
     * they want to withdraw, and the summary shows
     * the amount remaining after the fee.
     */
    setAmount(
      availableBalance.toFixed(
        selectedAsset.decimals,
      ),
    );

    setTouched(true);

    setApiError(null);
  };

  /* =========================================================
     WITHDRAWAL API
     
     POST /transaction/withdraw/confirm

     BODY:

     {
       currency,
       amount,
       walletAddress,
       network
     }
  ========================================================= */

  const confirmWithdrawal = async (
    withdrawal: WithdrawalRequest,
  ): Promise<WithdrawalApiResponse> => {
   

    if (!token) {
      throw new Error(
        "Your session has expired. Please log in again.",
      );
    }

    const response =
      await fetch(
        `${import.meta.env.VITE_DEVE_URL}/transaction/withdraw/confirm`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(
            withdrawal,
          ),
        },
      );

    let data: WithdrawalApiResponse =
      {};

    try {
      data =
        await response.json();
    } catch {
      data = {};
    }

    if (!response.ok) {
      throw new Error(
        typeof data.message ===
          "string"
          ? data.message
          : `Withdrawal failed with status ${response.status}`,
      );
    }

    return data;
  };

  /* =========================================================
     SUBMIT WITHDRAWAL
  ========================================================= */

const handleSubmit = async () => {
  setTouched(true);
  setApiError(null);
  setSuccessMessage(null);

  if (!isAmountValid) {
    return;
  }

  if (!walletAddress.trim() || !isAddressValid) {
    return;
  }

  if (!isXrpTagValid) {
    return;
  }

  const withdrawalData: WithdrawalRequest = {
    currency: selectedAsset.symbol,
    amount: numericAmount,
    walletAddress: walletAddress.trim(),
    network: selectedAsset.network,
  };

  const toastId = toast.loading(
    `Processing ${selectedAsset.symbol} withdrawal...`,
  );

  try {
    setIsSubmitting(true);

    console.log(
      "Withdrawal request:",
      withdrawalData,
    );

    const response = await confirmWithdrawal(
      withdrawalData,
    );

    console.log(
      "Withdrawal response:",
      response,
    );

    toast.update(toastId, {
      render:
        response.message ||
        "Withdrawal request submitted successfully.",
      type: "success",
      isLoading: false,
      autoClose: 4000,
      closeOnClick: true,
    });

    setSuccessMessage(
      response.message ||
        "Withdrawal request submitted successfully.",
    );

    onSuccess?.(response);

    setTimeout(() => {
      onClose();
    }, 1200);
  } catch (error) {
    console.error(
      "Withdrawal error:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong while processing the withdrawal.";

    setApiError(message);

    toast.update(toastId, {
      render: message,
      type: "error",
      isLoading: false,
      autoClose: 5000,
      closeOnClick: true,
    });
  } finally {
    setIsSubmitting(false);
  }
};

  /* =========================================================
     CLOSE
  ========================================================= */

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    onClose();
  };

  /* =========================================================
     ADDRESS PLACEHOLDER
  ========================================================= */

  const getAddressPlaceholder =
    () => {
      switch (
        selectedAsset.symbol
      ) {
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

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-all duration-200 ${
        show
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
    >
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="sticky top-0 z-10 border-b border-gray-800 bg-gray-900 px-6 py-5">
          <div className="flex items-start justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-600/10">
                <ArrowDownToLine className="h-5 w-5 text-blue-400" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white sm:text-xl">
                  Withdraw Funds
                </h2>

                <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                  Select an asset and enter your withdrawal details.
                </p>
              </div>

            </div>

            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>

          </div>
        </div>

        <div className="space-y-6 p-6">

          {/* =================================================
              INFORMATION
          ================================================= */}

          <div className="flex items-start gap-3 rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">

            <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />

            <div>
              <p className="text-sm font-medium text-blue-300">
                Verify your withdrawal details
              </p>

              <p className="mt-1 text-xs leading-relaxed text-blue-200/70">
                Make sure the wallet address and network are correct
                before submitting. Cryptocurrency transactions may
                not be reversible.
              </p>
            </div>

          </div>

          {/* =================================================
              API ERROR
          ================================================= */}

          {apiError && (
            <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4">

              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />

              <div>
                <p className="text-sm font-medium text-red-300">
                  Withdrawal failed
                </p>

                <p className="mt-1 text-xs text-red-200/80">
                  {apiError}
                </p>
              </div>

            </div>
          )}

          {/* =================================================
              SUCCESS
          ================================================= */}

          {successMessage && (
            <div className="flex items-start gap-3 rounded-xl border border-green-500/20 bg-green-500/10 p-4">

              <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-400" />

              <div>
                <p className="text-sm font-medium text-green-300">
                  Withdrawal submitted
                </p>

                <p className="mt-1 text-xs text-green-200/80">
                  {successMessage}
                </p>
              </div>

            </div>
          )}

          {/* =================================================
              ASSET SELECTION
          ================================================= */}

          <div>

            <label className="mb-3 block text-sm font-medium text-gray-300">
              Select Asset
            </label>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

              {assets.map(
                (asset) => {
                  const isSelected =
                    selectedAsset.symbol ===
                    asset.symbol;

                  return (
                    <button
                      key={
                        asset.symbol
                      }
                      type="button"
                      onClick={() =>
                        handleAssetChange(
                          asset,
                        )
                      }
                      disabled={
                        isSubmitting
                      }
                      className={`relative rounded-xl border p-3 text-left transition-all ${
                        isSelected
                          ? "border-blue-500 bg-blue-500/10 ring-1 ring-blue-500/30"
                          : "border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800"
                      } disabled:cursor-not-allowed disabled:opacity-50`}
                    >

                      {isSelected && (
                        <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}

                      <div
                        className={`mb-2 flex h-10 w-10 items-center justify-center rounded-xl border text-xl font-bold ${asset.bgColor} ${asset.borderColor} ${asset.textColor}`}
                      >
                        {asset.icon}
                      </div>

                      <p className="text-sm font-semibold text-white">
                        {asset.symbol}
                      </p>

                      <p className="mt-0.5 text-xs text-gray-500">
                        {asset.name}
                      </p>

                    </button>
                  );
                },
              )}

            </div>

          </div>

          {/* =================================================
              AVAILABLE BALANCE
          ================================================= */}

          <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-4">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border text-lg font-bold ${selectedAsset.bgColor} ${selectedAsset.borderColor} ${selectedAsset.textColor}`}
                >
                  {selectedAsset.icon}
                </div>

                <div>

                  <p className="text-xs text-gray-500">
                    Available Balance
                  </p>

                  <p className="mt-0.5 text-base font-semibold text-white">
                    {formatAmount(
                      availableBalance,
                    )}{" "}
                    {selectedAsset.symbol}
                  </p>

                </div>

              </div>

              <Wallet className="h-5 w-5 text-gray-500" />

            </div>

            {availableBalance <=
              0 && (
              <p className="mt-3 text-xs text-yellow-400">
                You don't have an available{" "}
                {
                  selectedAsset.symbol
                }{" "}
                balance to withdraw.
              </p>
            )}

          </div>

          {/* =================================================
              NETWORK
          ================================================= */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-300">
              Network
            </label>

            <div className="flex items-center justify-between rounded-xl border border-gray-700 bg-gray-800 px-4 py-3">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-700">
                  <Wallet className="h-4 w-4 text-gray-300" />
                </div>

                <div>

                  <p className="text-sm font-medium text-white">
                    {
                      selectedAsset.network
                    }
                  </p>

                  <p className="text-xs text-gray-500">
                    {
                      selectedAsset.symbol
                    }{" "}
                    withdrawal network
                  </p>

                </div>

              </div>

              <Check className="h-4 w-4 text-green-400" />

            </div>

          </div>

          {/* =================================================
              AMOUNT
          ================================================= */}

          <div>

            <div className="mb-2 flex items-center justify-between">

              <label
                htmlFor="withdrawal-amount"
                className="text-sm font-medium text-gray-300"
              >
                Withdrawal Amount
              </label>

              <span className="text-xs text-gray-500">
                Available:{" "}
                <span className="text-gray-300">
                  {formatAmount(
                    availableBalance,
                  )}{" "}
                  {
                    selectedAsset.symbol
                  }
                </span>
              </span>

            </div>

            <div className="relative">

              <input
                id="withdrawal-amount"
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) =>
                  handleAmountChange(
                    e.target.value,
                  )
                }
                onBlur={() =>
                  setTouched(true)
                }
                disabled={
                  isSubmitting
                }
                placeholder="0.00"
                autoComplete="off"
                className={`w-full rounded-xl border bg-gray-800 py-3.5 pl-4 pr-24 text-lg text-white transition-all focus:outline-none focus:ring-1 ${
                  getAmountError()
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-700 focus:border-blue-500 focus:ring-blue-500"
                } disabled:opacity-50`}
              />

              <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-2">

                <button
                  type="button"
                  onClick={
                    handleMaxAmount
                  }
                  disabled={
                    isSubmitting ||
                    availableBalance <=
                      0
                  }
                  className="text-xs font-medium text-blue-400 hover:text-blue-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  MAX
                </button>

                <span className="pr-2 text-sm font-semibold text-gray-300">
                  {
                    selectedAsset.symbol
                  }
                </span>

              </div>

            </div>

            {getAmountError() && (
              <p className="mt-2 text-xs text-red-400">
                {getAmountError()}
              </p>
            )}

          </div>

          {/* =================================================
              WALLET ADDRESS
          ================================================= */}

          <div>

            <label
              htmlFor="withdrawal-wallet-address"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Destination Wallet Address
            </label>

            <input
              id="withdrawal-wallet-address"
              type="text"
              value={
                walletAddress
              }
              onChange={(e) => {
                setWalletAddress(
                  e.target.value,
                );

                setApiError(null);
                setSuccessMessage(
                  null,
                );
              }}
              onBlur={() =>
                setTouched(true)
              }
              disabled={
                isSubmitting
              }
              placeholder={getAddressPlaceholder()}
              autoComplete="off"
              spellCheck={false}
              className={`w-full rounded-xl border bg-gray-800 px-4 py-3 text-sm text-white transition-all focus:outline-none focus:ring-1 ${
                getAddressError()
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-700 focus:border-blue-500 focus:ring-blue-500"
              } disabled:opacity-50`}
            />

            {getAddressError() && (
              <p className="mt-2 text-xs text-red-400">
                {getAddressError()}
              </p>
            )}

            {selectedAsset.symbol ===
              "USDT" && (
              <div className="mt-2 flex items-start gap-2">

                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-400" />

                <p className="text-xs text-yellow-400/90">
                  Only send USDT using the TRON
                  (TRC20) network.
                </p>

              </div>
            )}

          </div>

          {/* =================================================
              XRP DESTINATION TAG
          ================================================= */}

          {selectedAsset.symbol ===
            "XRP" && (
            <div>

              <label
                htmlFor="xrp-destination-tag"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Destination Tag / Memo{" "}
                <span className="font-normal text-gray-500">
                  (if required)
                </span>
              </label>

              <input
                id="xrp-destination-tag"
                type="text"
                inputMode="numeric"
                value={
                  destinationTag
                }
                onChange={(e) => {
                  const value =
                    e.target.value;

                  if (
                    /^\d*$/.test(
                      value,
                    )
                  ) {
                    setDestinationTag(
                      value,
                    );
                  }
                }}
                disabled={
                  isSubmitting
                }
                placeholder="Enter destination tag"
                className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
              />

              <p className="mt-2 text-xs text-gray-500">
                Some XRP exchanges and wallets
                require a destination tag.
              </p>

            </div>
          )}

          {/* =================================================
              SUMMARY
          ================================================= */}

          <div className="overflow-hidden rounded-xl border border-gray-700 bg-gray-800/50">

            <div className="border-b border-gray-700 px-4 py-3">
              <h3 className="text-sm font-semibold text-white">
                Withdrawal Summary
              </h3>
            </div>

            <div className="space-y-3 p-4">

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  Currency
                </span>

                <span className="text-sm font-medium text-white">
                  {
                    selectedAsset.name
                  }{" "}
                  (
                  {
                    selectedAsset.symbol
                  }
                  )
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  Network
                </span>

                <span className="text-sm text-gray-300">
                  {
                    selectedAsset.network
                  }
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  Available
                </span>

                <span className="text-sm text-gray-300">
                  {formatAmount(
                    availableBalance,
                  )}{" "}
                  {
                    selectedAsset.symbol
                  }
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  Withdrawal amount
                </span>

                <span className="text-sm font-medium text-white">
                  {numericAmount >
                  0
                    ? formatAmount(
                        numericAmount,
                      )
                    : "0"}{" "}
                  {
                    selectedAsset.symbol
                  }
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  Withdrawal fee
                </span>

                <span className="text-sm text-gray-300">
                  {
                    withdrawalFee
                  }{" "}
                  {
                    selectedAsset.symbol
                  }
                </span>
              </div>

              <div className="border-t border-gray-700 pt-3">

                <div className="flex items-center justify-between">

                  <span className="text-sm font-medium text-gray-300">
                    You will receive
                  </span>

                  <span className="text-base font-semibold text-green-400">
                    {receivedAmount >
                    0
                      ? formatAmount(
                          receivedAmount,
                        )
                      : "0"}{" "}
                    {
                      selectedAsset.symbol
                    }
                  </span>

                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              WARNING
          ================================================= */}

          <div className="flex items-start gap-3 rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4">

            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-400" />

            <p className="text-xs leading-relaxed text-yellow-200/80">
              Please carefully verify the destination
              address and network. Cryptocurrency
              withdrawals are generally irreversible
              once confirmed.
            </p>

          </div>

          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">

            <button
              type="button"
              onClick={
                handleClose
              }
              disabled={
                isSubmitting
              }
              className="flex-1 rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 font-medium text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={
                handleSubmit
              }
              disabled={
                !isFormValid ||
                isSubmitting
              }
              className={`flex-1 rounded-xl px-4 py-3 font-medium transition-all ${
                isFormValid &&
                !isSubmitting
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
                  : "cursor-not-allowed bg-gray-700 text-gray-400 opacity-60"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Processing...
                </span>
              ) : (
                "Continue Withdrawal"
              )}
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};

export default WithdrawalCodeModal;