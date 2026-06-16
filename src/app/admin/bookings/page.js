"use client";

import { useState, useEffect, useCallback } from "react";
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Download,
  RefreshCw,
  Loader2,
} from "lucide-react";
import api from "../../axios/axios";
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
  const [bookings, setBookings]   = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: PAGE_LIMIT, total: 0, totalPages: 1 });
  const [search, setSearch]       = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage]           = useState(1);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [viewBooking, setViewBooking] = useState(null);

  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Reset to page 1 on tab/search change
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

  return (
    <>
    <div className="p-6 md:p-8 space-y-6">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0B1E3F] flex items-center justify-center">
            <CalendarCheck size={18} className="text-[#C9A24B]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#0B1E3F]">Bookings</h1>
            <p className="text-sm text-[#4A5568]">
              {pagination.total} total booking{pagination.total !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchBookings}
            disabled={loading}
            className="flex items-center gap-1.5 text-sm text-[#4A5568] border border-[#CBD5E0] bg-white rounded-lg px-3 py-2 hover:bg-[#FAF6EC] transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button className="flex items-center gap-1.5 text-sm text-[#4A5568] border border-[#CBD5E0] bg-white rounded-lg px-3 py-2 hover:bg-[#FAF6EC] transition-colors">
            <Download size={14} />
            Export
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-[#CBD5E0] shadow-sm overflow-hidden">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-[#CBD5E0]">
          {/* Status: tabs on desktop, dropdown on mobile */}
          <div>
            {/* Mobile dropdown */}
            <div className="relative sm:hidden">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="w-full appearance-none text-sm bg-[#FAF6EC] border border-[#CBD5E0] rounded-lg px-3 py-2 pr-8 text-[#1A202C] font-semibold capitalize outline-none focus:border-[#C9A24B] transition-colors"
              >
                {STATUS_TABS.map((tab) => (
                  <option key={tab} value={tab} className="capitalize">{tab}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A0AEC0] pointer-events-none" />
            </div>
            {/* Desktop tabs */}
            <div className="hidden sm:flex items-center gap-1 bg-[#FAF6EC] rounded-lg p-1 flex-wrap">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-md capitalize transition-all
                    ${activeTab === tab
                      ? "bg-[#0B1E3F] text-white shadow-sm"
                      : "text-[#4A5568] hover:text-[#0B1E3F]"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 bg-[#FAF6EC] border border-[#CBD5E0] rounded-lg px-3 py-1.5">
            <Search size={14} className="text-[#A0AEC0]" />
            <input
              type="text"
              placeholder="Search by name, package…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="text-sm bg-transparent outline-none text-[#1A202C] placeholder:text-[#A0AEC0] w-full sm:w-48"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="px-6 py-4 bg-red-50 border-b border-red-100 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#FAF6EC] border-b border-[#CBD5E0]">
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#4A5568] uppercase tracking-wider">#</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#4A5568] uppercase tracking-wider">Customer</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#4A5568] uppercase tracking-wider">Package</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#4A5568] uppercase tracking-wider">Amount</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#4A5568] uppercase tracking-wider">Order ID</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#4A5568] uppercase tracking-wider">Date</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#4A5568] uppercase tracking-wider">City</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#4A5568] uppercase tracking-wider">Status</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#CBD5E0]">
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-16">
                    <Loader2 size={28} className="mx-auto animate-spin text-[#C9A24B]" />
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-16 text-[#A0AEC0]">
                    <CalendarCheck size={32} className="mx-auto mb-3 opacity-40" />
                    No bookings found
                  </td>
                </tr>
              ) : (
                bookings.map((b) => {
                  const cfg = STATUS_CONFIG[b.status] ?? { label: b.status, icon: AlertCircle, cls: "bg-gray-100 text-gray-600" };
                  const StatusIcon = cfg.icon;
                  return (
                    <tr key={b.id} className="hover:bg-[#FAF6EC]/60 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-medium text-[#0B1E3F]">#{b.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#0B1E3F] flex items-center justify-center text-[#C9A24B] text-xs font-bold flex-shrink-0">
                            {b.user?.name?.charAt(0)?.toUpperCase() ?? "?"}
                          </div>
                          <div>
                            <p className="text-[#1A202C] font-medium text-xs leading-tight">{b.user?.name ?? "—"}</p>
                            <p className="text-[#A0AEC0] text-[11px]">{b.user?.mobileNumber ?? ""}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#4A5568] font-medium">{b.packageName ?? "—"}</td>
                      <td className="px-6 py-4 font-semibold text-[#0B1E3F]">{formatAmount(b.purchaseAmount, b.currency)}</td>
                      <td className="px-6 py-4">
                        {b.cashfreeOrderId
                          ? <span className="font-mono text-[11px] text-[#4A5568] bg-[#FAF6EC] px-2 py-0.5 rounded">{b.cashfreeOrderId}</span>
                          : <span className="text-[#A0AEC0] text-xs">—</span>
                        }
                      </td>
                      <td className="px-6 py-4 text-[#4A5568] text-xs whitespace-nowrap">{formatDate(b.purchaseDate)}</td>
                      <td className="px-6 py-4 text-[#4A5568] text-xs">{b.serviceCity && b.serviceCity !== "Not specified" ? b.serviceCity : "—"}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.cls}`}>
                          <StatusIcon size={11} />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setViewBooking(b)}
                          className="text-[#A0AEC0] hover:text-[#0B1E3F] transition-colors p-1.5 rounded-lg hover:bg-[#FAF6EC]"
                        >
                          <Eye size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-t border-[#CBD5E0] bg-[#FAF6EC]/50">
          <span className="text-xs text-[#4A5568]">
            Showing{" "}
            <span className="font-semibold text-[#0B1E3F]">
              {bookings.length === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{" "}
            of <span className="font-semibold text-[#0B1E3F]">{pagination.total}</span> bookings
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-[#CBD5E0] text-[#4A5568] bg-white hover:bg-[#FAF6EC] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={13} /> Prev
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                disabled={loading}
                className={`text-xs w-8 h-8 rounded-lg border transition-colors font-medium
                  ${p === page
                    ? "bg-[#0B1E3F] text-white border-[#0B1E3F]"
                    : "bg-white border-[#CBD5E0] text-[#4A5568] hover:bg-[#FAF6EC]"
                  }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page >= pagination.totalPages || loading}
              className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-[#CBD5E0] text-[#4A5568] bg-white hover:bg-[#FAF6EC] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>

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
