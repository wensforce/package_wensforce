"use client";

import { ArrowLeft, RotateCcw, Trash2 } from "lucide-react";

/**
 * ServiceDetailHeader
 *
 * Mirrors UserDetailHeader's slot structure:
 *   [← Back]   [Service Details]   [Edit | Refresh | Delete]
 *
 * Props
 * ─────
 * onBack     () => void
 * onRefresh  () => void
 * onEdit     () => void
 * onDelete   () => void
 * refreshing boolean
 * deleting   boolean
 */
export default function ServiceDetailHeader({
  onBack,
  onRefresh,
  onEdit,
  onDelete,
  refreshing = false,
  deleting = false,
}) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-[#CBD5E0]">
      {/* Back */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-medium text-[#C9A24B] hover:text-[#A68239] transition-colors"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* Title */}
      <h1 className="text-base font-semibold text-[#1A202C]">
        Service Details
      </h1>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Edit */}
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F5F5F5] text-[#1A202C] text-sm font-medium hover:bg-[#E2E8F0] transition-colors"
        >
          Edit
        </button>

        {/* Refresh */}
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B1E3F] text-white text-sm font-medium hover:bg-[#152d5a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RotateCcw size={14} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>

        {/* Delete */}
        <button
          onClick={onDelete}
          disabled={deleting}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 size={14} />
          {deleting ? "Deleting…" : "Delete"}
        </button>
      </div>
    </div>
  );
}