"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Share2, Layers, Gift, Clock, AlertCircle, Plus, Check, Search } from "lucide-react";
import { toast } from "sonner";
import { referralApi } from "../apis/referral.api";

import { useCustomCategory } from "../../hooks/useCustomCategory";
import { usePackageSearch } from "../../hooks/usePackageSearch";

const inputCls =
  "w-full rounded-xl border border-[#CBD5E0] bg-[#FAF6EC] px-3.5 py-2.5 text-xs md:text-sm text-[#1A202C] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-colors disabled:opacity-60";

const sectionCardCls = "rounded-xl border border-[#CBD5E0] bg-white p-4 space-y-4";

export default function ReferralProgramModal({
  isOpen,
  onClose,
  initialData = null, // null for create mode, program object for edit mode
  onSaved,
}) {
  const isEditMode = Boolean(initialData);

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);
  const [availablePackages, setAvailablePackages] = useState([]);

  // Package search hooks for trigger, referrer, and referee packages
  const triggerPackageSearch = usePackageSearch(availablePackages);
  const referrerPackageSearch = usePackageSearch(availablePackages);
  const refereePackageSearch = usePackageSearch(availablePackages);

  // Use reusable custom category hook
  const {
    category: packageCategory,
    setCategory: setPackageCategory,
    categoriesList,
    setCategoriesList,
    isCustomCategory,
    setIsCustomCategory,
    customCategoryInput,
    setCustomCategoryInput,
    toggleCustomMode,
    handleSelectChange,
    handleCustomInputChange,
  } = useCustomCategory({
    initialCategory: initialData?.packageCategory || "membership",
    fetchCategoriesFn: referralApi.fetchCategories,
  });

  // Form Fields State
  const [name, setName] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [programStatus, setProgramStatus] = useState("active");
  const [maxTotalRedemptions, setMaxTotalRedemptions] = useState("");
  const [maxRedemptionsPerUser, setMaxRedemptionsPerUser] = useState("");
  const [rewardOnSignup, setRewardOnSignup] = useState(true);

  // Referrer Reward Fields
  const [referrerRewardType, setReferrerRewardType] = useState("discount");
  const [referrerRewardCalcType, setReferrerRewardCalcType] = useState("fixed");
  const [referrerRewardValue, setReferrerRewardValue] = useState("200");
  const [referrerPackageScope, setReferrerPackageScope] = useState("any");
  const [referrerTriggerPackageIds, setReferrerTriggerPackageIds] = useState([]);
  const [referrerAllowedPackageIds, setReferrerAllowedPackageIds] = useState([]);

  // Referee Reward Fields
  const [refereeRewardType, setRefereeRewardType] = useState("discount");
  const [refereeRewardCalcType, setRefereeRewardCalcType] = useState("fixed");
  const [refereeRewardValue, setRefereeRewardValue] = useState("100");
  const [refereePackageScope, setRefereePackageScope] = useState("any");
  const [refereeAllowedPackageIds, setRefereeAllowedPackageIds] = useState([]);

  // Fetch available packages and categories on mount
  useEffect(() => {
    if (!isOpen) return;

    referralApi.fetchPackagesList().then((pkgs) => {
      setAvailablePackages(pkgs);
    }).catch(() => { });

    referralApi.fetchCategories().then((cats) => {
      if (Array.isArray(cats) && cats.length > 0) {
        const merged = Array.from(
          new Set([
            "membership",
            "welcome_india",
            "all",
            ...cats.map((c) => c.toLowerCase().trim()),
          ])
        );
        setCategoriesList(merged);
      }
    }).catch(() => { });
  }, [isOpen]);

  // Pre-fill form when editing
  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setName(initialData.name || "");

      const cat = initialData.packageCategory || "membership";
      setPackageCategory(cat);

      setStartDate(initialData.startDate ? new Date(initialData.startDate).toISOString().slice(0, 16) : "");
      setEndDate(initialData.endDate ? new Date(initialData.endDate).toISOString().slice(0, 16) : "");
      setProgramStatus(initialData.programStatus || "active");
      setMaxTotalRedemptions(initialData.maxTotalRedemptions != null ? String(initialData.maxTotalRedemptions) : "");
      setMaxRedemptionsPerUser(initialData.maxRedemptionsPerUser != null ? String(initialData.maxRedemptionsPerUser) : "");
      setRewardOnSignup(initialData.rewardOnSignup ?? true);

      // Referrer
      setReferrerRewardType(initialData.referrerRewardType || "discount");
      setReferrerRewardCalcType(initialData.referrerRewardCalcType || "fixed");
      setReferrerRewardValue(initialData.referrerRewardValue != null ? String(initialData.referrerRewardValue) : "0");
      setReferrerPackageScope(initialData.referrerPackageScope || "any");

      const trigIds = (initialData.referrerTriggerPackages || []).map((p) => p.packageId || p.id);
      setReferrerTriggerPackageIds(trigIds);

      const refAllowedIds = (initialData.referrerAllowedPackages || []).map((p) => p.packageId || p.id);
      setReferrerAllowedPackageIds(refAllowedIds);

      // Referee
      setRefereeRewardType(initialData.refereeRewardType || "discount");
      setRefereeRewardCalcType(initialData.refereeRewardCalcType || "fixed");
      setRefereeRewardValue(initialData.refereeRewardValue != null ? String(initialData.refereeRewardValue) : "0");
      setRefereePackageScope(initialData.refereePackageScope || "any");

      const refereeAllowedIds = (initialData.refereeAllowedPackages || []).map((p) => p.packageId || p.id);
      setRefereeAllowedPackageIds(refereeAllowedIds);
    } else {
      // Reset defaults for Create
      setName("");
      setPackageCategory("membership");
      setIsCustomCategory(false);
      setCustomCategoryInput("");
      setStartDate("");
      setEndDate("");
      setProgramStatus("active");
      setMaxTotalRedemptions("");
      setMaxRedemptionsPerUser("");
      setRewardOnSignup(true);

      setReferrerRewardType("discount");
      setReferrerRewardCalcType("fixed");
      setReferrerRewardValue("200");
      setReferrerPackageScope("any");
      setReferrerTriggerPackageIds([]);
      setReferrerAllowedPackageIds([]);

      setRefereeRewardType("discount");
      setRefereeRewardCalcType("fixed");
      setRefereeRewardValue("100");
      setRefereePackageScope("any");
      setRefereeAllowedPackageIds([]);
    }
    setFormError(null);
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const togglePackageSelection = (list, setList, pkgId) => {
    if (list.includes(pkgId)) {
      setList(list.filter((id) => id !== pkgId));
    } else {
      setList([...list, pkgId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError("Program name is required.");
      return;
    }

    const finalCategory = isCustomCategory
      ? customCategoryInput.trim().toLowerCase()
      : packageCategory.trim().toLowerCase();

    if (referrerRewardType !== "none" && referrerRewardCalcType === "percentage") {
      const refVal = parseFloat(referrerRewardValue);
      if (isNaN(refVal) || refVal <= 0 || refVal > 100) {
        setFormError("Referrer reward percentage must be greater than 0% and less than or equal to 100%.");
        return;
      }
    }

    if (refereeRewardType !== "none" && refereeRewardCalcType === "percentage") {
      const refVal = parseFloat(refereeRewardValue);
      if (isNaN(refVal) || refVal <= 0 || refVal > 100) {
        setFormError("Referee reward percentage must be greater than 0% and less than or equal to 100%.");
        return;
      }
    }

    setSaving(true);

    try {
      const payload = {
        name: name.trim(),
        packageCategory: finalCategory,
        startDate: startDate ? new Date(startDate).toISOString() : null,
        endDate: endDate ? new Date(endDate).toISOString() : null,
        programStatus,
        maxTotalRedemptions: maxTotalRedemptions ? parseInt(maxTotalRedemptions, 10) : null,
        maxRedemptionsPerUser: maxRedemptionsPerUser ? parseInt(maxRedemptionsPerUser, 10) : null,
        rewardOnSignup,

        // Referrer
        referrerRewardType,
        referrerRewardCalcType: referrerRewardType === "none" ? null : referrerRewardCalcType,
        referrerRewardValue: referrerRewardType === "none" ? 0 : parseFloat(referrerRewardValue) || 0,
        referrerPackageScope,
        referrerTriggerPackageIds,
        referrerAllowedPackageIds: referrerPackageScope === "custom" ? referrerAllowedPackageIds : [],

        // Referee
        refereeRewardType,
        refereeRewardCalcType: refereeRewardType === "none" ? null : refereeRewardCalcType,
        refereeRewardValue: refereeRewardType === "none" ? 0 : parseFloat(refereeRewardValue) || 0,
        refereePackageScope,
        refereeAllowedPackageIds: refereePackageScope === "custom" ? refereeAllowedPackageIds : [],
      };

      if (isEditMode) {
        await referralApi.updateProgram(initialData.id, payload);
        toast.success("Referral program updated successfully!");
      } else {
        await referralApi.createProgram(payload);
        toast.success("Referral program created successfully!");
      }

      onSaved?.();
      onClose();
    } catch (err) {
      console.error("Error saving referral program:", err);
      const serverMsg =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.msg ||
        err?.response?.data?.errors?.[0]?.message ||
        err?.message ||
        "Failed to save referral program.";
      setFormError(serverMsg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl border border-[#CBD5E0] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#CBD5E0] bg-[#FAF6EC]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0B1E3F] flex items-center justify-center text-[#C9A24B]">
              <Share2 size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0B1E3F]">
                {isEditMode ? `Edit Program: ${initialData.name}` : "Create New Referral Program"}
              </h2>
              <p className="text-xs text-[#718096]">
                Define reward values, triggers, allowed packages, and redemption limits.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#A0AEC0] hover:text-[#0B1E3F] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {formError && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              <AlertCircle size={16} className="shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* 1. Basic Info */}
          <div className={sectionCardCls}>
            <h3 className="text-xs font-bold text-[#0B1E3F] uppercase tracking-wider border-b border-[#CBD5E0] pb-2 flex items-center gap-1.5">
              <Layers size={14} className="text-[#C9A24B]" />
              Basic Program Details
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-semibold text-[#0B1E3F]">
                  Program Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Primary Membership Drive 2026"
                  className={inputCls}
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-[#0B1E3F]">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={toggleCustomMode}
                    className="text-[11px] font-semibold text-[#C9A24B] hover:underline"
                  >
                    {isCustomCategory ? "Select from list" : "+ Custom Category"}
                  </button>
                </div>

                {!isCustomCategory ? (
                  <select
                    value={packageCategory}
                    onChange={handleSelectChange}
                    className={inputCls}
                  >
                    {categoriesList.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.replace(/_/g, " ").toUpperCase()}
                      </option>
                    ))}
                    <option value="__custom__">+ Add Custom Category...</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={customCategoryInput}
                    onChange={handleCustomInputChange}
                    placeholder="e.g. all, vip_events"
                    className={inputCls}
                  />
                )}
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#0B1E3F]">Program Status</label>
                <select
                  value={programStatus}
                  onChange={(e) => setProgramStatus(e.target.value)}
                  className={inputCls}
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Start & End Dates */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#0B1E3F]">Start Date (Optional)</label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={inputCls}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#0B1E3F]">End Date (Optional)</label>
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          {/* 2. Redemption Limits */}
          <div className={sectionCardCls}>
            <h3 className="text-xs font-bold text-[#0B1E3F] uppercase tracking-wider border-b border-[#CBD5E0] pb-2 flex items-center gap-1.5">
              <Clock size={14} className="text-[#C9A24B]" />
              Redemption & Limits
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#0B1E3F]">
                  Max Program Redemptions (Leave empty for unlimited)
                </label>
                <input
                  type="number"
                  min="0"
                  value={maxTotalRedemptions}
                  onChange={(e) => setMaxTotalRedemptions(e.target.value)}
                  placeholder="e.g. 500"
                  className={inputCls}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#0B1E3F]">
                  Max Redemptions Per User (Leave empty for unlimited)
                </label>
                <input
                  type="number"
                  min="0"
                  value={maxRedemptionsPerUser}
                  onChange={(e) => setMaxRedemptionsPerUser(e.target.value)}
                  placeholder="e.g. 5"
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          {/* 3. Reward Trigger Settings */}
          <div className={sectionCardCls}>
            <h3 className="text-xs font-bold text-[#0B1E3F] uppercase tracking-wider border-b border-[#CBD5E0] pb-2 flex items-center gap-1.5">
              <Gift size={14} className="text-[#C9A24B]" />
              Reward Payout Trigger
            </h3>
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-[#0B1E3F]">When should rewards be issued?</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRewardOnSignup(true)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${rewardOnSignup
                      ? "border-[#0B1E3F] bg-[#0B1E3F] text-white shadow-sm"
                      : "border-[#CBD5E0] bg-[#FAF6EC] text-[#4A5568] hover:bg-white"
                    }`}
                >
                  <div>On Signup / Code Application</div>
                  <p className="text-[10px] opacity-75 mt-1 font-normal">
                    Issued immediately when the referee applies the referral code.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setRewardOnSignup(false)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${!rewardOnSignup
                      ? "border-[#0B1E3F] bg-[#0B1E3F] text-white shadow-sm"
                      : "border-[#CBD5E0] bg-[#FAF6EC] text-[#4A5568] hover:bg-white"
                    }`}
                >
                  <div>On Package Purchase</div>
                  <p className="text-[10px] opacity-75 mt-1 font-normal">
                    Issued only when the referee purchases a qualifying trigger package.
                  </p>
                </button>
              </div>

              {/* Trigger packages select */}
              <div className="space-y-2 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="block text-xs font-semibold text-[#0B1E3F]">
                    Referrer Trigger Packages (Select packages that trigger reward generation on purchase)
                  </label>
                  <div className="flex items-center gap-1.5 bg-[#FAF6EC] border border-[#CBD5E0] rounded-lg px-2.5 py-1 w-full sm:w-48">
                    <Search size={12} className="text-[#A0AEC0] shrink-0" />
                    <input
                      type="text"
                      placeholder="Search packages..."
                      value={triggerPackageSearch.searchQuery}
                      onChange={(e) => triggerPackageSearch.setSearchQuery(e.target.value)}
                      className="text-xs bg-transparent outline-none text-[#1A202C] placeholder:text-[#A0AEC0] w-full"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto p-2 border border-[#CBD5E0] rounded-xl bg-[#FAF6EC]">
                  {triggerPackageSearch.filteredPackages.length === 0 ? (
                    <div className="col-span-full py-4 text-center text-xs text-[#718096]">
                      No matching packages found
                    </div>
                  ) : (
                    triggerPackageSearch.filteredPackages.map((pkg) => {
                      const selected = referrerTriggerPackageIds.includes(pkg.id);
                      return (
                        <button
                          type="button"
                          key={pkg.id}
                          onClick={() => togglePackageSelection(referrerTriggerPackageIds, setReferrerTriggerPackageIds, pkg.id)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-left border flex items-center justify-between transition-colors ${selected
                              ? "bg-[#0B1E3F] text-white border-[#0B1E3F]"
                              : "bg-white text-[#4A5568] border-[#CBD5E0] hover:bg-[#E2E8F0]"
                            }`}
                        >
                          <span className="truncate">{pkg.name}</span>
                          {selected && <Check size={12} className="shrink-0 ml-1" />}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 4. Referrer Reward Rules */}
          <div className={sectionCardCls}>
            <h3 className="text-xs font-bold text-[#0B1E3F] uppercase tracking-wider border-b border-[#CBD5E0] pb-2 flex items-center gap-1.5">
              <Gift size={14} className="text-[#C9A24B]" />
              Referrer Reward (Person sharing the code)
            </h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#0B1E3F]">Reward Type</label>
                <select
                  value={referrerRewardType}
                  onChange={(e) => setReferrerRewardType(e.target.value)}
                  className={inputCls}
                >
                  <option value="discount">Discount Coupon</option>
                  <option value="wallet">Wallet Cashback</option>
                  <option value="none">None (No Referrer Reward)</option>
                </select>
              </div>

              {referrerRewardType !== "none" && (
                <>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#0B1E3F]">Calculation</label>
                    <select
                      value={referrerRewardCalcType}
                      onChange={(e) => setReferrerRewardCalcType(e.target.value)}
                      className={inputCls}
                    >
                      <option value="fixed">Fixed Amount (₹)</option>
                      <option value="percentage">Percentage (%)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#0B1E3F]">Value</label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={referrerRewardValue}
                      onChange={(e) => setReferrerRewardValue(e.target.value)}
                      placeholder={referrerRewardCalcType === "fixed" ? "e.g. 200" : "e.g. 10"}
                      className={inputCls}
                    />
                  </div>
                </>
              )}
            </div>

            {referrerRewardType !== "none" && (
              <div className="space-y-2 pt-1 border-t border-[#CBD5E0]">
                <label className="block text-xs font-semibold text-[#0B1E3F]">Package Scope</label>
                <div className="flex gap-4">
                  <label className="inline-flex items-center gap-1.5 text-xs text-[#1A202C]">
                    <input
                      type="radio"
                      name="referrerScope"
                      checked={referrerPackageScope === "any"}
                      onChange={() => setReferrerPackageScope("any")}
                    />
                    Usable on Any Package
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-xs text-[#1A202C]">
                    <input
                      type="radio"
                      name="referrerScope"
                      checked={referrerPackageScope === "custom"}
                      onChange={() => setReferrerPackageScope("custom")}
                    />
                    Restricted to Custom Packages
                  </label>
                </div>

                {referrerPackageScope === "custom" && (
                  <div className="space-y-1.5 mt-2">
                    <div className="flex items-center gap-1.5 bg-[#FAF6EC] border border-[#CBD5E0] rounded-lg px-2.5 py-1 w-full sm:w-48">
                      <Search size={12} className="text-[#A0AEC0] shrink-0" />
                      <input
                        type="text"
                        placeholder="Search packages..."
                        value={referrerPackageSearch.searchQuery}
                        onChange={(e) => referrerPackageSearch.setSearchQuery(e.target.value)}
                        className="text-xs bg-transparent outline-none text-[#1A202C] placeholder:text-[#A0AEC0] w-full"
                      />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-32 overflow-y-auto p-2 border border-[#CBD5E0] rounded-xl bg-[#FAF6EC]">
                      {referrerPackageSearch.filteredPackages.length === 0 ? (
                        <div className="col-span-full py-4 text-center text-xs text-[#718096]">
                          No matching packages found
                        </div>
                      ) : (
                        referrerPackageSearch.filteredPackages.map((pkg) => {
                          const selected = referrerAllowedPackageIds.includes(pkg.id);
                          return (
                            <button
                              type="button"
                              key={pkg.id}
                              onClick={() => togglePackageSelection(referrerAllowedPackageIds, setReferrerAllowedPackageIds, pkg.id)}
                              className={`px-2 py-1 rounded text-xs font-medium text-left border flex items-center justify-between transition-colors ${selected
                                  ? "bg-[#0B1E3F] text-white border-[#0B1E3F]"
                                  : "bg-white text-[#4A5568] border-[#CBD5E0]"
                                }`}
                            >
                              <span className="truncate">{pkg.name}</span>
                              {selected && <Check size={12} className="ml-1 shrink-0" />}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 5. Referee Reward Rules */}
          <div className={sectionCardCls}>
            <h3 className="text-xs font-bold text-[#0B1E3F] uppercase tracking-wider border-b border-[#CBD5E0] pb-2 flex items-center gap-1.5">
              <Gift size={14} className="text-[#C9A24B]" />
              Referee Reward (Person applying the code)
            </h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#0B1E3F]">Reward Type</label>
                <select
                  value={refereeRewardType}
                  onChange={(e) => setRefereeRewardType(e.target.value)}
                  className={inputCls}
                >
                  <option value="discount">Discount Coupon</option>
                  <option value="wallet">Wallet Cashback</option>
                  <option value="none">None (No Referee Reward)</option>
                </select>
              </div>

              {refereeRewardType !== "none" && (
                <>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#0B1E3F]">Calculation</label>
                    <select
                      value={refereeRewardCalcType}
                      onChange={(e) => setRefereeRewardCalcType(e.target.value)}
                      className={inputCls}
                    >
                      <option value="fixed">Fixed Amount (₹)</option>
                      <option value="percentage">Percentage (%)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#0B1E3F]">Value</label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={refereeRewardValue}
                      onChange={(e) => setRefereeRewardValue(e.target.value)}
                      placeholder={refereeRewardCalcType === "fixed" ? "e.g. 100" : "e.g. 5"}
                      className={inputCls}
                    />
                  </div>
                </>
              )}
            </div>

            {refereeRewardType !== "none" && (
              <div className="space-y-2 pt-1 border-t border-[#CBD5E0]">
                <label className="block text-xs font-semibold text-[#0B1E3F]">Package Scope</label>
                <div className="flex gap-4">
                  <label className="inline-flex items-center gap-1.5 text-xs text-[#1A202C]">
                    <input
                      type="radio"
                      name="refereeScope"
                      checked={refereePackageScope === "any"}
                      onChange={() => setRefereePackageScope("any")}
                    />
                    Usable on Any Package
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-xs text-[#1A202C]">
                    <input
                      type="radio"
                      name="refereeScope"
                      checked={refereePackageScope === "custom"}
                      onChange={() => setRefereePackageScope("custom")}
                    />
                    Restricted to Custom Packages
                  </label>
                </div>

                {refereePackageScope === "custom" && (
                  <div className="space-y-1.5 mt-2">
                    <div className="flex items-center gap-1.5 bg-[#FAF6EC] border border-[#CBD5E0] rounded-lg px-2.5 py-1 w-full sm:w-48">
                      <Search size={12} className="text-[#A0AEC0] shrink-0" />
                      <input
                        type="text"
                        placeholder="Search packages..."
                        value={refereePackageSearch.searchQuery}
                        onChange={(e) => refereePackageSearch.setSearchQuery(e.target.value)}
                        className="text-xs bg-transparent outline-none text-[#1A202C] placeholder:text-[#A0AEC0] w-full"
                      />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-32 overflow-y-auto p-2 border border-[#CBD5E0] rounded-xl bg-[#FAF6EC]">
                      {refereePackageSearch.filteredPackages.length === 0 ? (
                        <div className="col-span-full py-4 text-center text-xs text-[#718096]">
                          No matching packages found
                        </div>
                      ) : (
                        refereePackageSearch.filteredPackages.map((pkg) => {
                          const selected = refereeAllowedPackageIds.includes(pkg.id);
                          return (
                            <button
                              type="button"
                              key={pkg.id}
                              onClick={() => togglePackageSelection(refereeAllowedPackageIds, setRefereeAllowedPackageIds, pkg.id)}
                              className={`px-2 py-1 rounded text-xs font-medium text-left border flex items-center justify-between transition-colors ${selected
                                  ? "bg-[#0B1E3F] text-white border-[#0B1E3F]"
                                  : "bg-white text-[#4A5568] border-[#CBD5E0]"
                                }`}
                            >
                              <span className="truncate">{pkg.name}</span>
                              {selected && <Check size={12} className="ml-1 shrink-0" />}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#CBD5E0]">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-5 py-2.5 text-xs font-semibold text-[#4A5568] bg-[#FAF6EC] hover:bg-[#E2E8F0] rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#0B1E3F] hover:bg-[#152d5a] rounded-xl transition-colors shadow-sm disabled:opacity-50"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {isEditMode ? "Update Program" : "Create Program"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
