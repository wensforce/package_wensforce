import { Wrench, Plus, Edit, Trash2, Eye, Search } from "lucide-react";

const CATEGORIES = ["All", "Security", "Transport", "Concierge", "Intelligence"];

export default function ServicesPage() {
  return (
    <div className="max-w-6xl space-y-6">

      {/* ── Page header ────────────────────────────────────────────── */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p
            className="text-[10px] font-bold tracking-[0.45em] uppercase mb-1"
            style={{ color: "var(--adm-gold)" }}
          >
            Service Catalogue
          </p>
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--adm-blue)", fontFamily: "var(--font-playfair, serif)" }}
          >
            Services
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--adm-text-sub)" }}>
            Manage and organise services available to members
          </p>
        </div>

        <button
          className="adm-btn-primary"
          style={{ background: "var(--adm-navy)" }}
        >
          <Plus size={14} />
          Add Service
        </button>
      </div>

      {/* ── Stats strip ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Services", value: "—", accent: "var(--adm-blue)" },
          { label: "Active",         value: "—", accent: "var(--adm-success)" },
          { label: "Categories",     value: CATEGORIES.length - 1, accent: "var(--adm-gold)" },
          { label: "Inactive",       value: "—", accent: "var(--adm-error)" },
        ].map(({ label, value, accent }) => (
          <div
            key={label}
            className="adm-card rounded-xl px-4 py-3.5"
          >
            <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: "var(--adm-text-muted)" }}>
              {label}
            </p>
            <p className="text-2xl font-bold" style={{ color: accent }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Filter / search bar ─────────────────────────────────────── */}
      <div
        className="adm-card rounded-2xl px-4 py-3 flex items-center gap-3 flex-wrap"
      >
        {/* Search input */}
        <div
          className="flex items-center gap-2 flex-1 min-w-45 px-3 py-2 rounded-xl"
          style={{ background: "var(--adm-table-head)", border: "1px solid var(--adm-border)" }}
        >
          <Search size={13} style={{ color: "var(--adm-text-muted)" }} />
          <input
            placeholder="Search services…"
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "var(--adm-text)", caretColor: "var(--adm-blue)" }}
          />
        </div>

        {/* Category pills */}
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((c, i) => (
            <span
              key={c}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer select-none transition-all"
              style={
                i === 0
                  ? { background: "var(--adm-navy)", color: "#fff" }
                  : {
                      background: "var(--adm-table-head)",
                      border: "1px solid var(--adm-border)",
                      color: "var(--adm-text-sub)",
                    }
              }
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* ── Service table ───────────────────────────────────────────── */}
      <div className="adm-card rounded-2xl overflow-hidden">

        {/* Table header row */}
        <div
          className="grid px-5 py-3 border-b"
          style={{
            gridTemplateColumns: "1fr 2fr 0.8fr 0.8fr 100px",
            borderColor: "var(--adm-card-border)",
            background: "var(--adm-table-head)",
          }}
        >
          {["Service Name", "Description", "Category", "Status", "Actions"].map((h) => (
            <p
              key={h}
              className="text-[10px] font-bold tracking-widest uppercase"
              style={{ color: "var(--adm-text-muted)" }}
            >
              {h}
            </p>
          ))}
        </div>

        {/* Empty state */}
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
            style={{
              background: "var(--adm-gold-light)",
              border: "1px solid var(--adm-gold-border)",
            }}
          >
            <Wrench size={26} style={{ color: "var(--adm-gold)" }} />
          </div>
          <h3
            className="font-semibold text-lg mb-1.5"
            style={{ color: "var(--adm-blue)", fontFamily: "var(--font-playfair, serif)" }}
          >
            No Services Yet
          </h3>
          <p className="text-sm max-w-xs leading-relaxed mb-6" style={{ color: "var(--adm-text-sub)" }}>
            Add services to the catalogue. Members will see them based on their membership tier.
          </p>
          <button className="adm-btn-primary" style={{ background: "var(--adm-navy)" }}>
            <Plus size={13} />
            Add First Service
          </button>
        </div>
      </div>

      {/* ── Action legend ───────────────────────────────────────────── */}
      <div
        className="adm-card rounded-2xl px-5 py-3.5 flex items-center gap-6 flex-wrap"
      >
        <p
          className="text-[10px] font-bold tracking-widest uppercase"
          style={{ color: "var(--adm-text-muted)" }}
        >
          Available Actions
        </p>
        {[
          { icon: Eye,    label: "View Details", color: "var(--adm-blue-mid)" },
          { icon: Edit,   label: "Edit",         color: "var(--adm-gold)" },
          { icon: Trash2, label: "Delete",        color: "var(--adm-error)" },
        ].map(({ icon: Icon, label, color }) => (
          <div key={label} className="flex items-center gap-2">
            <Icon size={13} style={{ color }} />
            <span className="text-xs font-medium" style={{ color: "var(--adm-text-sub)" }}>
              {label}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}
