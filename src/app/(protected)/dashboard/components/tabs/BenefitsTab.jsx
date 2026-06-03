import { useState } from "react";
import { Star, Check, Lock, Shield, Car, MapPin, Crown, Phone } from "lucide-react";
import { PLAN_META } from "../../lib/planMeta";

const PLAN_LEVELS = Object.entries(PLAN_META).map(([key, meta]) => ({ key, ...meta }));

const ALL_BENEFITS = [
  {
    label: "Security-Escorted Trips",
    getValue: (p) => `${p.trips} trips / year`,
    included: true,
  },
  {
    label: "Personal Vehicle Class",
    getValue: (p) => p.vehicle,
    included: true,
  },
  {
    label: "Personal Security Detail",
    getValue: (p) => p.bodyguard,
    included: true,
  },
  {
    label: "24×7 Emergency Helpline",
    getValue: () => "Always included",
    included: true,
  },
  {
    label: "Route Intelligence Briefing",
    getValue: () => "Pre-trip brief",
    included: true,
  },
  {
    label: "Hotel Security Sweep",
    getValue: () => "On request",
    included: false,
    minPlan: "executive",
  },
  {
    label: "Advance Threat Assessment",
    getValue: () => "Elite & above",
    included: false,
    minPlan: "elite",
  },
  {
    label: "Convoy Escort Service",
    getValue: () => "Sovereign only",
    included: false,
    minPlan: "sovereign",
  },
];

const PLAN_ORDER = ["essential", "executive", "premium", "elite", "sovereign"];

function isBenefitIncluded(benefit, planKey) {
  if (benefit.included) return true;
  if (!benefit.minPlan) return false;
  return PLAN_ORDER.indexOf(planKey) >= PLAN_ORDER.indexOf(benefit.minPlan);
}

function BenefitRow({ label, value, included }) {
  return (
    <div
      className="flex items-center justify-between py-3.5 border-b last:border-0"
      style={{ borderColor: "rgba(255,255,255,0.05)" }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
          style={
            included
              ? { background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)" }
              : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }
          }
        >
          {included ? (
            <Check size={9} style={{ color: "#22c55e" }} />
          ) : (
            <Lock size={9} style={{ color: "rgba(255,255,255,0.2)" }} />
          )}
        </div>
        <span
          className="text-sm"
          style={{ color: included ? "rgba(255,255,255,0.78)" : "rgba(255,255,255,0.25)" }}
        >
          {label}
        </span>
      </div>
      <span
        className="text-xs font-semibold ml-4 text-right"
        style={{ color: included ? "#C9A24B" : "rgba(255,255,255,0.18)" }}
      >
        {value}
      </span>
    </div>
  );
}

export default function BenefitsTab() {
  const [selectedPlan, setSelectedPlan] = useState("executive");
  const plan = PLAN_META[selectedPlan];

  return (
    <div>
      {/* Section header */}
      <div className="mb-8 flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: "rgba(201,162,75,0.12)",
            border: "1px solid rgba(201,162,75,0.22)",
          }}
        >
          <Star size={16} style={{ color: "#C9A24B" }} />
        </div>
        <div>
          <p
            className="text-[10px] font-bold tracking-[0.45em] uppercase"
            style={{ color: "#C9A24B" }}
          >
            Membership Inclusions
          </p>
          <h2
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "var(--font-playfair, serif)" }}
          >
            My Benefits
          </h2>
        </div>
      </div>

      {/* Info notice */}
      <div
        className="rounded-2xl p-4 mb-8 flex items-center gap-3"
        style={{
          background: "rgba(201,162,75,0.07)",
          border: "1px solid rgba(201,162,75,0.14)",
        }}
      >
        <Crown size={16} style={{ color: "#C9A24B" }} />
        <p className="text-white/45 text-xs leading-relaxed flex-1">
          Link your subscription to see your live benefit usage. The preview
          below reflects the selected plan tier.
        </p>
      </div>

      {/* Plan selector */}
      <div className="mb-8">
        <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/30 mb-3">
          Preview Plan
        </p>
        <div className="flex gap-2 flex-wrap">
          {PLAN_LEVELS.map(({ key, label, accentColor }) => (
            <button
              key={key}
              onClick={() => setSelectedPlan(key)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200"
              style={
                key === selectedPlan
                  ? {
                      background: `${accentColor}20`,
                      border: `1px solid ${accentColor}40`,
                      color: accentColor,
                    }
                  : {
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      color: "rgba(255,255,255,0.3)",
                    }
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Usage cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Trips", used: 0, total: plan.trips, color: "#C9A24B", icon: MapPin, isNumeric: true },
          { label: "Vehicle Class", value: plan.vehicle, color: "#6B8DD6", icon: Car, isNumeric: false },
          { label: "Security Detail", value: plan.bodyguard, color: "#9B7FD4", icon: Shield, isNumeric: false },
        ].map(({ label, used, total, value, color, icon: Icon, isNumeric }) => (
          <div
            key={label}
            className="rounded-2xl p-5 relative overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div
              className="absolute top-0 right-0 w-20 h-20 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at top right, ${color}14 0%, transparent 70%)`,
              }}
            />
            <div className="flex items-center gap-2 mb-4">
              <Icon size={13} style={{ color }} />
              <span
                className="text-[10px] font-bold tracking-widest uppercase"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                {label}
              </span>
            </div>
            {isNumeric ? (
              <>
                <p className="text-2xl font-bold text-white mb-1">
                  {used}
                  <span className="text-sm text-white/30 font-normal"> / {total}</span>
                </p>
                <div
                  className="h-1.5 rounded-full overflow-hidden mb-1.5"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: total > 0 ? `${(used / total) * 100}%` : "0%",
                      background: `linear-gradient(90deg, ${color}, ${color}70)`,
                    }}
                  />
                </div>
                <p className="text-white/25 text-xs">{total} remaining</p>
              </>
            ) : (
              <>
                <p
                  className="text-sm font-semibold leading-snug mb-1"
                  style={{ color: "rgba(255,255,255,0.75)" }}
                >
                  {value}
                </p>
                <p className="text-white/25 text-xs">Included in plan</p>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Full benefits list */}
      <div
        className="rounded-2xl overflow-hidden mb-8"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          className="px-5 py-4 border-b flex items-center justify-between"
          style={{ borderColor: "rgba(255,255,255,0.05)" }}
        >
          <p className="text-xs font-bold tracking-widest uppercase text-white/35">
            All Inclusions
          </p>
          <span
            className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
            style={{
              background: `${plan.accentColor}18`,
              color: plan.accentColor,
              border: `1px solid ${plan.accentColor}28`,
            }}
          >
            {PLAN_META[selectedPlan].label} Plan
          </span>
        </div>
        <div className="px-5">
          {ALL_BENEFITS.map((benefit) => (
            <BenefitRow
              key={benefit.label}
              label={benefit.label}
              value={benefit.getValue(plan)}
              included={isBenefitIncluded(benefit, selectedPlan)}
            />
          ))}
        </div>
      </div>

      {/* Upgrade prompt */}
      <div
        className="rounded-2xl p-5 flex items-center gap-4"
        style={{
          background: "rgba(212,175,55,0.06)",
          border: "1px solid rgba(212,175,55,0.14)",
        }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: "rgba(212,175,55,0.12)",
            border: "1px solid rgba(212,175,55,0.2)",
          }}
        >
          <Crown size={15} style={{ color: "#D4AF37" }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white/60 text-sm font-semibold">Want more benefits?</p>
          <p className="text-white/25 text-xs mt-0.5">
            Upgrade to unlock hotel sweeps, advance threat assessments, and convoy services.
          </p>
        </div>
        <a
          href="https://wa.me/917304607954?text=Hi%20WENS%20Force!%20I%27d%20like%20to%20upgrade%20my%20plan."
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:brightness-110"
          style={{
            background: "rgba(212,175,55,0.14)",
            border: "1px solid rgba(212,175,55,0.26)",
            color: "#D4AF37",
          }}
        >
          <Phone size={11} />
          Enquire
        </a>
      </div>
    </div>
  );
}
