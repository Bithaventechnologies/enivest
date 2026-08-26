/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Modal from "../components/ChnagePasswordModal";
import AdminPageHeader from "./AdminPageHeader";

const Settings = () => {
  const [walletAddresses, setWalletAddresses] = useState({
    eth: "",
    usdt: "",
    usdc: "",
    sol: "",
    xrp: "",
    btc: "",
  });

  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [token] = useState<string | undefined>(Cookies.get("authToken"));
  const [distributionSettings, setDistributionSettings] = useState({
    minInvestmentAmount: 5000,
    maxInvestmentAmount: 500000,
    isActive: true,
  });

  const tokenDistributionBaseUrl = (() => {
    const baseUrl = (import.meta.env.VITE_DEVE_URL || "").replace(/\/+$/, "");

    return `${baseUrl}/token-distribution`;
  })();

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchWalletAddresses();
    fetchTokenDistributionSettings();
  }, []);

  const fetchWalletAddresses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_DEVE_URL}/wallet/get-wallets-addresses`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = response.data.data[0];

      if (data) {     
            setWalletAddresses({
          eth: data.eth || "",
          usdt: data.usdt || "",
          usdc: data.usdc || "",
          xrp: data.xrp || "",
          sol: data.sol || "",
          btc: data.btc || "",
        });
      }
    } catch (error: any) {
      console.error("Error fetching wallet addresses:", error.message);
      setError("Failed to load wallet addresses");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    setPasswordError("");

    if (!password) {
      setError("Password is required to update wallet addresses");
      setLoading(false);
      return;
    }

    try {
      await axios.patch(
        `${import.meta.env.VITE_DEVE_URL}/wallet/update-wallets-addresses`,
        {
          ...walletAddresses,
          password,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setSuccess("Wallet addresses updated successfully");
      setPassword("");
      fetchWalletAddresses();
    } catch (error: any) {
      console.error("Error saving wallet addresses:", error.message);
      const errorMessage =
        error.response?.data?.message || "Failed to update wallet addresses";
      setError(
        errorMessage.includes("password") ? "Incorrect password" : errorMessage,
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchTokenDistributionSettings = async () => {
    try {
      setError("");
      const response = await axios.get(
        `${tokenDistributionBaseUrl}/admin/settings`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const settings = response.data?.data || {};
      setDistributionSettings({
        minInvestmentAmount: Number(settings.minInvestmentAmount ?? 5000),
        maxInvestmentAmount: Number(settings.maxInvestmentAmount ?? 500000),
        isActive: Boolean(settings.isActive ?? true),
      });
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Failed to load token distribution settings";
      setError(message);
      console.error(
        "Error fetching token distribution settings:",
        error.message,
      );
    }
  };

  const handleSaveDistributionSettings = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // Validate inputs
      if (distributionSettings.minInvestmentAmount <= 0) {
        setError("Minimum investment amount must be greater than 0");
        setLoading(false);
        return;
      }

      if (
        distributionSettings.maxInvestmentAmount <
        distributionSettings.minInvestmentAmount
      ) {
        setError("Maximum amount cannot be less than minimum amount");
        setLoading(false);
        return;
      }

      const response = await axios.patch(
        `${tokenDistributionBaseUrl}/admin/settings`,
        distributionSettings,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const settings = response.data?.data || distributionSettings;
      setDistributionSettings({
        minInvestmentAmount: Number(settings.minInvestmentAmount ?? 5000),
        maxInvestmentAmount: Number(settings.maxInvestmentAmount ?? 500000),
        isActive: Boolean(settings.isActive ?? true),
      });

      setSuccess("✓ Token distribution settings updated successfully");
    } catch (error: any) {
      console.error(
        "Error updating token distribution settings:",
        error.message,
      );
      const message =
        error.response?.data?.message ||
        "Failed to update token distribution settings";
      setError(`❌ ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPasswordError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_DEVE_URL}/auth/reset-password`,
        {
          email: Cookies.get("userEmail"),
          newPassword,
          confirmPassword,
          role: "admin",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setSuccess("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error changing password:", error.message);
      const errorMessage =
        error.response?.data?.message || "Failed to change password";
      setPasswordError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full p-4 sm:p-6 lg:p-8">
      <AdminPageHeader title="Settings" description="Configure wallet addresses, token distribution limits, and account security." />

      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : success ? (
          <p className="text-center text-green-500">{success}</p>
        ) : null}

        <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50/60 p-5">
          <h3 className="mb-1 text-lg font-semibold text-slate-900">
            Token Distribution Settings
          </h3>
          <p className="mb-5 text-sm text-slate-500">Set the active investment window for the distribution event.</p>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Minimum investment amount (USD)
              </label>
              <input
                type="number"
                min={1000}
                step={100}
                value={distributionSettings.minInvestmentAmount}
                onChange={(e) =>
                  setDistributionSettings((prev) => ({
                    ...prev,
                    minInvestmentAmount: Number(e.target.value || 0),
                  }))
                }
                className="w-full rounded-xl border border-amber-300 bg-white p-3 text-gray-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Maximum investment amount (USD)
              </label>
              <input
                type="number"
                min={distributionSettings.minInvestmentAmount}
                step={100}
                value={distributionSettings.maxInvestmentAmount}
                onChange={(e) =>
                  setDistributionSettings((prev) => ({
                    ...prev,
                    maxInvestmentAmount: Number(e.target.value || 0),
                  }))
                }
                className="w-full rounded-xl border border-amber-300 bg-white p-3 text-gray-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              />
            </div>

            <label className="flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-white p-3">
              <span className="text-sm font-semibold text-gray-700">
                Event active
              </span>
              <input
                type="checkbox"
                checked={distributionSettings.isActive}
                onChange={(e) =>
                  setDistributionSettings((prev) => ({
                    ...prev,
                    isActive: e.target.checked,
                  }))
                }
                className="h-5 w-5 accent-amber-500"
              />
            </label>

            <button
              type="button"
              onClick={handleSaveDistributionSettings}
              className="w-full rounded-xl bg-amber-600 px-4 py-3 font-semibold text-white transition hover:bg-amber-700 disabled:opacity-60"
            >
              Save Distribution Settings
            </button>
          </div>
        </div>

        <div className="mb-5 border-b border-slate-200 pb-4"><h3 className="text-lg font-semibold text-slate-900">Wallet addresses</h3><p className="mt-1 text-sm text-slate-500">Update the receiving address for each supported asset.</p></div>
        <form onSubmit={handleSaveChanges} className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
          {/* ETH Wallet Address */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              ETH Wallet Address
            </label>
            <input
              type="text"
              value={walletAddresses.eth}
              onChange={(e) =>
                setWalletAddresses((prev) => ({ ...prev, eth: e.target.value }))
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter ETH wallet address"
            />
          </div>

          {/* USDT Wallet Address */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              USDT Wallet Address
            </label>
            <input
              type="text"
              value={walletAddresses.usdt}
              onChange={(e) =>
                setWalletAddresses((prev) => ({
                  ...prev,
                  usdt: e.target.value,
                }))
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter USDT wallet address"
            />
          </div>

          {/* USDC Wallet Address */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              USDC Wallet Address
            </label>
            <input
              type="text"
              value={walletAddresses.usdc}
              onChange={(e) =>
                setWalletAddresses((prev) => ({
                  ...prev,
                  usdc: e.target.value,
                }))
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter USDC wallet address"
            />
          </div>

          {/* SOL Wallet Address */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              SOL Wallet Address
            </label>
            <input
              type="text"
              value={walletAddresses.sol}
              onChange={(e) =>
                setWalletAddresses((prev) => ({ ...prev, sol: e.target.value }))
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter SOL wallet address"
            />
          </div>

          {/* BTC Wallet Address */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              BTC Wallet Address
            </label>
            <input
              type="text"
              value={walletAddresses.btc}
              onChange={(e) =>
                setWalletAddresses((prev) => ({ ...prev, btc: e.target.value }))
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter BTC wallet address"
            />
          </div>

          {/* XRP Wallet Address */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              XRP Wallet Address
            </label>
            <input
              type="text"
              value={walletAddresses.xrp}
              onChange={(e) =>
                setWalletAddresses((prev) => ({ ...prev, xrp: e.target.value }))
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter XRP wallet address"
            />
          </div>

          {/* Update Wallet Pin */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Update Wallet Pin
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your Wallet Pin"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white px-4 py-3 rounded-xl hover:bg-indigo-700 shadow-md transition sm:col-span-2"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>

        {/* Button to open the change password modal */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Change Password
        </button>
      </div>

      {/* Modal Component */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleChangePassword}
        currentPassword={currentPassword}
        setCurrentPassword={setCurrentPassword}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        passwordError={passwordError}
      />
    </div>
  );
};

export default Settings;
