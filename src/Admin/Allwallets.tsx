/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Table from "../components/Table";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import AdminPageHeader from "./AdminPageHeader";

// Define Wallet Type
interface Wallet {
  id: string; // IDs from MongoDB are usually strings
  type: string;
  address: string;
  secretKey: string;
}

const Allwallets = () => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [token] = useState<string | undefined>(Cookies.get("authToken"));
  const [loading, setLoading] = useState(false);

  console.log(loading);

  const getAllWallets = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_DEVE_URL}/wallet`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setWallets(response.data.data);
      setLoading(false);
    } catch (error: any) {
      console.error("Error fetching wallets:", error.message);
      toast.error(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    setLoading(true);

    getAllWallets();
  }, [token]);

  const handleDelete = async (id: string) => {
    setLoading(true); // Start loading

    try {
      // Call API to delete the wallet
      const response = await axios.delete(
        `${import.meta.env.VITE_DEVE_URL}/wallet/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.status === 200) {
        setWallets(wallets.filter((wallet) => wallet.id !== id));

        await getAllWallets();
        toast.success("Wallet deleted successfully");
      } else {
        toast.error("Failed to delete wallet");
      }
    } catch (error: any) {
      console.error("Error deleting wallet:", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const columns = [
    { key: "walletType", title: "Wallet Type" },
    { key: "passPhrase", title: "Secret Phrase" },
    { key: "apiKey", title: "Api Key" },
    { key: "apiSecret", title: "Secret Key" },
    { key: "action", title: "Action" },
  ];

  const dataWithActions = wallets.map((wallet: any) => ({
    ...wallet,
    action: (
      <button
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        onClick={() => handleDelete(wallet._id)}
      >
        Delete
      </button>
    ),
  }));

  return (
    <div className="min-h-full p-4 sm:p-6 lg:p-8">
      <AdminPageHeader title="Wallets" description="View connected wallet records and their associated credentials." />
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 px-5 py-4"><p className="text-sm font-semibold text-slate-800">All wallet records</p></div><div className="p-4 sm:p-5"><Table columns={columns} data={dataWithActions} /></div></div>
    </div>
  );
};

export default Allwallets;
