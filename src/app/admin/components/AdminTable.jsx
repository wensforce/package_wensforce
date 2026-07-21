"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Loader2,
  Search,
  RefreshCw,
  Download,
  Plus,
  Upload,
} from "lucide-react";

/**
 * @typedef {Object} AdminTableColumn
 * @property {string} key - Unique key matching a field or a custom render key
 * @property {string} label - Column header text
 * @property {string} [className] - Extra classes on the `<th>`
 * @property {string} [cellClassName] - Extra classes on every `<td>` in this column
 */

/**
 * @typedef {Object} AdminTablePagination
 * @property {number} page - Current page (1-based)
 * @property {number} limit - Items per page
 * @property {number} total - Total number of records
 * @property {number} totalPages - Total number of pages
 */

/**
 * Reusable paginated admin table with header, search, optional filter tabs,
 * Refresh / Export / Create buttons, and a pagination footer.
 *
 * @param {AdminTableProps} props
 */
export default function AdminTable({
  icon,
  title,
  subtitle,
  tabs = [],
  activeTab,
  onTabChange,
  searchPlaceholder = "Search…",
  searchValue,
  onSearchChange,
  columns = [],
  rows = [],
  renderCell,
  rowKey,
  loading,
  error,
  pagination,
  onPageChange,
  onRefresh,
  onImport,
  onExport,
  onCreate,
  createLabel = "Create",
  emptyIcon,
  emptyText = "No records found",
  headerActions,
  toolbarFilters,
}) {
  const hasTabs = tabs.length > 0;

  // Sliding window pagination to prevent layout breakage on mobile/tablet when there are many pages
  const getPageNumbers = () => {
    const total = pagination.totalPages;
    const current = pagination.page;
    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= 3) {
      return [1, 2, 3, 4, "...", total];
    }
    if (current >= total - 2) {
      return [1, "...", total - 3, total - 2, total - 1, total];
    }
    return [1, "...", current - 1, current, current + 1, "...", total];
  };

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* ── Page Header ──────────────────────────────────────────────── */}
        {/* Uses lg:flex-row to stay side-by-side on desktop/iPad landscape, and stack cleanly on mobile/iPad portrait */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B1E3F] flex items-center justify-center shrink-0">
              {icon}
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3F]">{title}</h1>
              {subtitle && <p className="text-xs md:text-sm text-[#4A5568]">{subtitle}</p>}
            </div>
          </div>

          {/* Action buttons wrapper */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            {headerActions}
            {onImport && (
              <div className="relative">
                <input
                  id="import-file"
                  type="file"
                  accept=".csv,.xlsx,.xls,.json"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onImport(file);
                      e.target.value = "";
                    }
                  }}
                  className="hidden"
                />
                <label
                  htmlFor="import-file"
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 border border-[#CBD5E0] bg-white rounded-lg px-2.5 py-1.5 md:text-sm md:px-3 md:py-2 hover:bg-[#FAF6EC] transition-colors cursor-pointer"
                >
                  <Upload size={14} className="text-[#C9A24B]" />
                  Import
                </label>
              </div>
            )}
            {onExport && (
              <button
                onClick={onExport}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 border border-[#CBD5E0] bg-white rounded-lg px-2.5 py-1.5 md:text-sm md:px-3 md:py-2 hover:bg-[#FAF6EC] transition-colors"
              >
                <Download size={14} className="text-[#C9A24B]" />
                Export
              </button>
            )}
            {onCreate && (
              <button
                onClick={onCreate}
                className="flex items-center gap-1.5 text-xs font-semibold text-white bg-[#0B1E3F] rounded-lg px-2.5 py-1.5 md:text-sm md:px-3 md:py-2 hover:bg-[#152d5a] transition-colors"
              >
                <Plus size={14} />
                {createLabel}
              </button>
            )}
            <button
              onClick={onRefresh}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs text-[#4A5568] border border-[#CBD5E0] bg-white rounded-lg px-2.5 py-1.5 md:text-sm md:px-3 md:py-2 hover:bg-[#FAF6EC] transition-colors disabled:opacity-50"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {/* ── Main Table Card ───────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-[#CBD5E0] shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-3.5 lg:px-6 lg:py-4 border-b border-[#CBD5E0]">
            {hasTabs && (
              <div className="w-full lg:w-auto">
                {/* Mobile dropdown (displays on screens smaller than sm) */}
                <div className="relative sm:hidden">
                  <select
                    value={activeTab}
                    onChange={(e) => onTabChange(e.target.value)}
                    className="w-full appearance-none text-xs bg-[#FAF6EC] border border-[#CBD5E0] rounded-lg px-3 py-2 pr-8 text-[#1A202C] font-semibold capitalize outline-none focus:border-[#C9A24B] transition-colors"
                  >
                    {tabs.map((tab) => (
                      <option key={tab} value={tab} className="capitalize">
                        {tab}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A0AEC0] pointer-events-none"
                  />
                </div>
                {/* Desktop/Tablet tabs (displays on screens >= sm, wraps dynamically) */}
                <div className="hidden sm:flex items-center gap-1 bg-[#FAF6EC] rounded-lg p-1 flex-wrap">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => onTabChange(tab)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-md capitalize transition-all
                        ${
                          activeTab === tab
                            ? "bg-[#0B1E3F] text-white shadow-sm"
                            : "text-[#4A5568] hover:text-[#0B1E3F]"
                        }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:ml-auto w-full lg:w-auto">
              {toolbarFilters}

              {/* Search */}
              <div className="flex items-center gap-2 bg-[#FAF6EC] border border-[#CBD5E0] rounded-lg px-3 py-1.5 w-full sm:w-auto">
                <Search size={14} className="text-[#A0AEC0]" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="text-xs md:text-sm bg-transparent outline-none text-[#1A202C] placeholder:text-[#A0AEC0] w-full sm:w-48"
                />
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="px-6 py-4 bg-red-50 border-b border-red-100 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Table container: overflow-x-auto enables scroll on mobile. min-w-max stops column squeezing */}
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-max text-sm table-auto">
              <thead>
                <tr className="bg-[#FAF6EC] border-b border-[#CBD5E0]">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={`text-left px-4 py-3 sm:px-5 lg:px-6 text-xs font-semibold text-[#4A5568] uppercase tracking-wider whitespace-nowrap ${col.className ?? ""}`}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#CBD5E0]">
                {loading ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-16">
                      <Loader2
                        size={28}
                        className="mx-auto animate-spin text-[#C9A24B]"
                      />
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="text-center py-16 text-[#A0AEC0]"
                    >
                      {emptyIcon && (
                        <div className="mx-auto mb-3 w-8 h-8 flex items-center justify-center opacity-40">
                          {emptyIcon}
                        </div>
                      )}
                      {emptyText}
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr
                      key={rowKey(row)}
                      className="hover:bg-[#FAF6EC]/60 transition-colors"
                    >
                      {columns.map((col) => {
                        // Apply whitespace-nowrap to standard compact values to prevent ugly word breaking on narrow layout sizes
                        const isNowrap = ["id", "thumbnail", "price", "duration", "status", "createdAt", "updatedAt", "actions"].includes(col.key);
                        return (
                          <td
                            key={col.key}
                            className={`px-4 py-3 sm:px-5 lg:px-6 ${isNowrap ? "whitespace-nowrap" : ""} ${col.cellClassName ?? ""}`}
                          >
                            {renderCell(row, col.key)}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between px-4 py-3 sm:px-5 lg:px-6 lg:py-4 border-t border-[#CBD5E0] bg-[#FAF6EC]/50">
            <span className="text-xs text-[#4A5568] text-center sm:text-left">
              Showing{" "}
              <span className="font-semibold text-[#0B1E3F]">
                {rows.length === 0
                  ? 0
                  : (pagination.page - 1) * pagination.limit + 1}
                –
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#0B1E3F]">
                {pagination.total}
              </span>
            </span>

            <div className="flex flex-wrap items-center gap-1 justify-center">
              <button
                onClick={() => onPageChange(Math.max(1, pagination.page - 1))}
                disabled={pagination.page <= 1 || loading}
                className="flex items-center gap-1 text-xs px-2.5 py-1.5 md:px-3 rounded-lg border border-[#CBD5E0] text-[#4A5568] bg-white hover:bg-[#FAF6EC] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={13} /> Prev
              </button>

              {getPageNumbers().map((p, idx) => {
                if (p === "...") {
                  return (
                    <span
                      key={`dots-${idx}`}
                      className="px-2 text-xs font-semibold text-[#4A5568]"
                    >
                      ...
                    </span>
                  );
                }
                return (
                  <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    disabled={loading}
                    className={`text-xs w-8 h-8 rounded-lg border transition-colors font-medium
                      ${
                        p === pagination.page
                          ? "bg-[#0B1E3F] text-white border-[#0B1E3F]"
                          : "bg-white border-[#CBD5E0] text-[#4A5568] hover:bg-[#FAF6EC]"
                      }`}
                  >
                    {p}
                  </button>
                );
              })}

              <button
                onClick={() =>
                  onPageChange(
                    Math.min(pagination.totalPages, pagination.page + 1),
                  )
                }
                disabled={pagination.page >= pagination.totalPages || loading}
                className="flex items-center gap-1 text-xs px-2.5 py-1.5 md:px-3 rounded-lg border border-[#CBD5E0] text-[#4A5568] bg-white hover:bg-[#FAF6EC] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
