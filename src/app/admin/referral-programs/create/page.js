"use client";

import { Share2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import ReferralProgramForm from "../components/ReferralProgramForm";

export default function ReferralProgramCreatePage() {
  const router = useRouter();

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
                Create Referral Program
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

        {/* Form body */}
        <div className="p-6">
          <ReferralProgramForm onSaved={() => router.push("/admin/referral-programs")} />
        </div>
      </div>
    </div>
  );
}
