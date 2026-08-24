import { ArrowRight, CreditCard, Settings, ShieldCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";
import AdminPageHeader from "./AdminPageHeader";

const adminLinks = [
  { title: "Users", description: "Review account records and KYC fee settings.", to: "../all-users", icon: Users },
  { title: "Transactions", description: "Process outstanding withdrawal requests.", to: "../pending-withdraw", icon: CreditCard },
  { title: "KYC reviews", description: "Inspect and process verification submissions.", to: "../pending-kycs", icon: ShieldCheck },
  { title: "Settings", description: "Manage wallet addresses and distribution controls.", to: "../admin-settings", icon: Settings },
];

const AdminOverview = () => (
  <div className="min-h-full p-4 sm:p-6 lg:p-8">
    <AdminPageHeader title="Dashboard" description="A focused starting point for the administration workspace." />
    <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5 sm:p-7">
      <p className="text-sm font-semibold text-indigo-700">Administration workspace</p>
      <h2 className="mt-1 text-xl font-semibold text-slate-900">Manage your platform with confidence.</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Choose a workspace below to review live records, approvals, wallet controls, and account settings. No placeholder metrics are shown here.</p>
    </div>
    <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {adminLinks.map(({ title, description, to, icon: Icon }) => (
        <Link key={title} to={to} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 group-hover:bg-indigo-50 group-hover:text-indigo-600"><Icon className="h-5 w-5" /></div>
          <h3 className="mt-5 font-semibold text-slate-900">{title}</h3><p className="mt-1 text-sm leading-5 text-slate-500">{description}</p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-indigo-600">Open <ArrowRight className="h-4 w-4" /></span>
        </Link>
      ))}
    </div>
  </div>
);

export default AdminOverview;
