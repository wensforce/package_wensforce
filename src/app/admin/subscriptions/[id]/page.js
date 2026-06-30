"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AlertTriangle, Loader2 } from "lucide-react";
import { subscriptionApi } from "../apis/subscription.api";
import Modal from "../../components/Modal";
import SubscriptionDetailHeader from "../../components/subscription/SubscriptionDetailHeader";
import SubscriptionOverviewCard from "../../components/subscription/SubscriptionOverviewCard";

export default function SubscriptionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const subscriptionId = params?.id;

  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [adminRemarks, setAdminRemarks] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [actionError, setActionError] = useState(null);

  const fetchSubscription = useCallback(
    async ({ silent = false } = {}) => {
      if (!subscriptionId) return;

      if (!silent) setLoading(true);
      else setRefreshing(true);
      setError(null);

      try {
        const cacheKey = `subscription_${subscriptionId}`;
        if (!silent) {
          const cached = sessionStorage.getItem(cacheKey);
          if (cached) {
            setSubscription(JSON.parse(cached));
            sessionStorage.removeItem(cacheKey);
            setLoading(false);
            return;
          }
        }

        const data = await subscriptionApi.getSubscriptionById(subscriptionId);
        setSubscription(data);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            "Failed to fetch subscription details.",
        );
      } finally {
        if (!silent) setLoading(false);
        else setRefreshing(false);
      }
    },
    [subscriptionId],
  );

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const normalizedStatus = String(subscription?.status || "").toUpperCase();
  const canVerify = normalizedStatus !== "ACTIVE";
  const canCancel = normalizedStatus !== "CANCELLED";

  async function handleActionSubmit(e) {
    e.preventDefault();
    if (!actionType) return;

    setActionLoading(actionType);
    setActionError(null);
    setError(null);

    try {
      await subscriptionApi.updateSubscriptionAction(
        subscriptionId,
        actionType,
        adminRemarks,
      );

      setActionType(null);
      setAdminRemarks("");
      await fetchSubscription({ silent: true });
    } catch (err) {
      setActionError(
        err?.response?.data?.message || `Failed to ${actionType} subscription.`,
      );
    } finally {
      setActionLoading(null);
    }
  }

  function openActionModal(type) {
    setActionType(type);
    setAdminRemarks(subscription?.adminRemarks || "");
    setActionError(null);
  }

  if (loading) {
    return (
      <div className="p-8 min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2
            size={32}
            className="animate-spin text-[#C9A24B] mx-auto mb-3"
          />
          <p className="text-sm text-[#4A5568]">
            Loading subscription details...
          </p>
        </div>
      </div>
    );
  }

  if (!subscription && error) {
    return (
      <div className="p-6 md:p-8">
        <div className="bg-white rounded-2xl border border-[#CBD5E0] overflow-hidden">
          <SubscriptionDetailHeader
            onBack={() => router.push("/admin/subscriptions")}
            onRefresh={() => fetchSubscription()}
            onVerify={() => {}}
            onCancel={() => {}}
            refreshing={refreshing}
            actionLoading={actionLoading}
            canVerify={false}
            canCancel={false}
          />

          <div className="p-8 text-center">
            <AlertTriangle size={34} className="mx-auto text-red-500 mb-3" />
            <h2 className="text-lg font-semibold text-[#1A202C] mb-2">
              Unable to load subscription
            </h2>
            <p className="text-sm text-[#4A5568] mb-5">{error}</p>
            <button
              onClick={() => fetchSubscription()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0B1E3F] text-white text-sm font-medium hover:bg-[#152d5a] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="p-8">
        <p className="text-sm text-[#4A5568]">Subscription not found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="bg-white rounded-2xl border border-[#CBD5E0] overflow-hidden">
        <SubscriptionDetailHeader
          onBack={() => router.push("/admin/subscriptions")}
          onRefresh={() => fetchSubscription({ silent: true })}
          onVerify={() => openActionModal("verify")}
          onCancel={() => openActionModal("cancel")}
          refreshing={refreshing}
          actionLoading={actionLoading}
          canVerify={canVerify}
          canCancel={canCancel}
        />

        {error && (
          <div className="mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="p-6">
          <SubscriptionOverviewCard subscription={subscription} />
        </div>
      </div>

      <Modal
        open={Boolean(actionType)}
        onClose={() => {
          if (actionLoading) return;
          setActionType(null);
          setActionError(null);
        }}
        title={
          actionType === "verify"
            ? "Verify Subscription"
            : "Cancel Subscription"
        }
        description={
          actionType === "verify"
            ? "Add optional remarks before verifying this subscription."
            : "Add optional remarks before cancelling this subscription."
        }
      >
        <form onSubmit={handleActionSubmit} className="p-6 space-y-4">
          {actionError && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">
              {actionError}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#0B1E3F]">
              Admin Remarks
            </label>
            <textarea
              value={adminRemarks}
              onChange={(e) => setAdminRemarks(e.target.value)}
              rows={4}
              placeholder={
                actionType === "verify"
                  ? "Verified after payment confirmation"
                  : "Cancelled by ops team"
              }
              disabled={Boolean(actionLoading)}
              className="w-full text-sm rounded-lg border border-[#CBD5E0] bg-[#FAF6EC] px-3 py-2.5 text-[#1A202C] placeholder:text-[#A0AEC0] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-colors resize-none disabled:opacity-60"
            />
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setActionType(null);
                setActionError(null);
              }}
              disabled={Boolean(actionLoading)}
              className="text-sm font-medium text-[#4A5568] border border-[#CBD5E0] bg-white rounded-lg px-4 py-2 hover:bg-[#FAF6EC] transition-colors disabled:opacity-50"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={Boolean(actionLoading)}
              className={`text-sm font-semibold text-white rounded-lg px-4 py-2 transition-colors disabled:opacity-60 ${
                actionType === "verify"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {actionLoading === "verify"
                ? "Verifying..."
                : actionLoading === "cancel"
                  ? "Cancelling..."
                  : actionType === "verify"
                    ? "Verify Subscription"
                    : "Cancel Subscription"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
