"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Loader2,
  Package,
  ArrowLeft,
  Pencil,
  Trash2,
  Car,
  Clock,
  Route,
  Shield,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import api from "../../../axios/axios";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

function formatPrice(value) {
  if (value == null) return "—";
  return `₹${Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

function discountPct(regular, discounted) {
  if (!regular || !discounted || discounted >= regular) return null;
  return Math.round(((regular - discounted) / regular) * 100);
}

export default function PackageDetailPage() {
  const router = useRouter();
  const params = useParams();
  const packageId = params?.id;

  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    const fetchPackage = async () => {
      if (!packageId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/package/${packageId}`);
        setPackageData(res.data?.data ?? null);
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
      await api.delete(`/package/${packageId}`);
      router.push("/admin/packages");
    } catch (err) {
      setDeleteError(
        err?.response?.data?.message || "Failed to delete package.",
      );
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F6F1] py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={40} className="text-[#0B1E3F] animate-spin" />
            <p className="text-[#4A5568]">Loading package details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !packageData) {
    return (
      <div className="min-h-screen bg-[#F8F6F1] py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.back()}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E8E3DB] bg-[#F8F6F1] px-4 py-2 text-sm font-semibold text-[#4A5568] transition-colors hover:bg-[#EFF1F3]"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <div className="rounded-[32px] border border-red-200 bg-red-50 p-6">
            <div className="flex gap-4">
              <AlertCircle size={24} className="shrink-0 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-900">Error</h3>
                <p className="text-red-800 mt-1">
                  {error || "Package not found."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const pct = discountPct(
    packageData.regularPrice,
    packageData.discountedPrice,
  );

  return (
    <div className="min-h-screen bg-[#F8F6F1] py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 rounded-[32px] border border-[#E8E3DB] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B1E3F] text-white shadow-sm">
                <Package size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#718096]">
                  Package Details
                </p>
                <h1 className="mt-2 text-3xl font-semibold text-[#0B1E3F]">
                  {packageData.name}
                </h1>
              </div>
            </div>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 rounded-full border border-[#E8E3DB] bg-[#F8F6F1] px-4 py-2 text-sm font-semibold text-[#4A5568] transition-colors hover:bg-[#EFF1F3]"
            >
              <ArrowLeft size={16} /> Back
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Thumbnail & Status */}
          <div className="lg:col-span-1">
            <div className="rounded-[24px] border border-[#E8E3DB] bg-white overflow-hidden shadow-sm">
              {/* Thumbnail */}
              <div className="relative h-64 w-full bg-[#F0EDE8] flex items-center justify-center overflow-hidden">
                {packageData.thumbnailUrl ? (
                  <img
                    src={packageData.thumbnailUrl}
                    alt={packageData.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-[#CBD5E0]">
                    <Package size={48} />
                    <p className="mt-2 text-sm">No image</p>
                  </div>
                )}

                {/* Status Badge */}
                <span
                  className={`absolute top-4 right-4 rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1.5 ${
                    packageData.isActive
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-neutral-200 text-neutral-700"
                  }`}
                >
                  <CheckCircle size={12} />
                  {packageData.isActive ? "Active" : "Inactive"}
                </span>

                {/* Discount Badge */}
                {pct && (
                  <span className="absolute top-4 left-4 rounded-full bg-[#0B1E3F] text-white px-3 py-1 text-xs font-semibold">
                    {pct}% off
                  </span>
                )}
              </div>

              {/* Price Section */}
              <div className="p-6 space-y-4 border-t border-[#E8E3DB]">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#718096]">
                    Pricing
                  </p>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-[#0B1E3F]">
                        {formatPrice(packageData.discountedPrice)}
                      </span>
                      {pct && (
                        <span className="text-lg text-[#718096] line-through">
                          {formatPrice(packageData.regularPrice)}
                        </span>
                      )}
                    </div>
                    {!pct && (
                      <p className="text-sm text-[#718096]">
                        {formatPrice(packageData.regularPrice)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="rounded-[24px] border border-[#E8E3DB] bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#718096] mb-4">
                Basic Information
              </p>

              {packageData.description && (
                <div className="mb-6">
                  <label className="text-xs font-semibold text-[#4A5568]">
                    Description
                  </label>
                  <p className="mt-2 text-sm text-[#2D3748] leading-relaxed">
                    {packageData.description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#4A5568]">
                    Vehicle Type
                  </label>
                  <p className="mt-2 text-sm font-medium text-[#0B1E3F]">
                    {packageData.vehicleType || "—"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#4A5568]">
                    Vehicle Model
                  </label>
                  <p className="mt-2 text-sm font-medium text-[#0B1E3F]">
                    {packageData.vehicleModel || "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Package Details Grid */}
            <div className="rounded-[24px] border border-[#E8E3DB] bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#718096] mb-4">
                Package Specifications
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {/* Bodyguard Type */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-[#718096]">
                    <Shield size={16} />
                    <span className="text-xs font-semibold">
                      Bodyguard Type
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-[#0B1E3F]">
                    {packageData.bodyguardType || "—"}
                  </p>
                </div>

                {/* Trips */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-[#718096]">
                    <Route size={16} />
                    <span className="text-xs font-semibold">Trips</span>
                  </div>
                  <p className="text-sm font-semibold text-[#0B1E3F]">
                    {packageData.trips || "—"}
                  </p>
                </div>

                {/* Validity */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-[#718096]">
                    <Clock size={16} />
                    <span className="text-xs font-semibold">Validity</span>
                  </div>
                  <p className="text-sm font-semibold text-[#0B1E3F]">
                    {packageData.validity
                      ? `${packageData.validity} month${packageData.validity > 1 ? "s" : ""}`
                      : "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Included Services */}
            {packageData.packageServices &&
              packageData.packageServices.length > 0 && (
                <div className="rounded-[24px] border border-[#E8E3DB] bg-white p-6 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#718096] mb-4">
                    Included Services
                  </p>

                  <div className="space-y-3">
                    {packageData.packageServices.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-4 pb-3 border-b border-[#E8E3DB] last:border-b-0"
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold text-[#0B1E3F]">
                            {item.service?.title || "Unknown Service"}
                          </h4>
                          {item.service?.description && (
                            <p className="mt-1 text-sm text-[#4A5568]">
                              {item.service.description}
                            </p>
                          )}
                        </div>

                        <div className="text-right">
                          <p className="text-xs font-semibold text-[#718096]">
                            Quantity
                          </p>
                          <p className="text-lg font-bold text-[#0B1E3F]">
                            {item.count || 1}
                          </p>
                        </div>

                        <Link
                          href={`/admin/services/${item.service?.id}`}
                          className="p-2 self-center-safe rounded-lg bg-[#F7FAFC] hover:bg-[#4A90E2] text-[#0B1E3F] hover:text-white transition-all"
                          title="View service details"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Meta Information */}
            <div className="rounded-[24px] border border-[#E8E3DB] bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#718096] mb-4">
                Metadata
              </p>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#4A5568]">Package ID</span>
                  <span className="font-mono text-[#0B1E3F]">
                    {packageData.id}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-[#E8E3DB]">
                  <span className="text-[#4A5568]">Created</span>
                  <span className="text-[#0B1E3F]">
                    {new Date(packageData.createdAt).toLocaleDateString(
                      "en-IN",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-[#E8E3DB]">
                  <span className="text-[#4A5568]">Last Updated</span>
                  <span className="text-[#0B1E3F]">
                    {new Date(packageData.updatedAt).toLocaleDateString(
                      "en-IN",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Error Alert */}
        {deleteError && (
          <div className="mt-6 rounded-[24px] border border-red-200 bg-red-50 p-6">
            <div className="flex gap-4">
              <AlertCircle size={24} className="shrink-0 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-900">Error</h3>
                <p className="text-red-800 mt-1">{deleteError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex gap-3 sm:justify-end">
          <button
            onClick={() =>
              router.push(`/admin/packages/edit/${packageData.id}`)
            }
            className="inline-flex items-center gap-2 rounded-full border border-[#0B1E3F] bg-[#0B1E3F] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#152d5a]"
          >
            <Pencil size={18} /> Update
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-2 rounded-full border border-red-300 bg-red-50 px-6 py-3 font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleting ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Deleting...
              </>
            ) : (
              <>
                <Trash2 size={18} /> Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
