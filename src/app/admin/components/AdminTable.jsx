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
 * @typedef {Object} AdminTableProps
 * @property {React.ReactNode} icon - Icon rendered inside the header badge
 * @property {string} title - Page heading
 * @property {string} [subtitle] - Secondary text below the heading (e.g. "12 total services")
 * @property {string[]} [tabs] - Filter tabs; first entry is treated as "all". Omit to hide tabs.
 * @property {string} [activeTab] - Currently selected tab value
 * @property {(tab: string) => void} [onTabChange] - Called when user switches tabs
 * @property {string} [searchPlaceholder] - Placeholder text for the search input
 * @property {string} searchValue - Controlled value of the search input
 * @property {(value: string) => void} onSearchChange - Called on every search input change
 * @property {AdminTableColumn[]} columns - Column definitions
 * @property {any[]} rows - Data rows to render
 * @property {(row: any, colKey: string) => React.ReactNode} renderCell - Renders a single cell
 * @property {(row: any) => string | number} rowKey - Returns a unique key for each row
 * @property {boolean} loading - When true shows a spinner and disables pagination
 * @property {string | null} error - Error message shown in a red banner; `null` hides it
 * @property {AdminTablePagination} pagination - Pagination state
 * @property {(page: number) => void} onPageChange - Called when user changes page
 * @property {() => void} onRefresh - Called when user clicks Refresh
 * @property {() => void} [onExport] - Called when user clicks Export; omit to hide the button
 * @property {() => void} [onCreate] - Called when user clicks Create; omit to hide the button
 * @property {string} [createLabel] - Label for the Create button (default: "Create")
 * @property {React.ReactNode} [emptyIcon] - Icon shown in the empty-state row
 * @property {string} [emptyText] - Text shown when there are no rows (default: "No records found")
 * @property {React.ReactNode} [headerActions] - Extra ReactNode rendered before the action buttons
 * @property {React.ReactNode} [toolbarFilters] - Optional controls rendered in the table toolbar (e.g. date filter)
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
  onExport,
  onCreate,
  createLabel = "Create",
  emptyIcon,
  emptyText = "No records found",
  headerActions,
  toolbarFilters,
}) {
  const hasTabs = tabs.length > 0;

  return (
    <>
      <div className="p-6 md:p-8 space-y-6">
        {/* ── Page Header ──────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B1E3F] flex items-center justify-center">
              {icon}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#0B1E3F]">{title}</h1>
              {subtitle && <p className="text-sm text-[#4A5568]">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {headerActions}
            {onCreate && (
              <button
                onClick={onCreate}
                className="flex items-center gap-1.5 text-sm font-semibold text-white bg-[#0B1E3F] rounded-lg px-3 py-2 hover:bg-[#152d5a] transition-colors"
              >
                <Plus size={14} />
                {createLabel}
              </button>
            )}
            <button
              onClick={onRefresh}
              disabled={loading}
              className="flex items-center gap-1.5 text-sm text-[#4A5568] border border-[#CBD5E0] bg-white rounded-lg px-3 py-2 hover:bg-[#FAF6EC] transition-colors disabled:opacity-50"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
            {onExport && (
              <button
                onClick={onExport}
                className="flex items-center gap-1.5 text-sm text-[#4A5568] border border-[#CBD5E0] bg-white rounded-lg px-3 py-2 hover:bg-[#FAF6EC] transition-colors"
              >
                <Download size={14} />
                Export
              </button>
            )}
          </div>
        </div>

        {/* ── Main Table Card ───────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-[#CBD5E0] shadow-sm overflow-hidden">

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-[#CBD5E0]">
            {hasTabs && (
              <div>
                {/* Mobile dropdown */}
                <div className="relative sm:hidden">
                  <select
                    value={activeTab}
                    onChange={(e) => onTabChange(e.target.value)}
                    className="w-full appearance-none text-sm bg-[#FAF6EC] border border-[#CBD5E0] rounded-lg px-3 py-2 pr-8 text-[#1A202C] font-semibold capitalize outline-none focus:border-[#C9A24B] transition-colors"
                  >
                    {tabs.map((tab) => (
                      <option key={tab} value={tab} className="capitalize">{tab}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A0AEC0] pointer-events-none" />
                </div>
                {/* Desktop tabs */}
                <div className="hidden sm:flex items-center gap-1 bg-[#FAF6EC] rounded-lg p-1 flex-wrap">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => onTabChange(tab)}
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
            )}

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:ml-auto w-full sm:w-auto">
              {toolbarFilters}

              {/* Search */}
              <div className="flex items-center gap-2 bg-[#FAF6EC] border border-[#CBD5E0] rounded-lg px-3 py-1.5 w-full sm:w-auto">
                <Search size={14} className="text-[#A0AEC0]" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="text-sm bg-transparent outline-none text-[#1A202C] placeholder:text-[#A0AEC0] w-full sm:w-48"
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

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#FAF6EC] border-b border-[#CBD5E0]">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={`text-left px-6 py-3 text-xs font-semibold text-[#4A5568] uppercase tracking-wider ${col.className ?? ""}`}
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
                      <Loader2 size={28} className="mx-auto animate-spin text-[#C9A24B]" />
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-16 text-[#A0AEC0]">
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
                    <tr key={rowKey(row)} className="hover:bg-[#FAF6EC]/60 transition-colors">
                      {columns.map((col) => (
                        <td key={col.key} className={`px-6 py-4 ${col.cellClassName ?? ""}`}>
                          {renderCell(row, col.key)}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-t border-[#CBD5E0] bg-[#FAF6EC]/50">
            <span className="text-xs text-[#4A5568]">
              Showing{" "}
              <span className="font-semibold text-[#0B1E3F]">
                {rows.length === 0
                  ? 0
                  : (pagination.page - 1) * pagination.limit + 1}
                –{Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{" "}
              of <span className="font-semibold text-[#0B1E3F]">{pagination.total}</span>
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => onPageChange(Math.max(1, pagination.page - 1))}
                disabled={pagination.page <= 1 || loading}
                className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-[#CBD5E0] text-[#4A5568] bg-white hover:bg-[#FAF6EC] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={13} /> Prev
              </button>

              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  disabled={loading}
                  className={`text-xs w-8 h-8 rounded-lg border transition-colors font-medium
                    ${p === pagination.page
                      ? "bg-[#0B1E3F] text-white border-[#0B1E3F]"
                      : "bg-white border-[#CBD5E0] text-[#4A5568] hover:bg-[#FAF6EC]"
                    }`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => onPageChange(Math.min(pagination.totalPages, pagination.page + 1))}
                disabled={pagination.page >= pagination.totalPages || loading}
                className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-[#CBD5E0] text-[#4A5568] bg-white hover:bg-[#FAF6EC] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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