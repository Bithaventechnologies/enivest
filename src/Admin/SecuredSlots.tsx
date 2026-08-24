/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Table from "../components/Table";
import Cookies from "js-cookie";
import axios from "axios";
import { Banknote, RefreshCw, UsersRound } from "lucide-react";
import AdminPageHeader from "./AdminPageHeader";

interface SecuredSlot {
  slotId: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  currency: string;
  status: string;
  securedAt: string;
}

const SecuredSlots = () => {
  const [slots, setSlots] = useState<SecuredSlot[]>([]);
  const [token] = useState<string | undefined>(Cookies.get("authToken"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalSlots, setTotalSlots] = useState(0);
  const [totalInvested, setTotalInvested] = useState(0);

  const tokenDistributionBaseUrl = (() => {
    const baseUrl = (import.meta.env.VITE_DEVE_URL || "").replace(/\/+$/, "");

    return `${baseUrl}/token-distribution`;
  })();

  useEffect(() => {
    if (!token) return;

    fetchSecuredSlots();
  }, [token]);

  const fetchSecuredSlots = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${tokenDistributionBaseUrl}/admin/all-slots`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Response from /admin/all-slots:", response.data);

      /*
        API RESPONSE:

        response.data
          └── data
               ├── total
               ├── page
               ├── limit
               └── data[]
                    ├── slot
                    │    ├── id
                    │    ├── amount
                    │    ├── currency
                    │    ├── status
                    │    └── securedAt
                    │
                    └── user
                         ├── id
                         ├── email
                         └── name
      */

      const apiData = response.data?.data;

      const rawSlots = Array.isArray(apiData?.data) ? apiData.data : [];

      console.log("Raw slots:", rawSlots);

      // Flatten slot + user into one object
      const mappedSlots: SecuredSlot[] = rawSlots.map((item: any) => ({
        slotId: item?.slot?.id || "",
        userId: item?.user?.id || "",
        userName: item?.user?.name || "N/A",
        userEmail: item?.user?.email || "N/A",
        amount: Number(item?.slot?.amount) || 0,
        currency: item?.slot?.currency || "N/A",
        status: item?.slot?.status || "N/A",
        securedAt: item?.slot?.securedAt || "",
      }));

      console.log("Mapped slots:", mappedSlots);

      setSlots(mappedSlots);

      // Total slots from API
      setTotalSlots(Number(apiData?.total) || mappedSlots.length);

      // Calculate total investment
      const total = mappedSlots.reduce((sum, slot) => sum + slot.amount, 0);

      setTotalInvested(total);
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to load secured slots";

      setError(`❌ ${message}`);

      console.error("Error fetching secured slots:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);

      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return `${currency} ${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const columns = [
    {
      key: "S/N",
      title: "S/N",
    },
    {
      key: "userName",
      title: "User Name",
    },
    {
      key: "userEmail",
      title: "User Email",
    },
    {
      key: "amount",
      title: "Investment Amount",
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
      key: "securedAt",
      title: "Secured Date",
    },
  ];

  const dataWithFormatting = slots.map((slot, index) => ({
    ...slot,

    "S/N": index + 1,

    amount: formatAmount(slot.amount, slot.currency),

    status: (
      <span
        className={`px-3 py-1 rounded-full text-sm font-semibold ${
          slot.status === "active"
            ? "bg-emerald-100 text-emerald-800"
            : slot.status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : slot.status === "cancelled"
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-800"
        }`}
      >
        {slot.status
          ? slot.status.charAt(0).toUpperCase() + slot.status.slice(1)
          : "N/A"}
      </span>
    ),

    securedAt: formatDate(slot.securedAt),
  }));

  return (
    <div className="min-h-full p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <AdminPageHeader title="Secured slots" description="Monitor all user-secured token distribution investments." />

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Total Slots */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Secured Slots
                </p>

                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  {loading ? "..." : totalSlots}
                </p>
              </div>

              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600"><UsersRound className="h-6 w-6" /></div>
            </div>
          </div>

          {/* Total Invested */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Invested
                </p>

                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  {loading
                    ? "..."
                    : `$${totalInvested.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`}
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600"><Banknote className="h-6 w-6" /></div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>

            <button
              onClick={fetchSecuredSlots}
              className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Table */}
        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Table Header */}
          <div className="border-b border-slate-100 p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                All Slots ({slots.length})
              </h3>

              <button
                onClick={fetchSecuredSlots}
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50 sm:w-auto"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> {loading ? "Loading..." : "Refresh"}
              </button>
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">Loading secured slots...</p>
            </div>
          ) : slots.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No secured slots found</p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto pb-14">
              <div className="min-w-[900px]">
                <Table columns={columns} data={dataWithFormatting} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecuredSlots;
