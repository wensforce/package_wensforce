"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Shield,
  Calendar,
  Navigation,
  CheckCircle2,
  RefreshCw,
  MapPin,
  Package,
  Hourglass,
  PlayCircle,
  AlertTriangle,
  XCircle,
  Clock,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "sonner";
// import RequestTripModal from "./RequestTrip";
import { useDispatch, useSelector } from "react-redux";
import { setActivePackages } from "../slices/active-packages-slice";
import { subscriptionApiUser } from "@/app/user-apis/subscription.api";
// ── Config ────────────────────────────────────────────────────────────────────
const ASSETS_BASE = process.env.NEXT_PUBLIC_ASSETS_URL ?? "";

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getImageUrl(key) {
  if (!key) return null;
  if (key.startsWith("http")) return key;
  return `${ASSETS_BASE}/${key}`;
}

function isExpiringSoon(endDate) {
  if (!endDate) return false;
  const diffDays = (new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24);
  return diffDays > 0 && diffDays <= 30;
}

function resolveDisplayStatus(plan) {
  if (plan.status === "active" && isExpiringSoon(plan.endDate))
    return "expiring_soon";
  return plan.status;
}

function normalisePlans(raw) {
  if (!raw) return [];
  return Array.isArray(raw) ? raw : [raw];
}

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CFG = {
  pending: {
    label: "Pending",
    icon: <Hourglass size={11} />,
    bg: "#fffbeb",
    border: "#d69e2e",
    color: "#92400e",
  },
  active: {
    label: "Active",
    icon: <PlayCircle size={11} />,
    bg: "#e6f9f0",
    border: "#25a060",
    color: "#1a7a4a",
  },
  expiring_soon: {
    label: "Expiring Soon",
    icon: <AlertTriangle size={11} />,
    bg: "#fff7ed",
    border: "#f97316",
    color: "#9a3412",
  },
  completed: {
    label: "Completed",
    icon: <CheckCircle2 size={11} />,
    bg: "#eef2ff",
    border: "#4f46e5",
    color: "#3730a3",
  },
  cancelled: {
    label: "Cancelled",
    icon: <XCircle size={11} />,
    bg: "#fef2f2",
    border: "#e53e3e",
    color: "#9b2c2c",
  },
};

// ── StatusBadge ───────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const s = STATUS_CFG[status] ?? STATUS_CFG.pending;
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0"
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

// ── StatCell ──────────────────────────────────────────────────────────────────
function StatCell({ icon, label, value }) {
  return (
    <div className="flex flex-col items-center gap-0.5 min-w-0">
      <div
        className="flex items-center gap-1 text-xs whitespace-nowrap"
        style={{ color: "var(--color-text-tertiary)" }}
      >
        <span style={{ color: "var(--color-gold)" }}>{icon}</span>
        {label}
      </div>
      <span
        className="text-sm font-bold"
        style={{ color: "var(--color-navy)" }}
      >
        {value}
      </span>
    </div>
  );
}

// ── PackageCard ───────────────────────────────────────────────────────────────
function PackageCard({ plan, onRequestTrip }) {
  const pkg = plan.package ?? {};
  const displayStatus = resolveDisplayStatus(plan);
  const tripsLeft = (plan.tripsTotal ?? 0) - (plan.tripsUsed ?? 0);
  const vehicleImg = getImageUrl(pkg.thumbnailUrl ?? pkg.thumbnailUrlKey);

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        border: "1px solid var(--color-border)",
        background: "var(--color-white)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      <div className="flex flex-col sm:flex-row">
        {/* ── Left: vehicle image ── */}
        <div
          className="relative sm:w-52 flex-shrink-0 overflow-hidden"
          style={{ minHeight: 220, background: "#e2e8f0" }}
        >
          {vehicleImg ? (
            <img
              src={vehicleImg}
              alt={pkg.vehicleModel ?? "Vehicle"}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Shield size={40} style={{ color: "#94a3b8" }} />
            </div>
          )}

          {/* gradient overlay */}
          <div
            className="absolute bottom-0 left-0 right-0 p-3 space-y-2"
            style={{
              background:
                "linear-gradient(0deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0) 100%)",
            }}
          >
            <p className="text-sm font-semibold text-white leading-tight">
              {plan.vehicleType ?? pkg.vehicleType}
              {pkg.vehicleModel && (
                <>
                  <span className="mx-1.5 text-white/50">•</span>
                  {pkg.vehicleModel}
                </>
              )}
            </p>
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-white"
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.25)",
                backdropFilter: "blur(4px)",
              }}
            >
              <Shield size={10} />
              {plan.bodyguardType ?? pkg.bodyguardType} Bodyguard
            </span>
          </div>
        </div>

        {/* ── Right: info ── */}
        <div className="flex-1 p-5 flex flex-col gap-4 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3
                className="text-xl font-bold leading-tight"
                style={{
                  color: "var(--color-navy)",
                  fontFamily: "var(--font-playfair)",
                }}
              >
                {pkg.name ?? "—"}
              </h3>
              {pkg.description && (
                <p
                  className="text-xs mt-0.5 line-clamp-1"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  {pkg.description}
                </p>
              )}
            </div>
            <StatusBadge status={displayStatus} />
          </div>

          {/* Stats row */}
          <div
            className="flex items-center justify-between rounded-xl px-3 py-3 gap-2"
            style={{
              background: "var(--color-cream)",
              border: "1px solid var(--color-border)",
            }}
          >
            <StatCell
              icon={<Calendar size={11} />}
              label="Validity"
              value={`${pkg.validity ?? "—"} Months`}
            />
            <div
              className="w-px self-stretch"
              style={{ background: "var(--color-border)" }}
            />
            <StatCell
              icon={<Navigation size={11} />}
              label="Total Trips"
              value={plan.tripsTotal ?? 0}
            />
            <div
              className="w-px self-stretch"
              style={{ background: "var(--color-border)" }}
            />
            <StatCell
              icon={<CheckCircle2 size={11} />}
              label="Trips Used"
              value={plan.tripsUsed ?? 0}
            />
            <div
              className="w-px self-stretch"
              style={{ background: "var(--color-border)" }}
            />
            <StatCell
              icon={<RefreshCw size={11} />}
              label="Trips Left"
              value={tripsLeft}
            />
          </div>

          {/* Package Details */}
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              Package Details
            </p>
            <div className="space-y-1.5">
              {[
                ["Vehicle Type", plan.vehicleType ?? pkg.vehicleType],
                ["Vehicle Model", pkg.vehicleModel],
                ["Bodyguard Type", plan.bodyguardType ?? pkg.bodyguardType],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center gap-2 text-sm">
                  <span
                    className="w-32 flex-shrink-0"
                    style={{ color: "var(--color-text-tertiary)" }}
                  >
                    {label}
                  </span>
                  <span
                    className="font-semibold"
                    style={{ color: "var(--color-navy)" }}
                  >
                    {value ?? "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Included Services */}
          {plan.services?.length > 0 && (
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                Included Services{" "}
                <span className="normal-case font-normal">
                  (Only services included in your package)
                </span>
              </p>
              <div className="flex flex-wrap gap-2">
                {plan.services.map((svc) => {
                  const svcImg = getImageUrl(
                    svc.thumbnailUrl ?? svc.thumbnailUrlKey,
                  );
                  return (
                    <div
                      key={svc.id}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl"
                      style={{
                        background: "var(--color-cream)",
                        border: "1px solid var(--color-border)",
                      }}
                    >
                      {svcImg ? (
                        <img
                          src={svcImg}
                          alt={svc.title}
                          className="w-7 h-7 rounded-lg object-cover flex-shrink-0"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: "var(--color-border)" }}
                        >
                          <Package size={12} style={{ color: "#94a3b8" }} />
                        </div>
                      )}
                      <div>
                        <p
                          className="text-xs font-semibold leading-tight"
                          style={{ color: "var(--color-navy)" }}
                        >
                          {svc.title}
                        </p>
                        <p
                          className="text-xs leading-tight"
                          style={{
                            color:
                              svc.count > 0
                                ? "var(--color-text-tertiary)"
                                : "#e53e3e",
                          }}
                        >
                          {svc.count} available
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-1 mt-auto">
            <p
              className="text-xs"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              Valid till:{" "}
              <span
                className="font-semibold"
                style={{ color: "var(--color-navy)" }}
              >
                {formatDate(plan.endDate)}
              </span>
            </p>
            {/* <button
              onClick={() => onRequestTrip(plan)}
              className="flex cursor-pointer items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-light,#1e3a6e) 100%)",
                color: "var(--color-white)",
              }}
            >
              <MapPin size={14} />
              Request a Trip
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Loading skeleton ──────────────────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="rounded-2xl h-72 animate-pulse"
          style={{ background: "var(--color-border)" }}
        />
      ))}
    </div>
  );
}

// ── ActivePackages (default export) ──────────────────────────────────────────
export default function ActivePackages() {
  const { user, isLoggedIn } = useAuth();
  const dispatch = useDispatch();

  const storePlans = useSelector((state) => state.activePackages.value);

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tripModalPlan, setTripModalPlan] = useState(null);

  // Always hits the API — used by both initial cache-miss load and manual refresh.
  async function fetchFromApi({ isRefresh = false } = {}) {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const data = await subscriptionApiUser.getMySubscriptions();
      const fetchedPlans = normalisePlans(data?.data);
      setPlans(fetchedPlans);
      dispatch(setActivePackages(fetchedPlans));
      if (isRefresh) toast.success("Memberships refreshed");
    } catch {
      toast.error("Failed to load your memberships. Please try again.");
      if (!isRefresh) setPlans([]);
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    if (!isLoggedIn || !user) return;

    // ── Store hit: use cached active packages, skip API call ──
    if (storePlans && storePlans.length > 0) {
      setPlans(storePlans);
      setLoading(false);
      return;
    }

    // ── Store miss: fetch from API and populate store ──
    fetchFromApi();
  }, [isLoggedIn, user]);

  function handleRefresh() {
    if (refreshing || loading) return;
    fetchFromApi({ isRefresh: true });
  }

  return (
    <>
      <div className="space-y-4">
        {/* Section heading */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2
              className="text-xl font-bold"
              style={{
                color: "var(--color-navy)",
                fontFamily: "var(--font-playfair)",
              }}
            >
              Active Packages
            </h2>
            <p
              className="text-sm mt-0.5"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              View your current active packages and available trips
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all hover:opacity-85 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            style={{
              color: "var(--color-navy)",
              borderColor: "var(--color-border)",
              background: "var(--color-white)",
            }}
          >
            <RefreshCw
              size={13}
              style={{
                animation: refreshing ? "spin 0.8s linear infinite" : "none",
              }}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Loading */}
        {loading && <LoadingSkeleton />}

        {/* Cards */}
        {!loading && plans.length > 0 && (
          <div className="space-y-4">
            {plans.map((plan, i) => (
              <PackageCard
                key={plan.id ?? i}
                plan={plan}
                onRequestTrip={setTripModalPlan}
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
              <ShoppingBag
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
                  "linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-light,#1e3a6e) 100%)",
                color: "var(--color-white)",
              }}
            >
              <ShoppingBag size={14} />
              Browse Plans
            </Link>
          </div>
        )}
      </div>

      {/* Request Trip Modal
      {tripModalPlan && (
        <RequestTripModal
          plan={tripModalPlan}
          onClose={() => setTripModalPlan(null)}
        />
      )} */}

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}
