"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Layers,
  CheckCircle2,
  XCircle,
  Eye,
  Pencil,
  Image as ImageIcon,
} from "lucide-react";
import api from "../../axios/axios";
import AdminTable from "../components/AdminTable";
import ServiceCreateModal from "../components/modals/ServiceCreateModal";

const PAGE_LIMIT = 10;

const COLUMNS = [
  { key: "id", label: "#" },
  { key: "thumbnail", label: "Thumbnail" },
  { key: "title", label: "Title" },
  { key: "description", label: "Description" },
  { key: "status", label: "Status" },
  { key: "createdAt", label: "Created" },
  { key: "updatedAt", label: "Updated" },
  { key: "actions", label: "Actions" },
];

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function truncateWords(text, maxWords) {
  if (!text) return "—";
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "…";
}

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_LIMIT,
    total: 0,
    totalPages: 1,
  });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit: PAGE_LIMIT };
      if (search.trim()) params.search = search.trim();

      const res = await api.get("/service/list", { params });
      const { services: rows, pagination: pg } = res.data.data;
      setServices(rows);
      setPagination({
        ...pg,
        totalPages: Math.max(1, Math.ceil(pg.total / pg.limit)),
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load services.");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  function renderCell(s, key) {
    switch (key) {
      case "id":
        return (
          <span className="font-mono text-xs font-medium text-[#0B1E3F]">
            #{s.id}
          </span>
        );
      case "thumbnail":
        return s.thumbnailUrl ? (
          <img
            src={s.thumbnailUrl}
            alt={s.title}
            loading="lazy"
            className="w-10 h-10 rounded-lg object-cover border border-[#CBD5E0]"
          />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-[#FAF6EC] border border-[#CBD5E0] flex items-center justify-center">
            <ImageIcon size={16} className="text-[#CBD5E0]" />
          </div>
        );
      case "title":
        return (
          <span
            className="text-[#1A202C] font-medium text-sm block max-w-[160px] truncate"
            title={s.title ?? ""}
          >
            {truncateWords(s.title, 3)}
          </span>
        );
      case "description":
        return (
          <span className="text-[#4A5568] text-xs" title={s.description ?? ""}>
            {truncateWords(s.description, 5)}
          </span>
        );
      case "status":
        return s.isActive ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
            <CheckCircle2 size={11} /> Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-600">
            <XCircle size={11} /> Inactive
          </span>
        );
      case "createdAt":
        return (
          <span className="text-[#4A5568] text-xs whitespace-nowrap">
            {formatDate(s.createdAt)}
          </span>
        );
      case "updatedAt":
        return (
          <span className="text-[#4A5568] text-xs whitespace-nowrap">
            {formatDate(s.updatedAt)}
          </span>
        );
      case "actions":
        return (
          <button
            onClick={() => {
              sessionStorage.setItem(`service_${s.id}`, JSON.stringify(s));
              router.push(`/admin/services/${s.id}`);
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
    <>
      <AdminTable
        icon={<Layers size={18} className="text-[#C9A24B]" />}
        title="Services"
        subtitle={`${pagination.total} total service${pagination.total !== 1 ? "s" : ""}`}
        searchPlaceholder="Search by title…"
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        columns={COLUMNS}
        rows={services}
        renderCell={renderCell}
        rowKey={(s) => s.id}
        loading={loading}
        error={error}
        pagination={pagination}
        onPageChange={setPage}
        onRefresh={fetchServices}
        onCreate={() => setShowCreate(true)}
        createLabel="New Service"
        emptyIcon={<Layers size={32} />}
        emptyText="No services found"
      />

      <ServiceCreateModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={fetchServices}
      />
    </>
  );
}