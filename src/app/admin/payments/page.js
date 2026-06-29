"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, CheckCircle2, Clock3, XCircle, Ban, Eye } from "lucide-react";
import api from "../../axios/axios";
import AdminTable from "../components/AdminTable";

const PAGE_LIMIT = 10;

const COLUMNS = [
  { key: "id", label: "#" },
  { key: "user", label: "User" },
  { key: "package", label: "Package" },
  { key: "amount", label: "Amount" },
  { key: "discount", label: "Discount" },
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

  if (s === "SUCCESS" || s === "COMPLETED" || s === "PAID") {
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
  const [payments, setPayments] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_LIMIT,
    total: 0,
    totalPages: 1,
  });
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = { page, limit: PAGE_LIMIT };
      if (search.trim()) params.search = search.trim();

      const res = await api.get("/payment", { params });
      const data = res.data?.data ?? {};

      const rows = Array.isArray(data.payments) ? data.payments : [];
      const total = Number(data.totalCount ?? rows.length ?? 0);
      const currentPage = Number(data.page ?? page);
      const limit = Number(data.limit ?? PAGE_LIMIT);

      setPayments(rows);
      setPagination({
        page: currentPage,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load payments.");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  function renderCell(payment, key) {
    const status = getStatusUI(payment.status);

    switch (key) {
      case "id":
        return <span className="font-mono text-xs font-medium text-[#0B1E3F]">#{payment.id}</span>;
      case "user":
        return (
          <div className="max-w-45">
            <p className="text-sm font-medium text-[#1A202C] truncate" title={payment.user?.name || ""}>
              {payment.user?.name || "Guest"}
            </p>
          </div>
        );
      case "package":
        return (
          <span className="text-sm text-[#1A202C] font-medium" title={payment.package?.name || ""}>
            {payment.package?.name || `#${payment.packageId ?? "-"}`}
          </span>
        );
      case "amount":
        return <span className="text-xs text-[#4A5568] whitespace-nowrap">{formatMoney(payment.amount)}</span>;
      case "discount":
        return <span className="text-xs text-[#4A5568] whitespace-nowrap">{formatMoney(payment.discountAmount)}</span>;
      case "finalAmount":
        return <span className="text-sm font-semibold text-[#0B1E3F] whitespace-nowrap">{formatMoney(payment.finalAmount)}</span>;
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
          <span className="text-xs font-mono text-[#4A5568]" title={payment.cashfreeOrderId || ""}>
            {payment.cashfreeOrderId || "-"}
          </span>
        );
      case "status":
        return (
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${status.className}`}>
            {status.icon} {status.label}
          </span>
        );
      case "actions":
        return (
          <button
            onClick={() => {
              sessionStorage.setItem(`payment_${payment.id}`, JSON.stringify(payment));
              router.push(`/admin/payments/${payment.id}`);
            }}
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
      onRefresh={fetchPayments}
      emptyIcon={<CreditCard size={32} />}
      emptyText="No payments found"
    />
  );
}
