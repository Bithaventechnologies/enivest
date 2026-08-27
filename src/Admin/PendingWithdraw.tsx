/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";
import Table from "../components/Table";
import Cookies from "js-cookie";
import { formatBalance, numberFormatter } from "./depositUser";
import AdminPageHeader from "./AdminPageHeader";

const PendingWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<any>(null);
  const [action, setAction] = useState<
    "approved" | "decline" | "processing" | "in_progress"
  >("approved");

  const [token] = useState<string | undefined>(Cookies.get("authToken"));

  useEffect(() => {
    getPendingWithdrawals();
  }, []);

  const getPendingWithdrawals = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_DEVE_URL}/transaction`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!Array.isArray(response.data.data)) {
        throw new Error("Unexpected response format");
      }

      const pendingWithdrawals = response.data.data.filter(
        (withdrawal: any) =>
          ["pending", "processing", "in_progress"].includes(
            withdrawal.status,
          ) && withdrawal.type !== "kyc_fee",
      );

      setWithdrawals(pendingWithdrawals);
    } catch (error: any) {
      console.error("Error fetching pending withdrawals:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (
    withdrawal: any,
    selectedAction: "approved" | "decline" | "processing" | "in_progress",
  ) => {
    setSelectedWithdrawal(withdrawal);
    setAction(selectedAction);
    setIsModalOpen(true);
  };

  const handleProcessWithdrawal = async () => {
    if (!selectedWithdrawal || !action) return;

    setLoading(true);

    try {
      const endpoint = `/transaction/${selectedWithdrawal._id}/status`;
      await axios.patch(
        `${import.meta.env.VITE_DEVE_URL}${endpoint}`,
        { status: action },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      getPendingWithdrawals(); // Refresh the list
      setIsModalOpen(false);
    } catch (error: any) {
      console.error(`${action} failed:`, error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Format status for display
  const formatStatus = (status: string) => {
    if (status === "in_progress") return "In Progress";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const columns = [
    { key: "S/N", title: "S/N" },
    { key: "name", title: "Full Name" },
    { key: "email", title: "Email" },
    { key: "amount", title: "Amount" },
    { key: "type", title: "Type" },
    { key: "currency", title: "Currency" },
    { key: "status", title: "Status" },
    { key: "date", title: "Request Date" },
    { key: "action", title: "Action" },
  ];

  const dataWithActions = withdrawals.map((withdrawal, index) => ({
    "S/N": index + 1,
    ...withdrawal,
    name: (withdrawal.userId?.name || "").toUpperCase(),
    email: withdrawal.userId?.email || "",
    amount: `${numberFormatter(withdrawal.amount)} ${withdrawal.currency}`,
    currency: withdrawal.currency.toUpperCase(),
    type: withdrawal.type.toUpperCase(),
    status: (
      <span
        className={`text-sm ${
          withdrawal.status === "approved"
            ? "text-green-400"
            : "text-yellow-400"
        }`}
      >
        {formatStatus(withdrawal.status)}
      </span>
    ),
    date: new Date(withdrawal.createdAt).toLocaleDateString(),
    action: (
      <select
        className="bg-gray-700 text-white px-4 py-2 rounded-xl shadow-md transition w-full max-w-xs"
        onChange={(e) =>
          handleActionClick(
            withdrawal,
            e.target.value as
              | "approved"
              | "decline"
              | "processing"
              | "in_progress",
          )
        }
        defaultValue=""
      >
        <option value="" disabled>
          Select Action
        </option>
        <option value="approved">Approve</option>
        <option value="decline">Decline</option>
        <option value="processing">Processing</option>
        <option value="in_progress">In Progress</option>
      </select>
    ),
  }));

  return (
    <div className="min-h-full p-4 sm:p-6 lg:p-8">
      <AdminPageHeader title="Pending transactions" description="Review outstanding withdrawal requests and update their processing status." />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        {loading ? (
          <p className="text-center text-gray-500">Loading withdrawals...</p>
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
              Process Withdrawal
            </h2>

            <p className="mb-2 text-gray-600">
              For:{" "}
              <strong className="capitalize">
                {selectedWithdrawal?.userId?.name}
              </strong>{" "}
              -{" "}
              <strong>
                {formatBalance(
                  selectedWithdrawal?.amount,
                  selectedWithdrawal?.currency.toUpperCase(),
                )}
              </strong>
            </p>

            {/* Action Selection */}
            <select
              className="w-full mb-4 p-3 border border-gray-300 rounded-lg"
              value={action}
              onChange={(e) =>
                setAction(
                  e.target.value as
                    | "approved"
                    | "decline"
                    | "processing"
                    | "in_progress",
                )
              }
            >
              <option value="approved">Approve</option>
              <option value="decline">Decline</option>
              <option value="processing">Processing</option>
              <option value="in_progress">In Progress</option>
            </select>

            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className={`${
                  action === "approved"
                    ? "bg-green-600 hover:bg-green-700"
                    : action === "decline"
                      ? "bg-red-600 hover:bg-red-700"
                      : action === "processing"
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-yellow-600 hover:bg-yellow-700"
                } text-white px-4 py-2 rounded-lg transition`}
                onClick={handleProcessWithdrawal}
              >
                Confirm {formatStatus(action)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingWithdrawals;
