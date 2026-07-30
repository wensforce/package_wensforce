"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Copy,
  Gift,
  Loader2,
  Sparkles,
  Users,
  Coins,
} from "lucide-react";
import { toast } from "sonner";
import { authApiUser } from "@/app/user-apis/auth.api";
import { useAuth } from "@/app/context/AuthContext";

const CATEGORY_OPTIONS = [
  { label: "Membership", value: "membership" },
  { label: "Welcome India", value: "welcome india" },
];

const formatDate = (value) => {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
};

export default function ReferralSummaryPanel({ onBack }) {
  const { user } = useAuth();
  const [category, setCategory] = useState("membership");
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadSummary = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      setSummary(null);

      try {
        const res = await authApiUser.getReferralSummary(category);
        if (isMounted) {
          setSummary(res?.data ?? null);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err?.response?.data?.message ||
              "Unable to load referral summary right now.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadSummary();

    return () => {
      isMounted = false;
    };
  }, [category, user?.id]);

  const handleCopy = async () => {
    if (!summary?.referralCode) return;

    try {
      await navigator.clipboard.writeText(summary.referralCode);
      setCopied(true);
      toast.success("Referral code copied");
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Unable to copy referral code");
    }
  };

  const referredUsers = summary?.referredUsers ?? [];
  const rewards = summary?.rewards ?? [];
  const activeRewards = rewards.filter((reward) => !reward.isRedeemed);

  return (
    <div className="mx-auto max-w-3xl space-y-6 py-4 animate-fade-in">
      <div>
        <button
          onClick={onBack}
          className="inline-flex cursor-pointer items-center gap-2 border-none bg-transparent p-0 text-sm font-semibold text-[#0B1E3F] transition-colors hover:text-[#C9A24B]"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>
      </div>

      <div className="w-full rounded-2xl border border-[#CBD5E0] bg-white p-5 shadow-md sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2
              className="text-xl font-bold text-[#0B1E3F]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Referral Summary
            </h2>
            <p className="mt-1 text-sm text-[#4A5568]">
              Share your referral code and track the people who joined through you.
            </p>
          </div>

          <div className="w-full sm:w-48">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#4A5568]">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-[#CBD5E0] bg-[#FAF6EC]/30 px-3 py-2.5 text-sm text-[#1A202C] outline-none transition-all focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/10"
            >
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="mt-6 flex items-center justify-center rounded-2xl border border-[#CBD5E0] bg-[#FAF6EC]/30 px-4 py-10 text-sm text-[#4A5568]">
            <Loader2 size={16} className="mr-2 animate-spin text-[#C9A24B]" />
            Loading referral summary...
          </div>
        ) : error ? (
          <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            <div className="rounded-2xl border border-[#CBD5E0] bg-[#FAF6EC]/40 p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#4A5568]">
                    Your referral code
                  </p>
                  <div className="mt-2 inline-flex items-center gap-2 rounded-xl bg-[#0B1E3F] px-4 py-2.5 text-lg font-semibold text-white">
                    <Sparkles size={16} className="text-[#C9A24B]" />
                    {summary?.referralCode || "—"}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={!summary?.referralCode}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#CBD5E0] bg-white px-3.5 py-2 text-sm font-semibold text-[#0B1E3F] transition-all hover:bg-[#FAF6EC] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Copy size={14} />
                  {copied ? "Copied" : "Copy Code"}
                </button>
              </div>

              <p className="mt-3 text-sm text-[#4A5568]">
                Share this code with friends to unlock rewards for your next package.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-[#CBD5E0] bg-white p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#0B1E3F]">
                  <Users size={16} className="text-[#C9A24B]" />
                  Referred users
                </div>
                <p className="mt-2 text-3xl font-bold text-[#0B1E3F]">
                  {referredUsers.length}
                </p>
                <p className="mt-1 text-sm text-[#4A5568]">
                  People who joined through your code.
                </p>
              </div>

              <div className="rounded-2xl border border-[#CBD5E0] bg-white p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#0B1E3F]">
                  <Gift size={16} className="text-[#C9A24B]" />
                  Active rewards
                </div>
                <p className="mt-2 text-3xl font-bold text-[#0B1E3F]">
                  {activeRewards.length}
                </p>
                <p className="mt-1 text-sm text-[#4A5568]">
                  Rewards that are still available to use.
                </p>
              </div>
            </div>

            {/* Active Referral Program Section */}
            {summary?.activeProgram ? (
              <div className="rounded-2xl border border-[#C9A24B]/30 bg-[#FAF6EC] p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#0B1E3F]">
                    <Sparkles size={16} className="text-[#C9A24B]" />
                    Active Program Offer: {summary.activeProgram.name}
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                    Active
                  </span>
                </div>
                <div className="grid gap-3 text-xs sm:grid-cols-2">
                  <div className="rounded-xl bg-white p-3 border border-[#CBD5E0]/60">
                    <p className="font-semibold text-[#4A5568]">Referrer Reward</p>
                    <p className="font-bold text-[#0B1E3F] text-sm mt-0.5 capitalize inline-flex items-center gap-1 flex-wrap">
                      {summary.activeProgram.referrerRewardCalcType === "percentage" ? (
                        `${summary.activeProgram.referrerRewardValue}%`
                      ) : (
                        <span className="inline-flex items-center gap-0.5">
                          <Coins size={13} className="text-[#C9A24B]" />
                          {summary.activeProgram.referrerRewardValue}
                        </span>
                      )}{" "}
                      {summary.activeProgram.referrerRewardType}
                    </p>
                    {summary.activeProgram.referrerAllowedPackages?.length > 0 && (
                      <p className="text-[#718096] mt-1">
                        Eligible: {summary.activeProgram.referrerAllowedPackages.map((p) => p.packageName).join(", ")}
                      </p>
                    )}
                  </div>
                  <div className="rounded-xl bg-white p-3 border border-[#CBD5E0]/60">
                    <p className="font-semibold text-[#4A5568]">Friend (Referee) Reward</p>
                    <p className="font-bold text-[#0B1E3F] text-sm mt-0.5 capitalize inline-flex items-center gap-1 flex-wrap">
                      {summary.activeProgram.refereeRewardCalcType === "percentage" ? (
                        `${summary.activeProgram.refereeRewardValue}%`
                      ) : (
                        <span className="inline-flex items-center gap-0.5">
                          <Coins size={13} className="text-[#C9A24B]" />
                          {summary.activeProgram.refereeRewardValue}
                        </span>
                      )}{" "}
                      {summary.activeProgram.refereeRewardType}
                    </p>
                    {summary.activeProgram.refereeAllowedPackages?.length > 0 && (
                      <p className="text-[#718096] mt-1">
                        Eligible: {summary.activeProgram.refereeAllowedPackages.map((p) => p.packageName).join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : null}

            

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#4A5568]">
                  Rewards
                </h3>
                <span className="text-xs text-[#718096]">
                  {rewards.length} total
                </span>
              </div>

              {rewards.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#CBD5E0] bg-[#FAF6EC]/20 px-4 py-4 text-sm text-[#4A5568]">
                  No rewards have been generated for this account yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {rewards.map((reward) => (
                    <div
                      key={reward.id}
                      className="flex flex-col gap-2 rounded-2xl border border-[#CBD5E0] bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="text-sm font-semibold text-[#0B1E3F] inline-flex items-center gap-1 flex-wrap">
                          {reward.rewardCalcType === "percentage" ? (
                            <>
                              {reward.rewardValue}% Reward
                              {reward.rewardAmountINR ? (
                                <span className="inline-flex items-center gap-0.5">
                                  (<Coins size={13} className="text-[#C9A24B]" />
                                  {Number(reward.rewardAmountINR).toLocaleString("en-IN")})
                                </span>
                              ) : null}
                            </>
                          ) : (
                            <span className="inline-flex items-center gap-0.5">
                              <Coins size={13} className="text-[#C9A24B]" />
                              {Number(reward.rewardValue || reward.rewardAmountINR || 0).toLocaleString("en-IN")} Discount Reward
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-[#4A5568] mt-0.5">
                          Eligible packages:{" "}
                          <span className="font-semibold text-[#0B1E3F]">
                            {reward.eligiblePackageNames && reward.eligiblePackageNames.length > 0
                              ? reward.eligiblePackageNames.join(", ")
                              : "All Packages in Category"}
                          </span>
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          reward.isRedeemed
                            ? "bg-gray-100 text-gray-700"
                            : "bg-[#FAF6EC] text-[#0B1E3F] border border-[#CBD5E0]"
                        }`}
                      >
                        {reward.isRedeemed ? "Redeemed" : "Available"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
