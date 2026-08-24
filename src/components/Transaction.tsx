/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { numberFormatter } from "../Admin/depositUser";

// Utility function to format date
const formatDate = (dateString: string | number | Date) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatStatus = (status: any) => {
  if (status === "in_progress") {
    return "In Progress";
  }
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const Transactions = ({ transactions }: any) => {
  if (transactions.length <= 0) return;

  return (
    <>
      {transactions.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Transactions</h2>
          <div className="space-y-4 max-h-[25rem] h-full overflow-y-auto hide-scrollbar">
            {transactions.map(
              (
                transaction: {
                  _id: any | React.Key | null | undefined;
                  type:
                    | string
                    | number
                    | boolean
                    | React.ReactElement<
                        any,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | null
                    | undefined;
                  currency:
                    | string
                    | number
                    | boolean
                    | React.ReactElement<
                        any,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | null
                    | undefined;
                  amount: any;
                  status:
                    | string
                    | number
                    | boolean
                    | React.ReactElement<
                        any,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | null
                    | undefined;
                  createdAt: any;
                },
                index: any
              ) => (
                <div
                  key={index}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-white capitalize">
                        {transaction.type === "kyc_fee"
                          ? "KYC Fee"
                          : transaction.type}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {transaction.currency}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">
                        {numberFormatter(transaction.amount)}{" "}
                        {transaction.currency}
                      </p>
                      <p
                        className={`text-sm ${
                          transaction.status === "approved"
                            ? "text-green-400"
                            : "text-yellow-400"
                        }`}
                      >
                        Status: {formatStatus(transaction.status)}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      {formatDate(transaction.createdAt)}
                    </span>
                    <span className="text-white">
                      ID: {transaction._id.slice(-9)}
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Transactions;
