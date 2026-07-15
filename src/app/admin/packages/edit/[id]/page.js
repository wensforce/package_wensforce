"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2, Package, ArrowLeft } from "lucide-react";
import { packageApi } from "../../apis/packages.api";
import { useFetchList } from "@/app/admin/hooks/useFetchList";
import PackageForm from "@/app/admin/components/package/PackageForm";

export default function PackageEditPage() {
  const router = useRouter();
  const params = useParams();
  const packageId = params?.id;

  const [packageData, setPackageData] = useState(null);
  const { loading, setLoading, error, setError } = useFetchList();

  useEffect(() => {
    const fetchPackage = async () => {
      if (!packageId) return;
      setLoading(true);
      setError(null);
      try {
        const data = await packageApi.getPackageById(packageId);
        setPackageData(data);
      } catch (err) {
        setError(
          err?.response?.data?.message || "Failed to load package details.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [packageId]);

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="bg-white rounded-2xl border border-[#CBD5E0] overflow-hidden">

        {/* Header — mirrors CouponDetailHeader / PackageCreatePage layout */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#CBD5E0]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B1E3F] text-white shadow-sm">
              <Package size={18} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#718096]">
                Package Admin
              </p>
              <h1 className="text-lg font-semibold text-[#1A202C] leading-tight">
                Edit Package
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push("/admin/packages")}
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
            Loading package...
          </div>
        ) : error ? (
          <div className="m-6 rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            {error}
          </div>
        ) : (
          <div className="p-6">
            <PackageForm
              packageId={packageId}
              initialData={packageData}
              onSaved={() => router.push("/admin/packages")}
            />
          </div>
        )}

      </div>
    </div>
  );
} 