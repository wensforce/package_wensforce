import { MapPin, Search, Filter, Download } from "lucide-react";

const COLUMNS = ["Trip ID", "Member", "Route", "Date", "Security", "Status", "Actions"];
const STATUS_FILTERS = ["All", "Upcoming", "In Progress", "Completed", "Cancelled"];

export default function TripsPage() {
  return (
    <div className="max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(155,127,212,0.12)", border: "1px solid rgba(155,127,212,0.22)" }}
          >
            <MapPin size={16} style={{ color: "#9B7FD4" }} />
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-[0.45em] uppercase" style={{ color: "#9B7FD4" }}>
              Journey Tracking
            </p>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-playfair, serif)" }}>
              All Trips
            </h1>
          </div>
        </div>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Total",       value: "0", color: "#9B7FD4" },
          { label: "Upcoming",    value: "0", color: "#6B8DD6" },
          { label: "In Progress", value: "0", color: "#eab308" },
          { label: "Completed",   value: "0", color: "#22c55e" },
          { label: "Cancelled",   value: "0", color: "#ef4444" },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="rounded-xl px-4 py-3 flex items-center justify-between"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <span className="text-xs text-white/35 font-medium">{label}</span>
            <span className="text-xl font-bold" style={{ color }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl flex-1 min-w-52"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <Search size={13} style={{ color: "rgba(255,255,255,0.2)" }} />
          <span className="text-sm text-white/20">Search by member or trip ID…</span>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.35)" }}
        >
          <Filter size={13} />
          Filter
        </button>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.35)" }}
        >
          <Download size={13} />
          Export
        </button>
      </div>

      {/* Status filter pills */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_FILTERS.map((f, i) => (
          <span
            key={f}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold"
            style={
              i === 0
                ? { background: "rgba(155,127,212,0.14)", border: "1px solid rgba(155,127,212,0.28)", color: "#9B7FD4" }
                : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.28)" }
            }
          >
            {f}
          </span>
        ))}
      </div>

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div
          className="grid px-5 py-3.5 border-b"
          style={{ gridTemplateColumns: "0.8fr 1.2fr 1.5fr 1fr 1fr 0.8fr 70px", borderColor: "rgba(255,255,255,0.05)" }}
        >
          {COLUMNS.map((c) => (
            <p key={c} className="text-[10px] font-bold tracking-widest uppercase text-white/22">{c}</p>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
            style={{ background: "rgba(155,127,212,0.07)", border: "1px solid rgba(155,127,212,0.14)" }}
          >
            <MapPin size={26} style={{ color: "rgba(155,127,212,0.45)" }} />
          </div>
          <h3 className="text-white/55 font-semibold text-lg mb-2" style={{ fontFamily: "var(--font-playfair, serif)" }}>
            No Trips Recorded
          </h3>
          <p className="text-white/22 text-sm max-w-xs leading-relaxed">
            All member journeys will be listed here once the trips API is integrated.
          </p>
        </div>
      </div>
    </div>
  );
}
