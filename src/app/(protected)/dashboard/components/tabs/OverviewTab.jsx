import {
  CreditCard,
  MapPin,
  Star,
  TrendingUp,
  ArrowRight,
  Shield,
  Zap,
} from "lucide-react";

const STAT_CARDS = [
  {
    label: "Active Plan",
    value: "—",
    sub: "No plan linked yet",
    icon: CreditCard,
    color: "#C9A24B",
  },
  {
    label: "Trips Remaining",
    value: "—",
    sub: "Link subscription to view",
    icon: MapPin,
    color: "#6B8DD6",
  },
  {
    label: "Benefits Used",
    value: "0",
    sub: "out of total included",
    icon: Star,
    color: "#9B7FD4",
  },
  {
    label: "Next Renewal",
    value: "—",
    sub: "Active plan required",
    icon: TrendingUp,
    color: "#22c55e",
  },
];

const QUICK_ACTIONS = [
  {
    label: "View Subscriptions",
    sub: "See your active membership plans",
    icon: CreditCard,
    tab: "subscriptions",
    color: "#C9A24B",
  },
  {
    label: "Book a Trip",
    sub: "Schedule a security-escorted journey",
    icon: MapPin,
    tab: "request",
    color: "#6B8DD6",
  },
  {
    label: "My Benefits",
    sub: "Explore everything included in your plan",
    icon: Star,
    tab: "benefits",
    color: "#9B7FD4",
  },
  {
    label: "Trip History",
    sub: "Review your past journeys",
    icon: TrendingUp,
    tab: "history",
    color: "#22c55e",
  },
];

function StatCard({ label, value, sub, icon: Icon, color }) {
  return (
    <div
      className="rounded-2xl p-5 relative overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div
        className="absolute top-0 right-0 w-24 h-24 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at top right, ${color}18 0%, transparent 70%)`,
        }}
      />
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
        style={{ background: `${color}18`, border: `1px solid ${color}30` }}
      >
        <Icon size={16} style={{ color }} />
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p
        className="text-[10px] font-bold tracking-[0.35em] uppercase mb-0.5"
        style={{ color }}
      >
        {label}
      </p>
      <p className="text-white/25 text-xs">{sub}</p>
    </div>
  );
}

export default function OverviewTab({ onNavigate }) {
  return (
    <div className="space-y-10">
      {/* Welcome banner */}
      <div
        className="rounded-2xl p-6 sm:p-8 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, rgba(201,162,75,0.11) 0%, rgba(201,162,75,0.03) 100%)",
          border: "1px solid rgba(201,162,75,0.18)",
        }}
      >
        <div
          className="absolute right-0 top-0 w-72 h-72 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at top right, rgba(201,162,75,0.07) 0%, transparent 65%)",
          }}
        />
        <div className="relative">
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "rgba(201,162,75,0.14)",
                border: "1px solid rgba(201,162,75,0.25)",
              }}
            >
              <Shield size={17} style={{ color: "#C9A24B" }} />
            </div>
            <span
              className="text-[10px] font-bold tracking-[0.45em] uppercase"
              style={{ color: "#C9A24B" }}
            >
              WENS Force Protection
            </span>
          </div>
          <h2
            className="text-2xl sm:text-3xl font-bold text-white mb-3"
            style={{ fontFamily: "var(--font-playfair, serif)" }}
          >
            Welcome to Your Portal
          </h2>
          <p className="text-white/40 text-sm leading-relaxed max-w-md mb-6">
            Manage your memberships, track trips, explore benefits, and request
            security-escorted journeys — all in one place.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <div
              className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              style={{
                background: "rgba(201,162,75,0.13)",
                color: "#C9A24B",
                border: "1px solid rgba(201,162,75,0.22)",
              }}
            >
              <Zap size={10} />
              Member Portal v2.0
            </div>
            <span className="text-white/20 text-xs">
              All features require an active subscription
            </span>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div>
        <p className="text-[10px] font-bold tracking-[0.45em] uppercase text-white/30 mb-4">
          At a Glance
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {STAT_CARDS.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <p className="text-[10px] font-bold tracking-[0.45em] uppercase text-white/30 mb-4">
          Quick Actions
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {QUICK_ACTIONS.map(({ label, sub, icon: Icon, tab, color }) => (
            <button
              key={label}
              onClick={() => onNavigate?.(tab)}
              className="flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-200 group hover:-translate-y-0.5 active:scale-[0.99]"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-105"
                style={{ background: `${color}18`, border: `1px solid ${color}2e` }}
              >
                <Icon size={16} style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white/80 text-sm font-semibold">{label}</p>
                <p className="text-white/30 text-xs mt-0.5 truncate">{sub}</p>
              </div>
              <ArrowRight
                size={14}
                className="text-white/20 group-hover:text-white/50 group-hover:translate-x-0.5 transition-all duration-200 shrink-0"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Support callout */}
      <div
        className="rounded-2xl p-5 flex items-center gap-4"
        style={{
          background: "rgba(37,211,102,0.05)",
          border: "1px solid rgba(37,211,102,0.12)",
        }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: "rgba(37,211,102,0.1)",
            border: "1px solid rgba(37,211,102,0.18)",
          }}
        >
          <Shield size={15} style={{ color: "#25D366" }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white/60 text-sm font-semibold">24×7 Concierge Support</p>
          <p className="text-white/25 text-xs mt-0.5 leading-relaxed">
            Our security team is always on standby. WhatsApp us for instant assistance.
          </p>
        </div>
        <a
          href="https://wa.me/917304607954?text=Hi%20WENS%20Force!%20I%20need%20help."
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:brightness-110"
          style={{
            background: "rgba(37,211,102,0.14)",
            border: "1px solid rgba(37,211,102,0.25)",
            color: "#25D366",
          }}
        >
          Chat Now
        </a>
      </div>
    </div>
  );
}
