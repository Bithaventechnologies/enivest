import { Outlet } from "react-router-dom";

import Sidebar from "../Admin/sidebar";

import AdminHeader from "../Admin/adminheader";
import { useState } from "react";

const Adminlayout = () => {
  const [active, setActive] = useState(false);

  return (
    <div className="admin-shell flex h-dvh w-full max-w-none overflow-hidden bg-slate-50">
      <Sidebar active={active} setActive={setActive} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader active={active} setActive={setActive} />
        <main className="min-h-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Adminlayout;
