"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Navigation,
  ChevronRight,
  Package,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../axios/axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setTripHistory } from "../slices/trip-history-slice";
// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDateTime(dateStr) {
  if (!dateStr) return "—";
  const date = new Date(dateStr);

  const formattedDate = date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedTime = date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `${formattedDate}, ${formattedTime}`;
}

function formatTripId(id) {
  return `#TRP${String(id).padStart(4, "0")}`;
}

function formatTripType(type) {
  if (!type) return "—";
  return type
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// ── Status Config ─────────────────────────────────────────────────────────────
const STATUS_CFG = {
  confirmed: {
    label: "Confirmed",
    icon: <CheckCircle2 size={11} />,
    bg: "#e6f9f0",
    border: "#25a060",
    color: "#1a7a4a",
  },
  completed: {
    label: "Completed",
    icon: <CheckCircle2 size={11} />,
    bg: "#e6f9f0",
    border: "#1a7a4a",
    color: "#14532d",
  },
  cancelled: {
    label: "Cancelled",
    icon: <XCircle size={11} />,
    bg: "#fef2f2",
    border: "#fca5a5",
    color: "#dc2626",
  },
  requested: {
    label: "Requested",
    icon: <Clock size={11} />,
    bg: "#eff6ff",
    border: "#bfdbfe",
    color: "#1d4ed8",
  },
  pending: {
    label: "Pending",
    icon: <Clock size={11} />,
    bg: "#fffbeb",
    border: "#d69e2e",
    color: "#92400e",
  },
};

function StatusBadge({ status }) {
  const s = STATUS_CFG[(status ?? "").toLowerCase()] ?? STATUS_CFG.pending;
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap border"
      style={{ background: s.bg, borderColor: s.border, color: s.color }}
    >
      {s.icon}
      {s.label}
    </span>
  );
}

// ── Loading Skeleton Card ─────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-200 p-5 space-y-4 animate-pulse bg-white shadow-sm">
      <div className="flex justify-between items-center">
        <div className="h-4 bg-slate-200 rounded w-1/3" />
        <div className="h-6 bg-slate-200 rounded-full w-1/4" />
      </div>
      <div className="space-y-2.5">
        <div className="h-3.5 bg-slate-200 rounded w-3/4" />
        <div className="h-3.5 bg-slate-200 rounded w-1/2" />
      </div>
      <div className="h-px bg-slate-100 my-2" />
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
          <div className="h-3 bg-slate-200 rounded w-2/3" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
          <div className="h-3 bg-slate-200 rounded w-1/2" />
        </div>
      </div>
      <div className="h-px bg-slate-100 my-2" />
      <div className="flex gap-2">
        <div className="h-5 bg-slate-200 rounded-lg w-16" />
        <div className="h-5 bg-slate-200 rounded-lg w-16" />
      </div>
    </div>
  );
}

// ── Trip Card ─────────────────────────────────────────────────────────────────
function TripCard({ trip }) {
  const displayId = formatTripId(trip.id);
  const typeLabel = formatTripType(trip.tripType);
  const formattedTripDateTime = formatDateTime(trip.tripDate);
  const formattedCreatedDateTime = formatDateTime(trip.createdAt);

  return (
    <div
      className="rounded-2xl border bg-white p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
      style={{
        borderColor: "var(--color-border)",
      }}
    >
      <div className="space-y-3 flex-1">
        {/* Top Header section: IDs & Status */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight" style={{ color: "var(--color-navy)" }}>
              {displayId}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold mt-0.5">
              Subscription ID: {trip.subscriptionId}
            </span>
          </div>
          <StatusBadge status={trip.status} />
        </div>

        {/* Assignment Reference ID */}
        <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-slate-400 font-medium">Assignment Ref:</span>
          <span className="font-bold uppercase text-[11px]" style={{ color: "var(--color-navy)" }}>
            {trip.assignmentId ?? "Pending"}
          </span>
        </div>

        <div className="h-px bg-slate-100 my-2" />

        {/* Route Locations (Pickup & Drop) */}
        <div className="relative pl-5 space-y-3">
          <div className="absolute left-[4px] top-1.5 bottom-1.5 w-px border-l border-dashed border-slate-300" />

          <div className="relative">
            <div className="absolute left-[-21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pickup Location</div>
            <div className="text-xs font-bold truncate mt-0.5" style={{ color: "var(--color-navy)" }}>
              {trip.pickupLocation ?? "—"}
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-[-21px] top-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-4 ring-rose-50" />
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Drop Location</div>
            <div className="text-xs font-bold truncate mt-0.5" style={{ color: "var(--color-navy)" }}>
              {trip.dropLocation ?? "—"}
            </div>
          </div>
        </div>

        <div className="h-px bg-slate-100 my-2" />

        {/* Date/Time and Trip Type Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-slate-400 font-semibold text-[10px] block">Trip Date & Time</span>
            <span className="font-bold leading-tight mt-0.5 block truncate" style={{ color: "var(--color-navy)" }}>
              {formattedTripDateTime}
            </span>
          </div>
          <div>
            <span className="text-slate-400 font-semibold text-[10px] block">Trip Type</span>
            <span className="font-bold leading-tight mt-0.5 block truncate text-xs" style={{ color: "var(--color-navy)" }}>
              {typeLabel}
            </span>
          </div>
        </div>

        {/* Services requested */}
        <div className="space-y-1">
          <span className="text-slate-400 text-[10px] font-semibold block">Services Requested</span>
          {trip.services && trip.services.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {trip.services.map((svc) => (
                <span
                  key={svc.id}
                  className="px-2 py-0.5 rounded-lg text-[9px] font-bold border capitalize"
                  style={{
                    borderColor: "var(--color-gold-light)",
                    background: "rgba(201, 162, 75, 0.06)",
                    color: "var(--color-navy)",
                  }}
                >
                  {svc.name}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-xs text-slate-400 italic">No services requested</span>
          )}
        </div>

        {/* Cancellation Reason alert block */}
        {trip.status?.toLowerCase() === "cancelled" && (
          <div
            className="flex items-start gap-2.5 p-3 rounded-2xl text-[11px] leading-snug mt-2.5"
            style={{ background: "#fef2f2", color: "#b91c1c", border: "1px solid #fee2e2" }}
          >
            <XCircle size={14} className="flex-shrink-0 mt-0.5 text-red-600" />
            <div className="flex-1 min-w-0">
              <span className="font-bold block">Cancelled</span>
              <span className="block mt-0.5 font-medium break-words">
                {trip.cancellationReason || "No cancellation reason provided."}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="h-px bg-slate-100 my-3" />

      {/* Bottom Footer Section: Created/Requested Timestamp */}
      <div className="flex items-center justify-between text-[9px] text-slate-400 font-medium">
        <span>Trip Booking Request</span>
        <span>Requested: {formattedCreatedDateTime}</span>
      </div>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center text-center py-14 space-y-3 bg-white rounded-2xl border" style={{ borderColor: "var(--color-border)" }}>
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ background: "var(--color-cream)", border: "1px solid var(--color-border)" }}
      >
        <Navigation size={22} style={{ color: "var(--color-text-tertiary)" }} />
      </div>
      <div>
        <p className="font-semibold text-sm" style={{ color: "var(--color-navy)" }}>
          No trips yet
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
          Your trip history will appear here once you request a trip.
        </p>
      </div>
    </div>
  );
}

// ── TripHistory (Default Export) ──────────────────────────────────────────────
export default function TripHistory() {
  const { user, isLoggedIn } = useAuth();
  const dispatch = useDispatch();

  const storeTrips = useSelector((state) => state.tripHistory.value);

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const PREVIEW_COUNT = 6; // Fits grid layouts perfectly

  // Always hits the API — used by both initial cache-miss load and manual refresh.
  async function fetchFromApi({ isRefresh = false } = {}) {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const { data } = await api.get("/trip/mine");
      const fetchedTrips = Array.isArray(data?.data) ? data.data : [];
      setTrips(fetchedTrips);
      dispatch(setTripHistory(fetchedTrips));
      if (isRefresh) toast.success("Trip history refreshed");
    } catch {
      toast.error("Failed to load trip history. Please try again.");
      if (!isRefresh) setTrips([]);
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

    // ── Store hit: use cached trip history, skip API call ──
    if (storeTrips && storeTrips.length > 0) {
      console.log("Trip history store hit");
      setTrips(storeTrips);
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

  const displayed = showAll ? trips : trips.slice(0, PREVIEW_COUNT);
  const hasMore = trips.length > PREVIEW_COUNT;

  return (
    <div className="space-y-4">
      {/* Heading */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2
            className="text-xl font-bold"
            style={{ color: "var(--color-navy)", fontFamily: "var(--font-playfair)" }}
          >
            Trip History
          </h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
            View all your trip requests and their status
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

      {/* Skeletons Loader */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && trips.length === 0 && <EmptyState />}

      {/* Responsive Card Grid */}
      {!loading && trips.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayed.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}

      {/* View All Footer */}
      {!loading && hasMore && (
        <div className="flex justify-center pt-2">
          <button
            onClick={() => setShowAll((p) => !p)}
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-85 active:scale-[0.98] border shadow-sm bg-white"
            style={{ color: "var(--color-navy)", borderColor: "var(--color-border)" }}
          >
            {showAll ? "Show Less" : `View All Trips (${trips.length})`}
            <ChevronRight
              size={15}
              style={{
                transform: showAll ? "rotate(90deg)" : "none",
                transition: "transform 0.2s",
              }}
            />
          </button>
        </div>
      )}

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
    </div>
  );
}