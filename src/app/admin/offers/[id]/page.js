"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Gift,
  ArrowLeft,
  RefreshCw,
  Pencil,
  Trash2,
  AlertTriangle,
  BadgeCheck,
  Calendar,
  Layers,
  Sparkles,
  Link2,
  CheckCircle,
  Star,
  Tag,
  AlertCircle,
  X,
  PlusCircle,
  MinusCircle,
} from "lucide-react";
import { offersApi } from "../apis/offers.api";
import { toast } from "sonner";

// Formatting dates
function formatDate(iso) {
  if (!iso) return "-";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const formatDateForInput = (isoString) => {
  if (!isoString) return "";
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export default function OfferDetailPage() {
  const router = useRouter();
  const params = useParams();
  const offerId = params?.id;

  const [offer, setOffer] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [editBenefits, setEditBenefits] = useState([]);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState(null);

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Fetch Offer details and Packages list
  const fetchOfferDetails = useCallback(
    async ({ silent = false } = {}) => {
      if (!offerId) return;

      if (!silent) setLoading(true);
      else setRefreshing(true);
      setError(null);

      try {
        const [offerData, packagesData] = await Promise.all([
          offersApi.getOfferById(offerId),
          offersApi.fetchPackagesList(),
        ]);
        setOffer(offerData);
        setPackages(packagesData);
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.data?.message || "Failed to fetch offer details.",
        );
      } finally {
        if (!silent) setLoading(false);
        else setRefreshing(false);
      }
    },
    [offerId],
  );

  useEffect(() => {
    fetchOfferDetails();
  }, [fetchOfferDetails]);

  // Auto-populate Alert Banner Text, Countdown Label, Pricing Label
  // and Deadline Note Strong whenever endDate changes
  useEffect(() => {
    if (!editForm.endDate) return;
    const formatted = new Date(editForm.endDate).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    });
    setEditForm((prev) => ({
      ...prev,
      alertText: `Access Closes ${formatted}`,
      countdownLabel: `Time remaining to claim founding rates till ${formatted}`,
      pricingLabel: `Current founding rates — valid till ${formatted}`,
      deadlineNoteStrong: `After ${formatted}:`,
    }));
  }, [editForm.endDate]);

  // Status computation
  const statusUI = useMemo(() => {
    if (!offer)
      return { className: "bg-gray-100 text-gray-700", label: "UNKNOWN" };
    const isActive = offer.isActive && new Date(offer.endDate) >= new Date();
    return isActive
      ? { className: "bg-green-100 text-green-700", label: "ACTIVE" }
      : { className: "bg-red-100 text-red-700", label: "EXPIRED / INACTIVE" };
  }, [offer]);

  const t = useCallback(
    (template = "") => {
      if (!template) return "";
      const deadline = offer?.endDate ? new Date(offer.endDate) : null;
      const deadlineDateLabel = deadline
        ? deadline.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
            timeZone: "Asia/Kolkata",
          })
        : "";
      const packageName = offer?.featuredPackage?.name ?? "Premium";
      return template
        .replace(/\{date\}/g, deadlineDateLabel)
        .replace(/\{packageName\}/g, packageName);
    },
    [offer],
  );

  // Open Edit Modal with Pre-populated Fields
  const openEditModal = () => {
    if (!offer) return;
    setEditForm({
      slug: offer.slug || "",
      isActive: offer.isActive ?? true,
      startDate: offer.startDate ? formatDateForInput(offer.startDate) : "",
      endDate: offer.endDate ? formatDateForInput(offer.endDate) : "",
      category: offer.category || "",
      alertText: offer.alertText || "",
      eyebrow: offer.eyebrow || "",
      title: offer.title || "",
      titleAccent: offer.titleAccent || "",
      description: offer.description || "",
      countdownLabel: offer.countdownLabel || "",
      pricingLabel: offer.pricingLabel || "",
      benefitsHeading: offer.benefitsHeading || "",
      deadlineNoteStrong: offer.deadlineNoteStrong || "",
      deadlineNoteBody: offer.deadlineNoteBody || "",
      ctaPrimaryText: offer.ctaPrimaryText || "",
      ctaPrimaryHref: offer.ctaPrimaryHref || "",
      ctaSecondaryText: offer.ctaSecondaryText || "",
      footerNote: offer.footerNote || "",
      featuredPackageIds: offer.featuredPackages ? offer.featuredPackages.map((p) => p.id) : [],
    });
    setEditBenefits(
      Array.isArray(offer.benefits)
        ? offer.benefits.map((b) => ({
            icon: b.icon,
            title: b.title,
            description: b.description,
            order: b.order,
          }))
        : [],
    );
    setEditError(null);
    setEditModalOpen(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addEditBenefit = () => {
    setEditBenefits((prev) => [
      ...prev,
      { icon: "CheckCircle", title: "", description: "", order: prev.length },
    ]);
  };

  const updateEditBenefit = (index, field, value) => {
    setEditBenefits((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const removeEditBenefit = (index) => {
    setEditBenefits((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit Edit Offer
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditSubmitting(true);
    setEditError(null);

    if (!editForm.slug.trim()) {
      setEditError("Slug is required.");
      setEditSubmitting(false);
      return;
    }
    if (!editForm.title.trim()) {
      setEditError("Title is required.");
      setEditSubmitting(false);
      return;
    }
    if (!editForm.category.trim()) {
      setEditError("Category is required.");
      setEditSubmitting(false);
      return;
    }
    if (!editForm.endDate) {
      setEditError("End date is required.");
      setEditSubmitting(false);
      return;
    }

    try {
      const payload = {
        ...editForm,
        category: editForm.category.toLowerCase().trim(),
        featuredPackageIds: editForm.featuredPackageIds || [],
        startDate: editForm.startDate
          ? new Date(editForm.startDate).toISOString()
          : null,
        endDate: new Date(editForm.endDate).toISOString(),
        benefits: editBenefits.map((b, idx) => ({ ...b, order: idx })),
      };

      const res = await offersApi.updateOffer(offerId, payload);
      if (res && res.success === false) {
        setEditError(res.message || "Failed to update offer.");
        setEditSubmitting(false);
        return;
      }
      toast.success("Offer updated successfully!");
      setEditModalOpen(false);
      fetchOfferDetails({ silent: true });
    } catch (err) {
      console.error(err);
      setEditError(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0]?.msg ||
          "Failed to update offer.",
      );
    } finally {
      setEditSubmitting(false);
    }
  };

  // Delete Offer action
  const handleDeleteConfirm = async () => {
    if (!offerId || deleting) return;
    setDeleting(true);
    try {
      await offersApi.deleteOffer(offerId);
      toast.success("Offer deleted successfully!");
      router.push("/admin/offers");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete offer.");
      setDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  if (loading && !offer) {
    return (
      <div className="p-8 min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw
            size={32}
            className="animate-spin text-[#C9A24B] mx-auto mb-3"
          />
          <p className="text-sm text-gray-500">Loading offer details...</p>
        </div>
      </div>
    );
  }

  if (error && !offer) {
    return (
      <div className="p-6 md:p-8">
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 border-b border-gray-100 bg-white">
            <button
              onClick={() => router.push("/admin/offers")}
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#0B1E3F] transition-colors"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3F]">
              Offer Details
            </h1>
            <button
              onClick={() => fetchOfferDetails()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0B1E3F] text-white text-sm font-semibold hover:bg-[#1E3A6F] transition-colors"
            >
              <RefreshCw size={14} /> Retry
            </button>
          </div>
          <div className="p-8 text-center">
            <AlertTriangle size={34} className="mx-auto text-red-500 mb-3" />
            <h2 className="text-lg font-semibold text-[#1A202C] mb-1">
              Unable to load offer details
            </h2>
            <p className="text-sm text-gray-500 mb-6">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="p-8">
        <p className="text-sm text-gray-500">Offer not found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6 bg-[#FAF6EC] min-h-screen text-[#1A202C]">
      {/* Detail Wrapper */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Navigation & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-gray-100 bg-white">
          <button
            onClick={() => router.push("/admin/offers")}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#0B1E3F] transition-colors"
          >
            <ArrowLeft size={16} /> Back to Offers
          </button>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => fetchOfferDetails({ silent: true })}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                size={14}
                className={refreshing ? "animate-spin" : ""}
              />
              {refreshing ? "Refreshing" : "Refresh"}
            </button>
            <button
              onClick={openEditModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#C9A24B] hover:bg-[#a88000] text-[#0B1E3F] text-sm font-semibold transition-colors"
            >
              <Pencil size={14} /> Edit
            </button>
            <button
              onClick={() => setDeleteModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>

        {/* Details Layout */}
        <div className="p-6 space-y-8">
          {/* Grid Layout: Left Overview, Right Copy details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Offer Overview Card */}
            <div className="lg:col-span-1 bg-[#FAF6EC] border border-gray-150 p-5 rounded-xl space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-bold text-[#0B1E3F] text-sm flex items-center gap-2">
                  <Gift size={16} className="text-[#C9A24B]" />
                  Offer Info
                </h3>
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${statusUI.className}`}
                >
                  {statusUI.label}
                </span>
              </div>

              <div className="space-y-3.5 text-xs text-gray-700">
                <div>
                  <span className="block text-gray-400 font-medium">
                    Slug (URL identifier)
                  </span>
                  <span className="font-mono font-bold text-gray-900 break-all">
                    {offer.slug}
                  </span>
                </div>
                <div>
                  <span className="block text-gray-400 font-medium">
                    Category
                  </span>
                  <span className="font-semibold text-gray-900 uppercase tracking-wide bg-white px-2 py-0.5 rounded border border-gray-200 inline-block mt-0.5">
                    {offer.category}
                  </span>
                </div>
                <div>
                  <span className="block text-gray-400 font-medium">
                    Start Date
                  </span>
                  <span className="font-semibold text-gray-900">
                    {formatDate(offer.startDate)}
                  </span>
                </div>
                <div>
                  <span className="block text-gray-400 font-medium">
                    End Date
                  </span>
                  <span className="font-semibold text-[#9B2C2C]">
                    {formatDate(offer.endDate)}
                  </span>
                </div>
                {offer.featuredPackage && (
                  <div>
                    <span className="block text-gray-400 font-medium">
                      Featured Package
                    </span>
                    <Link
                      href={`/admin/packages/${offer.featuredPackage.id}`}
                      className="font-semibold text-[#0B1E3F] hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <Sparkles size={13} className="text-[#C9A24B]" />
                      {offer.featuredPackage.name} (₹
                      {offer.featuredPackage.discountedPrice.toLocaleString()})
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Banner Copy & UI texts Card */}
            <div className="lg:col-span-2 bg-white border border-gray-150 p-5 rounded-xl space-y-4">
              <h3 className="font-bold text-[#0B1E3F] text-sm border-b pb-2 flex items-center gap-2">
                <Layers size={16} className="text-[#1E3A6F]" />
                Copywriting & Text Customizations
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="block text-gray-400 font-medium">
                    Eyebrow (Overheader)
                  </span>
                  <span className="font-semibold text-gray-900">
                    {offer.eyebrow || "-"}
                  </span>
                </div>
                <div>
                  <span className="block text-gray-400 font-medium">
                    Alert bar Text
                  </span>
                  <span className="font-semibold text-gray-900 bg-amber-50 text-amber-900 border border-amber-100 p-2 rounded block mt-0.5">
                    {t(offer.alertText) || "-"}
                  </span>
                </div>
                <div className="md:col-span-2">
                  <span className="block text-gray-400 font-medium">
                    Headline Title
                  </span>
                  <h2 className="text-base font-bold text-[#0B1E3F]">
                    {offer.title}{" "}
                    {offer.titleAccent && (
                      <span className="text-[#C9A24B]">
                        {offer.titleAccent}
                      </span>
                    )}
                  </h2>
                </div>
                <div className="md:col-span-2">
                  <span className="block text-gray-400 font-medium">
                    Offer Description
                  </span>
                  <p className="text-gray-600 mt-1">
                    {t(offer.description) || "-"}
                  </p>
                </div>
                <div>
                  <span className="block text-gray-400 font-medium">
                    Countdown Label
                  </span>
                  <span className="font-medium text-gray-800">
                    {offer.countdownLabel || "-"}
                  </span>
                </div>
                <div>
                  <span className="block text-gray-400 font-medium">
                    Pricing Label
                  </span>
                  <span className="font-medium text-gray-800">
                    {t(offer.pricingLabel) || "-"}
                  </span>
                </div>
                <div>
                  <span className="block text-gray-400 font-medium">
                    Deadline Note Bold
                  </span>
                  <span className="font-bold text-gray-900">
                    {t(offer.deadlineNoteStrong) || "-"}
                  </span>
                </div>
                <div>
                  <span className="block text-gray-400 font-medium">
                    Deadline Note Body
                  </span>
                  <span className="font-medium text-gray-600">
                    {t(offer.deadlineNoteBody) || "-"}
                  </span>
                </div>
                <div>
                  <span className="block text-gray-400 font-medium">
                    CTA Primary Text
                  </span>
                  <span className="font-bold text-[#0B1E3F] inline-flex items-center gap-1">
                    {offer.ctaPrimaryText || "-"} <Link2 size={12} />{" "}
                    {offer.ctaPrimaryHref}
                  </span>
                </div>
                <div>
                  <span className="block text-gray-400 font-medium">
                    CTA Secondary Text
                  </span>
                  <span className="font-medium text-gray-700">
                    {offer.ctaSecondaryText || "-"}
                  </span>
                </div>
                <div className="md:col-span-2">
                  <span className="block text-gray-400 font-medium">
                    Footer Note
                  </span>
                  <span className="font-medium text-gray-500 italic">
                    {t(offer.footerNote) || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Grid Section */}
          <div className="space-y-4">
            <h3 className="font-bold text-[#0B1E3F] text-sm border-b pb-2 flex items-center gap-2">
              <CheckCircle size={16} className="text-green-600" />
              {offer.benefitsHeading || "Offer Benefits"}
            </h3>

            {!offer.benefits || offer.benefits.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">
                No custom benefits defined for this offer.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {offer.benefits.map((benefit) => (
                  <div
                    key={benefit.id}
                    className="bg-white border border-gray-150 p-4 rounded-xl shadow-sm flex items-start gap-3 hover:shadow hover:border-[#C9A24B] transition-all"
                  >
                    <div className="p-2 bg-[#FAF6EC] rounded text-[#C9A24B] mt-0.5">
                      {benefit.icon === "Star" && <Star size={16} />}
                      {benefit.icon === "Tag" && <Tag size={16} />}
                      {benefit.icon === "CheckCircle" && (
                        <CheckCircle size={16} />
                      )}
                      {benefit.icon === "AlertCircle" && (
                        <AlertCircle size={16} />
                      )}
                      {benefit.icon === "Gift" && <Gift size={16} />}
                      {![
                        "Star",
                        "Tag",
                        "CheckCircle",
                        "AlertCircle",
                        "Gift",
                      ].includes(benefit.icon) && <CheckCircle size={16} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0B1E3F] text-xs">
                        {benefit.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {benefit.description}
                      </p>
                      <span className="inline-block text-[10px] text-gray-400 mt-2 font-mono uppercase tracking-wider">
                        Order Index: {benefit.order}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#0B1E3F] text-white">
              <h2 className="text-lg font-bold inline-flex items-center gap-2">
                <Pencil size={18} className="text-[#C9A24B]" />
                Edit Promotional Offer
              </h2>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
              {editError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700 flex items-center gap-2">
                  <AlertTriangle size={15} />
                  <span>{editError}</span>
                </div>
              )}

              {/* Basic config */}
              <div className="bg-[#FAF6EC] p-4 rounded-xl border border-gray-150 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B1E3F] border-b pb-1">
                  Basic Configuration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Slug *
                    </label>
                    <input
                      type="text"
                      name="slug"
                      value={editForm.slug}
                      onChange={handleEditInputChange}
                      placeholder="e.g. founding-fy-2026"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#C9A24B] text-[#1A202C]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Category *
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={editForm.category}
                      onChange={handleEditInputChange}
                      placeholder="e.g. Premium"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#C9A24B] text-[#1A202C]"
                      required
                    />
                  </div>
                  <div className="flex items-center h-full pt-5">
                    <label className="inline-flex items-center gap-2 text-sm text-gray-700 font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={editForm.isActive}
                        onChange={handleEditInputChange}
                        className="rounded border-gray-300 text-[#C9A24B] focus:ring-[#C9A24B]"
                      />
                      Is Active
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Start Date
                    </label>
                    <input
                      type="datetime-local"
                      name="startDate"
                      value={editForm.startDate}
                      onChange={handleEditInputChange}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#C9A24B] text-[#1A202C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      End Date *
                    </label>
                    <input
                      type="datetime-local"
                      name="endDate"
                      value={editForm.endDate}
                      onChange={handleEditInputChange}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#C9A24B] text-[#1A202C]"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Text display */}
              <div className="bg-white p-4 rounded-xl border border-gray-150 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B1E3F] border-b pb-1">
                  Banner Text Elements
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={editForm.title}
                      onChange={handleEditInputChange}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#C9A24B] text-[#1A202C]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Title Accent
                    </label>
                    <input
                      type="text"
                      name="titleAccent"
                      value={editForm.titleAccent}
                      onChange={handleEditInputChange}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#C9A24B] text-[#1A202C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Eyebrow
                    </label>
                    <input
                      type="text"
                      name="eyebrow"
                      value={editForm.eyebrow}
                      onChange={handleEditInputChange}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#C9A24B] text-[#1A202C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Alert Banner Text{" "}
                      <span className="text-[#C9A24B] font-normal normal-case tracking-normal">
                        (auto-filled from end date)
                      </span>
                    </label>
                    <input
                      type="text"
                      name="alertText"
                      value={editForm.alertText}
                      onChange={handleEditInputChange}
                      readOnly
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-[#1A202C] cursor-not-allowed opacity-70"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleEditInputChange}
                    rows={2}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#C9A24B] text-[#1A202C]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Countdown Label{" "}
                      <span className="text-[#C9A24B] font-normal normal-case tracking-normal">
                        (auto-filled from end date)
                      </span>
                    </label>
                    <input
                      type="text"
                      name="countdownLabel"
                      value={editForm.countdownLabel}
                      onChange={handleEditInputChange}
                      readOnly
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-[#1A202C] cursor-not-allowed opacity-70"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Pricing Label{" "}
                      <span className="text-[#C9A24B] font-normal normal-case tracking-normal">
                        (auto-filled from end date)
                      </span>
                    </label>
                    <input
                      type="text"
                      name="pricingLabel"
                      value={editForm.pricingLabel}
                      onChange={handleEditInputChange}
                      readOnly
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-[#1A202C] cursor-not-allowed opacity-70"
                    />
                  </div>
                </div>
              </div>

              {/* Featured package & CTAs */}
              <div className="bg-[#FAF6EC] p-4 rounded-xl border border-gray-150 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B1E3F] border-b pb-1">
                  CTA links & Featured Packages
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-2">
                      Featured Packages
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto bg-white p-3 border border-gray-200 rounded-lg">
                      {packages.map((pkg) => (
                        <label key={pkg.id} className="flex items-center gap-2 text-sm text-[#1A202C] cursor-pointer font-sans">
                          <input
                            type="checkbox"
                            checked={editForm.featuredPackageIds?.includes(pkg.id) || false}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setEditForm((prev) => {
                                const ids = prev.featuredPackageIds || [];
                                return {
                                  ...prev,
                                  featuredPackageIds: checked
                                    ? [...ids, pkg.id]
                                    : ids.filter((id) => id !== pkg.id),
                                };
                              });
                            }}
                            className="rounded text-[#C9A24B] focus:ring-[#C9A24B]"
                          />
                          <span className="truncate">{pkg.name} (₹{pkg.discountedPrice ?? pkg.regularPrice})</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      CTA Primary Text
                    </label>
                    <input
                      type="text"
                      name="ctaPrimaryText"
                      value={editForm.ctaPrimaryText}
                      onChange={handleEditInputChange}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#C9A24B] text-[#1A202C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      CTA Primary Href
                    </label>
                    <input
                      type="text"
                      name="ctaPrimaryHref"
                      value={editForm.ctaPrimaryHref}
                      onChange={handleEditInputChange}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#C9A24B] text-[#1A202C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      CTA Secondary Text
                    </label>
                    <input
                      type="text"
                      name="ctaSecondaryText"
                      value={editForm.ctaSecondaryText}
                      onChange={handleEditInputChange}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#C9A24B] text-[#1A202C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Footer Note
                    </label>
                    <input
                      type="text"
                      name="footerNote"
                      value={editForm.footerNote}
                      onChange={handleEditInputChange}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#C9A24B] text-[#1A202C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Deadline Note Strong{" "}
                      <span className="text-[#C9A24B] font-normal normal-case tracking-normal">
                        (auto-filled from end date)
                      </span>
                    </label>
                    <input
                      type="text"
                      name="deadlineNoteStrong"
                      value={editForm.deadlineNoteStrong}
                      onChange={handleEditInputChange}
                      readOnly
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-[#1A202C] cursor-not-allowed opacity-70"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Deadline Note Body
                    </label>
                    <input
                      type="text"
                      name="deadlineNoteBody"
                      value={editForm.deadlineNoteBody}
                      onChange={handleEditInputChange}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#C9A24B] text-[#1A202C]"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Benefits */}
              <div className="bg-white p-4 rounded-xl border border-gray-150 space-y-4">
                <div className="flex items-center justify-between border-b pb-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B1E3F]">
                    Edit Benefits List ({editBenefits.length})
                  </h3>
                  <button
                    type="button"
                    onClick={addEditBenefit}
                    className="inline-flex items-center gap-1 text-xs text-[#C9A24B] hover:text-[#a88000] font-bold"
                  >
                    <PlusCircle size={15} /> Add Benefit
                  </button>
                </div>

                {editBenefits.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-4">
                    No benefits added. Add at least one benefit item.
                  </p>
                ) : (
                  <div className="space-y-4 divide-y divide-gray-100">
                    {editBenefits.map((benefit, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-3 first:pt-0"
                      >
                        <div className="md:col-span-3">
                          <label className="block text-[10px] text-gray-400 font-semibold mb-0.5">
                            Icon *
                          </label>
                          <select
                            value={benefit.icon}
                            onChange={(e) =>
                              updateEditBenefit(idx, "icon", e.target.value)
                            }
                            className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs focus:outline-none focus:border-[#C9A24B] text-[#1A202C]"
                          >
                            <option value="Star">Star (★)</option>
                            <option value="Tag">Tag (🏷)</option>
                            <option value="CheckCircle">CheckCircle (✓)</option>
                            <option value="AlertCircle">AlertCircle (⚠)</option>
                            <option value="Gift">Gift (🎁)</option>
                          </select>
                        </div>
                        <div className="md:col-span-4">
                          <label className="block text-[10px] text-gray-400 font-semibold mb-0.5">
                            Title *
                          </label>
                          <input
                            type="text"
                            value={benefit.title}
                            onChange={(e) =>
                              updateEditBenefit(idx, "title", e.target.value)
                            }
                            className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs focus:outline-none focus:border-[#C9A24B] text-[#1A202C]"
                            required
                          />
                        </div>
                        <div className="md:col-span-4">
                          <label className="block text-[10px] text-gray-400 font-semibold mb-0.5">
                            Description *
                          </label>
                          <input
                            type="text"
                            value={benefit.description}
                            onChange={(e) =>
                              updateEditBenefit(
                                idx,
                                "description",
                                e.target.value,
                              )
                            }
                            className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs focus:outline-none focus:border-[#C9A24B] text-[#1A202C]"
                            required
                          />
                        </div>
                        <div className="md:col-span-1 flex items-end justify-center pb-1">
                          <button
                            type="button"
                            onClick={() => removeEditBenefit(idx)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <MinusCircle size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal footer */}
              <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  className="px-5 py-2 rounded-lg bg-[#0B1E3F] hover:bg-[#1E3A6F] text-white text-sm font-semibold transition-colors shadow-md disabled:opacity-50"
                >
                  {editSubmitting ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-gray-150">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertTriangle size={26} />
              <h3 className="text-lg font-bold text-[#0B1E3F]">
                Delete Promotional Offer
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete the offer{" "}
              <strong>"{offer?.title}"</strong>? This will permanently delete
              this offer and all associated benefits from the database. This
              action is irreversible.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                disabled={deleting}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors shadow-md disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}