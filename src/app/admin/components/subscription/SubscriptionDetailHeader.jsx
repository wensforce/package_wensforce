"use client";

import { ArrowLeft, CheckCircle2, RefreshCw, XCircle } from "lucide-react";

export default function SubscriptionDetailHeader({
  onBack,
  onRefresh,
  onVerify,
  onCancel,
  refreshing,
  actionLoading,
  canVerify = true,
  canCancel = true,
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 border-b border-[#CBD5E0] bg-white">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-medium text-[#4A5568] hover:text-[#0B1E3F] transition-colors"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3F]">Subscription Details</h1>

      <div className="flex items-center justify-end gap-2">
        <button
          onClick={onVerify}
          disabled={!canVerify || actionLoading === "verify" || actionLoading === "cancel"}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-60"
        >
          <CheckCircle2 size={14} />
          {actionLoading === "verify" ? "Verifying" : "Verify"}
        </button>

        <button
          onClick={onCancel}
          disabled={!canCancel || actionLoading === "verify" || actionLoading === "cancel"}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-60"
        >
          <XCircle size={14} />
          {actionLoading === "cancel" ? "Cancelling" : "Cancel"}
        </button>

        <button
          onClick={onRefresh}
          disabled={refreshing || actionLoading === "verify" || actionLoading === "cancel"}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0B1E3F] text-white text-sm font-semibold hover:bg-[#152d5a] transition-colors disabled:opacity-60"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing" : "Refresh"}
        </button>
      </div>
    </div>
  );
}
