/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

import Table from "../components/Table";
import AdminPageHeader from "./AdminPageHeader";
import { formatBalance } from "./depositUser";

const GetTransactions = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [token] = useState<string | undefined>(
    Cookies.get("authToken"),
  );

  // Filters
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currencyFilter, setCurrencyFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    getTransactions();
  }, []);

  const getTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${import.meta.env.VITE_DEVE_URL}/transaction`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!Array.isArray(response.data?.data)) {
        throw new Error("Unexpected response format");
      }

      setTransactions(response.data.data);
    } catch (error: any) {
      console.error(
        "Error fetching transactions:",
        error.response?.data || error.message,
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch transactions.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Format transaction status
  const formatStatus = (status: string) => {
    if (!status) return "Unknown";

    if (status === "in_progress") {
      return "In Progress";
    }

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1)
    );
  };

  // Status styling
  const getStatusClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "text-green-600 bg-green-100";

      case "completed":
        return "text-green-600 bg-green-100";

      case "pending":
        return "text-yellow-600 bg-yellow-100";

      case "processing":
        return "text-blue-600 bg-blue-100";

      case "in_progress":
        return "text-blue-600 bg-blue-100";

      case "declined":
      case "decline":
      case "failed":
        return "text-red-600 bg-red-100";

      case "cancelled":
        return "text-gray-600 bg-gray-100";

      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesType =
        typeFilter === "all" ||
        transaction.type?.toLowerCase() ===
          typeFilter.toLowerCase();

      const matchesStatus =
        statusFilter === "all" ||
        transaction.status?.toLowerCase() ===
          statusFilter.toLowerCase();

      const matchesCurrency =
        currencyFilter === "all" ||
        transaction.currency?.toLowerCase() ===
          currencyFilter.toLowerCase();

      const searchValue =
        search.trim().toLowerCase();

      const matchesSearch =
        !searchValue ||
        transaction.userId?.name
          ?.toLowerCase()
          .includes(searchValue) ||
        transaction.userId?.email
          ?.toLowerCase()
          .includes(searchValue) ||
        transaction.currency
          ?.toLowerCase()
          .includes(searchValue) ||
        transaction.type
          ?.toLowerCase()
          .includes(searchValue) ||
        transaction.status
          ?.toLowerCase()
          .includes(searchValue) ||
        transaction._id
          ?.toLowerCase()
          .includes(searchValue);

      return (
        matchesType &&
        matchesStatus &&
        matchesCurrency &&
        matchesSearch
      );
    });
  }, [
    transactions,
    typeFilter,
    statusFilter,
    currencyFilter,
    search,
  ]);

  const columns = [
    {
      key: "S/N",
      title: "S/N",
    },
    {
      key: "name",
      title: "Full Name",
    },
    {
      key: "email",
      title: "Email",
    },
    {
      key: "amount",
      title: "Amount",
    },
    {
      key: "type",
      title: "Type",
    },
    {
      key: "currency",
      title: "Currency",
    },
    {
      key: "status",
      title: "Status",
    },
    {
      key: "date",
      title: "Transaction Date",
    },
  ];

  const dataWithActions =
    filteredTransactions.map(
      (transaction, index) => ({
        "S/N": index + 1,

        ...transaction,

        name: (
          transaction.userId?.name || "Unknown"
        ).toUpperCase(),

        email:
          transaction.userId?.email || "N/A",

        amount: formatBalance(
          transaction.amount,
          transaction.currency?.toUpperCase(),
        ),

        type: (
          transaction.type || "Unknown"
        ).toUpperCase(),

        currency: (
          transaction.currency || "N/A"
        ).toUpperCase(),

        status: (
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
              transaction.status,
            )}`}
          >
            {formatStatus(transaction.status)}
          </span>
        ),

        date: transaction.createdAt
          ? new Date(
              transaction.createdAt,
            ).toLocaleString()
          : "N/A",
      }),
    );

  return (
    <div className="min-h-full p-4 sm:p-6 lg:p-8">
      <AdminPageHeader
        title="All Transactions"
        description="View and monitor all user transactions across the platform."
      />

      {/* Filters */}
      <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Search
            </label>

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Name, email, ID..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Type */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Transaction Type
            </label>

            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="all">
                All Types
              </option>

              <option value="deposit">
                Deposits
              </option>

              <option value="withdrawal">
                Withdrawals
              </option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Status
            </label>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="all">
                All Statuses
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="processing">
                Processing
              </option>

              <option value="in_progress">
                In Progress
              </option>

              <option value="approved">
                Approved
              </option>

              <option value="completed">
                Completed
              </option>

              <option value="decline">
                Declined
              </option>

              <option value="failed">
                Failed
              </option>
            </select>
          </div>

          {/* Currency */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Currency
            </label>

            <select
              value={currencyFilter}
              onChange={(e) =>
                setCurrencyFilter(e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="all">
                All Currencies
              </option>

              <option value="BTC">
                BTC
              </option>

              <option value="ETH">
                ETH
              </option>

              <option value="XRP">
                XRP
              </option>

              <option value="USDT">
                USDT
              </option>
            </select>
          </div>
        </div>

        {/* Filter summary */}
        <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-800">
              {filteredTransactions.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-800">
              {transactions.length}
            </span>{" "}
            transactions
          </p>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setTypeFilter("all");
              setStatusFilter("all");
              setCurrencyFilter("all");
            }}
            className="w-fit rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Transactions */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        {loading ? (
          <div className="flex min-h-[250px] items-center justify-center">
            <div className="flex items-center gap-3 text-gray-500">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
              <span>
                Loading transactions...
              </span>
            </div>
          </div>
        ) : error ? (
          <div className="flex min-h-[250px] flex-col items-center justify-center gap-4">
            <p className="text-center text-red-500">
              {error}
            </p>

            <button
              type="button"
              onClick={getTransactions}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : filteredTransactions.length ===
          0 ? (
          <div className="flex min-h-[250px] items-center justify-center">
            <p className="text-center text-gray-500">
              No transactions found.
            </p>
          </div>
        ) : (
          <Table
            columns={columns}
            data={dataWithActions}
          />
        )}
      </div>
    </div>
  );
};

export default GetTransactions;