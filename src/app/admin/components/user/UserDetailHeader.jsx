"use client";

import { ArrowLeft, Pencil, RefreshCw } from "lucide-react";

export default function UserDetailHeader({ onBack, onRefresh, onEdit, refreshing }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 border-b border-[#CBD5E0] bg-white">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-medium text-[#4A5568] hover:text-[#0B1E3F] transition-colors"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3F]">User Details</h1>

      <div className="flex items-center justify-end gap-2">
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#CBD5E0] bg-white text-[#1A202C] text-sm font-medium hover:bg-[#FAF6EC] transition-colors"
        >
          <Pencil size={14} /> Edit
        </button>
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0B1E3F] text-white text-sm font-semibold hover:bg-[#152d5a] transition-colors disabled:opacity-60"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing" : "Refresh"}
        </button>
      </div>
    </div>
  );
}
