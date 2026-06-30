"use client";

import { Package, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import PackageForm from "@/app/admin/components/package/PackageForm";
export default function PackageCreatePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F8F6F1] py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-[32px] border border-[#E8E3DB] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B1E3F] text-white shadow-sm">
                <Package size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#718096]">Package admin</p>
                <h1 className="mt-2 text-3xl font-semibold text-[#0B1E3F]">Create package</h1>
              </div>
            </div>
            <button
              type="button"
              onClick={() => router.push("/admin/packages")}
              className="inline-flex items-center gap-2 rounded-full border border-[#E8E3DB] bg-[#F8F6F1] px-4 py-2 text-sm font-semibold text-[#4A5568] transition-colors hover:bg-[#EFF1F3]"
            >
              <ArrowLeft size={16} /> Back
            </button>
          </div>
        </div>

        <div className="rounded-[32px] border border-[#E8E3DB] bg-white shadow-sm">
          <PackageForm onSaved={() => router.push("/admin/packages")} />
        </div>
      </div>
    </div>
  );
}
