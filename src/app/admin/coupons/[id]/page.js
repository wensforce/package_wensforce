"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AlertTriangle, Loader2 } from "lucide-react";
import { couponApi } from "../apis/coupons.api";
import Modal from "../../components/Modal";
import CouponCreateModal from "../../components/modals/CouponCreateModal";
import CouponDetailHeader from "../../components/coupon/CouponDetailHeader";
import CouponOverviewCard from "../../components/coupon/CouponOverviewCard";
import CouponPackagesCard from "../../components/coupon/CouponPackagesCard";

export default function CouponDetailPage() {
  const router = useRouter();
  const params = useParams();
  const couponId = params?.id;

  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchCoupon = useCallback(
    async ({ silent = false } = {}) => {
      if (!couponId) return;

      if (!silent) setLoading(true);
      else setRefreshing(true);
      setError(null);

      try {
        const couponData = await couponApi.getCouponById(couponId);
        setCoupon(couponData);
      } catch (err) {
        setError(
          err?.response?.data?.message || "Failed to fetch coupon details.",
        );
      } finally {
        if (!silent) setLoading(false);
        else setRefreshing(false);
      }
    },
    [couponId],
  );

  useEffect(() => {
    fetchCoupon();
  }, [fetchCoupon]);

  async function handleDeleteConfirm() {
    setDeleting(true);
    setError(null);
    setShowDeleteConfirm(false);

    try {
      await couponApi.deleteCoupon(couponId);
      router.push("/admin/coupons");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete coupon.");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8 min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2
            size={32}
            className="animate-spin text-[#C9A24B] mx-auto mb-3"
          />
          <p className="text-sm text-[#4A5568]">Loading coupon details...</p>
        </div>
      </div>
    );
  }

  if (!coupon && error) {
    return (
      <div className="p-6 md:p-8">
        <div className="bg-white rounded-2xl border border-[#CBD5E0] overflow-hidden">
          <CouponDetailHeader
            onBack={() => router.push("/admin/coupons")}
            onRefresh={() => fetchCoupon()}
            onEdit={() => {}}
            refreshing={refreshing}
          />

          <div className="p-8 text-center">
            <AlertTriangle size={34} className="mx-auto text-red-500 mb-3" />
            <h2 className="text-lg font-semibold text-[#1A202C] mb-2">
              Unable to load coupon
            </h2>
            <p className="text-sm text-[#4A5568] mb-5">{error}</p>
            <button
              onClick={() => fetchCoupon()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0B1E3F] text-white text-sm font-medium hover:bg-[#152d5a] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!coupon) {
    return (
      <div className="p-8">
        <p className="text-sm text-[#4A5568]">Coupon not found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 md:p-8 space-y-6">
        <div className="bg-white rounded-2xl border border-[#CBD5E0] overflow-hidden">
          <CouponDetailHeader
            onBack={() => router.push("/admin/coupons")}
            onRefresh={() => fetchCoupon({ silent: true })}
            onEdit={() => setShowEditModal(true)}
            onDelete={() => setShowDeleteConfirm(true)}
            refreshing={refreshing}
            deleting={deleting}
          />

          {error && (
            <div className="mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="p-6 space-y-6">
            <CouponOverviewCard coupon={coupon} />
            <CouponPackagesCard packages={coupon.packages || []} />
          </div>
        </div>
      </div>

      <CouponCreateModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        coupon={coupon}
        onUpdated={(updatedCoupon) => {
          if (updatedCoupon) {
            setCoupon(updatedCoupon);
          } else {
            fetchCoupon({ silent: true });
          }
          setShowEditModal(false);
        }}
      />

      <Modal
        open={showDeleteConfirm}
        onClose={() => !deleting && setShowDeleteConfirm(false)}
        title="Delete Coupon"
        description="This action cannot be undone."
      >
        <div className="p-6">
          <p className="text-[#4A5568] text-sm mb-6">
            Are you sure you want to delete coupon{" "}
            <strong>{coupon?.code}</strong>?
          </p>
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              disabled={deleting}
              className="text-sm font-medium text-[#4A5568] border border-[#CBD5E0] bg-white rounded-lg px-4 py-2 hover:bg-[#FAF6EC] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="text-sm font-semibold text-white bg-red-600 rounded-lg px-4 py-2 hover:bg-red-700 transition-colors disabled:opacity-60"
            >
              {deleting ? "Deleting..." : "Delete Coupon"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
