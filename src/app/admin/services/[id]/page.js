"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Loader,
} from "lucide-react";
import { servicesApi } from "../apis/services.api";
import ServiceCreateModal from "../../components/modals/ServiceCreateModal";
import Modal from "../../components/Modal";
import { useFetchList } from "../../hooks/useFetchList"; 
import { useModal } from "../../hooks/useModal";
function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ServiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params?.id;

  const [service, setService] = useState(null);
  const { loading, setLoading, error, setError } = useFetchList();

  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Modal state, driven by the useModal hook
  const updateModal = useModal();
  const deleteModal = useModal();

  useEffect(() => {
    const loadService = async () => {
      setLoading(true);
      setError(null);

      try {
        // Try to get service data from sessionStorage first
        const cachedData = sessionStorage.getItem(`service_${serviceId}`);
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          console.log("Loaded service from cache:", parsedData);
          setService(parsedData);
          sessionStorage.removeItem(`service_${serviceId}`); // Clean up after use
          return; // Exit early if we found cached data
        }

        // If not in cache, fetch from API
        const serviceData = await servicesApi.getServiceById(serviceId);
        setService(serviceData);
      } catch (err) {
        setError(
          err?.response?.data?.message || "Failed to load service details.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      loadService();
    }
  }, [serviceId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setError(null);

    try {
      const serviceData = await servicesApi.getServiceById(serviceId);
      setService(serviceData);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to refresh service details.",
      );
    } finally {
      setRefreshing(false);
    }
  };

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

  const handleDelete = () => {
    deleteModal.open();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F6F1] flex items-center justify-center">
        <div className="text-center">
          <Loader
            size={40}
            className="animate-spin text-[#C9A24B] mx-auto mb-3"
          />
          <p className="text-[#4A5568] font-medium text-sm">
            Loading service details...
          </p>
        </div>
      </div>
    );
  }

  if (error && !service) {
    return (
      <div className="min-h-screen bg-[#F8F6F1]">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between p-6 border-b border-[#E8E3DB] bg-white">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-[#C9A24B] hover:text-[#A68239] font-medium transition-colors"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <h1 className="text-2xl font-bold text-[#0B1E3F]">
              Service Details
            </h1>
            <div className="w-20"></div>
          </div>

          <div className="p-6">
            <div className="bg-white rounded-lg p-8 text-center border border-[#E8E3DB]">
              <div className="text-red-600 font-semibold mb-2 text-sm">
                Error Loading Service
              </div>
              <p className="text-[#4A5568] text-sm mb-4">{error}</p>
              <button
                onClick={handleRefresh}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#C9A24B] text-white rounded font-medium text-sm hover:bg-[#A68239] transition-colors cursor-pointer"
              >
                <RotateCcw size={16} /> Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-[#F8F6F1] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#4A5568] font-medium text-sm">
            Service not found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F6F1]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E8E3DB] bg-white">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-[#C9A24B] hover:text-[#A68239] font-medium transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="text-2xl font-bold text-[#0B1E3F]">Service Details</h1>
          <div className="flex flex-wrap items-center gap-3 justify-end">
            <button
              onClick={() => updateModal.open()}
              className="inline-flex items-center gap-2 px-3 py-2 bg-[#F5F5F5] text-[#1A202C] rounded transition-colors hover:bg-[#E2E8F0] font-medium text-sm cursor-pointer"
            >
              Edit
            </button>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-3 py-2 bg-[#C9A24B] text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm cursor-pointer"
            >
              <RotateCcw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
              {refreshing ? "Refreshing" : "Refresh"}
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm cursor-pointer"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded p-3 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* Thumbnail & Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white rounded-lg p-6 border border-[#E8E3DB]">
            {/* Thumbnail */}
            <div className="md:col-span-1">
              <div className="h-48 bg-linear-to-b from-[#FAF6EC] to-[#F5F0E8] rounded-lg overflow-hidden flex items-center justify-center border border-[#E8E3DB]">
                {service.thumbnailUrl ? (
                  <img
                    src={service.thumbnailUrl}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-[#CBD5E0]">
                    <div className="text-4xl mb-2">🖼️</div>
                    <p className="text-xs">No image</p>
                  </div>
                )}
              </div>
            </div>

            {/* Title & Status */}
            <div className="md:col-span-2 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h2 className="text-2xl font-bold text-[#0B1E3F] leading-tight">
                    {service.title}
                  </h2>
                  {service.isActive ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-xs whitespace-nowrap shrink-0">
                      <CheckCircle2 size={14} /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-600 font-semibold text-xs whitespace-nowrap shrink-0">
                      <XCircle size={14} /> Inactive
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#4A5568] mb-4">
                  ID:{" "}
                  <span className="font-mono font-semibold">{service.id}</span>
                </p>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-[#4A5568] text-xs font-semibold mb-1">
                    Created
                  </p>
                  <p className="text-[#1A202C] font-medium text-xs">
                    {formatDate(service.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-[#4A5568] text-xs font-semibold mb-1">
                    Updated
                  </p>
                  <p className="text-[#1A202C] font-medium text-xs">
                    {formatDate(service.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white rounded-lg p-6 border border-[#E8E3DB]">
            <h3 className="text-sm font-semibold text-[#4A5568] mb-3 uppercase tracking-wide">
              Description
            </h3>
            <p className="text-[#1A202C] leading-relaxed whitespace-pre-wrap text-sm">
              {service.description || "No description provided"}
            </p>
          </div>

          {/* Status Panel */}
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8E3DB]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[#4A5568] text-xs uppercase tracking-wide font-semibold mb-1">
                    Status
                  </p>
                  <p className="text-sm font-semibold text-[#1A202C]">
                    {service.isActive
                      ? "Active and visible"
                      : "Inactive and hidden"}
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full px-3 py-2 bg-[#F3F7F8] text-xs font-semibold text-[#42525C]">
                  {service.isActive ? (
                    <CheckCircle2 size={16} className="text-green-600" />
                  ) : (
                    <XCircle size={16} className="text-red-600" />
                  )}
                  {service.isActive ? "Active" : "Inactive"}
                </div>
              </div>
            </div>

            {/* Features Section */}
            {service.features ? (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8E3DB]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-[#4A5568] uppercase tracking-wide">
                    Features
                  </h3>
                  <span className="text-xs text-[#718096]">
                    {Array.isArray(service.features)
                      ? service.features.length
                      : "1"}{" "}
                    item(s)
                  </span>
                </div>
                <ul className="space-y-3">
                  {Array.isArray(service.features) ? (
                    service.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="rounded-2xl bg-[#F8F9FA] px-4 py-3 text-[#1A202C] text-sm flex items-start gap-3"
                      >
                        <CheckCircle2
                          size={16}
                          className="text-green-600 mt-1"
                        />
                        <span>{feature}</span>
                      </li>
                    ))
                  ) : (
                    <p className="text-[#4A5568] text-sm">{service.features}</p>
                  )}
                </ul>
              </div>
            ) : null}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 flex-col sm:flex-row">
            <button
              onClick={() => router.back()}
              className="w-full sm:w-auto px-5 py-3 bg-white text-[#1A202C] rounded-3xl font-semibold border border-[#E8E3DB] hover:bg-[#F5F6F7] transition-colors text-sm cursor-pointer"
            >
              Back
            </button>
            <button
              onClick={() => updateModal.open()}
              className="w-full sm:w-auto px-5 py-3 bg-white text-[#1A202C] rounded-3xl font-semibold border border-[#E8E3DB] hover:bg-[#F5F6F7] transition-colors text-sm cursor-pointer"
            >
              Edit
            </button>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="w-full sm:w-auto px-5 py-3 bg-[#C9A24B] text-white rounded-3xl font-semibold hover:bg-[#A68239] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
              {refreshing ? "Refreshing" : "Refresh"}
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="w-full sm:w-auto px-5 py-3 bg-red-600 text-white rounded-3xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm cursor-pointer"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>

      <Modal
        open={deleteModal.isOpen}
        onClose={() => !deleting && deleteModal.close()}
        title="Delete Service"
        description="This action cannot be undone."
      >
        <div className="p-6">
          <p className="text-[#4A5568] text-sm mb-6">
            Are you sure you want to delete <strong>{service?.title}</strong>?
            All associated data will be permanently removed.
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => deleteModal.close()}
              disabled={deleting}
              className="px-4 py-2 bg-white text-[#1A202C] rounded-lg border border-[#E8E3DB] hover:bg-[#F5F6F7] transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {deleting ? "Deleting..." : "Delete Service"}
            </button>
          </div>
        </div>
      </Modal>

      <ServiceCreateModal
        open={updateModal.isOpen}
        onClose={() => updateModal.close()}
        service={service}
        onUpdated={(updatedService) => {
          setService(updatedService);
          updateModal.close();
        }}
      />
    </div>
  );
}