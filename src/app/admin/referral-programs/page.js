"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Share2,
  Plus,
  RefreshCw,
  Eye,
  Trash2,
  AlertTriangle,
  X,
  Calendar,
  Layers,
  Gift,
  Users,
  CheckCircle2,
  Clock,
  Ban,
  Activity,
  
  Pencil,
} from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminTable from "../components/AdminTable";
import { referralApi } from "./apis/referral.api";
import { useDeleteReferralProgram } from "./hooks/useDeleteReferralProgram";
import { toast } from "sonner";

const PAGE_LIMIT = 10;

const TABS = ["all", "active", "paused", "cancelled"];

const COLUMNS = [
  { key: "name", label: "Program Name" },
  { key: "category", label: "Category" },
  { key: "trigger", label: "Trigger" },
  { key: "rewards", label: "Reward Structure" },
  { key: "redemptions", label: "Redemptions" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions", className: "text-right" },
];

export default function ReferralProgramsPage() {
  const router = useRouter();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_LIMIT,
    total: 0,
    totalPages: 1,
  });

  // Use custom hook for deleting referral programs
  const {
    programToDelete,
    deleteModalOpen,
    deleting,
    confirmDelete,
    closeDeleteModal,
    handleDelete,
  } = useDeleteReferralProgram({
    onSuccess: () => loadPrograms(),
  });

  // View tracks modal state
  const [tracksModalOpen, setTracksModalOpen] = useState(false);
  const [selectedProgramForTracks, setSelectedProgramForTracks] = useState(null);
  const [tracksData, setTracksData] = useState([]);
  const [tracksLoading, setTracksLoading] = useState(false);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch list
  const loadPrograms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await referralApi.fetchPrograms({
        page,
        limit: PAGE_LIMIT,
        status: activeTab,
        search: debouncedSearch,
      });
      setRows(res.rows);
      setPagination(res.pagination);
    } catch (err) {
      console.error("Error fetching referral programs:", err);
      setError(err?.response?.data?.message || "Failed to load referral programs");
    } finally {
      setLoading(false);
    }
  }, [page, activeTab, debouncedSearch]);

  useEffect(() => {
    loadPrograms();
  }, [loadPrograms]);

  // Handle Tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1);
  };

  // Create / Edit handlers -> Navigate to dedicated pages
  const handleCreateProgram = () => {
    router.push("/admin/referral-programs/create");
  };

  const handleEditProgram = (program) => {
    router.push(`/admin/referral-programs/edit/${program.id}`);
  };

  // View tracks
  const handleViewTracks = async (program) => {
    setSelectedProgramForTracks(program);
    setTracksModalOpen(true);
    setTracksLoading(true);
    try {
      const res = await referralApi.getProgramTracks(program.id, { page: 1, limit: 10 });
      setTracksData(res.tracks || res.data || []);
    } catch (err) {
      toast.error("Failed to load tracking events");
    } finally {
      setTracksLoading(false);
    }
  };

  // Format Helper for rewards
  const formatReward = (type, calcType, val) => {
    if (!type || type === "none") return "None";
    if (calcType === "percentage") return `${val}% ${type}`;
    return `₹${val} ${type}`;
  };

  const renderCell = (row, key) => {
    switch (key) {
      case "name":
        return (
          <div>
            <Link
              href={`/admin/referral-programs/${row.id}`}
              className="font-bold text-[#0B1E3F] hover:text-[#C9A24B] hover:underline text-sm flex items-center gap-2 transition-colors"
            >
              <span>{row.name}</span>
              <span className="text-[10px] font-semibold text-[#4A5568] bg-[#FAF6EC] border border-[#CBD5E0] px-1.5 py-0.5 rounded">
                ID: {row.id}
              </span>
            </Link>
            <div className="text-xs text-[#718096] mt-0.5">
              {row.startDate ? new Date(row.startDate).toLocaleDateString() : "No start limit"} —{" "}
              {row.endDate ? new Date(row.endDate).toLocaleDateString() : "No end limit"}
            </div>
          </div>
        );

      case "category":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FAF6EC] text-[#0B1E3F] border border-[#CBD5E0] capitalize">
            <Layers size={12} className="text-[#C9A24B]" />
            {row.packageCategory}
          </span>
        );

      case "trigger":
        return (
          <div>
            {row.rewardOnSignup ? (
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                <CheckCircle2 size={12} /> On Signup
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                <Clock size={12} /> On Package Purchase
              </span>
            )}
          </div>
        );

      case "rewards":
        return (
          <div className="text-xs space-y-1">
            <div>
              <span className="font-semibold text-[#4A5568]">Referrer: </span>
              <span className="text-[#0B1E3F]">
                {formatReward(row.referrerRewardType, row.referrerRewardCalcType, row.referrerRewardValue)}
              </span>
            </div>
            <div>
              <span className="font-semibold text-[#4A5568]">Referee: </span>
              <span className="text-[#0B1E3F]">
                {formatReward(row.refereeRewardType, row.refereeRewardCalcType, row.refereeRewardValue)}
              </span>
            </div>
          </div>
        );

      case "redemptions":
        return (
          <div className="text-xs font-medium text-[#1A202C]">
            <span className="text-[#C9A24B] font-bold">{row.totalRedemptionCount ?? 0}</span>
            <span className="text-[#718096]"> / {row.maxTotalRedemptions ?? "∞"}</span>
          </div>
        );

      case "status": {
        const st = (row.programStatus || "active").toLowerCase();
        let badgeCls = "bg-green-50 text-green-700 border-green-200";
        let icon = <Activity size={12} />;
        if (st === "paused") {
          badgeCls = "bg-amber-50 text-amber-700 border-amber-200";
          icon = <Clock size={12} />;
        } else if (st === "cancelled") {
          badgeCls = "bg-red-50 text-red-700 border-red-200";
          icon = <Ban size={12} />;
        }
        return (
          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border capitalize ${badgeCls}`}>
            {icon}
            {st}
          </span>
        );
      }

      case "actions":
        return (
          <div className="flex items-center justify-end gap-1.5">
            <button
              onClick={() => router.push(`/admin/referral-programs/${row.id}`)}
              title="View Program Details & Audit History"
              className="p-1.5 text-[#4A5568] hover:text-[#0B1E3F] hover:bg-[#FAF6EC] rounded-lg transition-colors"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => handleEditProgram(row)}
              title="Edit Program"
              className="p-1.5 text-[#4A5568] hover:text-[#0B1E3F] hover:bg-[#FAF6EC] rounded-lg transition-colors"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => confirmDelete(row)}
              title="Delete / Cancel Program"
              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        );

      default:
        return row[key] ?? "-";
    }
  };

  return (
    <>
      <AdminTable
        icon={<Share2 className="text-[#C9A24B]" size={20} />}
        title="Referral Programs"
        subtitle="Manage category-specific referral rules, reward triggers, and redemption tracking."
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        searchPlaceholder="Search referral programs..."
        searchValue={search}
        onSearchChange={setSearch}
        columns={COLUMNS}
        rows={rows}
        renderCell={renderCell}
        rowKey={(row) => row.id}
        loading={loading}
        error={error}
        pagination={pagination}
        onPageChange={(p) => setPage(p)}
        onRefresh={loadPrograms}
        onCreate={handleCreateProgram}
        createLabel="Create Program"
        emptyIcon={<Share2 size={32} />}
        emptyText="No referral programs found"
      />



      {/* ── Delete / Cancel Confirmation Modal ── */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#CBD5E0] shadow-xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#0B1E3F]">Delete / Cancel Program</h3>
                <p className="text-xs text-[#718096]">Program ID: #{programToDelete?.id}</p>
              </div>
            </div>

            <p className="text-sm text-[#4A5568]">
              Are you sure you want to delete or cancel <strong>&quot;{programToDelete?.name}&quot;</strong>?
              If it has existing referral tracking history, it will be safely marked as <strong>cancelled</strong> to preserve foreign key constraints.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#CBD5E0]">
              <button
                onClick={closeDeleteModal}
                disabled={deleting}
                className="px-4 py-2 text-xs font-semibold text-[#4A5568] bg-[#FAF6EC] hover:bg-[#E2E8F0] rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors disabled:opacity-50"
              >
                {deleting ? "Processing..." : "Confirm Delete / Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── View Tracking Logs Modal ── */}
      {tracksModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl border border-[#CBD5E0] shadow-xl p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[#CBD5E0] pb-3">
              <div className="flex items-center gap-2">
                <Activity size={18} className="text-[#C9A24B]" />
                <h3 className="font-bold text-base text-[#0B1E3F]">
                  Tracking Logs: {selectedProgramForTracks?.name}
                </h3>
              </div>
              <button
                onClick={() => setTracksModalOpen(false)}
                className="text-[#A0AEC0] hover:text-[#0B1E3F] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {tracksLoading ? (
                <div className="py-12 text-center text-xs text-[#718096]">Loading tracking events...</div>
              ) : tracksData.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#718096]">No tracking history found for this program.</div>
              ) : (
                tracksData.map((track) => (
                  <div key={track.id} className="p-3.5 rounded-xl border border-[#CBD5E0] bg-[#FAF6EC]/50 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-[#0B1E3F]">
                      <span>Track ID: #{track.id}</span>
                      <span className="text-[10px] text-[#718096]">
                        {new Date(track.createdAt || track.redeemedAt || Date.now()).toLocaleString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-[#4A5568]">
                      <div>
                        <span className="font-semibold">Referrer User ID:</span> #{track.referrerUserId}
                      </div>
                      <div>
                        <span className="font-semibold">Referee User ID:</span> #{track.refereeUserId}
                      </div>
                    </div>
                    <div className="text-[11px] text-[#718096]">
                      Triggered by: {track.triggeredBySignup ? "Signup Application" : `Package Purchase (Order #${track.triggeringOrderId || "N/A"})`}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-[#CBD5E0]">
              <button
                onClick={() => setTracksModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#0B1E3F] hover:bg-[#152d5a] rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
