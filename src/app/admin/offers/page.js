"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Gift,
  Plus,
  Search,
  RefreshCw,
  Eye,
  Trash2,
  AlertTriangle,
  X,
  PlusCircle,
  MinusCircle,
  Calendar,
  Layers,
  ArrowRight,
} from "lucide-react";
import { offersApi } from "./apis/offers.api";
import { toast } from "sonner";

export default function OffersPage() {
  const router = useRouter();
  const [offers, setOffers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Create Modal state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // Delete Modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Form Fields
  const [form, setForm] = useState({
    slug: "",
    isActive: true,
    startDate: "",
    endDate: "",
    category: "",
    alertText: "",
    eyebrow: "",
    title: "",
    titleAccent: "",
    description: "",
    countdownLabel: "Time remaining to claim founding rates",
    pricingLabel: "Current founding rates — valid till {date}",
    benefitsHeading: "What you get as a founding member",
    deadlineNoteStrong: "After {date}:",
    deadlineNoteBody: "New memberships will be onboarded at the updated pricing...",
    ctaPrimaryText: "Claim Founding Rate",
    ctaPrimaryHref: "",
    ctaSecondaryText: "Ask Concierge →",
    footerNote: "wensforce.com · founding access closes {date}",
    featuredPackageIds: [],
  });

  const [benefits, setBenefits] = useState([]);

  const [packageSearchQuery, setPackageSearchQuery] = useState("");
  const [debouncedPackageSearchQuery, setDebouncedPackageSearchQuery] = useState("");

  // Debounce package search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPackageSearchQuery(packageSearchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [packageSearchQuery]);

  // Filter packages based on search query
  const filteredPackagesForCreate = packages.filter((pkg) =>
    pkg.name.toLowerCase().includes(debouncedPackageSearchQuery.toLowerCase())
  );

  // Load All Offers and Packages
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [offersData, packagesData] = await Promise.all([
        offersApi.fetchOffers(),
        offersApi.fetchPackagesList(),
      ]);
      setOffers(offersData);
      setPackages(packagesData);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch offers or packages data.");
      toast.error("Error loading data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auto-populate Alert Banner Text, Countdown Label, Pricing Label
  // and Deadline Note Strong whenever endDate changes
  useEffect(() => {
    if (!form.endDate) return;
    const formatted = new Date(form.endDate).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    });
    setForm((prev) => ({
      ...prev,
      alertText: `Access Closes ${formatted}`,
      countdownLabel: `Time remaining to claim founding rates till ${formatted}`,
      pricingLabel: `Current founding rates — valid till ${formatted}`,
      deadlineNoteStrong: `After ${formatted}:`,
    }));
  }, [form.endDate]);

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Benefits handlers
  const addBenefit = () => {
    setBenefits((prev) => [
      ...prev,
      { icon: "CheckCircle", title: "", description: "", order: prev.length },
    ]);
  };

  const updateBenefit = (index, field, value) => {
    setBenefits((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const removeBenefit = (index) => {
    setBenefits((prev) => prev.filter((_, i) => i !== index));
  };

  // Open Create Modal
  const openCreateModal = () => {
    setForm({
      slug: "",
      isActive: true,
      startDate: "",
      endDate: "",
      category: "",
      alertText: "",
      eyebrow: "",
      title: "",
      titleAccent: "",
      description: "",
      countdownLabel: "Time remaining to claim founding rates",
      pricingLabel: "Current founding rates — valid till {date}",
      benefitsHeading: "What you get as a founding member",
      deadlineNoteStrong: "After {date}:",
      deadlineNoteBody: "New memberships will be onboarded at the updated pricing...",
      ctaPrimaryText: "Claim Founding Rate",
      ctaPrimaryHref: "",
      ctaSecondaryText: "Ask Concierge →",
      footerNote: "wensforce.com · founding access closes {date}",
      featuredPackageIds: [],
    });
    setBenefits([
      { icon: "Star", title: "Current FY Pricing", description: "You pay today's rate for this membership year.", order: 0 },
      { icon: "Tag", title: "Lock-in Rate", description: "Your price is protected from future adjustments.", order: 1 }
    ]);
    setPackageSearchQuery("");
    setFormError(null);
    setCreateModalOpen(true);
  };

  // Submit Create Offer
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    // Validations
    if (!form.slug.trim()) {
      setFormError("Slug is required.");
      setSubmitting(false);
      return;
    }
    if (!form.title.trim()) {
      setFormError("Title is required.");
      setSubmitting(false);
      return;
    }
    if (!form.category.trim()) {
      setFormError("Category is required.");
      setSubmitting(false);
      return;
    }
    if (!form.endDate) {
      setFormError("End date is required.");
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        ...form,
        category: form.category.toLowerCase().trim(),
        featuredPackageIds: form.featuredPackageIds || [],
        startDate: form.startDate ? new Date(form.startDate).toISOString() : null,
        endDate: new Date(form.endDate).toISOString(),
        benefits: benefits.map((b, idx) => ({ ...b, order: idx })),
      };

      const res = await offersApi.createOffer(payload);
      if (res && res.success === false) {
        setFormError(res.message || "Failed to create offer.");
        setSubmitting(false);
        return;
      }
      toast.success("Offer created successfully!");
      setCreateModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || "Failed to create offer.");
    } finally {
      setSubmitting(false);
    }
  };

  // Open Delete Confirmation Modal
  const confirmDelete = (offer) => {
    setOfferToDelete(offer);
    setDeleteModalOpen(true);
  };

  // Confirm Delete Action
  const handleDeleteSubmit = async () => {
    if (!offerToDelete) return;
    setDeleting(true);
    try {
      await offersApi.deleteOffer(offerToDelete.id);
      toast.success("Offer deleted successfully!");
      setDeleteModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete offer.");
    } finally {
      setDeleting(false);
      setOfferToDelete(null);
    }
  };

  // Formatting dates
  const formatDate = (isoString) => {
    if (!isoString) return "-";
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter and Search logic
  const filteredOffers = offers.filter((offer) => {
    const matchesSearch =
      offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || offer.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const categories = ["All", ...new Set(offers.map((o) => o.category))];

  return (
    <div className="p-6 md:p-8 space-y-6 bg-[#FAF6EC] min-h-screen text-[#1A202C]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-serif-display text-[#0B1E3F]">
            Offers Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Create, view, and configure promotional landing page offers.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center justify-center p-2.5 rounded-lg bg-white border border-gray-200 text-[#0B1E3F] hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
            title="Refresh list"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0B1E3F] text-white hover:bg-[#1E3A6F] transition-colors shadow-md text-sm font-semibold"
          >
            <Plus size={16} /> Create Offer
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by title or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#FAF6EC] border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#C9A24B] text-[#1A202C]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-gray-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#FAF6EC] border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#1A202C] focus:outline-none focus:border-[#C9A24B]"
          >
            {categories.map((c) => (
              <option key={c} value={c.toLowerCase()}>
                {c === "All" ? "All Categories" : c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Offers Table / Mobile Cards */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#C9A24B]"></div>
          <p className="text-[#0B1E3F] font-medium text-sm">Loading offers...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <AlertTriangle size={34} className="mx-auto text-red-500 mb-3" />
          <h2 className="text-lg font-semibold text-[#1A202C] mb-1">Failed to load offers</h2>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 rounded-lg bg-[#0B1E3F] text-white hover:bg-[#1E3A6F] text-sm font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      ) : filteredOffers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <Gift size={38} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-base font-semibold text-[#0B1E3F]">No offers found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1">
            No offers match your criteria. Click "Create Offer" to setup a new promotion.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Slug</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Start / End Dates</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {filteredOffers.map((offer) => {
                  const isActive = offer.isActive && new Date(offer.endDate) >= new Date();
                  return (
                    <tr key={offer.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-[#0B1E3F]">{offer.title}</td>
                      <td className="px-6 py-4 text-xs font-mono text-gray-500">{offer.slug}</td>
                      <td className="px-6 py-4">
                        <span className="capitalize bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-medium">
                          {offer.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        <div>Start: {formatDate(offer.startDate)}</div>
                        <div className="mt-0.5">End: {formatDate(offer.endDate)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                            isActive ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-green-600" : "bg-red-600"}`} />
                          {isActive ? "Active" : "Expired / Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/offers/${offer.id}`}
                            className="p-1.5 hover:bg-gray-100 text-[#0B1E3F] rounded-lg transition-colors"
                            title="View details"
                          >
                            <Eye size={16} />
                          </Link>
                          <button
                            onClick={() => confirmDelete(offer)}
                            className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                            title="Delete offer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-6">
            {filteredOffers.map((offer) => {
              const isActive = offer.isActive && new Date(offer.endDate) >= new Date();
              return (
                <div key={offer.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#C9A24B]">
                          {offer.category}
                        </span>
                        <h3 className="font-bold text-[#0B1E3F] text-base mt-0.5">{offer.title}</h3>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isActive ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"
                        }`}
                      >
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="text-xs space-y-1 bg-[#FAF6EC] p-3 rounded-lg border border-gray-100">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Slug:</span>
                        <span className="font-mono font-medium">{offer.slug}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Starts:</span>
                        <span>{formatDate(offer.startDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Ends:</span>
                        <span>{formatDate(offer.endDate)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-4">
                    <button
                      onClick={() => confirmDelete(offer)}
                      className="text-xs text-red-600 font-semibold inline-flex items-center gap-1 hover:underline"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                    <Link
                      href={`/admin/offers/${offer.id}`}
                      className="text-xs text-[#0B1E3F] font-bold inline-flex items-center gap-1 hover:underline"
                    >
                      View details <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* CREATE OFFER MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#0B1E3F] text-white">
              <h2 className="text-lg font-bold inline-flex items-center gap-2">
                <Gift size={20} className="text-[#C9A24B]" />
                Create Promotional Offer
              </h2>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-6">
              {formError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700 flex items-center gap-2">
                  <AlertTriangle size={15} />
                  <span>{formError}</span>
                </div>
              )}

              {/* Grid 1: Basic Config */}
              <div className="bg-[#FAF6EC] p-4 rounded-xl border border-gray-150 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B1E3F] border-b pb-1">
                  Basic Configuration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Slug *</label>
                    <input
                      type="text"
                      name="slug"
                      value={form.slug}
                      onChange={handleInputChange}
                      placeholder="e.g. founding-fy-2026"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#C9A24B] text-[#1A202C]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Category *</label>
                    <input
                      type="text"
                      name="category"
                      value={form.category}
                      onChange={handleInputChange}
                      placeholder="e.g. user"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#C9A24B] text-[#1A202C]"
                      required
                    />
                  </div>
                  <div className="flex items-center h-full pt-5">
                    <label className="inline-flex items-center gap-2 text-sm text-gray-700 font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={form.isActive}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-[#C9A24B] focus:ring-[#C9A24B]"
                      />
                      Is Active
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Start Date</label>
                    <input
                      type="datetime-local"
                      name="startDate"
                      value={form.startDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#C9A24B] text-[#1A202C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">End Date *</label>
                    <input
                      type="datetime-local"
                      name="endDate"
                      value={form.endDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#C9A24B] text-[#1A202C]"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Grid 2: Display Texts */}
              <div className="bg-white p-4 rounded-xl border border-gray-150 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B1E3F] border-b pb-1">
                  Banner Text Elements (Use {"{date}"} for end date value)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleInputChange}
                      placeholder="e.g. Lock In Founding Rates"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#C9A24B] text-[#1A202C]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Title Accent</label>
                    <input
                      type="text"
                      name="titleAccent"
                      value={form.titleAccent}
                      onChange={handleInputChange}
                      placeholder="e.g. Before the FY Window Closes"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#C9A24B] text-[#1A202C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Eyebrow</label>
                    <input
                      type="text"
                      name="eyebrow"
                      value={form.eyebrow}
                      onChange={handleInputChange}
                      placeholder="e.g. Financial Year Founding Member Access"
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
                      value={form.alertText}
                      onChange={handleInputChange}
                      readOnly
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-[#1A202C] cursor-not-allowed opacity-70"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Provide a detailed description of this promotion..."
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
                      value={form.countdownLabel}
                      onChange={handleInputChange}
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
                      value={form.pricingLabel}
                      onChange={handleInputChange}
                      readOnly
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-[#1A202C] cursor-not-allowed opacity-70"
                    />
                  </div>
                </div>
              </div>

              {/* Grid 3: Packages & CTAs */}
              <div className="bg-[#FAF6EC] p-4 rounded-xl border border-gray-150 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B1E3F] border-b pb-1">
                  CTA links & Featured Packages
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-2">Featured Packages</label>
                    <input
                      type="text"
                      placeholder="Search packages..."
                      value={packageSearchQuery}
                      onChange={(e) => setPackageSearchQuery(e.target.value)}
                      className="w-full mb-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#C9A24B] text-[#1A202C]"
                    />
                    <div className="space-y-2 max-h-48 overflow-y-auto bg-white p-3 border border-gray-200 rounded-lg">
                      {filteredPackagesForCreate.length > 0 ? (
                        filteredPackagesForCreate.map((pkg) => (
                          <label key={pkg.id} className="flex items-center gap-2 text-sm text-[#1A202C] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={form.featuredPackageIds?.includes(pkg.id) || false}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setForm((prev) => {
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
                        ))
                      ) : (
                        <p className="text-xs text-gray-400 italic">No packages found</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">CTA Primary Text</label>
                    <input
                      type="text"
                      name="ctaPrimaryText"
                      value={form.ctaPrimaryText}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#C9A24B] text-[#1A202C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">CTA Primary Href</label>
                    <input
                      type="text"
                      name="ctaPrimaryHref"
                      value={form.ctaPrimaryHref}
                      onChange={handleInputChange}
                      placeholder="e.g. /booking/premium"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#C9A24B] text-[#1A202C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">CTA Secondary Text</label>
                    <input
                      type="text"
                      name="ctaSecondaryText"
                      value={form.ctaSecondaryText}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#C9A24B] text-[#1A202C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Footer Note</label>
                    <input
                      type="text"
                      name="footerNote"
                      value={form.footerNote}
                      onChange={handleInputChange}
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
                      value={form.deadlineNoteStrong}
                      onChange={handleInputChange}
                      readOnly
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-[#1A202C] cursor-not-allowed opacity-70"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Deadline Note Body</label>
                    <input
                      type="text"
                      name="deadlineNoteBody"
                      value={form.deadlineNoteBody}
                      onChange={handleInputChange}
                      placeholder="e.g. Pricing will increase..."
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#C9A24B] text-[#1A202C]"
                    />
                  </div>
                </div>
              </div>

              {/* Grid 4: Offer Benefits Form Section */}
              <div className="bg-white p-4 rounded-xl border border-gray-150 space-y-4">
                <div className="flex items-center justify-between border-b pb-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B1E3F]">
                    Offer Benefits List ({benefits.length})
                  </h3>
                  <button
                    type="button"
                    onClick={addBenefit}
                    className="inline-flex items-center gap-1 text-xs text-[#C9A24B] hover:text-[#a88000] font-bold"
                  >
                    <PlusCircle size={15} /> Add Benefit
                  </button>
                </div>

                {benefits.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-4">No benefits added. Add at least one benefit item.</p>
                ) : (
                  <div className="space-y-4 divide-y divide-gray-100">
                    {benefits.map((benefit, idx) => (
                      <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-3 first:pt-0">
                        <div className="md:col-span-3">
                          <label className="block text-[10px] text-gray-400 font-semibold mb-0.5">Icon *</label>
                          <select
                            value={benefit.icon}
                            onChange={(e) => updateBenefit(idx, "icon", e.target.value)}
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
                          <label className="block text-[10px] text-gray-400 font-semibold mb-0.5">Title *</label>
                          <input
                            type="text"
                            value={benefit.title}
                            onChange={(e) => updateBenefit(idx, "title", e.target.value)}
                            placeholder="e.g. Current FY Pricing"
                            className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs focus:outline-none focus:border-[#C9A24B] text-[#1A202C]"
                            required
                          />
                        </div>
                        <div className="md:col-span-4">
                          <label className="block text-[10px] text-gray-400 font-semibold mb-0.5">Description *</label>
                          <input
                            type="text"
                            value={benefit.description}
                            onChange={(e) => updateBenefit(idx, "description", e.target.value)}
                            placeholder="Brief description..."
                            className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs focus:outline-none focus:border-[#C9A24B] text-[#1A202C]"
                            required
                          />
                        </div>
                        <div className="md:col-span-1 flex items-end justify-center pb-1">
                          <button
                            type="button"
                            onClick={() => removeBenefit(idx)}
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

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg bg-[#0B1E3F] hover:bg-[#1E3A6F] text-white text-sm font-semibold transition-colors shadow-md disabled:opacity-50"
                >
                  {submitting ? "Creating..." : "Save Offer"}
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
              <h3 className="text-lg font-bold text-[#0B1E3F]">Delete Promotional Offer</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete the offer <strong>"{offerToDelete?.title}"</strong>? This will permanently delete this offer and all associated benefits from the database. This action is irreversible.
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
                onClick={handleDeleteSubmit}
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