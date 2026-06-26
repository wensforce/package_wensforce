"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Package, RefreshCw, Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import api from "../../axios/axios";
import PackageCard from "../components/package/PackageCard";

const PAGE_LIMIT = 12;

export default function PackagesPage() {
  const router = useRouter();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_LIMIT,
    total: 0,
    totalPages: 1,
  });

  // Debounce search input - wait 400ms before updating search state
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  const loadPackages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit: PAGE_LIMIT };
      if (search.trim()) {
        params.search = search.trim();
      }

      const res = await api.get("/package", { params });
      const data = res.data?.data ?? res.data;
      
      const packagesList = Array.isArray(data) ? data : data?.packages ?? [];
      const total = data?.total ?? packagesList.length;
      const currentPage = data?.page ?? page;
      const limit = data?.limit ?? PAGE_LIMIT;
      
      setPackages(packagesList);
      setPagination({
        page: currentPage,
        limit: limit,
        total: total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to load packages.");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    loadPackages();
  }, [loadPackages]);

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0B1E3F] flex items-center justify-center">
            <Package size={18} className="text-[#C9A24B]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#0B1E3F]">Packages</h1>
            <p className="text-sm text-[#4A5568]">
              {pagination.total} total package{pagination.total !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadPackages}
            disabled={loading}
            className="flex items-center gap-1.5 text-sm text-[#4A5568] border border-[#CBD5E0] bg-white rounded-lg px-3 py-2 hover:bg-[#FAF6EC] transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            onClick={() => router.push("/admin/packages/create")}
            className="flex items-center gap-1.5 text-sm font-semibold text-white bg-[#0B1E3F] rounded-lg px-3 py-2 hover:bg-[#152d5a] transition-colors"
          >
            <Plus size={14} />
            New Package
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#CBD5E0] shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-[#CBD5E0]">
          <div className="text-sm text-[#4A5568]">
            {search.trim() ? (
              <span>
                Searching for &ldquo;{search}&rdquo;
              </span>
            ) : (
              <span>Browse and manage all packages</span>
            )}
          </div>

          <div className="flex items-center gap-2 bg-[#FAF6EC] border border-[#CBD5E0] rounded-lg px-3 py-1.5">
            <Search size={14} className="text-[#A0AEC0]" />
            <input
              type="text"
              placeholder="Search by name, tags, vehicle..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="text-sm bg-transparent outline-none text-[#1A202C] placeholder:text-[#A0AEC0] w-full sm:w-64"
            />
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl bg-[#FAF6EC] border border-[#CBD5E0] h-72 animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
              <p className="text-sm text-red-600 mb-4">{error}</p>
              <button
                onClick={loadPackages}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-700 transition-colors"
              >
                <RefreshCw size={12} /> Try again
              </button>
            </div>
          ) : packages.length === 0 ? (
            <div className="rounded-2xl border border-[#CBD5E0] bg-[#FAF6EC] p-16 text-center">
              <div className="mx-auto mb-4 h-14 w-14 rounded-xl bg-white border border-[#CBD5E0] flex items-center justify-center">
                <Package size={24} className="text-[#A0AEC0]" />
              </div>
              <h2 className="text-base font-semibold text-[#1A202C] mb-1">
                {search.trim() ? "No results found" : "No packages yet"}
              </h2>
              <p className="text-sm text-[#4A5568] mb-6">
                {search.trim() ? `Nothing matched "${search}".` : "Create your first package to get started."}
              </p>
              {!search.trim() && (
                <button
                  onClick={() => router.push("/admin/packages/create")}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#0B1E3F] px-5 py-2 text-sm font-medium text-white hover:bg-[#152d5a] transition-colors"
                >
                  <Plus size={14} /> Create Package
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 mb-6">
                {packages.map((pkg) => (
                  <PackageCard key={pkg.id} pkg={pkg} />
                ))}
              </div>

              {/* Pagination Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-6 border-t border-[#CBD5E0]">
                <span className="text-xs text-[#4A5568]">
                  Showing{" "}
                  <span className="font-semibold text-[#0B1E3F]">
                    {packages.length === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1}
                    –{Math.min(pagination.page * pagination.limit, pagination.total)}
                  </span>{" "}
                  of <span className="font-semibold text-[#0B1E3F]">{pagination.total}</span>
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage(Math.max(1, pagination.page - 1))}
                    disabled={pagination.page <= 1 || loading}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-[#CBD5E0] text-[#4A5568] bg-white hover:bg-[#FAF6EC] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={13} /> Prev
                  </button>

                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      disabled={loading}
                      className={`text-xs w-8 h-8 rounded-lg border transition-colors font-medium ${
                        p === pagination.page
                          ? "bg-[#0B1E3F] text-white border-[#0B1E3F]"
                          : "bg-white border-[#CBD5E0] text-[#4A5568] hover:bg-[#FAF6EC]"
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    onClick={() => setPage(Math.min(pagination.totalPages, pagination.page + 1))}
                    disabled={pagination.page >= pagination.totalPages || loading}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-[#CBD5E0] text-[#4A5568] bg-white hover:bg-[#FAF6EC] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
