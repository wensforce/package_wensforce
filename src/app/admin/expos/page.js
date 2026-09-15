"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Eye,
  Pencil,
  Image as ImageIcon,
} from "lucide-react";
import { exposApi } from "./apis/expos.api";
import { formatExpoPackagesCell } from "./utils/expoPackageUtils";
import AdminTable from "../components/AdminTable";
import { useFetchList } from "../hooks/useFetchList";

const PAGE_LIMIT = exposApi.PAGE_LIMIT;

const STATUS_PILL = {
  upcoming: "bg-blue-100 text-blue-800",
  ongoing: "bg-green-100 text-green-800",
  completed: "bg-gray-100 text-gray-700",
  cancelled: "bg-red-100 text-red-700",
};

const COLUMNS = [
  { key: "id", label: "ID" },
  { key: "thumbnail", label: "Card" },
  { key: "name", label: "Name" },
  { key: "city", label: "City" },
  { key: "eventDates", label: "Event" },
  { key: "packages", label: "Packages" },
  { key: "status", label: "Status" },
  { key: "actions", label: "", className: "w-24 text-right" },
];

function formatDateRange(start, end) {
  const fmt = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return String(iso).slice(0, 10);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  return `${fmt(start)} – ${fmt(end)}`;
}

export default function ExposPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_LIMIT,
    total: 0,
    totalPages: 1,
  });

  const fetchExposForHook = useCallback(async ({ search, page }) => {
    const { rows, pagination: pg } = await exposApi.fetchExpos({
      page,
      search,
    });
    setPagination(pg);
    return rows;
  }, []);

  const {
    rows: expos,
    loading,
    error,
    searchInput,
    setSearchInput,
    search,
    refetch,
  } = useFetchList({
    fetchFn: fetchExposForHook,
    params: { page },
  });

  useEffect(() => {
    setPage(1);
  }, [search]);

  function renderCell(row, key) {
    switch (key) {
      case "id":
        return (
          <span className="font-mono text-xs font-medium text-[#0B1E3F]">
            {row.id}
          </span>
        );
      case "thumbnail":
        return row.cardImage ? (
          <img
            src={row.cardImage}
            alt={row.name}
            loading="lazy"
            className="w-10 h-10 rounded-lg object-cover border border-[#CBD5E0]"
          />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-[#FAF6EC] border border-[#CBD5E0] flex items-center justify-center">
            <ImageIcon size={16} className="text-[#CBD5E0]" />
          </div>
        );
      case "name":
        return (
          <div className="max-w-[200px]">
            <button
              type="button"
              onClick={() => router.push(`/admin/expos/${row.id}`)}
              className="font-semibold text-[#1A202C] text-sm truncate text-left hover:text-[#C9A24B] transition-colors w-full"
              title={row.name}
            >
              {row.name}
            </button>
            {row.shortName && (
              <p className="text-xs text-[#A0AEC0] truncate">{row.shortName}</p>
            )}
          </div>
        );
      case "city":
        return (
          <span className="text-sm text-[#4A5568]">{row.city || "—"}</span>
        );
      case "eventDates":
        return (
          <span className="text-xs text-[#4A5568] whitespace-nowrap">
            {formatDateRange(row.eventStart, row.eventEnd)}
          </span>
        );
      case "packages":
        return (
          <span
            className="text-xs text-[#4A5568] max-w-[180px] truncate block"
            title={formatExpoPackagesCell(row, { maxNames: 99 })}
          >
            {formatExpoPackagesCell(row)}
          </span>
        );
      case "status":
        return (
          <span
            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
              STATUS_PILL[row.status] ?? "bg-[#FAF6EC] text-[#4A5568]"
            }`}
          >
            {row.status}
          </span>
        );
      case "actions":
        return (
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => router.push(`/admin/expos/${row.id}`)}
              className="text-[#A0AEC0] hover:text-[#0B1E3F] transition-colors p-1.5 rounded-lg hover:bg-[#FAF6EC]"
              title="View"
            >
              <Eye size={15} />
            </button>
            <button
              type="button"
              onClick={() => router.push(`/admin/expos/edit/${row.id}`)}
              className="text-[#A0AEC0] hover:text-[#C9A24B] transition-colors p-1.5 rounded-lg hover:bg-[#FAF6EC]"
              title="Edit"
            >
              <Pencil size={14} />
            </button>
          </div>
        );
      default:
        return row[key] ?? "—";
    }
  }

  return (
    <AdminTable
      icon={<CalendarDays size={18} className="text-[#C9A24B]" />}
      title="Expos"
      subtitle={`${pagination.total} total expo${pagination.total !== 1 ? "s" : ""}`}
      searchPlaceholder="Search by name, city, slug…"
      searchValue={searchInput}
      onSearchChange={setSearchInput}
      columns={COLUMNS}
      rows={expos}
      renderCell={renderCell}
      rowKey={(row) => row.id}
      loading={loading}
      error={error}
      pagination={pagination}
      onPageChange={setPage}
      onRefresh={refetch}
      onCreate={() => router.push("/admin/expos/create")}
      createLabel="New Expo"
      emptyIcon={<CalendarDays size={32} />}
      emptyText="No expos found"
    />
  );
}
