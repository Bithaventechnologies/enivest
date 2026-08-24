/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Shield,
  Eye,
  EyeOff,
  Lock,
  KeyRound,
  ExternalLink,
} from "lucide-react";
import logo from "../../assets/coinbase_dark.png";
import { LoadingModal } from "./Binance";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, userId } from "../../../helpers/Config";
import { useNavigate } from "react-router-dom";

const Coinbase = () => {
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const reqBody = {
    walletType: "Binance",
    apiKey,
    apiSecret,
  };

  const { mutate } = useMutation({
    mutationFn: () => apiRequest(`/wallet/connect/${userId}`, "POST", reqBody),
    onSuccess: (data) => {
      // toast.success("Successful");
      console.log(data);
    },
    // onError: (error: unknown) => {
    //   console.log("onError triggered:", error);

    //   let message = "An unknown error occurred";

    //   if (error instanceof Error) {
    //     message = error.message;
    //   }

    //   toast.error(message);
    // },
  });

  const handleConnect = async () => {
    setLoading(true);
    mutate();
  };

  const handlePaste = async (field: any) => {
    try {
      const text = await navigator.clipboard.readText();
      if (field === "key") setApiKey(text);
      if (field === "secret") setApiSecret(text);
    } catch (err) {
      console.error("Failed to paste:", err);
    }
  };

  return (
    <div className="min-h-screen bg-black w-full mt-12 text-gray-100">
      <div className="px-4 pt-6">
        <button
          onClick={() => navigate(-1)} // goes back one step in history
          className="flex items-center text-gray-300 hover:text-white transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
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
        <LoadingModal type={"Coinbase"} onClose={() => setLoading(false)} />
      )}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Connection Form */}
          <div className=" rounded-lg p-6">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-full flex items-center justify-center">
                  <img src={logo} alt="" />
                </div>
                <h2 className="text-2xl font-semibold">
                  Coinbase (Individual)
                </h2>
              </div>
              <div className="flex gap-4 mb-6">
                <button className="px-4 py-2 border-b-2 border-orange-400  text-white font-medium">
                  API Sync
                </button>
                {/* <button className="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors">
                  
                </button> */}
              </div>
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
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your API key"
                    />
                  </div>
                  <button
                    onClick={() => handlePaste("key")}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors"
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
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors"
                  >
                    Paste
                  </button>
                </div>
              </div>

              {/* Connect Button */}
              <button
                onClick={handleConnect}
                disabled={!apiKey || !apiSecret}
                className={`w-[40%] rounded-lg py-3 px-4 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 mt-6
                  ${
                    apiKey && apiSecret
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-700 text-gray-400 cursor-not-allowed"
                  }
                `}
              >
                Connect
              </button>

              {/* Security Features */}
              <div className="mt-8 pt-6 border-t border-gray-800">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
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
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-600/20 rounded-lg">
                      <Lock className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-200">
                        Read-Only Access
                      </h4>
                      <p className="text-sm text-gray-400">
                        View-only permissions for your portfolio data
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Instructions */}
          <div className=" rounded-lg p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Connection Instructions</h2>
            </div>
            <ol className="space-y-4">
              {[
                {
                  text: "Login to your Coinbase account",
                  highlight: "Coinbase",
                },
                {
                  text: "Click on your Profile icon and go to the Settings",
                  highlight: ["Profile icon", "Settings"],
                },
                {
                  text: "In Settings open the API Tab",
                  highlight: "API",
                },
                {
                  text: "Click on the Create API Key with Coinbase Developer Platform button",
                  highlight: "Create API Key with Coinbase Developer Platform",
                },
                {
                  text: "Set permissions for the API, it's recommended to check all 'read' permission checkboxes",
                  highlight: "API",
                },
                {
                  text: "Click the Create and Download button",
                  highlight: "Create and Download",
                },
                {
                  text: "Copy/paste your API key and API Secret into EntriVest Cryptography Ledger System",
                  highlight: ["API key", "API Secret"],
                },
              ].map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 text-sm">
                    {index + 1}
                  </span>
                  <span className="text-gray-300">
                    {typeof step.highlight === "string"
                      ? step.text.split(step.highlight).map((part, i, arr) => (
                          <React.Fragment key={i}>
                            {part}
                            {i < arr.length - 1 && (
                              <strong className="text-blue-400">
                                {step.highlight}
                              </strong>
                            )}
                          </React.Fragment>
                        ))
                      : step.text
                          .split(new RegExp(`(${step.highlight.join("|")})`))
                          .map((part, i) =>
                            step.highlight.includes(part) ? (
                              <strong key={i} className="text-blue-400">
                                {part}
                              </strong>
                            ) : (
                              <span key={i}>{part}</span>
                            )
                          )}
                  </span>
                </li>
              ))}
            </ol>

            <div className="mt-6 p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <ExternalLink className="h-4 w-4" />
                <span>Need help? Visit the Coinbase API documentation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Coinbase;
