"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  TicketPercent,
  CheckCircle2,
  XCircle,
  CalendarClock,
  Hash,
  Eye,
} from "lucide-react";
import { couponApi } from "./apis/coupons.api";
import AdminTable from "../components/AdminTable";
import CouponCreateModal from "../components/modals/CouponCreateModal";
import { useFetchList } from "../hooks/useFetchList";
import { useModal } from "../hooks/useModal";
const PAGE_LIMIT = 10;

const COLUMNS = [
  { key: "id", label: "#" },
  { key: "code", label: "Code" },
  { key: "discount", label: "Discount" },
  { key: "usage", label: "Usage" },
  { key: "validUntil", label: "Valid Until" },
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

function formatDiscount(coupon) {
  if (!coupon) return "-";

  if (coupon.discountType === "percentage") {
    return `${coupon.discountValue}%`;
  }

  return `Rs ${Number(coupon.discountValue || 0).toLocaleString("en-IN")}`;
}

export default function CouponsPage() {
  const router = useRouter();

  // pagination stays local — the hook doesn't manage it
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_LIMIT,
    total: 0,
    totalPages: 1,
  });

  // create-modal visibility, now driven by useModal (no data needed here,
  // so we just use isOpen/open/close and ignore `data`)
  const {
    isOpen: showCreate,
    open: openCreateModal,
    close: closeCreateModal,
  } = useModal();

  // stable wrapper: reads page/search from its own args, not closure
  const fetchCouponsForHook = useCallback(async ({ search, page }) => {
    const { rows, pagination: pg } = await couponApi.fetchCoupons({
      page,
      search,
    });
    setPagination(pg);
    return rows;
  }, []);

  const {
    rows: coupons,
    loading,
    error,
    searchInput,
    setSearchInput,
    search,
    refetch,
  } = useFetchList({
    fetchFn: fetchCouponsForHook,
    params: { page },
  });

  // reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  function renderCell(coupon, key) {
    switch (key) {
      case "id":
        return (
          <span className="font-mono text-xs font-medium text-[#0B1E3F] inline-flex items-center gap-1">
            <Hash size={11} /> {coupon.id}
          </span>
        );
      case "code":
        return (
          <span className="inline-flex items-center rounded-md border border-[#CBD5E0] bg-[#FAF6EC] px-2 py-1 text-xs font-semibold text-[#0B1E3F] uppercase tracking-wide">
            {coupon.code || "-"}
          </span>
        );
      case "discount":
        return (
          <span className="text-[#1A202C] text-sm font-medium">
            {formatDiscount(coupon)}
          </span>
        );
      case "usage": {
        const limit = coupon.usageLimit;
        const used = coupon.usedCount ?? 0;
        return (
          <span className="text-[#4A5568] text-xs whitespace-nowrap">
            {used} / {limit ?? "Unlimited"}
          </span>
        );
      }
      case "validUntil":
        return (
          <span className="text-[#4A5568] text-xs whitespace-nowrap inline-flex items-center gap-1">
            <CalendarClock size={11} className="text-[#A0AEC0]" />
            {coupon.validUntil ? formatDate(coupon.validUntil) : "No expiry"}
          </span>
        );
      case "status":
        return coupon.isActive ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
            <CheckCircle2 size={11} /> Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-600">
            <XCircle size={11} /> Inactive
          </span>
        );
      case "actions":
        return (
          <button
            type="button"
            onClick={() => router.push(`/admin/coupons/${coupon.id}`)}
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
    <>
      <AdminTable
        icon={<TicketPercent size={18} className="text-[#C9A24B]" />}
        title="Coupons"
        subtitle={`${pagination.total} total coupon${pagination.total !== 1 ? "s" : ""}`}
        searchPlaceholder="Search by code..."
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        columns={COLUMNS}
        rows={coupons}
        renderCell={renderCell}
        rowKey={(coupon) => coupon.id}
        loading={loading}
        error={error}
        pagination={pagination}
        onPageChange={setPage}
        onRefresh={refetch}
        onCreate={openCreateModal}
        createLabel="New Coupon"
        emptyIcon={<TicketPercent size={32} />}
        emptyText="No coupons found"
      />

      <CouponCreateModal
        open={showCreate}
        onClose={closeCreateModal}
        onCreated={refetch}
      />
    </>
  );
}
