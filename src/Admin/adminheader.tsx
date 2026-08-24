import { MdOutlineMenu } from "react-icons/md";
import { Bell, ShieldCheck } from "lucide-react";
import { useLocation } from "react-router-dom";

interface UserHedeprops {
  active: boolean;
  setActive: (active: boolean) => void;
}

const pageNames: Record<string, string> = {
  "admin-overview": "Dashboard", "all-users": "Users", "all-wallets": "Wallets",
  "deposit-user": "User wallets", "pending-withdraw": "Pending transactions",
  "pending-kycs": "KYC reviews", "admin-settings": "Settings", "secured-slots": "Secured slots",
};

const AdminHeader: React.FC<UserHedeprops> = ({ active, setActive }) => {
  const location = useLocation();
  const pageName = pageNames[location.pathname.split("/").pop() || ""] || "Administration";

  return (
    <header className="flex h-20 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button aria-label="Open navigation" className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden" onClick={() => setActive(!active)}><MdOutlineMenu className="text-2xl" /></button>
        <div className="min-w-0"><p className="text-xs font-medium text-slate-400">Admin / {pageName}</p><p className="truncate text-lg font-semibold text-slate-900">{pageName}</p></div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <button aria-label="Notifications" className="hidden rounded-lg p-2.5 text-slate-500 transition hover:bg-slate-100 sm:block"><Bell className="h-5 w-5" /></button>
        <div className="flex items-center gap-2 border-l border-slate-200 pl-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-600"><ShieldCheck className="h-5 w-5" /></div><div className="hidden sm:block"><p className="text-sm font-medium text-slate-700">Administrator</p><p className="text-xs text-slate-400">Secure session</p></div></div>
      </div>
    </header>
  );
};

export default AdminHeader;
