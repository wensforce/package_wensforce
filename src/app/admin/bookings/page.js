"use client";

import { useState, useEffect, useCallback } from "react";
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
} from "lucide-react";
import api from "../../axios/axios";
import AdminTable from "../components/AdminTable";
import BookingViewModal from "../components/BookingViewModal";

const STATUS_CONFIG = {
  confirmed: { label: "Confirmed", icon: CheckCircle2, cls: "bg-green-100 text-green-700" },
  completed: { label: "Completed", icon: CheckCircle2, cls: "bg-green-100 text-green-700" },
  pending:   { label: "Pending",   icon: AlertCircle,  cls: "bg-yellow-100 text-yellow-700" },
  initiated: { label: "Initiated", icon: AlertCircle,  cls: "bg-blue-100 text-blue-600" },
  cancelled: { label: "Cancelled", icon: XCircle,      cls: "bg-red-100 text-red-600" },
  failed:    { label: "Failed",    icon: XCircle,      cls: "bg-red-100 text-red-700" },
};

const STATUS_TABS = ["all", "pending", "initiated", "completed", "cancelled", "failed"];
const PAGE_LIMIT  = 10;

const COLUMNS = [
  { key: "id",       label: "#" },
  { key: "customer", label: "Customer" },
  { key: "package",  label: "Package" },
  { key: "amount",   label: "Amount" },
  { key: "orderId",  label: "Order ID" },
  { key: "date",     label: "Date" },
  { key: "city",     label: "City" },
  { key: "status",   label: "Status" },
  { key: "actions",  label: "" },
];

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function formatAmount(val, currency) {
  if (val == null) return "—";
  const symbol = currency === "INR" || !currency ? "₹" : currency + " ";
  return symbol + Number(val).toLocaleString("en-IN");
}

export default function BookingsPage() {
  const [bookings, setBookings]     = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: PAGE_LIMIT, total: 0, totalPages: 1 });
  const [search, setSearch]         = useState("");
  const [activeTab, setActiveTab]   = useState("all");
  const [page, setPage]             = useState(1);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);
  const [viewBooking, setViewBooking] = useState(null);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => { setPage(1); }, [activeTab, search]);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit: PAGE_LIMIT };
      if (activeTab !== "all") params.status = activeTab;
      if (search.trim())       params.search  = search.trim();

      const res = await api.get("/booking", { params });
      const { data: rows, pagination: pg } = res.data.data;
      setBookings(rows);
      setPagination(pg);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  }, [page, activeTab, search]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  function handleStatusUpdated(id, newStatus) {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
  }

  function renderCell(b, key) {
    switch (key) {
      case "id":
        return <span className="font-mono text-xs font-medium text-[#0B1E3F]">#{b.id}</span>;
      case "customer":
        return (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#0B1E3F] flex items-center justify-center text-[#C9A24B] text-xs font-bold flex-shrink-0">
              {b.user?.name?.charAt(0)?.toUpperCase() ?? "?"}
            </div>
            <div>
              <p className="text-[#1A202C] font-medium text-xs leading-tight">{b.user?.name ?? "—"}</p>
              <p className="text-[#A0AEC0] text-[11px]">{b.user?.mobileNumber ?? ""}</p>
            </div>
          </div>
        );
      case "package":
        return <span className="text-[#4A5568] font-medium">{b.packageName ?? "—"}</span>;
      case "amount":
        return <span className="font-semibold text-[#0B1E3F]">{formatAmount(b.purchaseAmount, b.currency)}</span>;
      case "orderId":
        return b.cashfreeOrderId
          ? <span className="font-mono text-[11px] text-[#4A5568] bg-[#FAF6EC] px-2 py-0.5 rounded">{b.cashfreeOrderId}</span>
          : <span className="text-[#A0AEC0] text-xs">—</span>;
      case "date":
        return <span className="text-[#4A5568] text-xs whitespace-nowrap">{formatDate(b.purchaseDate)}</span>;
      case "city":
        return (
          <span className="text-[#4A5568] text-xs">
            {b.serviceCity && b.serviceCity !== "Not specified" ? b.serviceCity : "—"}
          </span>
        );
      case "status": {
        const cfg = STATUS_CONFIG[b.status] ?? { label: b.status, icon: AlertCircle, cls: "bg-gray-100 text-gray-600" };
        const StatusIcon = cfg.icon;
        return (
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.cls}`}>
            <StatusIcon size={11} />
            {cfg.label}
          </span>
        );
      }
      case "actions":
        return (
          <button
            onClick={() => setViewBooking(b)}
            className="text-[#A0AEC0] hover:text-[#0B1E3F] transition-colors p-1.5 rounded-lg hover:bg-[#FAF6EC]"
          >
            <Eye size={15} />
          </button>
        );
      default:
        return null;
    }
  }

  return (
    <>
      <AdminTable
        icon={<CalendarCheck size={18} className="text-[#C9A24B]" />}
        title="Bookings"
        subtitle={`${pagination.total} total booking${pagination.total !== 1 ? "s" : ""}`}
        tabs={STATUS_TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchPlaceholder="Search by name, package…"
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        columns={COLUMNS}
        rows={bookings}
        renderCell={renderCell}
        rowKey={(b) => b.id}
        loading={loading}
        error={error}
        pagination={pagination}
        onPageChange={setPage}
        onRefresh={fetchBookings}
        onExport={() => {}}
        emptyIcon={<CalendarCheck size={32} />}
        emptyText="No bookings found"
      />

      {viewBooking && (
        <BookingViewModal
          booking={viewBooking}
          onClose={() => setViewBooking(null)}
          onStatusUpdated={handleStatusUpdated}
        />
      )}
    </>
  );
}
