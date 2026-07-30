"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  CheckCircle2,
  Clock3,
  XCircle,
  Ban,
  Eye,
  Sparkles,
  Coins,
} from "lucide-react";
import { paymentApi } from "./apis/payments.api";
import AdminTable from "../components/AdminTable";
import { useFetchList } from "../hooks/useFetchList";

const PAGE_LIMIT = 10;

const COLUMNS = [
  { key: "id", label: "#" },
  { key: "user", label: "User" },
  { key: "package", label: "Package" },
  { key: "amount", label: "Amount" },
  { key: "discount", label: "Discount" },
  { key: "referral", label: "Referral" },
  { key: "finalAmount", label: "Final" },
  { key: "coupon", label: "Coupon" },
  { key: "order", label: "Order ID" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" },
];

function formatDate(iso) {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatMoney(value) {
  return `Rs ${Number(value || 0).toLocaleString("en-IN")}`;
}

function getStatusUI(status) {
  const s = String(status || "PENDING").toUpperCase();

  if (s === "SUCCESS" || s === "COMPLETED" || s === "PAID" || s === "ACTIVE") {
    return {
      className: "bg-green-100 text-green-700",
      icon: <CheckCircle2 size={11} />,
      label: s,
    };
  }
  if (s === "FAILED") {
    return {
      className: "bg-red-100 text-red-700",
      icon: <XCircle size={11} />,
      label: s,
    };
  }
  if (s === "CANCELLED") {
    return {
      className: "bg-gray-200 text-gray-700",
      icon: <Ban size={11} />,
      label: s,
    };
  }
  return {
    className: "bg-amber-100 text-amber-700",
    icon: <Clock3 size={11} />,
    label: s,
  };
}

export default function PaymentsPage() {
  const router = useRouter();

  // pagination stays local — the hook doesn't manage it
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_LIMIT,
    total: 0,
    totalPages: 1,
  });

  // stable wrapper: reads page/search from its own args, not closure
  const fetchPaymentsForHook = useCallback(async ({ search, page }) => {
    const { rows, pagination: pg } = await paymentApi.fetchPayments({
      page,
      search,
    });
    setPagination(pg);
    return rows;
  }, []);

  const {
    rows: payments,
    loading,
    error,
    searchInput,
    setSearchInput,
    search,
    refetch,
  } = useFetchList({
    fetchFn: fetchPaymentsForHook,
    params: { page },
  });

  // reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  function handleView(payment) {
    try {
      sessionStorage.setItem(`payment_${payment.id}`, JSON.stringify(payment));
    } catch (err) {
      console.warn("Could not cache payment for detail view:", err);
    }
    router.push(`/admin/payments/${payment.id}`);
  }

  function renderCell(payment, key) {
    const status = getStatusUI(payment.status);

    switch (key) {
      case "id":
        return (
          <span className="font-mono text-xs font-medium text-[#0B1E3F]">
            #{payment.id}
          </span>
        );
      case "user":
        return (
          <div className="max-w-45">
            <p
              className="text-sm font-medium text-[#1A202C] truncate"
              title={payment.user?.name || ""}
            >
              {payment.user?.name || "Guest"}
            </p>
          </div>
        );
      case "package":
        return (
          <span
            className="text-sm text-[#1A202C] font-medium"
            title={payment.package?.name || ""}
          >
            {payment.package?.name || `#${payment.packageId ?? "-"}`}
          </span>
        );
      case "amount":
        return (
          <span className="text-xs text-[#4A5568] whitespace-nowrap">
            {formatMoney(payment.amount)}
          </span>
        );
      case "discount":
        return (
          <span className="text-xs text-[#4A5568] whitespace-nowrap">
            {formatMoney(payment.discountAmount)}
          </span>
        );
      case "referral":
        return payment.appliedReferralRewardId || payment.referralDiscountAmount ? (
          <div className="flex flex-col gap-0.5">
            {payment.referralDiscountAmount ? (
              <span className="inline-flex items-center gap-1 rounded-md border border-[#C9A24B]/40 bg-[#FAF6EC] px-2 py-0.5 text-xs font-semibold text-[#0B1E3F] whitespace-nowrap">
                <Coins size={11} className="text-[#C9A24B]" />
                -{Number(payment.referralDiscountAmount || 0).toLocaleString("en-IN")}
              </span>
            ) : null}
            {payment.appliedReferralRewardId ? (
              <span className="text-[10px] text-[#718096]">
                Reward #{payment.appliedReferralRewardId}
              </span>
            ) : null}
          </div>
        ) : (
          <span className="text-xs text-[#A0AEC0]">-</span>
        );
      case "finalAmount":
        return (
          <span className="text-sm font-semibold text-[#0B1E3F] whitespace-nowrap">
            {formatMoney(payment.finalAmount)}
          </span>
        );
      case "coupon":
        return payment.couponCode ? (
          <span className="inline-flex items-center rounded-md border border-[#CBD5E0] bg-[#FAF6EC] px-2 py-1 text-xs font-semibold text-[#0B1E3F] uppercase tracking-wide">
            {payment.couponCode}
          </span>
        ) : (
          <span className="text-xs text-[#A0AEC0]">None</span>
        );
      case "order":
        return (
          <span
            className="text-xs font-mono text-[#4A5568]"
            title={payment.cashfreeOrderId || ""}
          >
            {payment.cashfreeOrderId || "-"}
          </span>
        );
      case "status":
        return (
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${status.className}`}
          >
            {status.icon} {status.label}
          </span>
        );
      case "actions":
        return (
          <button
            type="button"
            onClick={() => handleView(payment)}
            className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
          >
            <Eye size={14} /> View
          </button>
        );
      default:
        return null;
    }
  }

  return (
    <AdminTable
      icon={<CreditCard size={18} className="text-[#C9A24B]" />}
      title="Payments"
      subtitle={`${pagination.total} total payment${pagination.total !== 1 ? "s" : ""}`}
      searchPlaceholder="Search by user, package, order ID..."
      searchValue={searchInput}
      onSearchChange={setSearchInput}
      columns={COLUMNS}
      rows={payments}
      renderCell={renderCell}
      rowKey={(payment) => payment.id}
      loading={loading}
      error={error}
      pagination={pagination}
      onPageChange={setPage}
      onRefresh={refetch}
      emptyIcon={<CreditCard size={32} />}
      emptyText="No payments found"
    />
  );
}
