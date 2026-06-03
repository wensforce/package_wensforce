import { MapPin, Plus, Clock, CheckCircle2, Loader } from "lucide-react";

const FILTERS = ["All", "Upcoming", "In Progress", "Completed"];

const STATUS_STYLES = {
  Upcoming: { bg: "rgba(107,141,214,0.12)", color: "#6B8DD6", border: "rgba(107,141,214,0.25)" },
  "In Progress": { bg: "rgba(234,179,8,0.12)", color: "#eab308", border: "rgba(234,179,8,0.25)" },
  Completed: { bg: "rgba(34,197,94,0.12)", color: "#22c55e", border: "rgba(34,197,94,0.25)" },
};

export default function TripsTab({ onNavigate }) {
  return (
    <div>
      {/* Section header */}
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "rgba(107,141,214,0.12)",
              border: "1px solid rgba(107,141,214,0.22)",
            }}
          >
            <MapPin size={16} style={{ color: "#6B8DD6" }} />
          </div>
          <div>
            <p
              className="text-[10px] font-bold tracking-[0.45em] uppercase"
              style={{ color: "#6B8DD6" }}
            >
              Upcoming Journeys
            </p>
            <h2
              className="text-2xl font-bold text-white"
              style={{ fontFamily: "var(--font-playfair, serif)" }}
            >
              My Trips
            </h2>
          </div>
        </div>

        <button
          onClick={() => onNavigate?.("request")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99]"
          style={{
            background: "rgba(107,141,214,0.14)",
            border: "1px solid rgba(107,141,214,0.28)",
            color: "#6B8DD6",
          }}
        >
          <Plus size={13} />
          Request a Trip
        </button>
      </div>

      {/* Status filter pills */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {FILTERS.map((f, i) => (
          <button
            key={f}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={
              i === 0
                ? {
                    background: "rgba(107,141,214,0.14)",
                    border: "1px solid rgba(107,141,214,0.28)",
                    color: "#6B8DD6",
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

      {/* What each status looks like — legend */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
        {Object.entries(STATUS_STYLES).map(([label, style]) => {
          const Icon =
            label === "Upcoming"
              ? Clock
              : label === "In Progress"
              ? Loader
              : CheckCircle2;
          return (
            <div
              key={label}
              className="rounded-xl p-4 flex items-center gap-3"
              style={{
                background: style.bg,
                border: `1px solid ${style.border}`,
              }}
            >
              <Icon size={15} style={{ color: style.color }} />
              <span
                className="text-xs font-semibold"
                style={{ color: style.color }}
              >
                {label}
              </span>
              <span className="text-white/20 text-xs ml-auto">0</span>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
          style={{
            background: "rgba(107,141,214,0.08)",
            border: "1px solid rgba(107,141,214,0.18)",
          }}
        >
          <MapPin size={32} style={{ color: "rgba(107,141,214,0.6)" }} />
        </div>
        <h3
          className="text-white/70 font-semibold text-xl mb-2"
          style={{ fontFamily: "var(--font-playfair, serif)" }}
        >
          No Upcoming Trips
        </h3>
        <p className="text-white/25 text-sm font-light max-w-xs leading-relaxed mb-8">
          You have no scheduled journeys yet. Use the button above to request a
          security-escorted trip.
        </p>
        <button
          onClick={() => onNavigate?.("request")}
          className="flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 hover:-translate-y-0.5"
          style={{
            background: "rgba(107,141,214,0.14)",
            border: "1px solid rgba(107,141,214,0.28)",
            color: "#6B8DD6",
          }}
        >
          <Plus size={15} />
          Request Your First Trip
        </button>
      </div>
    </div>
  );
}
