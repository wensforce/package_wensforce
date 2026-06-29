"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  CheckCircle2,
  XCircle,
  Eye,
  Pencil,
} from "lucide-react";
import api from "../../axios/axios";
import AdminTable from "../components/AdminTable";

const PAGE_LIMIT = 10;

function formatAmount(val, currency) {
  if (val == null) return "—";
  const symbol = currency === "INR" || !currency ? "₹" : currency + " ";
  return symbol + Number(val).toLocaleString("en-IN");
}

const COLUMNS = [
  { key: "id",        label: "#",           className: "w-16" },
  { key: "thumbnail", label: "Thumbnail",   className: "w-20" },
  { key: "name",      label: "Name" },
  { key: "price",     label: "Price" },
  { key: "duration",  label: "Duration" },
  { key: "status",    label: "Status" },
  { key: "actions",   label: "",            className: "w-24 text-right" },
];

export default function PackagesPage() {
  const router = useRouter();

  const [packages, setPackages]     = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: PAGE_LIMIT, total: 0, totalPages: 1 });
  const [page, setPage]             = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch]         = useState("");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Reset to page 1 on search change
  useEffect(() => { setPage(1); }, [search]);

  const fetchPackages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit: PAGE_LIMIT };
      if (search.trim()) params.search = search.trim();

      const res = await api.get("/package", { params });
      const data = res.data?.data ?? res.data ?? {};
      const rows = data.packages || data.data || data.items || (Array.isArray(data) ? data : []);
      const pg   = data.pagination || {
        page,
        limit: PAGE_LIMIT,
        total: rows.length,
        totalPages: Math.ceil(rows.length / PAGE_LIMIT) || 1,
      };
      setPackages(Array.isArray(rows) ? rows : []);
      setPagination(pg);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load packages.");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchPackages(); }, [fetchPackages]);

  function renderCell(row, key) {
    switch (key) {
      case "id":
        return (
          <span className="font-mono text-xs font-medium text-[#0B1E3F]">
            #{row.id}
          </span>
        );
      case "thumbnail":
        return row.thumbnailUrl ? (
          <img
            src={row.thumbnailUrl}
            alt={row.name}
            className="w-12 h-12 object-cover rounded-lg border border-[#CBD5E0]"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-[#FAF6EC] border border-[#CBD5E0] flex items-center justify-center">
            <Package size={16} className="text-[#C9A24B]" />
          </div>
        );
      case "name":
        return (
          <div>
            <p className="font-semibold text-[#1A202C] text-sm leading-tight">
              {row.name || row.title || "—"}
            </p>
            {row.category && (
              <p className="text-[#A0AEC0] text-xs mt-0.5">{row.category}</p>
            )}
          </div>
        );
      case "price":
        return (
          <span className="font-semibold text-[#0B1E3F]">
            {formatAmount(row.price ?? row.basePrice, row.currency)}
          </span>
        );
      case "duration":
        return (
          <span className="text-[#4A5568] text-sm">
            {row.duration ? `${row.duration} ${row.durationUnit || "days"}` : "—"}
          </span>
        );
      case "status":
        return row.isActive !== undefined ? (
          row.isActive ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
              <CheckCircle2 size={11} /> Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-600">
              <XCircle size={11} /> Inactive
            </span>
          )
        ) : "—";
      case "actions":
        return (
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={() => router.push(`/admin/packages/${row.id}`)}
              className="text-[#A0AEC0] hover:text-[#0B1E3F] transition-colors p-1.5 rounded-lg hover:bg-[#FAF6EC]"
              title="View"
            >
              <Eye size={15} />
            </button>
            <button
              onClick={() => router.push(`/admin/packages/edit/${row.id}`)}
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
      icon={<Package size={18} className="text-[#C9A24B]" />}
      title="Packages"
      subtitle={`${pagination.total} total package${pagination.total !== 1 ? "s" : ""}`}
      searchPlaceholder="Search packages…"
      searchValue={searchInput}
      onSearchChange={setSearchInput}
      columns={COLUMNS}
      rows={packages}
      renderCell={renderCell}
      rowKey={(row) => row.id}
      loading={loading}
      error={error}
      pagination={pagination}
      onPageChange={setPage}
      onRefresh={fetchPackages}
      onCreate={() => router.push("/admin/packages/create")}
      createLabel="New Package"
      emptyIcon={<Package size={32} />}
      emptyText="No packages found"
    />
  );
}
