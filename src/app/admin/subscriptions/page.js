"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Repeat, CheckCircle2, Clock3, XCircle, Ban, Eye } from "lucide-react";
import { subscriptionApi } from "./apis/subscription.api";
import AdminTable from "../components/AdminTable";
import CreateSubscriptionModal from "../components/modals/CreateSubscriptionModal";
import { useFetchList } from "../hooks/useFetchList";
import { useModal } from "../hooks/useModal";

const PAGE_LIMIT = 10;

const COLUMNS = [
  { key: "id", label: "#" },
  { key: "user", label: "User" },
  { key: "package", label: "Package" },
  { key: "trips", label: "Trips" },
  { key: "vehicleType", label: "Vehicle" },
  { key: "bodyguardType", label: "Bodyguard" },
  { key: "daysLeft", label: "Days Left" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" },
];

function getDaysLeftMeta(endDate) {
  if (!endDate) {
    return { text: "-", className: "text-[#A0AEC0]", title: "No end date" };
  }

  const now = new Date();
  const end = new Date(endDate);
  if (Number.isNaN(end.getTime())) {
    return { text: "Invalid", className: "text-red-600", title: "Invalid end date" };
  }

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysLeft = Math.ceil((end.getTime() - now.getTime()) / msPerDay);

  if (daysLeft < 0) {
    return {
      text: `${Math.abs(daysLeft)} day(s) ago`,
      className: "text-red-600",
      title: `Expired on ${end.toLocaleDateString("en-IN")}`,
    };
  }

  if (daysLeft <= 3) {
    return {
      text: `${daysLeft} day(s)`,
      className: "text-amber-700 font-semibold",
      title: `Ends on ${end.toLocaleDateString("en-IN")}`,
    };
  }

  return {
    text: `${daysLeft} day(s)`,
    className: "text-[#1A202C]",
    title: `Ends on ${end.toLocaleDateString("en-IN")}`,
  };
}

function getStatusUI(status) {
  const s = String(status || "pending").toUpperCase();

  if (s === "ACTIVE") {
    return { className: "bg-green-100 text-green-700", icon: <CheckCircle2 size={11} />, label: s };
  }
  if (s === "EXPIRED") {
    return { className: "bg-red-100 text-red-700", icon: <XCircle size={11} />, label: s };
  }
  if (s === "CANCELLED") {
    return { className: "bg-gray-200 text-gray-700", icon: <Ban size={11} />, label: s };
  }
  return { className: "bg-amber-100 text-amber-700", icon: <Clock3 size={11} />, label: s };
}

export default function SubscriptionsPage() {
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
  const fetchSubscriptionsForHook = useCallback(async ({ search, page }) => {
    const { rows, pagination: pg } = await subscriptionApi.fetchSubscriptions({ page, search });
    setPagination(pg);
    return rows;
  }, []);

  const {
    rows: subscriptions,
    loading,
    error,
    searchInput,
    setSearchInput,
    search,
    refetch,
  } = useFetchList({
    fetchFn: fetchSubscriptionsForHook,
    params: { page },
  });

  // reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  function handleView(sub) {
    try {
      sessionStorage.setItem(`subscription_${sub.id}`, JSON.stringify(sub));
    } catch (err) {
      // storage full/disabled — non-fatal, detail page will fetch fresh instead
      console.warn("Could not cache subscription for detail view:", err);
    }
    router.push(`/admin/subscriptions/${sub.id}`);
  }

  function renderCell(sub, key) {
    const status = getStatusUI(sub.status);

    switch (key) {
      case "id":
        return (
          <span className="font-mono text-xs font-medium text-[#0B1E3F]">
            #{sub.id}
          </span>
        );
      case "user":
        return (
          <div>
            <p className="text-sm font-medium text-[#1A202C]">
              #{sub.user?.id ?? sub.userId ?? "-"}
            </p>
            <p className="text-xs text-[#4A5568]">
              {sub.user?.mobileNumber || "-"}
            </p>
          </div>
        );
      case "package":
        return (
          <span className="text-sm font-medium text-[#1A202C]">
            {sub.package?.name || `#${sub.packageId ?? "-"}`}
          </span>
        );
      case "trips":
        return (
          <span className="text-xs text-[#4A5568] whitespace-nowrap">
            {sub.tripsUsed ?? 0} / {sub.tripsTotal ?? 0}
          </span>
        );
      case "vehicleType":
        return <span className="text-xs text-[#4A5568]">{sub.vehicleType || "-"}</span>;
      case "bodyguardType":
        return <span className="text-xs text-[#4A5568]">{sub.bodyguardType || "-"}</span>;
      case "daysLeft": {
        const daysMeta = getDaysLeftMeta(sub.endDate);
        return (
          <span className={`text-xs whitespace-nowrap ${daysMeta.className}`} title={daysMeta.title}>
            {daysMeta.text}
          </span>
        );
      }
      case "status":
        return (
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${status.className}`}>
            {status.icon} {status.label}
          </span>
        );
      case "actions":
        return (
          <button
            type="button"
            onClick={() => handleView(sub)}
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
        icon={<Repeat size={18} className="text-[#C9A24B]" />}
        title="Subscriptions"
        subtitle={`${pagination.total} total subscription${pagination.total !== 1 ? "s" : ""}`}
        searchPlaceholder="Search by user, package, status..."
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        columns={COLUMNS}
        rows={subscriptions}
        renderCell={renderCell}
        rowKey={(sub) => sub.id}
        loading={loading}
        error={error}
        pagination={pagination}
        onPageChange={setPage}
        onRefresh={refetch}
        onCreate={openCreateModal}
        createLabel="New Subscription"
        emptyIcon={<Repeat size={32} />}
        emptyText="No subscriptions found"
      />

      <CreateSubscriptionModal
        open={showCreate}
        onClose={closeCreateModal}
        onCreated={refetch}
      />
    </>
  );
}