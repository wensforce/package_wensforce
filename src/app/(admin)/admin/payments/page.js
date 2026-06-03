import { Wallet, Search, Filter, Download, TrendingUp } from "lucide-react";

const COLUMNS = ["Order ID", "Member", "Plan", "Amount", "Gateway", "Date", "Status"];
const DATE_FILTERS = ["All Time", "Today", "This Week", "This Month", "Custom"];
const GATEWAYS = ["All", "Cashfree", "PayPal", "Manual"];

export default function PaymentsPage() {
  return (
    <div className="max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}
          >
            <Wallet size={16} style={{ color: "#22c55e" }} />
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-[0.45em] uppercase" style={{ color: "#22c55e" }}>
              Financial Records
            </p>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-playfair, serif)" }}>
              Payments
            </h1>
          </div>
        </div>

        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)" }}
        >
          <Download size={13} />
          Export CSV
        </button>
      </div>

      {/* Revenue cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Revenue",    value: "₹ —", color: "#22c55e"  },
          { label: "This Month",       value: "₹ —", color: "#C9A24B"  },
          { label: "Total Orders",     value: "—",   color: "#6B8DD6"  },
          { label: "Failed / Refunded",value: "—",   color: "#ef4444"  },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="rounded-xl px-4 py-3.5 relative overflow-hidden"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div
              className="absolute bottom-0 left-0 right-0 h-0.5"
              style={{ background: `linear-gradient(90deg, ${color}55, transparent)` }}
            />
            <p className="text-xl font-bold mb-0.5" style={{ color }}>{value}</p>
            <p className="text-[10px] font-bold tracking-widest uppercase text-white/25">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters row */}
      <div className="flex items-center gap-3 flex-wrap">
        <div
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl flex-1 min-w-52"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <Search size={13} style={{ color: "rgba(255,255,255,0.2)" }} />
          <span className="text-sm text-white/20">Search by order ID or member…</span>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.35)" }}
        >
          <Filter size={13} />
          Filter
        </button>
      </div>

      {/* Date + gateway filter pills */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {DATE_FILTERS.map((f, i) => (
            <span
              key={f}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold"
              style={
                i === 0
                  ? { background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)", color: "#22c55e" }
                  : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.28)" }
              }
            >
              {f}
            </span>
          ))}
        </div>

        <div
          className="w-px self-stretch mx-1"
          style={{ background: "rgba(255,255,255,0.07)" }}
        />

        <div className="flex gap-2 flex-wrap">
          {GATEWAYS.map((g, i) => (
            <span
              key={g}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold"
              style={
                i === 0
                  ? { background: "rgba(201,162,75,0.12)", border: "1px solid rgba(201,162,75,0.24)", color: "#C9A24B" }
                  : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.28)" }
              }
            >
              {g}
            </span>
          ))}
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div
          className="grid px-5 py-3.5 border-b"
          style={{ gridTemplateColumns: "1.5fr 1.2fr 1fr 0.8fr 0.9fr 1fr 0.8fr", borderColor: "rgba(255,255,255,0.05)" }}
        >
          {COLUMNS.map((c) => (
            <p key={c} className="text-[10px] font-bold tracking-widest uppercase text-white/22">{c}</p>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
            style={{ background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.14)" }}
          >
            <TrendingUp size={26} style={{ color: "rgba(34,197,94,0.45)" }} />
          </div>
          <h3 className="text-white/55 font-semibold text-lg mb-2" style={{ fontFamily: "var(--font-playfair, serif)" }}>
            No Transactions Yet
          </h3>
          <p className="text-white/22 text-sm max-w-xs leading-relaxed">
            Payment records from Cashfree and PayPal will appear here once the payments API is connected.
          </p>
        </div>
      </div>
    </div>
  );
}
