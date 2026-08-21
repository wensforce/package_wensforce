"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CarTaxiFront,
  CalendarDays,
  Eye,
  CheckCircle2,
  Clock3,
  XCircle,
  Ban,
} from "lucide-react";
import { tripApi } from "./apis/trips.api";
import AdminTable from "../components/AdminTable";
import CreateTripModal from "../components/modals/CreateTripModal";
import { useFetchList } from "../hooks/useFetchList";
import { useModal } from "../hooks/useModal";
const PAGE_LIMIT = 10;

const COLUMNS = [
  { key: "id", label: "ID" },
  { key: "assignmentId", label: "Assignment" },
  { key: "user", label: "User" },
  { key: "route", label: "Route" },
  { key: "tripDate", label: "Trip Date" },
  { key: "tripType", label: "Trip Type" },
  { key: "services", label: "Services" },
  { key: "additionalAmount", label: "Add. Cost" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" },
];

function formatDate(iso) {
  if (!iso) return "-";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStatusUI(status) {
  const s = String(status || "pending").toUpperCase();

  if (["CONFIRMED", "COMPLETED", "ACTIVE"].includes(s)) {
    return {
      className: "bg-green-100 text-green-700",
      icon: <CheckCircle2 size={11} />,
      label: s,
    };
  }
  if (["CANCELLED", "CANCELED"].includes(s)) {
    return {
      className: "bg-gray-200 text-gray-700",
      icon: <Ban size={11} />,
      label: s,
    };
  }
  if (["FAILED", "REJECTED"].includes(s)) {
    return {
      className: "bg-red-100 text-red-700",
      icon: <XCircle size={11} />,
      label: s,
    };
  }
  return {
    className: "bg-amber-100 text-amber-700",
    icon: <Clock3 size={11} />,
    label: s,
  };
}

export default function TripsPage() {
  const router = useRouter();

  // pagination + date filter stay local — the hook doesn't manage them
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_LIMIT,
    total: 0,
    totalPages: 1,
  });
  const [tripDate, setTripDate] = useState("");

  // create-modal visibility, now driven by useModal (no data needed here,
  // so we just use isOpen/open/close and ignore `data`)
  const {
    isOpen: showCreate,
    open: openCreateModal,
    close: closeCreateModal,
  } = useModal();

  // stable wrapper: reads search/page/tripDate from its own args, not closure
  const fetchTripsForHook = useCallback(async ({ search, page, tripDate }) => {
    const { rows, pagination: pg } = await tripApi.fetchTrips({
      page,
      search,
      tripDate,
    });
    setPagination(pg);
    return rows;
  }, []);

  const {
    rows: trips,
    loading,
    error,
    searchInput,
    setSearchInput,
    search,
    refetch,
  } = useFetchList({
    fetchFn: fetchTripsForHook,
    params: { page, tripDate }, // either changing triggers a refetch
  });

  // reset to page 1 whenever search or the date filter changes
  useEffect(() => {
    setPage(1);
  }, [search, tripDate]);

  function handleView(trip) {
    try {
      sessionStorage.setItem(`trip_${trip.id}`, JSON.stringify(trip));
    } catch (err) {
      console.warn("Could not cache trip for detail view:", err);
    }
    router.push(`/admin/trips/${trip.id}`);
  }

  function renderCell(trip, key) {
    const status = getStatusUI(trip.status);

    switch (key) {
      case "id":
        return (
          <span className="font-mono text-xs font-medium text-[#0B1E3F]">
            {trip.id}
          </span>
        );
      case "assignmentId":
        return (
          <span className="text-xs font-mono text-[#4A5568]">
            {trip.assignmentId || "-"}
          </span>
        );
      case "user":
        return (
          <div className="max-w-45">
            <p
              className="text-sm font-medium text-[#1A202C] truncate"
              title={trip.user?.name || ""}
            >
              {trip.user?.name || `#${trip.userId ?? "-"}`}
            </p>
            <p className="text-xs text-[#4A5568] truncate">
              {trip.user?.mobileNumber || "-"}
            </p>
          </div>
        );
      case "route":
        return (
          <div className="max-w-65">
            <p
              className="text-xs text-[#1A202C] truncate"
              title={trip.pickupLocation || ""}
            >
              {trip.pickupLocation || "-"}
            </p>
            <p className="text-[11px] text-[#A0AEC0]">to</p>
            <p
              className="text-xs text-[#1A202C] truncate"
              title={trip.dropLocation || ""}
            >
              {trip.dropLocation || "-"}
            </p>
          </div>
        );
      case "tripDate":
        return (
          <span className="text-xs text-[#4A5568] whitespace-nowrap">
            {formatDate(trip.tripDate)}
          </span>
        );
      case "tripType":
        return (
          <span className="inline-flex items-center rounded-md border border-[#CBD5E0] bg-[#FAF6EC] px-2 py-1 text-xs font-semibold text-[#0B1E3F] uppercase tracking-wide">
            {String(trip.tripType || "-").replace(/-/g, " ")}
          </span>
        );
      case "services": {
        const services = Array.isArray(trip.services) ? trip.services : [];
        if (!services.length)
          return <span className="text-xs text-[#A0AEC0]">None</span>;

        const label = services
          .slice(0, 2)
          .map((s) => s?.name)
          .filter(Boolean)
          .join(", ");
        const extra = services.length > 2 ? ` +${services.length - 2}` : "";

        return (
          <span
            className="text-xs text-[#4A5568]"
            title={services
              .map((s) => s?.name)
              .filter(Boolean)
              .join(", ")}
          >
            {label || "Services"}
            {extra}
          </span>
        );
      }
      case "additionalAmount":
        return trip.additionalAmount !== null &&
          trip.additionalAmount !== undefined ? (
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-1 whitespace-nowrap">
            ₹{Number(trip.additionalAmount).toLocaleString("en-IN")}
          </span>
        ) : (
          <span className="text-xs text-[#A0AEC0]">-</span>
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
            onClick={() => handleView(trip)}
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
        icon={<CarTaxiFront size={18} className="text-[#C9A24B]" />}
        title="Trips"
        subtitle={`${pagination.total} total trip${pagination.total !== 1 ? "s" : ""}`}
        searchPlaceholder="Search by pickup, drop, assignment, type, user..."
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        columns={COLUMNS}
        rows={trips}
        renderCell={renderCell}
        rowKey={(trip) => trip.id}
        loading={loading}
        error={error}
        pagination={pagination}
        onPageChange={setPage}
        onRefresh={refetch}
        onCreate={openCreateModal}
        createLabel="New Trip"
        toolbarFilters={
          <div className="w-full sm:w-auto">
            <div className="relative">
              <CalendarDays
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0AEC0]"
              />
              <input
                type="date"
                value={tripDate}
                onChange={(e) => setTripDate(e.target.value)}
                className="w-full sm:w-44 rounded-lg border border-[#CBD5E0] bg-white pl-9 pr-3 py-2 text-sm text-[#1A202C] focus:border-[#C9A24B] focus:outline-none"
                title="Filter by trip date"
              />
            </div>
          </div>
        }
        emptyIcon={<CarTaxiFront size={32} />}
        emptyText="No trips found"
      />

      <CreateTripModal
        open={showCreate}
        onClose={closeCreateModal}
        onCreated={refetch}
      />
    </>
  );
}
