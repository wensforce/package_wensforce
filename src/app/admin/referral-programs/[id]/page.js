"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Share2,
  ArrowLeft,
  RefreshCw,
  Pencil,
  Trash2,
  AlertTriangle,
  Clock,
  Ban,
  Layers,
  Users,
  Award,
  Gift,
  Tag,
  Calendar,
  Activity,
  UserCheck,
  PackageCheck,
  Eye,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
  Coins,
  Phone,
  User,
} from "lucide-react";
import { referralApi } from "../apis/referral.api";
import { useDeleteReferralProgram } from "../hooks/useDeleteReferralProgram";
import { toast } from "sonner";

function formatDate(iso) {
  if (!iso) return "No Limit";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatReward(type, calcType, value) {
  if (!type || type === "none") return "No Reward";
  const formattedVal =
    calcType === "percentage" ? (
      `${value}%`
    ) : (
      <span className="inline-flex items-center gap-0.5">
        <Coins size={14} className="text-[#C9A24B]" />
        {Number(value || 0).toLocaleString("en-IN")}
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1">
      {formattedVal}
      <span className="font-normal">({type})</span>
    </span>
  );
}

// Helper: display name or fallback to User #id
function getUserLabel(user, userId) {
  if (!user) return <span className="text-gray-400">User #{userId || "-"}</span>;
  return (
    <div>
      <p className="font-semibold text-[#0B1E3F] flex items-center gap-1">
        <User size={12} className="text-[#718096]" />
        {user.name ? user.name : `User #${user.id}`}
      </p>
      <p className="text-[11px] text-[#718096] flex items-center gap-1 mt-0.5">
        <Phone size={11} />
        {user.mobileNumber || "-"}
      </p>
    </div>
  );
}

function TriggerPackageChip({ pkg }) {
  const pkgName =
    pkg.name || pkg.packageNameSnapshot || `Package #${pkg.packageId}`;
  const pkgPrice = pkg.discountedPrice ?? pkg.regularPrice ?? null;

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-purple-50 border border-purple-200 text-[#0B1E3F]">
      <PackageCheck size={12} className="text-purple-600 shrink-0" />
      <span>{pkgName}</span>
      {pkgPrice != null ? (
        <span className="text-[#718096]">
          (₹{Number(pkgPrice).toLocaleString("en-IN")})
        </span>
      ) : null}
    </span>
  );
}

export default function ReferralProgramDetailPage() {
  const router = useRouter();
  const params = useParams();
  const programId = params?.id;

  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Tracking history state
  const [tracks, setTracks] = useState([]);
  const [tracksLoading, setTracksLoading] = useState(false);
  const [tracksPage, setTracksPage] = useState(1);
  const [tracksTotal, setTracksTotal] = useState(0);
  const tracksLimit = 10;

  // Custom hook for deleting referral program
  const {
    deleteModalOpen,
    deleting,
    confirmDelete,
    closeDeleteModal,
    handleDelete,
  } = useDeleteReferralProgram({
    onSuccess: () => router.push("/admin/referral-programs"),
  });

  // Fetch program details
  const fetchProgramDetails = useCallback(
    async ({ silent = false } = {}) => {
      if (!programId) return;

      if (!silent) setLoading(true);
      else setRefreshing(true);
      setError(null);

      try {
        const data = await referralApi.getProgramById(programId);
        setProgram(data);
      } catch (err) {
        console.error("Error fetching referral program details:", err);
        setError(
          err?.response?.data?.message ||
          "Failed to load referral program details.",
        );
      } finally {
        if (!silent) setLoading(false);
        else setRefreshing(false);
      }
    },
    [programId],
  );

  // Fetch audit tracks
  const fetchTracks = useCallback(
    async (page = 1) => {
      if (!programId) return;
      setTracksLoading(true);
      try {
        const res = await referralApi.getProgramTracks(programId, {
          page,
          limit: tracksLimit,
        });
        setTracks(res.tracks || res.data || []);
        setTracksTotal(res.total || 0);
      } catch (err) {
        console.error("Error loading program tracks:", err);
      } finally {
        setTracksLoading(false);
      }
    },
    [programId],
  );

  useEffect(() => {
    fetchProgramDetails();
    fetchTracks(1);
  }, [fetchProgramDetails, fetchTracks]);

  // Compute status UI badge
  const statusUI = useMemo(() => {
    if (!program) {
      return {
        className: "bg-gray-100 text-gray-700 border-gray-300",
        label: "UNKNOWN",
        icon: <Activity size={13} />,
      };
    }
    const st = (program.programStatus || "active").toLowerCase();
    if (st === "active") {
      return {
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        label: "ACTIVE",
        icon: <Activity size={13} />,
      };
    }
    if (st === "paused") {
      return {
        className: "bg-amber-50 text-amber-700 border-amber-200",
        label: "PAUSED",
        icon: <Clock size={13} />,
      };
    }
    return {
      className: "bg-red-50 text-red-700 border-red-200",
      label: "CANCELLED",
      icon: <Ban size={13} />,
    };
  }, [program]);

  const totalPages = Math.max(1, Math.ceil(tracksTotal / tracksLimit));

  if (loading && !program) {
    return (
      <div className="p-8 min-h-[60vh] flex items-center justify-center bg-[#FAF6EC]">
        <div className="text-center">
          <RefreshCw
            size={36}
            className="animate-spin text-[#C9A24B] mx-auto mb-3"
          />
          <p className="text-sm font-medium text-[#4A5568]">
            Loading referral program details...
          </p>
        </div>
      </div>
    );
  }

  if (error && !program) {
    return (
      <div className="p-4 sm:p-6 md:p-8 bg-[#FAF6EC] min-h-screen">
        <div className="bg-white rounded-2xl border border-[#CBD5E0] overflow-hidden shadow-sm max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 border-b border-[#CBD5E0] bg-[#FAF6EC]">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#4A5568] hover:text-[#0B1E3F] transition-colors"
            >
              <ArrowLeft size={16} /> Back to Programs
            </button>
            <h1 className="text-xl font-bold text-[#0B1E3F]">
              Referral Program Details
            </h1>
            <button
              onClick={() => fetchProgramDetails()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0B1E3F] text-white text-sm font-semibold hover:bg-[#1E3A6F] transition-colors"
            >
              <RefreshCw size={14} /> Retry
            </button>
          </div>
          <div className="p-8 text-center">
            <AlertTriangle size={40} className="mx-auto text-red-500 mb-3" />
            <h2 className="text-lg font-semibold text-[#1A202C] mb-1">
              Unable to load referral program
            </h2>
            <p className="text-sm text-[#718096] mb-6">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="p-8 bg-[#FAF6EC] min-h-screen">
        <p className="text-sm text-[#718096]">Referral program not found.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 bg-[#FAF6EC] min-h-screen text-[#1A202C]">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-[#CBD5E0] shadow-sm overflow-hidden">
        {/* Navigation & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 border-b border-[#CBD5E0] bg-[#FAF6EC]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-xl border border-[#CBD5E0] bg-white text-[#4A5568] hover:text-[#0B1E3F] hover:bg-gray-50 transition-colors"
              title="Back"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0B1E3F] text-white shadow-sm">
              <Share2 size={20} className="text-[#C9A24B]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#718096]">
                  Referral Program #{program.id}
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${statusUI.className}`}
                >
                  {statusUI.icon}
                  {statusUI.label}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#0B1E3F] leading-tight">
                {program.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
            <button
              onClick={() => {
                fetchProgramDetails({ silent: true });
                fetchTracks(tracksPage);
              }}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#CBD5E0] bg-white text-[#4A5568] text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                size={14}
                className={refreshing ? "animate-spin text-[#C9A24B]" : ""}
              />
              {refreshing ? "Refreshing" : "Refresh"}
            </button>
            <Link
              href={`/admin/referral-programs/edit/${program.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C9A24B] hover:bg-[#a88000] text-[#0B1E3F] text-sm font-semibold shadow-sm transition-colors"
            >
              <Pencil size={14} /> Edit Program
            </Link>
            <button
              onClick={() => confirmDelete(program)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-sm transition-colors"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white border-b border-[#CBD5E0]">
          {/* Total Redemptions */}
          <div className="p-4 rounded-xl border border-[#CBD5E0] bg-[#FAF6EC]">
            <div className="flex items-center justify-between text-[#718096] mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Total Redemptions
              </span>
              <Activity size={16} className="text-[#C9A24B]" />
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-extrabold text-[#0B1E3F]">
                {program.totalRedemptionCount ?? 0}
              </span>
              <span className="text-xs font-semibold text-[#718096]">
                / {program.maxTotalRedemptions ?? "∞"} max
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-3 overflow-hidden">
              <div
                className="bg-[#C9A24B] h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: program.maxTotalRedemptions
                    ? `${Math.min(
                      100,
                      ((program.totalRedemptionCount || 0) /
                        program.maxTotalRedemptions) *
                      100,
                    )}%`
                    : "100%",
                }}
              />
            </div>
          </div>

          {/* Per User Cap */}
          <div className="p-4 rounded-xl border border-[#CBD5E0] bg-[#FAF6EC]">
            <div className="flex items-center justify-between text-[#718096] mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Per-User Cap
              </span>
              <Users size={16} className="text-blue-600" />
            </div>
            <div className="mt-1">
              <span className="text-2xl font-extrabold text-[#0B1E3F]">
                {program.maxRedemptionsPerUser ?? "Unlimited"}
              </span>
              <p className="text-[11px] text-[#718096] mt-0.5">
                {program.maxRedemptionsPerUser
                  ? `Max ${program.maxRedemptionsPerUser} redemption(s) per referee`
                  : "No limit per user"}
              </p>
            </div>
          </div>

          {/* Referrer Reward */}
          <div className="p-4 rounded-xl border border-[#CBD5E0] bg-[#FAF6EC]">
            <div className="flex items-center justify-between text-[#718096] mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Referrer Benefit
              </span>
              <Gift size={16} className="text-emerald-600" />
            </div>
            <div className="mt-1">
              <span className="text-xl font-extrabold text-[#0B1E3F] block truncate">
                {formatReward(
                  program.referrerRewardType,
                  program.referrerRewardCalcType,
                  program.referrerRewardValue,
                )}
              </span>
              <p className="text-[11px] text-[#718096] capitalize mt-0.5">
                Scope: {program.referrerPackageScope || "any"}
              </p>
            </div>
          </div>

          {/* Referee Reward */}
          <div className="p-4 rounded-xl border border-[#CBD5E0] bg-[#FAF6EC]">
            <div className="flex items-center justify-between text-[#718096] mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Referee Benefit
              </span>
              <Award size={16} className="text-purple-600" />
            </div>
            <div className="mt-1">
              <span className="text-xl font-extrabold text-[#0B1E3F] block truncate">
                {formatReward(
                  program.refereeRewardType,
                  program.refereeRewardCalcType,
                  program.refereeRewardValue,
                )}
              </span>
              <p className="text-[11px] text-[#718096] capitalize mt-0.5">
                Scope: {program.refereePackageScope || "any"}
              </p>
            </div>
          </div>
        </div>

        {/* Main Details Grid */}
        <div className="p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1: Program Meta Info */}
            <div className="lg:col-span-1 bg-[#FAF6EC] border border-[#CBD5E0] p-5 rounded-2xl space-y-5">
              <div className="border-b border-[#CBD5E0] pb-3">
                <h3 className="font-bold text-[#0B1E3F] text-sm flex items-center gap-2">
                  <Tag size={16} className="text-[#C9A24B]" />
                  Program Meta & Validity
                </h3>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="block text-[#718096] font-medium mb-1">
                    Target Package Category
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-bold text-[#0B1E3F] bg-white px-3 py-1 rounded-lg border border-[#CBD5E0] capitalize text-sm">
                    <Layers size={14} className="text-[#C9A24B]" />
                    {program.packageCategory}
                  </span>
                </div>

                <div>
                  <span className="block text-[#718096] font-medium mb-1">
                    Reward Trigger Event
                  </span>
                  {program.rewardOnSignup ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                      <Zap size={14} /> Immediate On Signup
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                      <PackageCheck size={14} /> On Referee Package Purchase
                    </span>
                  )}
                  <p className="mt-2 text-[11px] leading-relaxed text-[#718096]">
                    {program.rewardOnSignup
                      ? "Referrer and referee rewards are created when the referee applies a referral code during registration."
                      : "Referrer and referee rewards are created only after the referee completes payment for a qualifying trigger package."}
                  </p>
                </div>

                <div>
                  <span className="block text-[#718096] font-medium">
                    Start Date
                  </span>
                  <span className="font-semibold text-[#1A202C] text-sm">
                    {formatDate(program.startDate)}
                  </span>
                </div>

                <div>
                  <span className="block text-[#718096] font-medium">
                    End Date
                  </span>
                  <span className="font-semibold text-red-700 text-sm">
                    {formatDate(program.endDate)}
                  </span>
                </div>

                {program.createdAt && (
                  <div className="pt-2 border-t border-[#CBD5E0]">
                    <span className="block text-[#718096] font-medium">
                      Created At
                    </span>
                    <span className="text-[#4A5568]">
                      {formatDate(program.createdAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Column 2 & 3: Referrer and Referee Rules */}
            <div className="lg:col-span-2 space-y-6">
              {/* Reward generation trigger — purchase-based programs */}
              {!program.rewardOnSignup ? (
                <div className="bg-white border border-purple-200 p-5 rounded-2xl space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-[#CBD5E0] pb-3">
                    <h3 className="font-bold text-[#0B1E3F] text-sm flex items-center gap-2">
                      <PackageCheck size={16} className="text-purple-600" />
                      Referee Purchase Trigger
                    </h3>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                      Purchase required
                    </span>
                  </div>

                  <p className="text-xs leading-relaxed text-[#4A5568]">
                    Rewards for this program are{" "}
                    <strong className="text-[#0B1E3F]">not</strong> issued on
                    signup. They are generated when a referred user (referee)
                    successfully purchases one of the packages listed below.
                  </p>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-[#0B1E3F] flex items-center gap-1.5">
                      <Sparkles size={13} className="text-[#C9A24B]" />
                      Qualifying trigger packages
                    </h4>
                    {Array.isArray(program.referrerTriggerPackages) &&
                    program.referrerTriggerPackages.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {program.referrerTriggerPackages.map((pkg) => (
                          <TriggerPackageChip key={pkg.id || pkg.packageId} pkg={pkg} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                        No trigger packages configured. Rewards will not be
                        generated until at least one qualifying package is
                        added to this program.
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="rounded-xl border border-[#CBD5E0] bg-[#FAF6EC] p-3 text-xs">
                      <p className="font-semibold text-[#718096] mb-1">
                        Referrer receives on trigger
                      </p>
                      <p className="font-bold text-[#0B1E3F] text-sm">
                        {formatReward(
                          program.referrerRewardType,
                          program.referrerRewardCalcType,
                          program.referrerRewardValue,
                        )}
                      </p>
                    </div>
                    <div className="rounded-xl border border-[#CBD5E0] bg-[#FAF6EC] p-3 text-xs">
                      <p className="font-semibold text-[#718096] mb-1">
                        Referee receives on trigger
                      </p>
                      <p className="font-bold text-[#0B1E3F] text-sm">
                        {formatReward(
                          program.refereeRewardType,
                          program.refereeRewardCalcType,
                          program.refereeRewardValue,
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-blue-200 p-5 rounded-2xl space-y-3 shadow-sm">
                  <div className="flex items-center justify-between border-b border-[#CBD5E0] pb-3">
                    <h3 className="font-bold text-[#0B1E3F] text-sm flex items-center gap-2">
                      <Zap size={16} className="text-blue-600" />
                      Signup Reward Trigger
                    </h3>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                      Instant on code apply
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-[#4A5568]">
                    Referrer and referee rewards are created immediately when
                    the referee applies a valid referral code during registration
                    (within the allowed window). No package purchase is required
                    to generate rewards.
                  </p>
                </div>
              )}

              {/* Referrer Rules Card */}
              <div className="bg-white border border-[#CBD5E0] p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#CBD5E0] pb-3">
                  <h3 className="font-bold text-[#0B1E3F] text-sm flex items-center gap-2">
                    <Gift size={16} className="text-[#C9A24B]" />
                    Referrer Reward Rules
                  </h3>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FAF6EC] text-[#0B1E3F] border border-[#CBD5E0] capitalize">
                    Scope: {program.referrerPackageScope || "any"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 bg-[#FAF6EC] rounded-xl border border-[#CBD5E0]">
                    <span className="text-[#718096] font-medium block">
                      Reward Type
                    </span>
                    <span className="font-bold text-[#0B1E3F] capitalize text-sm">
                      {program.referrerRewardType || "None"}
                    </span>
                  </div>

                  <div className="p-3 bg-[#FAF6EC] rounded-xl border border-[#CBD5E0]">
                    <span className="text-[#718096] font-medium block">
                      Calculation Type
                    </span>
                    <span className="font-bold text-[#0B1E3F] capitalize text-sm">
                      {program.referrerRewardCalcType || "-"}
                    </span>
                  </div>

                  <div className="p-3 bg-[#FAF6EC] rounded-xl border border-[#CBD5E0]">
                    <span className="text-[#718096] font-medium block">
                      Reward Value
                    </span>
                    <span className="font-bold text-[#0B1E3F] text-sm inline-flex items-center gap-0.5">
                      {program.referrerRewardCalcType === "percentage" ? (
                        `${program.referrerRewardValue}%`
                      ) : (
                        <>
                          <Coins size={14} className="text-[#C9A24B]" />
                          {Number(program.referrerRewardValue || 0).toLocaleString("en-IN")}
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Referrer Trigger Packages */}
                {program.referrerPackageScope === "custom" && (
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold text-[#0B1E3F] flex items-center gap-1.5">
                      <ShieldCheck size={13} className="text-blue-600" />
                      Allowed Packages for Referrer Reward Redemption
                    </h4>
                    {Array.isArray(program.referrerAllowedPackages) &&
                      program.referrerAllowedPackages.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {program.referrerAllowedPackages.map((pkg) => (
                          <span
                            key={pkg.id}
                            className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-900"
                          >
                            <PackageCheck size={12} className="text-blue-600" />
                            {pkg.name ||
                              pkg.packageNameSnapshot ||
                              `Package #${pkg.packageId}`}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-[#718096] italic">
                        Applies to all packages in category.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Referee Rules Card */}
              <div className="bg-white border border-[#CBD5E0] p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#CBD5E0] pb-3">
                  <h3 className="font-bold text-[#0B1E3F] text-sm flex items-center gap-2">
                    <Award size={16} className="text-[#C9A24B]" />
                    Referee Reward Rules
                  </h3>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FAF6EC] text-[#0B1E3F] border border-[#CBD5E0] capitalize">
                    Scope: {program.refereePackageScope || "any"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 bg-[#FAF6EC] rounded-xl border border-[#CBD5E0]">
                    <span className="text-[#718096] font-medium block">
                      Reward Type
                    </span>
                    <span className="font-bold text-[#0B1E3F] capitalize text-sm">
                      {program.refereeRewardType || "None"}
                    </span>
                  </div>

                  <div className="p-3 bg-[#FAF6EC] rounded-xl border border-[#CBD5E0]">
                    <span className="text-[#718096] font-medium block">
                      Calculation Type
                    </span>
                    <span className="font-bold text-[#0B1E3F] capitalize text-sm">
                      {program.refereeRewardCalcType || "-"}
                    </span>
                  </div>

                  <div className="p-3 bg-[#FAF6EC] rounded-xl border border-[#CBD5E0]">
                    <span className="text-[#718096] font-medium block">
                      Reward Value
                    </span>
                    <span className="font-bold text-[#0B1E3F] text-sm inline-flex items-center gap-0.5">
                      {program.refereeRewardCalcType === "percentage" ? (
                        `${program.refereeRewardValue}%`
                      ) : (
                        <>
                          <Coins size={14} className="text-[#C9A24B]" />
                          {Number(program.refereeRewardValue || 0).toLocaleString("en-IN")}
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Referee Allowed Packages */}
                {program.refereePackageScope === "custom" && (
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold text-[#0B1E3F] flex items-center gap-1.5">
                      <ShieldCheck size={13} className="text-purple-600" />
                      Allowed Referee Packages
                    </h4>
                    {Array.isArray(program.refereeAllowedPackages) &&
                      program.refereeAllowedPackages.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {program.refereeAllowedPackages.map((pkg) => (
                          <span
                            key={pkg.id}
                            className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-purple-50 border border-purple-200 text-purple-900"
                          >
                            <PackageCheck
                              size={12}
                              className="text-purple-600"
                            />
                            {pkg.name ||
                              pkg.packageNameSnapshot ||
                              `Package #${pkg.packageId}`}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-[#718096] italic">
                        Applies to all packages in category.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Audit & Redemption Tracking History Section */}
          <div className="bg-white border border-[#CBD5E0] rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#CBD5E0] pb-3">
              <div>
                <h3 className="font-bold text-[#0B1E3F] text-base flex items-center gap-2">
                  <UserCheck size={18} className="text-[#C9A24B]" />
                  Redemption & Audit Tracking History
                </h3>
                <p className="text-xs text-[#718096]">
                  Real-time record of referral links generated, applied, and
                  converted under this program.
                </p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#FAF6EC] text-[#0B1E3F] border border-[#CBD5E0] self-start sm:self-auto">
                Total Redemptions: {tracksTotal}
              </span>
            </div>

            {/* Table */}
            {tracksLoading ? (
              <div className="p-8 text-center">
                <RefreshCw
                  size={24}
                  className="animate-spin text-[#C9A24B] mx-auto mb-2"
                />
                <p className="text-xs text-[#718096]">
                  Loading audit history...
                </p>
              </div>
            ) : tracks.length === 0 ? (
              <div className="p-8 text-center text-[#718096]">
                <Activity size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm font-medium">
                  No redemptions tracked yet
                </p>
                <p className="text-xs text-gray-400">
                  When users refer friends, their redemption lifecycle will be
                  audited here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#FAF6EC] border-b border-[#CBD5E0] text-[#0B1E3F] font-bold">
                      <th className="py-3 px-4 whitespace-nowrap">#</th>
                      <th className="py-3 px-4 whitespace-nowrap">
                        <span className="flex items-center gap-1.5">
                          <Gift size={13} className="text-emerald-600" />
                          Referrer
                        </span>
                      </th>
                      <th className="py-3 px-4 whitespace-nowrap">
                        <span className="flex items-center gap-1.5">
                          <Award size={13} className="text-purple-600" />
                          Referee
                        </span>
                      </th>
                      <th className="py-3 px-4 whitespace-nowrap">Status</th>
                      <th className="py-3 px-4 whitespace-nowrap">Date & Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#CBD5E0] text-[#1A202C]">
                    {tracks.map((track, index) => (
                      <tr
                        key={track.id}
                        className="hover:bg-[#FAF6EC] transition-colors"
                      >
                        {/* Serial / Track ID */}
                        <td className="py-3 px-4 font-mono text-[#718096] text-[11px]">
                          #{track.id}
                        </td>

                        {/* Referrer */}
                        <td className="py-3 px-4">
                          {getUserLabel(track.referrer, track.referrerUserId)}
                        </td>

                        {/* Referee */}
                        <td className="py-3 px-4">
                          {getUserLabel(track.referee, track.refereeUserId)}
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border capitalize ${
                              track.status === "rewarded" ||
                              track.status === "converted"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : track.status === "applied"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            {track.status || "registered"}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="py-3 px-4 text-[#718096] whitespace-nowrap">
                          {formatDate(track.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-3 border-t border-[#CBD5E0] text-xs">
                <span className="text-[#718096]">
                  Showing page{" "}
                  <strong className="text-[#0B1E3F]">{tracksPage}</strong> of{" "}
                  <strong className="text-[#0B1E3F]">{totalPages}</strong>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const prev = Math.max(1, tracksPage - 1);
                      setTracksPage(prev);
                      fetchTracks(prev);
                    }}
                    disabled={tracksPage <= 1 || tracksLoading}
                    className="p-1.5 rounded-lg border border-[#CBD5E0] bg-white disabled:opacity-40 hover:bg-gray-50"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => {
                      const next = Math.min(totalPages, tracksPage + 1);
                      setTracksPage(next);
                      fetchTracks(next);
                    }}
                    disabled={tracksPage >= totalPages || tracksLoading}
                    className="p-1.5 rounded-lg border border-[#CBD5E0] bg-white disabled:opacity-40 hover:bg-gray-50"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-[#CBD5E0]">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2 bg-red-100 rounded-xl">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-bold text-[#0B1E3F]">
                Delete / Cancel Referral Program?
              </h3>
            </div>
            <p className="text-xs text-[#4A5568] leading-relaxed">
              Are you sure you want to delete <strong>{program.name}</strong>{" "}
              (ID: #{program.id})? If this program has existing tracking
              records, it will be safely marked as <strong>cancelled</strong> to
              preserve audit history.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={deleting}
                className="px-4 py-2 rounded-xl border border-[#CBD5E0] bg-white text-xs font-semibold text-[#4A5568] hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(program.id)}
                disabled={deleting}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 disabled:opacity-50"
              >
                {deleting && <RefreshCw size={12} className="animate-spin" />}
                {deleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}