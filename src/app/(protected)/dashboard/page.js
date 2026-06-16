"use client";

import { act, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Shield,
  CalendarDays,
  IndianRupee,
  LogOut,
  RefreshCw,
  ChevronRight,
  ChevronLeft,
  Clock,
  CheckCircle2,
  XCircle,
  Hourglass,
  PlayCircle,
  ShoppingBag,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../axios/axios";
import { toast } from "sonner";

// ── helpers ──────────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatPrice(amount) {
  if (amount == null) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

const STATUS_MAP = {
  pending: {
    label: "Pending",
    icon: <Hourglass size={11} />,
    bg: "#fffbeb",
    border: "#d69e2e",
    color: "#92400e",
    bar: "linear-gradient(90deg, #d69e2e, #f6ad55)",
  },
  active: {
    label: "Active",
    icon: <PlayCircle size={11} />,
    bg: "#e6f9f0",
    border: "#25a060",
    color: "#1a7a4a",
    bar: "linear-gradient(90deg, var(--color-navy), var(--color-gold))",
  },
  completed: {
    label: "Completed",
    icon: <CheckCircle2 size={11} />,
    bg: "#eef2ff",
    border: "#4f46e5",
    color: "#3730a3",
    bar: "linear-gradient(90deg, #4f46e5, #818cf8)",
  },
  cancelled: {
    label: "Cancelled",
    icon: <XCircle size={11} />,
    bg: "#fef2f2",
    border: "#e53e3e",
    color: "#9b2c2c",
    bar: "#e53e3e",
  },
};

function StatusBadge({ status }) {
  const s = STATUS_MAP[status] ?? STATUS_MAP.pending;
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{
        background: s.bg,
        border: `1px solid ${s.border}`,
        color: s.color,
      }}
    >
      {s.icon}
      {s.label}
    </span>
  );
}

function PlanCard({ plan, onBuyAgain }) {
  const s = STATUS_MAP[plan.status] ?? STATUS_MAP.pending;
  const canBuyAgain =
    plan.status === "completed" || plan.status === "cancelled";

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg"
      style={{
        border: "1px solid var(--color-border)",
        background: "var(--color-white)",
      }}
    >
      {/* Accent bar */}
      <div className="h-1.5 w-full" style={{ background: s.bar }} />

      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              Membership Plan
            </p>
            <h3
              className="text-2xl font-bold"
              style={{
                color: "var(--color-navy)",
                fontFamily: "var(--font-playfair)",
              }}
            >
              {plan.packageName ?? "—"}
            </h3>
          </div>
          <StatusBadge status={plan.status} />
        </div>

        {/* Divider */}
        <div className="h-px" style={{ background: "var(--color-border)" }} />

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-4">
          <InfoCell
            icon={<IndianRupee size={14} />}
            label="Amount Paid"
            value={formatPrice(plan.purchaseAmount)}
          />
          <InfoCell
            icon={<CalendarDays size={14} />}
            label="Purchase Date"
            value={formatDate(plan.purchaseDate)}
          />
          <InfoCell
            icon={<CalendarDays size={14} />}
            label="Validity"
            value={plan.validity}
          />
          <InfoCell
            icon={<Clock size={14} />}
            label="Plan Status"
            value={s.label}
            color={s.color}
          />
        </div>

        {/* Buy Again */}
        <button
          onClick={() => onBuyAgain(plan)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
          style={
            canBuyAgain
              ? {
                  background:
                    "linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-light) 100%)",
                  color: "var(--color-white)",
                }
              : {
                  background: "var(--color-cream)",
                  border: "1.5px solid var(--color-border)",
                  color: "var(--color-navy)",
                }
          }
        >
          <ShoppingBag size={14} />
          {canBuyAgain ? "Buy Again" : "Buy Again"}
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

function InfoCell({ icon, label, value, color }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5">
        <span style={{ color: "var(--color-gold)" }}>{icon}</span>
        <span
          className="text-xs font-medium uppercase tracking-wider"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          {label}
        </span>
      </div>
      <p
        className="text-sm font-semibold"
        style={{ color: color ?? "var(--color-text-primary)" }}
      >
        {value}
      </p>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user, logout, isLoggedIn } = useAuth();
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn || !user) return;

    async function fetchPlans() {
      try {
        const { data } = await api.get("/booking/my");
        setPlans(data?.data ?? []);
      } catch {
        toast.error("Failed to load your memberships. Please try again later.");
        setPlans([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, [isLoggedIn, user]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      logout();
    } catch (err) {
      console.error("Error during logout API call:", err);
    }
  };

  const handleRenew = (plan) => {
    router.push(`/membership/${plan.packageId ?? ""}`);
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--color-cream)" }}>
      {/* ── Top bar ──────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-sm"
        style={{
          background: "rgba(250,246,236,0.88)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="max-w-3xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 flex items-center justify-center">
              <img src="/Logo.png" alt="" />
            </div>
            <span
              className="text-base font-semibold"
              style={{
                color: "var(--color-navy)",
                fontFamily: "var(--font-playfair)",
              }}
            >
              WENS Force
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all hover:opacity-70"
            style={{
              color: "var(--color-text-secondary)",
              border: "1px solid var(--color-border)",
              background: "var(--color-white)",
            }}
          >
            <LogOut size={12} />
            Sign out
          </button>
        </div>
      </header>

      {/* ── Content ──────────────────────────────────────────────── */}
      <main className="max-w-3xl mx-auto px-5 py-10 space-y-8">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-sm font-medium transition-all hover:opacity-70"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <ChevronLeft size={16} />
          Back
        </button>

        {/* Greeting */}
        <div className="space-y-1">
          <p
            className="text-sm"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            Welcome back
          </p>
          <h1
            className="text-3xl font-bold"
            style={{
              color: "var(--color-navy)",
              fontFamily: "var(--font-playfair)",
            }}
          >
            {user?.name ?? user?.phone ?? "Member"}
          </h1>
          {user?.phone && user?.name && (
            <p
              className="text-sm"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {user.phone}
            </p>
          )}
        </div>

        {/* Section heading */}
        <div className="flex items-center justify-between">
          <h2
            className="text-lg font-semibold"
            style={{ color: "var(--color-navy)" }}
          >
            Your Memberships
          </h2>
          {!loading && plans.length > 0 && (
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-full"
              style={{
                background: "var(--color-navy)",
                color: "var(--color-gold)",
              }}
            >
              {plans.length} plan{plans.length > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="rounded-2xl h-64 animate-pulse"
                style={{ background: "var(--color-border)" }}
              />
            ))}
          </div>
        )}

        {/* Plans */}
        {!loading && plans.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2">
            {plans.map((plan, i) => (
              <PlanCard
                key={plan.planId ?? plan.id ?? i}
                plan={plan}
                onBuyAgain={handleRenew}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && plans.length === 0 && (
          <div
            className="rounded-2xl p-10 flex flex-col items-center text-center space-y-4"
            style={{
              background: "var(--color-white)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{
                background: "var(--color-cream)",
                border: "1px solid var(--color-border)",
              }}
            >
              <RefreshCw
                size={22}
                style={{ color: "var(--color-text-tertiary)" }}
              />
            </div>
            <div className="space-y-1">
              <p
                className="font-semibold text-sm"
                style={{ color: "var(--color-navy)" }}
              >
                No active memberships
              </p>
              <p
                className="text-xs"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                Explore our plans and get started with WENS Force
              </p>
            </div>
            <Link
              href="/#plans"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-light) 100%)",
                color: "var(--color-white)",
              }}
            >
              <ShoppingBag size={14} />
              Browse Plans
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
