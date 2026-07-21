"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AlertTriangle, Loader2 } from "lucide-react";
import { packageApi } from "../apis/packages.api";
import PackageDetailHeader from "../../components/package/PackageDetailHeader";
import PackageOverviewCard from "../../components/package/PackageOverviewCard";
import { useFetchList } from "../../hooks/useFetchList";
import PackageMediaSection from "../../components/package/PackageMediaSection";

export default function PackageDetailPage() {
  const router = useRouter();
  const params = useParams();
  const packageId = params?.id;

  const [packageData, setPackageData] = useState(null);
  const { loading, setLoading, error, setError } = useFetchList();
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const fetchPackage = useCallback(
    async ({ silent = false } = {}) => {
      if (!packageId) return;

      if (!silent) setLoading(true);
      else setRefreshing(true);
      setError(null);

      try {
        const data = await packageApi.getPackageById(packageId);
        console.log(data.images, data.videos, "gdhdh");
        setPackageData(data);
      } catch (err) {
        setError(
          err?.response?.data?.message || "Failed to fetch package details.",
        );
      } finally {
        if (!silent) setLoading(false);
        else setRefreshing(false);
      }
    },
    [packageId, setLoading, setError],
  );

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchPackage();
    });
  }, [fetchPackage]);

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this package? This action cannot be undone.",
      )
    ) {
      return;
    }

    setDeleting(true);
    setDeleteError(null);
    try {
      await packageApi.deletePackage(packageId);
      router.push("/admin/packages");
    } catch (err) {
      setDeleteError(
        err?.response?.data?.message || "Failed to delete package.",
      );
      setDeleting(false);
    }
  };

  if (loading && !packageData) {
    return (
      <div className="p-8 min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2
            size={32}
            className="animate-spin text-[#C9A24B] mx-auto mb-3"
          />
          <p className="text-sm text-[#4A5568]">Loading package details...</p>
        </div>
      </div>
    );
  }

  if (!packageData && error) {
    return (
      <div className="p-6 md:p-8">
        <div className="bg-white rounded-2xl border border-[#CBD5E0] overflow-hidden">
          <PackageDetailHeader
            onBack={() => router.push("/admin/packages")}
            onRefresh={() => fetchPackage()}
            onEdit={() => {}}
            onDelete={() => {}}
            refreshing={refreshing}
            deleting={deleting}
          />

          <div className="p-8 text-center">
            <AlertTriangle size={34} className="mx-auto text-red-500 mb-3" />
            <h2 className="text-lg font-semibold text-[#1A202C] mb-2">
              Unable to load package
            </h2>
            <p className="text-sm text-[#4A5568] mb-5">{error}</p>
            <button
              onClick={() => fetchPackage()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0B1E3F] text-white text-sm font-medium hover:bg-[#152d5a] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="p-8">
        <p className="text-sm text-[#4A5568]">Package not found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="bg-white rounded-2xl border border-[#CBD5E0] overflow-hidden">
        <PackageDetailHeader
          onBack={() => router.push("/admin/packages")}
          onRefresh={() => fetchPackage({ silent: true })}
          onEdit={() => router.push(`/admin/packages/edit/${packageData.id}`)}
          onDelete={handleDelete}
          refreshing={refreshing}
          deleting={deleting}
        />

        {error && (
          <div className="mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {deleteError && (
          <div className="mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {deleteError}
          </div>
        )}

        <div className="p-6">
          <PackageOverviewCard packageData={packageData} />
        </div>
        <div className="px-6 pb-6">
          <PackageMediaSection
            images={packageData.images ?? []}
            videos={packageData.videos ?? []}
          />
        </div>
      </div>
    </div>
  );
}
