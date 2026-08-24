import React from "react";
import logo from "../assets/coinstat_logo.png";
import { MdOutlineClear, MdPending, MdOutlineDashboard } from "react-icons/md";
import { PiSwap } from "react-icons/pi";
// import { BiMoneyWithdraw } from "react-icons/bi";
import { MdLogout } from "react-icons/md";
import { TbPackages } from "react-icons/tb";
import { NavLink, useNavigate } from "react-router-dom";
import { FiUsers } from "react-icons/fi";
import Cookies from "js-cookie";
import { Settings, Award } from "lucide-react";

// import { useDispatch } from "react-redux";
// import { clearAdmin } from "../Global/AdminSlice";

interface MenuItem {
  name: string;
  icon: React.ReactElement;
  path: string;
}

interface SidebarProps {
  active: boolean;
  setActive: (active: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ active, setActive }) => {
  const navigate = useNavigate();
  //   const dispatch = useDispatch();

  const handleLogout = () => {
    Cookies.remove("authToken");
    Cookies.remove("userId");

    navigate("/admin-auth/adminlogin");
  };

  const menuItems: MenuItem[] = [
    { name: "Dashboard", icon: <MdOutlineDashboard />, path: "admin-overview" },
    {
      name: "All Users",
      icon: <FiUsers />,
      path: "all-users",
    },
    // { name: "My Assets", icon: <BiMoneyWithdraw />, path: "assets" },
    { name: "All Wallets", icon: <PiSwap />, path: "all-wallets" },
    { name: "Manage User Wallets", icon: <TbPackages />, path: "deposit-user" },
    // { name: "All History", icon: <TbPackages />, path: "all-history" },
    {
      name: "Pending Transactions",
      icon: <MdPending />,
      path: "pending-withdraw",
    },
    {
      name: "Pending Kyc",
      icon: <TbPackages />,
      path: "pending-kycs",
    },
    {
      name: "Admin Settings",
      icon: <Settings />,
      path: "admin-settings",
    },
    {
      name: "Secured Slots",
      icon: <Award />,
      path: "secured-slots",
    },
    // {
    //   name: "Withdraw History",
    //   icon: <TbPackages />,
    //   path: "withdraw-history",
    // },
    // { name: "Plans", icon: <TbPackages />, path: "plans" },
    // { name: "Create Plan", icon: <FaPlus />, path: "createplan" },
    // {
    //   name: "Active Investment",
    //   icon: <TbPackages />,
    //   path: "active-investment",
    // },
    // {
    //   name: "Pending Investment",
    //   icon: <TbPackages />,
    //   path: "pending-investment",
    // },
    // {
    //   name: "Processed Investment",
    //   icon: <TbPackages />,
    //   path: "processed-investment",
    // },
    // { name: "Investment", icon: <TbPackages />, path: "investments" },
    // { name: "Top Earnings", icon: <TbPackages />, path: "top-earnings" },
    // { name: "Earning History", icon: <TbPackages />, path: "earning-history" },
  ];

  const handleMenuClick = (path: string) => {
    navigate(path);
    setActive(false);
  };

  return (
    <>
      {active && <button aria-label="Close navigation" onClick={() => setActive(false)} className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-800 bg-slate-950 text-slate-300 transition-transform duration-200 lg:static lg:translate-x-0 ${active ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="flex h-20 items-center justify-between border-b border-slate-800 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/15 ring-1 ring-inset ring-indigo-400/20">
            <img src={logo} alt="Entrivest" className="h-6 w-6 object-contain" />
          </div>
          <div><p className="text-sm font-semibold text-white">Entrivest</p><p className="text-xs text-slate-500">Admin console</p></div>
        </div>
        <button aria-label="Close navigation" onClick={() => setActive(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"><MdOutlineClear className="text-xl" /></button>
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-6">
        <p className="px-3 pb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Workspace</p>
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <li key={index}>
                <NavLink to={item.path} onClick={() => handleMenuClick(item.path)} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? "bg-indigo-500 text-white shadow-sm" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}>
                  <span className="text-lg">{item.icon}</span><span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="mt-auto border-t border-slate-800 pt-5">
            <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-300 transition hover:bg-rose-500/10 hover:text-rose-200"><MdLogout className="text-lg" />Log out</button>
          </div>
      </div>
    </aside></>
  );
};

export default Sidebar;
