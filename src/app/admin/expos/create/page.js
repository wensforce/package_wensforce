"use client";

import { CalendarDays, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import ExpoForm from "@/app/admin/components/expo/ExpoForm";

export default function ExpoCreatePage() {
  const router = useRouter();

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
                Create Expo
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
          <ExpoForm onSaved={() => router.push("/admin/expos")} />
        </div>
      </div>
    </div>
  );
}
