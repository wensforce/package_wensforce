"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Search, X } from "lucide-react";
import Modal from "../Modal";
import { useFetchList } from "../../hooks/useFetchList";
import { useFormState } from "../../hooks/useFormState";

import { couponApi } from "../../coupons/apis/coupons.api";
import { packageApi } from "../../packages/apis/packages.api";
const INITIAL_FORM = {
  code: "",
  discountType: "percentage",
  discountValue: "",
  expiryDate: "",
  usageLimit: "",
};

function toLocalDateTimeValue(date) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";

  const pad = (n) => String(n).padStart(2, "0");
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default function CouponCreateModal({
  open,
  onClose,
  onCreated,
  onUpdated,
  coupon,
}) {
  const { form, setForm, handleFieldChange } = useFormState(INITIAL_FORM);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [selectedPackageMeta, setSelectedPackageMeta] = useState({});
  const [packageSuggestions, setPackageSuggestions] = useState([]);
  const [packageSearch, setPackageSearch] = useState("");
  const [debouncedPackageSearch, setDebouncedPackageSearch] = useState("");
  const [loadingPackages, setLoadingPackages] = useState(false);
  const { loading, setLoading, error, setError } = useFetchList();

  const isEditMode = Boolean(coupon?.id);

  useEffect(() => {
    if (!open) return;

    if (coupon) {
      setForm({
        code: coupon.code || "",
        discountType: coupon.discountType || "percentage",
        discountValue: String(coupon.discountValue ?? ""),
        expiryDate: coupon.validUntil
          ? toLocalDateTimeValue(coupon.validUntil)
          : "",
        usageLimit: coupon.usageLimit != null ? String(coupon.usageLimit) : "",
      });

      if (Array.isArray(coupon.packages) && coupon.packages.length > 0) {
        setSelectedPackages(coupon.packages.map((pkg) => pkg.id));
        setSelectedPackageMeta(
          coupon.packages.reduce((acc, pkg) => {
            acc[pkg.id] = pkg.name || `Package #${pkg.id}`;
            return acc;
          }, {}),
        );
      } else {
        setSelectedPackages([]);
        setSelectedPackageMeta({});
      }
    } else {
      setForm(INITIAL_FORM);
      setSelectedPackages([]);
      setSelectedPackageMeta({});
    }

    setPackageSearch("");
    setDebouncedPackageSearch("");
    setPackageSuggestions([]);
    setError(null);
  }, [open, coupon]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => setDebouncedPackageSearch(packageSearch), 400);
    return () => clearTimeout(t);
  }, [packageSearch, open]);

  useEffect(() => {
    if (!open) return;

    const query = debouncedPackageSearch.trim();
    if (!query) {
      setPackageSuggestions([]);
      setLoadingPackages(false);
      return;
    }

    let cancelled = false;

    async function searchPackages() {
      setLoadingPackages(true);
      try {
        const rows = await packageApi.searchPackages(query);
        if (!cancelled) setPackageSuggestions(rows);
      } catch {
        if (!cancelled) setPackageSuggestions([]);
      } finally {
        if (!cancelled) setLoadingPackages(false);
      }
    }

    searchPackages();

    return () => {
      cancelled = true;
    };
  }, [debouncedPackageSearch, open]);

  const selectedCountLabel = useMemo(() => {
    if (selectedPackages.length === 0) return "All packages";
    return `${selectedPackages.length} package${selectedPackages.length > 1 ? "s" : ""} selected`;
  }, [selectedPackages]);

  const selectedPackageItems = useMemo(() => {
    return selectedPackages.map((id) => ({
      id,
      name: selectedPackageMeta[id] || `Package #${id}`,
    }));
  }, [selectedPackages, selectedPackageMeta]);

  const visibleSuggestions = useMemo(() => {
    return packageSuggestions
      .filter((pkg) => !selectedPackages.includes(pkg.id))
      .slice(0, 5);
  }, [packageSuggestions, selectedPackages]);



  function togglePackage(id) {
    setSelectedPackages((prev) =>
      prev.includes(id) ? prev.filter((pkgId) => pkgId !== id) : [...prev, id],
    );
  }

  function handlePackagePick(pkg) {
    if (!selectedPackages.includes(pkg.id)) {
      setSelectedPackages((prev) => [...prev, pkg.id]);
      setSelectedPackageMeta((prev) => ({
        ...prev,
        [pkg.id]: pkg.name || `Package #${pkg.id}`,
      }));
    }
    setPackageSearch("");
    setDebouncedPackageSearch("");
    setPackageSuggestions([]);
  }

  function validate() {
    if (!form.code.trim()) return "Coupon code is required.";

    const discountValue = Number(form.discountValue);
    if (!Number.isFinite(discountValue) || discountValue <= 0) {
      return "Discount value must be a positive number.";
    }

    if (!form.expiryDate) return "Expiry date is required.";

    const expiry = new Date(form.expiryDate);
    if (Number.isNaN(expiry.getTime())) return "Expiry date is invalid.";

    if (form.usageLimit !== "") {
      const usageLimit = Number(form.usageLimit);
      if (!Number.isInteger(usageLimit) || usageLimit <= 0) {
        return "Usage limit must be a positive integer.";
      }
    }

    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        code: form.code.trim().toUpperCase(),
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        expiryDate: new Date(form.expiryDate).toISOString(),
        ...(form.usageLimit !== ""
          ? { usageLimit: Number(form.usageLimit) }
          : {}),
        ...(selectedPackages.length > 0 ? { packageId: selectedPackages } : {}),
      };

      if (isEditMode) {
        const updated = await couponApi.updateCoupon(coupon.id, payload);
        onUpdated?.(updated);
      } else {
        await couponApi.createCoupon(payload);
        onCreated?.();
      }
      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          (isEditMode
            ? "Failed to update coupon."
            : "Failed to create coupon."),
      );
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    if (loading) return;
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEditMode ? "Edit Coupon" : "New Coupon"}
      description={
        isEditMode
          ? "Update coupon details and package applicability."
          : "Create a coupon and optionally limit it to selected packages."
      }
      size="lg"
    >
      <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 sm:col-span-2">
            <label className="block text-sm font-semibold text-[#0B1E3F]">
              Coupon Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="code"
              value={form.code}
              onChange={handleFieldChange}
              placeholder="e.g. SUMMER20"
              disabled={loading}
              className="w-full text-sm rounded-lg border border-[#CBD5E0] bg-[#FAF6EC] px-3 py-2.5 text-[#1A202C] uppercase placeholder:normal-case placeholder:text-[#A0AEC0] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-colors disabled:opacity-60"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#0B1E3F]">
              Discount Type <span className="text-red-500">*</span>
            </label>
            <select
              name="discountType"
              value={form.discountType}
              onChange={handleFieldChange}
              disabled={loading}
              className="w-full text-sm rounded-lg border border-[#CBD5E0] bg-[#FAF6EC] px-3 py-2.5 text-[#1A202C] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-colors disabled:opacity-60"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#0B1E3F]">
              Discount Value <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="discountValue"
              min="0"
              step="0.01"
              value={form.discountValue}
              onChange={handleFieldChange}
              placeholder={
                form.discountType === "percentage" ? "e.g. 20" : "e.g. 500"
              }
              disabled={loading}
              className="w-full rounded-3xl border border-[#CBD5E0] bg-[#FAF6EC] px-4 py-3 text-sm text-[#1A202C] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-colors disabled:opacity-60 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-moz-appearance]:textfield"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#0B1E3F]">
              Expiry Date <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              name="expiryDate"
              value={form.expiryDate}
              min={isEditMode ? undefined : toLocalDateTimeValue(new Date())}
              onChange={handleFieldChange}
              disabled={loading}
              className="w-full text-sm rounded-lg border border-[#CBD5E0] bg-[#FAF6EC] px-3 py-2.5 text-[#1A202C] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-colors disabled:opacity-60"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#0B1E3F]">
              Usage Limit
            </label>
            <input
              type="number"
              name="usageLimit"
              min="1"
              step="1"
              value={form.usageLimit}
              onChange={handleFieldChange}
              placeholder="Leave empty for unlimited"
              disabled={loading}
              className="w-full rounded-3xl border border-[#CBD5E0] bg-[#FAF6EC] px-4 py-3 text-sm text-[#1A202C] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-colors disabled:opacity-60 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-moz-appearance]:textfield"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-[#0B1E3F]">
              Applicable Packages
            </label>
            <span className="text-xs text-[#4A5568]">{selectedCountLabel}</span>
          </div>

          <div className="rounded-lg border border-[#CBD5E0] bg-[#FAF6EC] p-3 space-y-3">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0AEC0]"
              />
              <input
                type="text"
                value={packageSearch}
                onChange={(e) => setPackageSearch(e.target.value)}
                placeholder="Search package by name or ID"
                disabled={loading || loadingPackages}
                className="w-full rounded-lg border border-[#CBD5E0] bg-white pl-9 pr-3 py-2 text-sm text-[#1A202C] placeholder:text-[#A0AEC0] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-colors disabled:opacity-60"
              />
            </div>

            <div
              className={`rounded-lg ${packageSearch.trim() ? "border border-[#CBD5E0]" : ""} bg-white max-h-44 overflow-y-auto`}
            >
              {loadingPackages ? (
                <div className="flex items-center gap-2 text-xs text-[#4A5568] px-3 py-2.5">
                  <Loader2 size={14} className="animate-spin" /> Loading
                  packages...
                </div>
              ) : packageSearch.trim() && visibleSuggestions.length === 0 ? (
                <p className="text-xs text-[#4A5568] px-3 py-2.5">
                  No matching packages found.
                </p>
              ) : (
                visibleSuggestions.map((pkg) => (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => handlePackagePick(pkg)}
                    disabled={loading}
                    className="w-full flex items-center justify-between gap-3 px-3 py-2.5 text-left text-sm text-[#1A202C] hover:bg-[#FAF6EC] transition-colors disabled:opacity-60"
                  >
                    <span className="truncate">
                      {pkg.name || `Package #${pkg.id}`}
                    </span>
                    <span className="text-xs text-[#4A5568] shrink-0">
                      #{pkg.id}
                    </span>
                  </button>
                ))
              )}
            </div>

            {selectedPackageItems.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedPackageItems.map((pkg) => (
                  <span
                    key={pkg.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#CBD5E0] bg-white px-3 py-1.5 text-xs text-[#1A202C]"
                  >
                    <span className="max-w-45 truncate" title={pkg.name}>
                      {pkg.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => togglePackage(pkg.id)}
                      disabled={loading}
                      className="text-[#718096] hover:text-red-600 transition-colors"
                      aria-label={`Remove package ${pkg.id}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <p className="text-xs text-[#4A5568]">
            Leave unselected to make this coupon valid for all packages.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="text-sm font-medium text-[#4A5568] border border-[#CBD5E0] bg-white rounded-lg px-4 py-2 hover:bg-[#FAF6EC] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 text-sm font-semibold text-white bg-[#0B1E3F] rounded-lg px-5 py-2 hover:bg-[#152d5a] transition-colors disabled:opacity-60"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {loading
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
                ? "Update Coupon"
                : "Create Coupon"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
