"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2, Share2, ArrowLeft } from "lucide-react";
import { referralApi } from "../../apis/referral.api";
import { useFetchList } from "@/app/admin/hooks/useFetchList";
import ReferralProgramForm from "../../components/ReferralProgramForm";

export default function ReferralProgramEditPage() {
  const router = useRouter();
  const params = useParams();
  const programId = params?.id;

  const [programData, setProgramData] = useState(null);
  const { loading, setLoading, error, setError } = useFetchList();

  useEffect(() => {
    const fetchProgram = async () => {
      if (!programId) return;
      setLoading(true);
      setError(null);
      try {
        const data = await referralApi.getProgramById(programId);
        setProgramData(data);
      } catch (err) {
        setError(
          err?.response?.data?.message || "Failed to load referral program details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, [programId]);

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="bg-white rounded-2xl border border-[#CBD5E0] overflow-hidden shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#CBD5E0] bg-[#FAF6EC]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B1E3F] text-white shadow-sm">
              <Share2 size={18} className="text-[#C9A24B]" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#718096]">
                Referral Admin
              </p>
              <h1 className="text-lg font-semibold text-[#1A202C] leading-tight">
                {programData?.name ? `Edit: ${programData.name}` : "Edit Referral Program"}
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

        {/* Body */}
        {loading ? (
          <div className="p-12 text-center text-[#4A5568]">
            <Loader2
              size={24}
              className="mx-auto mb-4 animate-spin text-[#0B1E3F]"
            />
            Loading program details...
          </div>
        ) : error ? (
          <div className="m-6 rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            {error}
          </div>
        ) : (
          <div className="p-6">
            <ReferralProgramForm
              programId={programId}
              initialData={programData}
              onSaved={() => router.push("/admin/referral-programs")}
            />
          </div>
        )}
      </div>
    </div>
  );
}
