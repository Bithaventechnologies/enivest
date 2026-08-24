import type { ReactNode } from "react";

interface AdminPageHeaderProps {
  title: string;
  description: string;
  children?: ReactNode;
}

const AdminPageHeader = ({ title, description, children }: AdminPageHeaderProps) => (
  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
        Administration
      </p>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
        {title}
      </h1>
      <p className="mt-1.5 text-sm text-slate-500">{description}</p>
    </div>
    {children && <div className="shrink-0">{children}</div>}
  </div>
);

export default AdminPageHeader;
