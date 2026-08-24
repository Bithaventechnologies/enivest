/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

type Row = Record<string, any>;

interface Column {
  key: string;
  title: string;
  render?: (row: Row) => React.ReactNode;
}

interface TableProps {
  columns: Column[];
  data: Row[];
}

const Table: React.FC<TableProps> = ({ columns, data }) => {
  if (!columns.length || !data.length) {
    return (
      <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
        No data available to display.
      </p>
    );
  }

  /* ---------------- helpers ---------------- */

  const getNestedValue = (obj: Row, path: string) =>
    path.split(".").reduce<any>((acc, key) => acc?.[key], obj);

  const abbreviateCrypto = (method?: string) => {
    const map: Record<string, string> = {
      bitcoin: "BTC",
      solana: "SOL",
      ethereum: "ETH",
    };
    return method ? (map[method.toLowerCase()] ?? method) : "—";
  };

  const statusClasses: Record<string, string> = {
    approved: "bg-green-100 text-green-700",
    declined: "bg-red-100 text-red-700",
    pending: "bg-yellow-100 text-yellow-700",
  };

  const renderValue = (key: string, value: any) => {
    if (key === "status") {
      return (
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase ${
            statusClasses[value] ?? "bg-gray-100 text-gray-600"
          }`}
        >
          {value ?? "—"}
        </span>
      );
    }

    if (key === "method") {
      return <span className="font-semibold">{abbreviateCrypto(value)}</span>;
    }

    if (key === "amount" && typeof value === "number") {
      return <span className="font-semibold">${value.toLocaleString()}</span>;
    }

    if (key === "createdAt" && value) {
      return (
        <span className="text-sm text-gray-600">
          {new Date(value).toLocaleString()}
        </span>
      );
    }

    return value ?? "—";
  };

  const renderCell = (column: Column, row: Row) =>
    column.render
      ? column.render(row)
      : renderValue(column.key, getNestedValue(row, column.key));

  /* ---------------- render ---------------- */

  return (
    <>
      {/* 📱 Mobile Cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {data.map((row, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {columns.map((column) => (
                <div key={column.key} className="min-w-0 space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 break-words">
                    {column.title}
                  </p>

                  <div className="min-w-0 text-sm font-medium text-slate-700 break-words">
                    {renderCell(column, row)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 💻 Desktop Table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[720px] border-collapse">
          <thead className="border-y border-slate-200 bg-slate-50/80">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500 break-words"
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-b border-slate-100 transition-colors hover:bg-slate-50/70">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-4 py-3.5 text-sm text-slate-600 break-words"
                  >
                    {renderCell(column, row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Table;
