"use client";
import { Clock } from "lucide-react";
export default function PackageHistory() {
  return (
    <div className="rounded-2xl p-12 flex flex-col items-center text-center space-y-3"
      style={{ background: "var(--color-white)", border: "1px solid var(--color-border)" }}>
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ background: "var(--color-cream)", border: "1px solid var(--color-border)" }}>
        <Clock size={22} style={{ color: "var(--color-text-tertiary)" }} />
      </div>
      <div>
        <p className="font-semibold text-sm" style={{ color: "var(--color-navy)" }}>Package History</p>
        <p className="text-xs mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>This section is coming soon.</p>
      </div>
    </div>
  );
}