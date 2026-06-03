import { Wrench, Plus, Edit, Trash2, Eye } from "lucide-react";

const CATEGORIES = ["All", "Security", "Transport", "Concierge", "Intelligence"];

export default function ServicesPage() {
  return (
    <div className="max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.22)" }}
          >
            <Wrench size={16} style={{ color: "#D4AF37" }} />
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-[0.45em] uppercase" style={{ color: "#D4AF37" }}>
              Service Catalogue
            </p>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-playfair, serif)" }}>
              Services
            </h1>
          </div>
        </div>

        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all hover:-translate-y-0.5"
          style={{ background: "rgba(212,175,55,0.13)", border: "1px solid rgba(212,175,55,0.26)", color: "#D4AF37" }}
        >
          <Plus size={13} />
          Add Service
        </button>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((c, i) => (
          <span
            key={c}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold"
            style={
              i === 0
                ? { background: "rgba(212,175,55,0.14)", border: "1px solid rgba(212,175,55,0.28)", color: "#D4AF37" }
                : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.28)" }
            }
          >
            {c}
          </span>
        ))}
      </div>

      {/* Service list shell */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* List header */}
        <div
          className="grid px-5 py-3.5 border-b"
          style={{ gridTemplateColumns: "1fr 2fr 0.8fr 0.8fr 100px", borderColor: "rgba(255,255,255,0.05)" }}
        >
          {["Service Name", "Description", "Category", "Status", "Actions"].map((h) => (
            <p key={h} className="text-[10px] font-bold tracking-widest uppercase text-white/22">{h}</p>
          ))}
        </div>

        {/* Empty state */}
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
            style={{ background: "rgba(212,175,55,0.07)", border: "1px solid rgba(212,175,55,0.14)" }}
          >
            <Wrench size={26} style={{ color: "rgba(212,175,55,0.45)" }} />
          </div>
          <h3 className="text-white/55 font-semibold text-lg mb-2" style={{ fontFamily: "var(--font-playfair, serif)" }}>
            No Services Yet
          </h3>
          <p className="text-white/22 text-sm max-w-xs leading-relaxed mb-6">
            Add services to the catalogue. Members will be able to see them based on their membership tier.
          </p>
          <button
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold"
            style={{ background: "rgba(212,175,55,0.13)", border: "1px solid rgba(212,175,55,0.26)", color: "#D4AF37" }}
          >
            <Plus size={13} />
            Add First Service
          </button>
        </div>
      </div>

      {/* Action legend */}
      <div
        className="rounded-2xl p-4 flex items-center gap-6 flex-wrap"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
      >
        <p className="text-[10px] font-bold tracking-widest uppercase text-white/18">Available Actions</p>
        {[
          { icon: Eye,     label: "View",   color: "#6B8DD6" },
          { icon: Edit,    label: "Edit",   color: "#C9A24B" },
          { icon: Trash2,  label: "Delete", color: "#ef4444" },
        ].map(({ icon: Icon, label, color }) => (
          <div key={label} className="flex items-center gap-2">
            <Icon size={13} style={{ color }} />
            <span className="text-xs text-white/30">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
