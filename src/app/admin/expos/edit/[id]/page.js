"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, CalendarDays, Loader2 } from "lucide-react";
import ExpoForm from "@/app/admin/components/expo/ExpoForm";
import { exposApi } from "../../apis/expos.api";

export default function ExpoEditPage() {
  const router = useRouter();
  const params = useParams();
  const expoId = params?.id;
  const [expo, setExpo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!expoId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await exposApi.getExpoById(expoId);
      setExpo(data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load expo.");
    } finally {
      setLoading(false);
    }
  }, [expoId]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="bg-white rounded-2xl border border-[#CBD5E0] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#CBD5E0]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B1E3F] text-white shadow-sm">
              <CalendarDays size={18} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#718096]">
                Expo Admin
              </p>
              <h1 className="text-lg font-semibold text-[#1A202C] leading-tight">
                Edit Expo
              </h1>
            </div>
          </div>
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-full border border-[#CBD5E0] bg-white px-4 py-2 text-sm font-medium text-[#4A5568] hover:bg-[#FAF6EC] transition-colors"
          >
            <ArrowLeft size={15} />
            Back
          </button>
        </div>

        <div className="p-6">
          {loading && (
            <div className="py-16 flex flex-col items-center text-[#4A5568]">
              <Loader2 size={28} className="animate-spin text-[#C9A24B] mb-2" />
              Loading expo…
            </div>
          )}
          {!loading && error && (
            <div className="py-12 text-center">
              <AlertTriangle className="mx-auto text-red-500 mb-3" size={32} />
              <p className="text-sm text-[#4A5568] mb-4">{error}</p>
              <button
                type="button"
                onClick={load}
                className="px-4 py-2 rounded-lg bg-[#0B1E3F] text-white text-sm"
              >
                Retry
              </button>
            </div>
          )}
          {!loading && expo && (
            <ExpoForm
              expoId={expoId}
              initialData={expo}
              onSaved={() => router.push(`/admin/expos/${expoId}`)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
