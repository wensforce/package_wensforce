'use client';

import Link from "next/link";
import {
  Users,
  CreditCard,
  Wallet,
  MapPin,
  Package,
  Wrench,
  ArrowRight,
  TrendingUp,
  Activity,
} from "lucide-react";
import { useEffect } from "react";
import { useAdminStats } from './hooks/useAdminStats.js';
import { useDashboardStore } from '@/store/admin/dashboard.store';



const MODULES = [
  { href: "/admin/users",         label: "All Users",     sub: "Manage member accounts",  icon: Users,      color: "#C9A24B" },
  { href: "/admin/subscriptions", label: "Subscriptions", sub: "View active plans",        icon: CreditCard, color: "#6B8DD6" },
  { href: "/admin/trips",         label: "All Trips",     sub: "Monitor journeys",         icon: MapPin,     color: "#9B7FD4" },
  { href: "/admin/packages",      label: "Packages",      sub: "Create & manage plans",    icon: Package,    color: "#E07B39" },
  { href: "/admin/services",      label: "Services",      sub: "Add & edit services",      icon: Wrench,     color: "#D4AF37" },
  { href: "/admin/payments",      label: "Payments",      sub: "Transaction records",      icon: Wallet,     color: "#22c55e" },
];

function StatCard({ label, value, sub, color, icon: Icon }) {
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
          background: `radial-gradient(ellipse at top right, ${color}14 0%, transparent 70%)`,
        }}
      />
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
        style={{ background: `${color}18`, border: `1px solid ${color}28` }}
      >
        <Icon size={16} style={{ color }} />
      </div>
      <p className="text-2xl font-bold text-white mb-0.5">{value}</p>
      <p
        className="text-[10px] font-bold tracking-widest uppercase mb-0.5"
        style={{ color }}
      >
        {label}
      </p>
      <p className="text-white/20 text-xs">{sub}</p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { fetchStats, loading } = useAdminStats();
  const adminStats = useDashboardStore((s) => s.adminStats);
  const s = loading ? {} : (adminStats ?? {});
  

  const STATS = [
    { label: "Total Members",        value: s.users         ?? "—", color: "#C9A24B", icon: Users      },
    { label: "Active Subscriptions", value: s.subscriptions ?? "—", color: "#6B8DD6", icon: CreditCard },
    { label: "Revenue Collected",    value: s.revenue != null ? `₹${Number(s.revenue).toLocaleString("en-IN")}` : "—", color: "#22c55e", icon: Wallet },
    { label: "Trips This Month",     value: s.trips         ?? "—", color: "#9B7FD4", icon: MapPin     },
  ];

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="max-w-6xl space-y-10">
      {/* Page header */}
      <div>
        <p
          className="text-[10px] font-bold tracking-[0.5em] uppercase mb-1"
          style={{ color: "#C9A24B" }}
        >
          Control Center
        </p>
        <h1
          className="text-3xl font-bold text-white"
          style={{ fontFamily: "var(--font-playfair, serif)" }}
        >
          Admin Dashboard
        </h1>
        <p className="text-white/30 text-sm mt-1.5">
          Overview of all WENS Force operations and membership data.
        </p>
      </div>

      {/* Stats grid */}
      <div>
        <p className="text-[10px] font-bold tracking-widest uppercase text-white/22 mb-4">
          Key Metrics
        </p>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {STATS.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </div>


      {/* Module cards */}
      <div>
        <p className="text-[10px] font-bold tracking-widest uppercase text-white/22 mb-4">
          Admin Modules
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {MODULES.map(({ href, label, sub, icon: Icon, color }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-4 p-4 rounded-2xl group transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99]"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-105"
                style={{ background: `${color}18`, border: `1px solid ${color}28` }}
              >
                <Icon size={16} style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white/80 text-sm font-semibold">{label}</p>
                <p className="text-white/28 text-xs mt-0.5 truncate">{sub}</p>
              </div>
              <ArrowRight
                size={14}
                className="text-white/18 group-hover:text-white/45 group-hover:translate-x-0.5 transition-all duration-200 shrink-0"
              />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] font-bold tracking-widest uppercase text-white/22">
            Recent Activity
          </p>
          <span
            className="text-[10px] px-2.5 py-1 rounded-full font-bold"
            style={{
              background: "rgba(201,162,75,0.08)",
              color: "rgba(201,162,75,0.5)",
              border: "1px solid rgba(201,162,75,0.14)",
            }}
          >
            Live feed — coming soon
          </span>
        </div>

        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          {/* Table header */}
          <div
            className="grid px-5 py-3.5 border-b"
            style={{
              gridTemplateColumns: "1fr 1fr 1fr 90px",
              borderColor: "rgba(255,255,255,0.05)",
            }}
          >
            {["Event", "User", "Timestamp", "Status"].map((h) => (
              <p
                key={h}
                className="text-[10px] font-bold tracking-widest uppercase text-white/20"
              >
                {h}
              </p>
            ))}
          </div>

          {/* Empty state */}
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <TrendingUp
              size={30}
              className="mb-4"
              style={{ color: "rgba(201,162,75,0.2)" }}
            />
            <p className="text-white/24 text-sm font-medium">No recent activity</p>
            <p className="text-white/14 text-xs mt-1 max-w-xs leading-relaxed">
              Activity log will appear here once admin analytics are integrated.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
