"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { AlertTriangle, Loader2 } from "lucide-react";
import { servicesApi } from "../apis/services.api";
import ServiceCreateModal from "../../components/modals/ServiceCreateModal";
import Modal from "../../components/Modal";
import ServiceDetailHeader from "../../components/service/serviceDetailHeader";
import ServiceOverviewCard from "../../components/service/serviceOverviewCard";


import { useFetchList } from "../../hooks/useFetchList";
import { useModal } from "../../hooks/useModal";

export default function ServiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params?.id;

  const [service, setService] = useState(null);
  const { loading, setLoading, error, setError } = useFetchList();
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const updateModal = useModal();
  const deleteModal = useModal();

  const fetchService = useCallback(
    async ({ silent = false } = {}) => {
      if (!serviceId) return;

      if (!silent) setLoading(true);
      else setRefreshing(true);
      setError(null);

      try {
        if (!silent) {
          const cached = sessionStorage.getItem(`service_${serviceId}`);
          if (cached) {
            setService(JSON.parse(cached));
          }
        }

        const data = await servicesApi.getServiceById(serviceId);
        setService(data);
      } catch (err) {
        setError(
          err?.response?.data?.message || "Failed to fetch service details.",
        );
      } finally {
        if (!silent) setLoading(false);
        else setRefreshing(false);
      }
    },
    [serviceId],
  );

  useEffect(() => {
    fetchService();
  }, [fetchService]);

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    setError(null);
    deleteModal.close();

    try {
      await servicesApi.deleteService(serviceId);
      router.push("/admin/services");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete the service.");
    } finally {
      setDeleting(false);
    }
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading && !service) {
    return (
      <div className="p-8 min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2
            size={32}
            className="animate-spin text-[#C9A24B] mx-auto mb-3"
          />
          <p className="text-sm text-[#4A5568]">Loading service details...</p>
        </div>
      </div>
    );
  }

  // ── Error state (no data yet) ──────────────────────────────────────────────
  if (!service && error) {
    return (
      <div className="p-6 md:p-8">
        <div className="bg-white rounded-2xl border border-[#CBD5E0] overflow-hidden">
          <ServiceDetailHeader
            onBack={() => router.push("/admin/services")}
            onRefresh={() => fetchService()}
            onEdit={() => {}}
            onDelete={() => {}}
            refreshing={refreshing}
            deleting={deleting}
          />

          <div className="p-8 text-center">
            <AlertTriangle size={34} className="mx-auto text-red-500 mb-3" />
            <h2 className="text-lg font-semibold text-[#1A202C] mb-2">
              Unable to load service
            </h2>
            <p className="text-sm text-[#4A5568] mb-5">{error}</p>
            <button
              onClick={() => fetchService()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0B1E3F] text-white text-sm font-medium hover:bg-[#152d5a] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Not found state ────────────────────────────────────────────────────────
  if (!service) {
    return (
      <div className="p-8">
        <p className="text-sm text-[#4A5568]">Service not found.</p>
      </div>
    );
  }

  // ── Happy path ─────────────────────────────────────────────────────────────
  return (
    <>
      <div className="p-6 md:p-8 space-y-6">
        <div className="bg-white rounded-2xl border border-[#CBD5E0] overflow-hidden">
          <ServiceDetailHeader
            onBack={() => router.push("/admin/services")}
            onRefresh={() => fetchService({ silent: true })}
            onEdit={() => updateModal.open()}
            onDelete={() => deleteModal.open()}
            refreshing={refreshing}
            deleting={deleting}
          />

          {error && (
            <div className="mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="p-6">
            <ServiceOverviewCard service={service} />
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <Modal
        open={deleteModal.isOpen}
        onClose={() => !deleting && deleteModal.close()}
        title="Delete Service"
        description="This action cannot be undone."
      >
        <div className="p-6">
          <p className="text-[#4A5568] text-sm mb-6">
            Are you sure you want to delete{" "}
            <strong>{service?.title}</strong>? All associated data will be
            permanently removed.
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => deleteModal.close()}
              disabled={deleting}
              className="px-4 py-2 bg-white text-[#1A202C] rounded-lg border border-[#E8E3DB] hover:bg-[#F5F6F7] transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleting ? "Deleting..." : "Delete Service"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit modal */}
      <ServiceCreateModal
        open={updateModal.isOpen}
        onClose={() => updateModal.close()}
        service={service}
        onUpdated={(updatedService) => {
          if (updatedService) {
            setService((prev) => ({ ...prev, ...updatedService }));
          }
          updateModal.close();
          fetchService({ silent: true });
        }}
      />
    </>
  );
}