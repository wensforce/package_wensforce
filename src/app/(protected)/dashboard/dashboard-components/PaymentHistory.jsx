"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Wallet,
  ChevronRight,
  Tag,
  RefreshCw,
  Sparkles,
  Coins,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { paymentApiUser } from "@/app/user-apis/payment.api";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setPaymentHistory } from "../slices/payment-history-slice";

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

function formatPaymentId(id) {
  return `#PAY${String(id).padStart(4, "0")}`;
}

function formatCurrency(amount) {
  if (amount === null || amount === undefined) return "—";
  return `₹${Number(amount).toLocaleString("en-IN")}`;
}

// ── Status Config ─────────────────────────────────────────────────────────────
const STATUS_CFG = {
  success: {
    label: "Success",
    icon: <CheckCircle2 size={11} />,
    bg: "#e6f9f0",
    border: "#25a060",
    color: "#1a7a4a",
  },
  paid: {
    label: "Paid",
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
  failed: {
    label: "Failed",
    icon: <XCircle size={11} />,
    bg: "#fef2f2",
    border: "#fca5a5",
    color: "#dc2626",
  },
  cancelled: {
    label: "Cancelled",
    icon: <XCircle size={11} />,
    bg: "#fef2f2",
    border: "#fca5a5",
    color: "#dc2626",
  },
  refunded: {
    label: "Refunded",
    icon: <RotateCcw size={11} />,
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
      <div className="grid grid-cols-3 gap-2">
        <div className="h-8 bg-slate-200 rounded-lg" />
        <div className="h-8 bg-slate-200 rounded-lg" />
        <div className="h-8 bg-slate-200 rounded-lg" />
      </div>
      <div className="h-px bg-slate-100 my-2" />
      <div className="h-3 bg-slate-200 rounded w-1/2" />
    </div>
  );
}

// ── Payment Card ──────────────────────────────────────────────────────────────
function PaymentCard({ payment }) {
  const displayId = formatPaymentId(payment.id);
  const formattedCreatedDateTime = formatDateTime(payment.createdAt);
  const hasDiscount = (payment.discountAmount ?? 0) > 0;

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
          <div className="flex flex-col min-w-0">
            <span
              className="text-sm font-bold tracking-tight"
              style={{ color: "var(--color-navy)" }}
            >
              {displayId}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold mt-0.5 break-all">
              Order ID:{" "}
              <span className="font-mono">
                {payment.cashfreeOrderId ?? "—"}
              </span>
            </span>
          </div>
          <StatusBadge status={payment.status} />
        </div>

        {/* Package name + description */}
        <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-slate-400 font-medium">Package:</span>
          <span
            className="font-bold text-[11px] text-right"
            style={{ color: "var(--color-navy)" }}
          >
            {payment.package?.name ?? "—"}
          </span>
        </div>

        <div className="h-px bg-slate-100 my-2" />

        {/* Amount breakdown */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div>
            <span className="text-slate-400 font-semibold text-[10px] block">
              Amount
            </span>
            <span
              className="font-bold leading-tight mt-0.5 block truncate"
              style={{ color: "var(--color-navy)" }}
            >
              {formatCurrency(payment.amount)}
            </span>
          </div>
          <div>
            <span className="text-slate-400 font-semibold text-[10px] block">
              Discount
            </span>
            <span
              className="font-bold leading-tight mt-0.5 block truncate"
              style={{ color: hasDiscount ? "#1a7a4a" : "var(--color-navy)" }}
            >
              {hasDiscount
                ? `- ${formatCurrency(payment.discountAmount)}`
                : "—"}
            </span>
          </div>
          <div>
            <span className="text-slate-400 font-semibold text-[10px] block">
              Final Amount
            </span>
            <span
              className="font-bold leading-tight mt-0.5 block truncate"
              style={{ color: "var(--color-navy)" }}
            >
              {formatCurrency(payment.finalAmount)}
            </span>
          </div>
        </div>

        {/* Coupon code & Referral Reward badges */}
        <div className="flex flex-wrap items-center gap-2">
          {payment.couponCode && (
            <div
              className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg w-fit"
              style={{
                borderColor: "var(--color-gold-light)",
                background: "rgba(201, 162, 75, 0.06)",
                color: "var(--color-navy)",
                border: "1px solid var(--color-gold-light)",
              }}
            >
              <Tag size={11} />
              {payment.couponCode}
            </div>
          )}

          {(payment.appliedReferralRewardId || (payment.referralDiscountAmount ?? 0) > 0) && (
            <div className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg w-fit border border-[#C9A24B]/30 bg-[#FAF6EC] text-[#0B1E3F]">
              <Sparkles size={11} className="text-[#C9A24B]" />
              Referral Reward {payment.appliedReferralRewardId ? `#${payment.appliedReferralRewardId}` : ""}
              {(payment.referralDiscountAmount ?? 0) > 0 ? (
                <span className="inline-flex items-center gap-0.5">
                  (-<Coins size={11} className="text-[#C9A24B]" />
                  {Number(payment.referralDiscountAmount).toLocaleString("en-IN")})
                </span>
              ) : null}
            </div>
          )}
        </div>

        <div className="h-px bg-slate-100 my-2" />

        {/* Payment ID */}
        <div className="flex items-start justify-between text-xs gap-4 min-w-0">
          <span className="text-slate-400 font-semibold text-[10px] shrink-0 mt-0.5">
            Payment ID
          </span>
          <span
            className="font-bold text-[11px] font-mono text-right select-all break-all"
            style={{ color: "var(--color-navy)" }}
          >
            {payment.id ?? "Pending"}
          </span>
        </div>
      </div>

      <div className="h-px bg-slate-100 my-3" />

      {/* Bottom Footer Section: Created Timestamp */}
      <div className="flex items-center justify-between text-[9px] text-slate-400 font-medium">
        <span>Payment Request</span>
        <span>Created: {formattedCreatedDateTime}</span>
      </div>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div
      className="flex flex-col items-center text-center py-14 space-y-3 bg-white rounded-2xl border"
      style={{ borderColor: "var(--color-border)" }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{
          background: "var(--color-cream)",
          border: "1px solid var(--color-border)",
        }}
      >
        <Wallet size={22} style={{ color: "var(--color-text-tertiary)" }} />
      </div>
      <div>
        <p
          className="font-semibold text-sm"
          style={{ color: "var(--color-navy)" }}
        >
          No payments yet
        </p>
        <p
          className="text-xs mt-0.5"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          Your payment history will appear here once you make a payment.
        </p>
      </div>
    </div>
  );
}

// ── PaymentHistory (Default Export) ───────────────────────────────────────────
export default function PaymentHistory() {
  const { user, isLoggedIn } = useAuth();
  const dispatch = useDispatch();

  const storePayments = useSelector((state) => state.paymentHistory.value);

  const [payments, setPayments] = useState([]);
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
      const data = await paymentApiUser.getMyPayments();
      const fetchedPayments = Array.isArray(data?.data) ? data.data : [];
      setPayments(fetchedPayments);
      dispatch(setPaymentHistory(fetchedPayments));
      if (isRefresh) toast.success("Payment history refreshed");
    } catch {
      toast.error("Failed to load payment history. Please try again.");
      if (!isRefresh) setPayments([]);
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

    // ── Store hit: use cached payment history, skip API call ──
    if (storePayments && storePayments.length > 0) {
      setPayments(storePayments);
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

  const displayed = showAll ? payments : payments.slice(0, PREVIEW_COUNT);
  const hasMore = payments.length > PREVIEW_COUNT;

  return (
    <div className="space-y-4">
      {/* Heading */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2
            className="text-xl font-bold"
            style={{
              color: "var(--color-navy)",
              fontFamily: "var(--font-playfair)",
            }}
          >
            Payment History
          </h2>
          <p
            className="text-sm mt-0.5"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            View all your payments and their status
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
      {!loading && payments.length === 0 && <EmptyState />}

      {/* Responsive Card Grid */}
      {!loading && payments.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayed.map((payment) => (
            <PaymentCard key={payment.id} payment={payment} />
          ))}
        </div>
      )}

      {/* View All Footer */}
      {!loading && hasMore && (
        <div className="flex justify-center pt-2">
          <button
            onClick={() => setShowAll((p) => !p)}
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-85 active:scale-[0.98] border shadow-sm bg-white"
            style={{
              color: "var(--color-navy)",
              borderColor: "var(--color-border)",
            }}
          >
            {showAll ? "Show Less" : `View All Payments (${payments.length})`}
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