import { History, Filter, Download, MapPin, Calendar, Clock } from "lucide-react";

const FILTER_OPTIONS = ["All Time", "This Month", "Last 3 Months", "This Year"];

const DUMMY_COLUMNS = ["Date", "Route", "Duration", "Security", "Status"];

export default function TripHistoryTab() {
  return (
    <div>
      {/* Section header */}
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "rgba(155,127,212,0.12)",
              border: "1px solid rgba(155,127,212,0.22)",
            }}
          >
            <History size={16} style={{ color: "#9B7FD4" }} />
          </div>
          <div>
            <p
              className="text-[10px] font-bold tracking-[0.45em] uppercase"
              style={{ color: "#9B7FD4" }}
            >
              Past Journeys
            </p>
            <h2
              className="text-2xl font-bold text-white"
              style={{ fontFamily: "var(--font-playfair, serif)" }}
            >
              Trip History
            </h2>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            className="p-2.5 rounded-xl transition-colors hover:bg-white/5"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
            title="Filter"
          >
            <Filter size={14} style={{ color: "rgba(255,255,255,0.35)" }} />
          </button>
          <button
            className="p-2.5 rounded-xl transition-colors hover:bg-white/5"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
            title="Download report"
          >
            <Download size={14} style={{ color: "rgba(255,255,255,0.35)" }} />
          </button>
        </div>
      </div>

      {/* Date range filters */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {FILTER_OPTIONS.map((f, i) => (
          <button
            key={f}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={
              i === 0
                ? {
                    background: "rgba(155,127,212,0.14)",
                    border: "1px solid rgba(155,127,212,0.28)",
                    color: "#9B7FD4",
                  }
                : {
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: "rgba(255,255,255,0.3)",
                  }
            }
          >
            {f}
          </button>
        ))}
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3 mb-10">
        {[
          { label: "Total Trips", value: "0", icon: MapPin, color: "#9B7FD4" },
          { label: "Total Distance", value: "0 km", icon: Calendar, color: "#6B8DD6" },
          { label: "Total Hours", value: "0 hr", icon: Clock, color: "#C9A24B" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-2xl p-4 text-center"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <Icon size={16} className="mx-auto mb-2" style={{ color }} />
            <p className="text-xl font-bold text-white mb-0.5">{value}</p>
            <p className="text-[10px] font-bold tracking-widest uppercase text-white/25">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Table skeleton — placeholder */}
      <div
        className="rounded-2xl overflow-hidden mb-8"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Table header */}
        <div
          className="grid px-5 py-3.5 border-b"
          style={{
            gridTemplateColumns: "1fr 2fr 1fr 1fr 1fr",
            borderColor: "rgba(255,255,255,0.05)",
          }}
        >
          {DUMMY_COLUMNS.map((col) => (
            <p
              key={col}
              className="text-[10px] font-bold tracking-widest uppercase text-white/25"
            >
              {col}
            </p>
          ))}
        </div>

        {/* Empty state inside table */}
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
            style={{
              background: "rgba(155,127,212,0.08)",
              border: "1px solid rgba(155,127,212,0.16)",
            }}
          >
            <History size={26} style={{ color: "rgba(155,127,212,0.6)" }} />
          </div>
          <h3
            className="text-white/60 font-semibold text-lg mb-2"
            style={{ fontFamily: "var(--font-playfair, serif)" }}
          >
            No Trip History Yet
          </h3>
          <p className="text-white/20 text-sm font-light max-w-xs leading-relaxed">
            Completed journeys will appear here as a detailed record. Your travel
            data is securely stored and accessible anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
