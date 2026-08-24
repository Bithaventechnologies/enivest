/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import useUpdateUserProfile from "./useUpdateProfile";
import Cookies from "js-cookie";
import axios from "axios";
import KycPaymentModal from "./KycPaymentModal";

type KycStatus =
  | "not_submitted"
  | "processing"
  | "approved"
  | "declined"
  | "in_progress";

interface KycModalProps {
  show: boolean;
  onClose: () => void;
  availableTokens: any;
}

const KycModal: React.FC<KycModalProps> = ({
  show,
  onClose,
  availableTokens,
}) => {
  const [user, setUser] = useState<any>([]);
  const [fullName, setFullName] = useState(user?.kyc?.fullName || "");
  const [dob, setDob] = useState(user?.kyc?.dob || "");
  const [country, setCountry] = useState(user?.kyc?.country || "");
  const [address, setAddress] = useState(user?.kyc?.address || "");
  const [frontId, setFrontId] = useState<File | null>(null);
  const [backId, setBackId] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<KycStatus>("not_submitted");
  const [declineMessage, setDeclineMessage] = useState("");
  const [token] = useState<string | null | any>(Cookies.get("authToken"));
  const [showPayment, setShowPayment] = useState(false);

  const { updateUserProfile, isLoading, error, success } =
    useUpdateUserProfile();

  const getUserProfile = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_DEVE_URL}/user/get-profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const profile = response.data.data;
      setUser(profile);
      setStatus(profile?.kyc?.status || "not_submitted");
      setDeclineMessage(profile?.kyc?.declineMessage || "");
    } catch (error: any) {
      console.error("Error fetching users:", error.message);
    }
  };

  useEffect(() => {
    if (!token) return;
    getUserProfile();
  }, [token, success]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (file: File | null) => void
  ) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (
      !fullName ||
      !dob ||
      !country ||
      !address ||
      !frontId ||
      !backId ||
      !selfie
    ) {
      alert("Please complete all fields and upload all required files.");
      return;
    }

    if (!token) {
      alert("Session Expired, Kindly Login again");
      return;
    }

    setLoading(true);

    try {
      if (!user?.kyc?.feePaid) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setLoading(false);
        setShowPayment(true);
        return;
      }
      const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(
          `${import.meta.env.VITE_DEVE_URL}/media/upload-single`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();
        if (response.ok && data?.data?.mediaUrl) {
          return data?.data?.mediaUrl;
        } else {
          throw new Error(data.message || "Failed to upload file");
        }
      };

      const [frontIdUrl, backIdUrl, selfieUrl] = await Promise.all([
        uploadFile(frontId),
        uploadFile(backId),
        uploadFile(selfie),
      ]);

      const successRes = await updateUserProfile({
        kyc: {
          fullName,
          dob,
          country,
          address,
          status: "in_progress",
          frontIdUrl,
          backIdUrl,
          selfieUrl,
        },
      });

      if (successRes) {
        await getUserProfile();
        alert(
          "✅ KYC Submitted Successfully. Your application is under review."
        );
        setStatus("processing");
      } else {
        alert("Failed to Send ");
      }
    } catch (err: any) {
      console.error("KYC submission failed:", err.message);
      alert(`KYC submission failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setShowPayment(false);
  }, [show]);

  return (
    <>
      {showPayment ? (
        <KycPaymentModal
          show={showPayment}
          availableTokens={availableTokens}
          onClose={() => {
            setShowPayment(false);
            onClose();
            getUserProfile();
          }}
          KYC_FEE_USDT={user?.kyc?.feeUSDT > 0 ? user?.kyc.feeUSDT : undefined}
        />
      ) : (
        <div
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-200 ${
            show
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-lg mx-4 text-white">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">KYC Verification</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white disabled:opacity-50"
                disabled={loading || isLoading}
              >
                ✕
              </button>
            </div>

            {/* Status Messages */}
            {status === "approved" && (
              <div className="p-3 mb-4 rounded-lg bg-green-600/20 border border-green-600 text-green-400">
                ✅ Your KYC is approved.
              </div>
            )}
            {(status === "in_progress" || status === "processing") && (
              <div className="p-3 mb-4 rounded-lg bg-yellow-600/20 border border-yellow-600 text-yellow-400">
                ⏳ Your KYC is under review. Please wait.
              </div>
            )}

            {status === "declined" && (
              <div className="p-3 mb-4 rounded-lg bg-red-600/20 border border-red-600 text-red-400">
                ❌ KYC Declined: {declineMessage}
              </div>
            )}

            {(status === "not_submitted" || status === "declined") && (
              <div className="space-y-4">
                {/* Form Fields... same as before */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={loading || isLoading}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="flex space-x-3">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      disabled={loading || isLoading}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      disabled={loading || isLoading}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Residential Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    disabled={loading || isLoading}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* File Uploads */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Front of ID
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, setFrontId)}
                    disabled={loading || isLoading}
                    className="block w-full text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Back of ID
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, setBackId)}
                    disabled={loading || isLoading}
                    className="block w-full text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Selfie with ID
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, setSelfie)}
                    disabled={loading || isLoading}
                    className="block w-full text-gray-400"
                  />
                </div>

                {/* Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={onClose}
                    disabled={loading || isLoading}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading || isLoading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                  >
                    {loading || isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />{" "}
                        Submitting...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>
              </div>
            )}

            {error && <p className="text-red-400 mt-3">{error}</p>}
          </div>
        </div>
      )}
    </>
  );
};

export default KycModal;
