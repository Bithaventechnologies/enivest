/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";
import Table from "../components/Table";
import Cookies from "js-cookie";
import { formatBalance, numberFormatter } from "./depositUser";
import AdminPageHeader from "./AdminPageHeader";

const PendingKyc = () => {
  const [kycs, setKycs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedKyc, setSelectedKyc] = useState<any>(null);
  const [action, setAction] = useState<
    "approved" | "decline" | "processing" | "in_progress"
  >("approved");
  const [declineReason, setDeclineReason] = useState("");

  const [token] = useState<string | undefined>(Cookies.get("authToken"));

  useEffect(() => {
    getPendingKycs();
  }, []);

  const getPendingKycs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_DEVE_URL}/transaction`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!Array.isArray(response.data.data)) {
        throw new Error("Unexpected response format");
      }

      const pendingKycs = response.data.data.filter(
        (kyc: any) =>
          kyc.type === "kyc_fee" &&
          kyc.userId &&
          !["approved", "declined"].includes(kyc.userId.kyc?.status || "")
      );

      setKycs(pendingKycs);
    } catch (error: any) {
      console.error("Error fetching pending kycs:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (kyc: any) => {
    setSelectedKyc(kyc);
    setAction("approved");
    setDeclineReason("");
    setIsModalOpen(true);
  };

  const handleProcessKyc = async () => {
    if (!selectedKyc || !action) return;
    setLoading(true);

    try {
      const endpoint = `/transaction/${selectedKyc._id}/status`;
      await axios.patch(
        `${import.meta.env.VITE_DEVE_URL}${endpoint}`,
        {
          status: action,
          reason: action === "decline" ? declineReason : undefined,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      getPendingKycs(); // Refresh the list
      setIsModalOpen(false);
    } catch (error: any) {
      console.error(`${action} failed:`, error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

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
    { key: "kycStatus", title: "Kyc Status" },
    { key: "date", title: "Request Date" },
    { key: "action", title: "Action" },
  ];

  const dataWithActions = kycs.map((kyc, index) => ({
    "S/N": index + 1,
    ...kyc,
    name: (kyc.userId?.name || "").toUpperCase(),
    email: kyc.userId?.email || "",
    amount: `${numberFormatter(kyc.amount)} ${kyc.currency}`,
    currency: kyc.currency.toUpperCase(),
    type: kyc.type.toUpperCase(),
    status: (
      <span
        className={`text-sm ${
          kyc.status === "approved" ? "text-green-400" : "text-yellow-400"
        }`}
      >
        {formatStatus(kyc.status)}
      </span>
    ),
    kycStatus: (
      <span
        className={`text-sm ${
          kyc.userId.kyc?.status === "approved"
            ? "text-green-400"
            : "text-yellow-400"
        }`}
      >
        {formatStatus(kyc.userId.kyc?.status || "")}
      </span>
    ),
    date: new Date(kyc.createdAt).toLocaleDateString(),
    action: (
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg shadow-md transition"
        onClick={() => openModal(kyc)}
      >
        View / Process
      </button>
    ),
  }));

  return (
    <div className="min-h-full p-4 sm:p-6 lg:p-8">
      <AdminPageHeader title="KYC reviews" description="Inspect submitted verification details and process outstanding requests." />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        {loading ? (
          <p className="text-center text-gray-500">Loading kycs...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <Table columns={columns} data={dataWithActions} />
        )}
      </div>

      {isModalOpen && selectedKyc && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Process KYC Request
            </h2>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Name:</strong> {selectedKyc.userId?.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedKyc.userId?.email}
              </p>
              <p>
                <strong>Amount:</strong>{" "}
                {formatBalance(
                  selectedKyc.amount,
                  selectedKyc.currency.toUpperCase()
                )}
              </p>
              <p>
                <strong>Status:</strong> {formatStatus(selectedKyc.status)}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedKyc.createdAt).toLocaleString()}
              </p>

              {/* KYC Images */}
              {selectedKyc.frontImage && (
                <div>
                  <strong>Front Image:</strong>
                  <img
                    src={selectedKyc.frontImage}
                    alt="Front KYC"
                    className="w-full rounded-lg mt-2"
                  />
                </div>
              )}
              {selectedKyc.backImage && (
                <div>
                  <strong>Back Image:</strong>
                  <img
                    src={selectedKyc.backImage}
                    alt="Back KYC"
                    className="w-full rounded-lg mt-2"
                  />
                </div>
              )}
            </div>
            {/* KYC Details */}
            {selectedKyc.userId?.kyc && (
              <div className="mt-4 space-y-3">
                <h3 className="text-lg font-semibold text-gray-800">
                  KYC Information
                </h3>

                {selectedKyc.userId.kyc.fullName && (
                  <p>
                    <strong>Full Name:</strong>{" "}
                    {selectedKyc.userId.kyc.fullName}
                  </p>
                )}

                {selectedKyc.userId.kyc.dob && (
                  <p>
                    <strong>Date of Birth:</strong> {selectedKyc.userId.kyc.dob}
                  </p>
                )}

                {selectedKyc.userId.kyc.country && (
                  <p>
                    <strong>Country:</strong> {selectedKyc.userId.kyc.country}
                  </p>
                )}

                {selectedKyc.userId.kyc.address && (
                  <p>
                    <strong>Address:</strong> {selectedKyc.userId.kyc.address}
                  </p>
                )}

                {/* KYC Uploaded Images */}
                {/* KYC Uploaded Images */}
                {selectedKyc.userId.kyc.frontIdUrl && (
                  <div className="mt-3">
                    <strong>Front ID:</strong>
                    <img
                      src={selectedKyc.userId.kyc.frontIdUrl}
                      alt="Front ID"
                      className="w-full rounded-lg mt-2 border"
                    />
                    <a
                      href={selectedKyc.userId.kyc.frontIdUrl}
                      download="front-id.jpg"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                    >
                      ⬇️ Download Front ID
                    </a>
                  </div>
                )}

                {selectedKyc.userId.kyc.backIdUrl && (
                  <div className="mt-3">
                    <strong>Back ID:</strong>
                    <img
                      src={selectedKyc.userId.kyc.backIdUrl}
                      alt="Back ID"
                      className="w-full rounded-lg mt-2 border"
                    />
                    <a
                      href={selectedKyc.userId.kyc.backIdUrl}
                      download="back-id.jpg"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                    >
                      ⬇️ Download Back ID
                    </a>
                  </div>
                )}

                {selectedKyc.userId.kyc.selfieUrl && (
                  <div className="mt-3">
                    <strong>Selfie:</strong>
                    <img
                      src={selectedKyc.userId.kyc.selfieUrl}
                      alt="Selfie"
                      className="w-full rounded-lg mt-2 border"
                    />
                    <a
                      href={selectedKyc.userId.kyc.selfieUrl}
                      download="selfie.jpg"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                    >
                      ⬇️ Download Selfie
                    </a>
                  </div>
                )}
              </div>
            )}
            {/* Action Selection */}
            <div className="mt-6">
              <label className="block font-semibold mb-2">Select Action</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg"
                value={action}
                onChange={(e) => setAction(e.target.value as any)}
              >
                <option value="approved">Approve</option>
                <option value="decline">Decline</option>
                <option value="processing">Processing</option>
                <option value="in_progress">In Progress</option>
              </select>
            </div>
            {/* Decline Reason */}
            {action === "decline" && (
              <div className="mt-4">
                <label className="block font-semibold mb-2">
                  Reason for Decline
                </label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  rows={3}
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  placeholder="Enter reason for declining this KYC..."
                />
              </div>
            )}
            <div className="flex justify-end gap-4 mt-6">
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
                onClick={handleProcessKyc}
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

export default PendingKyc;

export const downloadImage = (url: string, filename: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
