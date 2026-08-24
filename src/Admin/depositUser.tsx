/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";
import Table from "../components/Table";
import Cookies from "js-cookie";
import { useCryptoRates } from "../components/useCryptoRates";
import AdminPageHeader from "./AdminPageHeader";

const ManageUserFunds = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState<
    "deposit" | "withdraw"
  >("deposit");
  const { ethToUsdt, usdtToUsdt, solToUsdt, btcToUsdt, usdcToUsdt, xrpToUsdt } =
    useCryptoRates();

  const [token] = useState<string | undefined>(Cookies.get("authToken"));

  useEffect(() => {
    getAllUsers();
  }, []);

  const getAllUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_DEVE_URL}/user/all-users`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!Array.isArray(response.data.data)) {
        throw new Error("Unexpected response format");
      }

      setUsers(response.data.data);
    } catch (error: any) {
      console.error("Error fetching users:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleManageFundsClick = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleTransaction = async () => {
    if (!selectedUser || !amount) return;

    setLoading(true);

    try {
      const endpoint =
        transactionType === "deposit"
          ? `/user/deposit/${selectedUser._id}`
          : `/user/withdraw/${selectedUser._id}`;

      await axios.patch(
        `${import.meta.env.VITE_DEVE_URL}${endpoint}`,
        {
          amount: Number(amount),
          method: selectedUser.currency || "usdt",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      getAllUsers();
      setIsModalOpen(false);
      setAmount("");
    } catch (error: any) {
      alert(error.response?.data.message ?? `Failed to ${transactionType}`);
    }
  };

  const columns = [
    { key: "S/N", title: "S/N" },
    { key: "name", title: "Full Name" },
    { key: "email", title: "Email" },
    { key: "btcBalance", title: "BTC Balance" },
    { key: "usdtBalance", title: "USDT Balance" },
    { key: "usdcBalance", title: "USDC Balance" },
    { key: "ethBalance", title: "ETH Balance" },
    { key: "xrpBalance", title: "XRP Balance" },
    { key: "solBalance", title: "SOL Balance" },
    { key: "total", title: "Total Portfolio" },
    { key: "action", title: "Action" },
  ];

  const dataWithActions = users.map((user, index) => ({
    "S/N": index + 1,
    ...user,
    name: (user?.name || "").toUpperCase(),
    ethBalance: formatBalance(user.ethBalance, "ETH"),
    usdtBalance: formatBalance(user.usdtBalance, "USDT"),
    usdcBalance: formatBalance(user.usdcBalance, "USDC"),
    solBalance: formatBalance(user.solBalance, "SOL"),
    xrpBalance: formatBalance(user.xrpBalance, "XRP"),
    btcBalance: formatBalance(user.btcBalance, "BTC"),
    total: currencyFormatter.format(
      (user.ethBalance || 0) * ethToUsdt +
        (user.usdtBalance || 0) * usdtToUsdt +
        (user.usdcBalance || 0) * usdcToUsdt +
        (user.xrpBalance || 0) * xrpToUsdt +
        (user.solBalance || 0) * solToUsdt +
        (user.btcBalance || 0) * btcToUsdt,
    ),
    action: (
      <button
        className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 shadow-md transition"
        onClick={() => handleManageFundsClick(user)}
      >
        Manage
      </button>
    ),
  }));

  return (
    <div className="min-h-full p-4 sm:p-6 lg:p-8">
      <AdminPageHeader title="User wallets" description="Review balances and manage deposits or withdrawals for an account." />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        {loading ? (
          <p className="text-center text-gray-500">Loading users...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <Table columns={columns} data={dataWithActions} />
        )}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Manage Funds
            </h2>

            <p className="mb-2 text-gray-600">
              Managing funds for:{" "}
              <strong className="capitalize">{selectedUser?.name}</strong> -{" "}
              <strong>${selectedUser?.totalPortfolio?.toLocaleString()}</strong>
            </p>

            {/* Transaction Type Selection */}
            <select
              className="w-full mb-4 p-3 border border-gray-300 rounded-lg"
              value={transactionType}
              onChange={(e) =>
                setTransactionType(e.target.value as "deposit" | "withdraw")
              }
            >
              <option value="deposit">Deposit</option>
              <option value="withdraw">Withdraw</option>
            </select>

            {/* Currency Selection */}
            <select
              className="w-full mb-4 p-3 border border-gray-300 rounded-lg"
              value={selectedUser?.currency || "usdt"}
              onChange={(e) =>
                setSelectedUser((prev: any) => ({
                  ...prev,
                  currency: e.target.value,
                }))
              }
            >
              <option value="usdt">USDT</option>
              <option value="usdc">USDC</option>
              <option value="btc">BTC</option>
              <option value="eth">ETH</option>
              <option value="sol">SOL</option>
              <option value="xrp">XRP</option>
            </select>

            {/* Amount Input */}
            <input
              type="number"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className={`${
                  transactionType === "deposit"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                } text-white px-4 py-2 rounded-lg transition`}
                onClick={handleTransaction}
              >
                Confirm {transactionType}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUserFunds;

export const numberFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 8,
  useGrouping: true, // Enables thousands separator
}).format;

export const formatBalance = (value: number | undefined, unit: string) => {
  const formattedValue = numberFormatter(value || 0);

  return `${formattedValue} ${unit}`;
};

export const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
