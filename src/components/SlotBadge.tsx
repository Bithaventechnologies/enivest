import React from "react";
import { Crown, Zap, TrendingUp } from "lucide-react";

interface SlotBadgeProps {
  amount: number;
  variant?: "small" | "large";
  animate?: boolean;
}

const SlotBadge: React.FC<SlotBadgeProps> = ({
  amount,
  variant = "small",
  animate = true,
}) => {
  if (variant === "small") {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-500/20 to-pink-500/20 border border-orange-500/50 rounded-full">
        <Crown className="w-4 h-4 text-orange-400" />
        <span className="text-xs font-semibold text-orange-400">
          Premium Member
        </span>
        <Zap className="w-3 h-3 text-pink-400" />
      </div>
    );
  }

  return (
    <div
      className={`relative w-full max-w-[360px] bg-gradient-to-br from-gray-800 to-gray-900 border border-orange-500/50 rounded-2xl p-5 sm:p-6 overflow-hidden ${
        animate ? "group" : ""
      }`}
    >
      {/* Animated background */}
      {animate && (
        <>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </>
      )}

      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">
              Slot Status
            </p>
            <h3 className="text-white font-bold text-lg">Slot Secured ✓</h3>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full blur-lg opacity-50"></div>
            <div className="relative bg-gradient-to-br from-orange-500 to-pink-500 rounded-full p-3">
              <Crown className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Investment Amount */}
        <div className="space-y-1">
          <p className="text-gray-400 text-xs">Investment Amount</p>
          <p className="text-white font-bold text-xl">
            ${amount.toLocaleString()}
          </p>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <p className="text-green-400 text-xs font-medium">
            Active • Premium Member
          </p>
        </div>

        {/* Benefits Hint */}
        <div className="bg-gray-700/30 rounded-lg p-3 text-xs text-gray-300 space-y-1">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3 h-3 text-green-400" />
            <span>Early access to token distribution</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-orange-400" />
            <span>VIP priority support & benefits</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotBadge;
