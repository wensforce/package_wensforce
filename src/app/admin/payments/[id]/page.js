"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AlertTriangle, Loader2 } from "lucide-react";
import { paymentApi } from "../apis/payments.api";
import PaymentDetailHeader from "../../components/payment/PaymentDetailHeader";
import PaymentOverviewCard from "../../components/payment/PaymentOverviewCard";
import { useFetchList } from "../../hooks/useFetchList";
export default function PaymentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const paymentId = params?.id;

  const [payment, setPayment] = useState(null);
  const { loading, setLoading, error, setError } = useFetchList();

  const [refreshing, setRefreshing] = useState(false);

  const fetchPayment = useCallback(
    async ({ silent = false } = {}) => {
      if (!paymentId) return;

      if (!silent) setLoading(true);
      else setRefreshing(true);
      setError(null);

      try {
        const cacheKey = `payment_${paymentId}`;
        const cached = sessionStorage.getItem(cacheKey);
        if (cached && !silent) {
          setPayment(JSON.parse(cached));
          sessionStorage.removeItem(cacheKey);
          if (!silent) setLoading(false);
          return;
        }

        const data = await paymentApi.getPaymentById(paymentId);
        setPayment(data);
      } catch (err) {
        setError(
          err?.response?.data?.message || "Failed to fetch payment details.",
        );
      } finally {
        if (!silent) setLoading(false);
        else setRefreshing(false);
      }
    },
    [paymentId],
  );

  useEffect(() => {
    fetchPayment();
  }, [fetchPayment]);

  if (loading) {
    return (
      <div className="p-8 min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2
            size={32}
            className="animate-spin text-[#C9A24B] mx-auto mb-3"
          />
          <p className="text-sm text-[#4A5568]">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!payment && error) {
    return (
      <div className="p-6 md:p-8">
        <div className="bg-white rounded-2xl border border-[#CBD5E0] overflow-hidden">
          <PaymentDetailHeader
            onBack={() => router.push("/admin/payments")}
            onRefresh={() => fetchPayment()}
            refreshing={refreshing}
          />

          <div className="p-8 text-center">
            <AlertTriangle size={34} className="mx-auto text-red-500 mb-3" />
            <h2 className="text-lg font-semibold text-[#1A202C] mb-2">
              Unable to load payment
            </h2>
            <p className="text-sm text-[#4A5568] mb-5">{error}</p>
            <button
              onClick={() => fetchPayment()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0B1E3F] text-white text-sm font-medium hover:bg-[#152d5a] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="p-8">
        <p className="text-sm text-[#4A5568]">Payment not found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="bg-white rounded-2xl border border-[#CBD5E0] overflow-hidden">
        <PaymentDetailHeader
          onBack={() => router.back()}
          onRefresh={() => fetchPayment({ silent: true })}
          refreshing={refreshing}
        />

        {error && (
          <div className="mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="p-6">
          <PaymentOverviewCard payment={payment} />
        </div>
      </div>
    </div>
  );
}
