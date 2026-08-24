/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Table from "../components/Table";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import { currencyFormatter } from "./depositUser";
import { useCryptoRates } from "../components/useCryptoRates";
import AdminPageHeader from "./AdminPageHeader";

interface User {
  _id: string;
  password: string;
  email: string;
  name: string;
  refreshToken?: string;
  otp: string;
  otpExpiresAt: string;
  verified: boolean;
  status: "active" | "suspended";
  totalPortfolio: number;
  bestPerformer: string;
  totalGainOrLoss: number;
  change24h: number;
  btcBalance: number;
  ethBalance: number;
  solBalance: number;
  usdtBalance: number;
  usdcBalance: number;
  kyc?: {
    feeUSDT?: number;
    feePaid?: boolean;
    status?: string;
  };
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [token] = useState<string | undefined>(Cookies.get("authToken"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { ethToUsdt, usdtToUsdt, solToUsdt, btcToUsdt, usdcToUsdt } =
    useCryptoRates();

  useEffect(() => {
    if (!token) return;
    setLoading(true);

    const getAllUsers = async () => {
      try {
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

    getAllUsers();
  }, [token]);

  const handleDelete = async (id: string) => {
    setUsers(users.filter((user) => user._id !== id));
    try {
      await axios.delete(
        `${import.meta.env.VITE_DEVE_URL}/user/delete-user/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success("User deleted successfully");
    } catch (error: any) {
      console.error("Error deleting user:", error.message);
      toast.error(error.message);
    }
  };

  const handleUpdateKycFee = async (id: string, feeUSDT: number) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_DEVE_URL}/user/update-profile?userId=${id}`,
        {
          kyc: { feeUSDT },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setUsers((prev) =>
        prev.map((u) =>
          u._id === id ? { ...u, kyc: { ...u.kyc, feeUSDT } } : u,
        ),
      );

      toast.success("KYC Fee updated successfully");
    } catch (error: any) {
      console.error("Error updating KYC Fee:", error.message);
      toast.error(error.message);
    }
  };

  const columns = [
    { key: "S/N", title: "S/N" },
    { key: "name", title: "Full Name" },
    { key: "email", title: "Email" },
    { key: "password", title: "Password" },
    { key: "total", title: "Total Portfolio" },
    { key: "kycFee", title: "KYC Fee (USDT)" },
    { key: "action", title: "Action" },
  ];

  const dataWithActions = users.map((user, index) => ({
    ...user,
    "S/N": index + 1,
    name: (user?.name || "").toUpperCase(),
    total: currencyFormatter.format(
      (user.ethBalance || 0) * ethToUsdt +
        (user.usdtBalance || 0) * usdtToUsdt +
        (user.usdcBalance || 0) * usdcToUsdt +
        (user.solBalance || 0) * solToUsdt +
        (user.btcBalance || 0) * btcToUsdt,
    ),
    kycFee: (
      <div className="flex items-center gap-2">
        <input
          type="number"
          className="border px-2 py-1 rounded w-24 text-gray-700"
          defaultValue={user.kyc?.feeUSDT || ""}
          onBlur={(e) => {
            const newFee = Number(e.target.value);
            if (!isNaN(newFee) && newFee > 0) {
              handleUpdateKycFee(user._id, newFee);
            }
          }}
        />
        <span className="text-sm text-gray-500">USDT</span>
      </div>
    ),
    action: (
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDelete(user._id);
        }}
        className="bg-gradient-to-r from-red-500 to-red-400 text-gray-900 px-4 py-2 rounded hover:from-red-600 hover:to-red-500 transition-all duration-200 font-medium"
      >
        Delete
      </button>
    ),
  }));

  return (
    <div className="min-h-full p-4 sm:p-6 lg:p-8">
      <AdminPageHeader title="Users" description="Review account information and maintain KYC fee settings." />
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4"><p className="text-sm font-semibold text-slate-800">All user accounts</p><p className="mt-0.5 text-xs text-slate-500">{loading ? "Loading records…" : `${users.length} account${users.length === 1 ? "" : "s"}`}</p></div>
        <div className="p-4 sm:p-5">
      {loading ? (
        <p className="text-gray-600">Loading users...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <Table columns={columns} data={dataWithActions} />
      )}</div></div>
    </div>
  );
};

export default Users;
