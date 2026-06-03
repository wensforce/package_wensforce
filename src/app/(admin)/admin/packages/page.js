import { Package, Plus, Edit, Trash2 } from "lucide-react";

const PLAN_TIERS = [
  { label: "Essential",  color: "#6B8DD6", price: "₹24,999", trips: 3,  vehicle: "Standard Sedan" },
  { label: "Executive",  color: "#C9A24B", price: "₹44,999", trips: 6,  vehicle: "Premium Sedan / MUV" },
  { label: "Premium",    color: "#9B7FD4", price: "₹69,999", trips: 10, vehicle: "Luxury SUV" },
  { label: "Elite",      color: "#E07B39", price: "₹99,999", trips: 15, vehicle: "Luxury SUV (7-Seater)" },
  { label: "Sovereign",  color: "#D4AF37", price: "₹1,99,999", trips: 24, vehicle: "Ultra-Luxury / Convoy" },
];

export default function PackagesPage() {
  return (
    <div className="max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(224,123,57,0.12)", border: "1px solid rgba(224,123,57,0.22)" }}
          >
            <Package size={16} style={{ color: "#E07B39" }} />
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-[0.45em] uppercase" style={{ color: "#E07B39" }}>
              Plan Management
            </p>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-playfair, serif)" }}>
              Packages
            </h1>
          </div>
        </div>

        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all hover:-translate-y-0.5"
          style={{ background: "rgba(224,123,57,0.13)", border: "1px solid rgba(224,123,57,0.26)", color: "#E07B39" }}
        >
          <Plus size={13} />
          Create Package
        </button>
      </div>

      {/* Info notice */}
      <div
        className="rounded-2xl p-4 flex items-center gap-3"
        style={{ background: "rgba(224,123,57,0.06)", border: "1px solid rgba(224,123,57,0.14)" }}
      >
        <Package size={14} style={{ color: "#E07B39" }} className="shrink-0" />
        <p className="text-white/38 text-xs leading-relaxed flex-1">
          Below are the current membership tiers seeded from the local config.
          CRUD operations will be available once the packages API is integrated.
        </p>
        <span
          className="text-[10px] px-2.5 py-1 rounded-full font-bold shrink-0"
          style={{ background: "rgba(234,179,8,0.12)", color: "#eab308", border: "1px solid rgba(234,179,8,0.2)" }}
        >
          Read-only preview
        </span>
      </div>

      {/* Package cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PLAN_TIERS.map(({ label, color, price, trips, vehicle }) => (
          <div
            key={label}
            className="rounded-2xl overflow-hidden relative"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            {/* Accent strip */}
            <div
              className="absolute left-0 top-0 bottom-0 w-1"
              style={{ background: `linear-gradient(180deg, ${color}, ${color}44)` }}
            />

            <div className="pl-5 pr-4 py-5">
              {/* Plan name */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p
                    className="text-[10px] font-bold tracking-[0.4em] uppercase mb-1"
                    style={{ color }}
                  >
                    Membership
                  </p>
                  <h3
                    className="text-xl font-bold text-white"
                    style={{ fontFamily: "var(--font-playfair, serif)" }}
                  >
                    {label}
                  </h3>
                </div>
                <p className="text-lg font-bold" style={{ color }}>{price}</p>
              </div>

              {/* Details */}
              <div
                className="space-y-2 py-3 border-y text-xs text-white/45 mb-4"
                style={{ borderColor: "rgba(255,255,255,0.06)" }}
              >
                <p><span className="text-white/25">Trips:</span> <span className="text-white/65 font-medium">{trips} / year</span></p>
                <p><span className="text-white/25">Vehicle:</span> <span className="text-white/65 font-medium">{vehicle}</span></p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all"
                  style={{ background: `${color}14`, border: `1px solid ${color}28`, color }}
                >
                  <Edit size={11} />
                  Edit
                </button>
                <button
                  className="w-9 h-9 flex items-center justify-center rounded-lg transition-all"
                  style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", color: "rgba(239,68,68,0.6)" }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add new card */}
        <button
          className="rounded-2xl flex flex-col items-center justify-center py-12 gap-3 transition-all hover:-translate-y-0.5 border-dashed"
          style={{ background: "rgba(255,255,255,0.015)", border: "1px dashed rgba(255,255,255,0.1)" }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(224,123,57,0.1)", border: "1px solid rgba(224,123,57,0.2)" }}
          >
            <Plus size={18} style={{ color: "#E07B39" }} />
          </div>
          <p className="text-white/30 text-sm font-medium">Create New Package</p>
        </button>
      </div>
    </div>
  );
}
