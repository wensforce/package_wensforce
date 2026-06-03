import {
  PlusCircle,
  MapPin,
  Calendar,
  Clock,
  Users,
  Shield,
  ChevronRight,
  Info,
  Phone,
} from "lucide-react";

function FormField({ label, placeholder, type = "text", icon: Icon, span2 = false }) {
  return (
    <div className={span2 ? "sm:col-span-2" : ""}>
      <label className="block text-[10px] font-bold tracking-[0.32em] uppercase text-white/35 mb-2">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon size={14} style={{ color: "rgba(255,255,255,0.18)" }} />
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          disabled
          className="w-full rounded-xl text-sm text-white/40 placeholder:text-white/18 outline-none cursor-not-allowed"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            padding: Icon ? "11px 14px 11px 38px" : "11px 14px",
          }}
        />
      </div>
    </div>
  );
}

export default function RequestTripTab() {
  return (
    <div>
      {/* Section header */}
      <div className="mb-8 flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: "rgba(224,123,57,0.12)",
            border: "1px solid rgba(224,123,57,0.22)",
          }}
        >
          <PlusCircle size={16} style={{ color: "#E07B39" }} />
        </div>
        <div>
          <p
            className="text-[10px] font-bold tracking-[0.45em] uppercase"
            style={{ color: "#E07B39" }}
          >
            Plan Your Journey
          </p>
          <h2
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "var(--font-playfair, serif)" }}
          >
            Request a Trip
          </h2>
        </div>
      </div>

      {/* Coming soon notice */}
      <div
        className="rounded-2xl p-5 mb-8 flex items-start gap-4"
        style={{
          background: "rgba(224,123,57,0.07)",
          border: "1px solid rgba(224,123,57,0.18)",
        }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
          style={{
            background: "rgba(224,123,57,0.14)",
            border: "1px solid rgba(224,123,57,0.24)",
          }}
        >
          <Info size={15} style={{ color: "#E07B39" }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white/70 text-sm font-semibold mb-1">
            Online Booking — Coming Soon
          </p>
          <p className="text-white/35 text-xs leading-relaxed">
            The self-service trip request form is under development. Until then,
            our concierge team is ready to schedule your journey directly.
          </p>
        </div>
        <a
          href="https://wa.me/917304607954?text=Hi%20WENS%20Force!%20I%27d%20like%20to%20book%20a%20trip."
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all hover:brightness-110"
          style={{
            background: "rgba(224,123,57,0.14)",
            border: "1px solid rgba(224,123,57,0.28)",
            color: "#E07B39",
          }}
        >
          <Phone size={12} />
          Contact Us
        </a>
      </div>

      {/* Dummy form — disabled / preview */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
          opacity: 0.55,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <div
          className="px-6 py-4 border-b flex items-center justify-between"
          style={{ borderColor: "rgba(255,255,255,0.05)" }}
        >
          <p className="text-xs font-bold tracking-widest uppercase text-white/40">
            Journey Details
          </p>
          <span
            className="text-[10px] px-2.5 py-1 rounded-full font-semibold"
            style={{
              background: "rgba(224,123,57,0.12)",
              color: "#E07B39",
              border: "1px solid rgba(224,123,57,0.2)",
            }}
          >
            Preview only
          </span>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <FormField
              label="Pickup Location"
              placeholder="Enter pickup address"
              icon={MapPin}
            />
            <FormField
              label="Drop-off Location"
              placeholder="Enter destination"
              icon={MapPin}
            />
            <FormField
              label="Travel Date"
              placeholder="Select date"
              type="date"
              icon={Calendar}
            />
            <FormField
              label="Preferred Time"
              placeholder="Select time"
              type="time"
              icon={Clock}
            />
            <FormField
              label="Passengers"
              placeholder="1 – 7"
              icon={Users}
            />
            <FormField
              label="Security Level"
              placeholder="As per your membership plan"
              icon={Shield}
            />
          </div>

          {/* Notes textarea */}
          <div className="mb-6">
            <label className="block text-[10px] font-bold tracking-[0.32em] uppercase text-white/35 mb-2">
              Special Instructions
            </label>
            <textarea
              disabled
              placeholder="Any special requirements or notes for the security team…"
              rows={3}
              className="w-full rounded-xl text-sm text-white/40 placeholder:text-white/18 outline-none resize-none"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                padding: "12px 14px",
              }}
            />
          </div>

          {/* Submit button preview */}
          <button
            disabled
            className="w-full py-3.5 rounded-xl text-sm font-bold tracking-wide flex items-center justify-center gap-2"
            style={{
              background: "rgba(224,123,57,0.14)",
              border: "1px solid rgba(224,123,57,0.26)",
              color: "#E07B39",
            }}
          >
            Submit Trip Request
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
