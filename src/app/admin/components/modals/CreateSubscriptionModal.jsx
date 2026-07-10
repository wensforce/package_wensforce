"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Loader2,
  Package,
  Search,
  UserRound,
  X,
  PlusCircle,
} from "lucide-react";
import Modal from "../Modal";

import { userApi } from "../../users/apis/user.api";
import { packageApi } from "../../packages/apis/packages.api";
import { subscriptionApi } from "../../subscriptions/apis/subscription.api";
const INITIAL_FORM = {
  startDate: "",
  paymentId: "",
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

export default function CreateSubscriptionModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [userSearch, setUserSearch] = useState("");
  const [debouncedUserSearch, setDebouncedUserSearch] = useState("");
  const [userOptions, setUserOptions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [packageSearch, setPackageSearch] = useState("");
  const [debouncedPackageSearch, setDebouncedPackageSearch] = useState("");
  const [packageOptions, setPackageOptions] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loadingPackages, setLoadingPackages] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const minStartDate = useMemo(() => toLocalDateTimeValue(new Date()), []);

  useEffect(() => {
    if (!open) return;
    setForm(INITIAL_FORM);
    setUserSearch("");
    setDebouncedUserSearch("");
    setUserOptions([]);
    setSelectedUser(null);
    setPackageSearch("");
    setDebouncedPackageSearch("");
    setPackageOptions([]);
    setSelectedPackage(null);
    setError(null);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => setDebouncedUserSearch(userSearch.trim()), 400);
    return () => clearTimeout(t);
  }, [userSearch, open]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(
      () => setDebouncedPackageSearch(packageSearch.trim()),
      400,
    );
    return () => clearTimeout(t);
  }, [packageSearch, open]);

  useEffect(() => {
    if (!open) return;
    const query = debouncedUserSearch;
    if (!query) {
      setUserOptions([]);
      setLoadingUsers(false);
      return;
    }

    let cancelled = false;

    async function fetchUsers() {
      setLoadingUsers(true);
      try {
        const rows = await userApi.searchUsers(query);
        if (!cancelled) setUserOptions(rows);
      } catch {
        if (!cancelled) setUserOptions([]);
      } finally {
        if (!cancelled) setLoadingUsers(false);
      }
    }

    fetchUsers();
    return () => {
      cancelled = true;
    };
  }, [debouncedUserSearch, open]);

  useEffect(() => {
    if (!open) return;
    const query = debouncedPackageSearch;
    if (!query) {
      setPackageOptions([]);
      setLoadingPackages(false);
      return;
    }

    let cancelled = false;

    async function fetchPackages() {
      setLoadingPackages(true);
      try {
        const rows = await packageApi.searchPackages(query);
        if (!cancelled) setPackageOptions(rows);
      } catch {
        if (!cancelled) setPackageOptions([]);
      } finally {
        if (!cancelled) setLoadingPackages(false);
      }
    }

    fetchPackages();
    return () => {
      cancelled = true;
    };
  }, [debouncedPackageSearch, open]);

  function handleFieldChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validateForm() {
    if (!selectedUser?.id) return "Please search and select a user.";
    if (!selectedPackage?.id) return "Please search and select a package.";
    if (!form.startDate) return "Start date is required.";
    const start = new Date(form.startDate);
    if (Number.isNaN(start.getTime())) return "Start date is invalid.";
    if (!form.paymentId.trim()) return "Payment reference is required.";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        userId: Number(selectedUser.id),
        packageId: Number(selectedPackage.id),
        startDate: new Date(form.startDate).toISOString(),
        paymentId: form.paymentId.trim(),
      };

      await subscriptionApi.createSubscription(payload);
      onCreated?.();
      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to create subscription.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        if (!submitting) onClose();
      }}
      title="New Subscription"
      description="Create a subscription by selecting user and package."
      size="xl"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#0B1E3F]">
              Search User <span className="text-red-500">*</span>
            </label>
            <div className="rounded-xl border border-[#CBD5E0] bg-[#FAF6EC] p-3 space-y-3">
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0AEC0]"
                />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Type name, email or mobile"
                  disabled={submitting}
                  className="w-full rounded-lg border border-[#CBD5E0] bg-white pl-9 pr-3 py-2 text-sm text-[#1A202C] placeholder:text-[#A0AEC0] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 disabled:opacity-60"
                />
              </div>

              <div
                className={`rounded-lg ${loadingUsers || userSearch.trim() ? "border" : ""} border-[#CBD5E0] bg-white max-h-44 overflow-y-auto`}
              >
                {loadingUsers ? (
                  <div className="flex items-center gap-2 text-xs text-[#4A5568] px-3 py-2.5">
                    <Loader2 size={14} className="animate-spin" /> Searching
                    users...
                  </div>
                ) : !userSearch.trim() ? null : userOptions.length === 0 ? (
                  <p className="text-xs text-[#4A5568] px-3 py-2.5">
                    No users found.
                  </p>
                ) : (
                  userOptions.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => {
                        setSelectedUser(user);
                        setUserSearch("");
                        setUserOptions([]);
                      }}
                      disabled={submitting}
                      className="w-full flex items-center justify-between gap-3 px-3 py-2.5 text-left text-sm text-[#1A202C] hover:bg-[#FAF6EC] transition-colors disabled:opacity-60"
                    >
                      <span className="truncate">
                        {user.name ||
                          user.email ||
                          user.mobileNumber ||
                          `User #${user.id}`}
                      </span>
                      <span className="text-xs text-[#4A5568] shrink-0">
                        #{user.id}
                      </span>
                    </button>
                  ))
                )}
              </div>

              {selectedUser && (
                <div className="inline-flex items-center gap-2 rounded-full border border-[#CBD5E0] bg-white px-3 py-1.5 text-xs text-[#1A202C]">
                  <UserRound size={12} />
                  <span
                    className="max-w-45 truncate"
                    title={
                      selectedUser.name ||
                      selectedUser.email ||
                      selectedUser.mobileNumber ||
                      `User #${selectedUser.id}`
                    }
                  >
                    {selectedUser.name ||
                      selectedUser.email ||
                      selectedUser.mobileNumber ||
                      `User #${selectedUser.id}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedUser(null)}
                    disabled={submitting}
                    className="text-[#718096] hover:text-red-600 transition-colors"
                    aria-label="Remove selected user"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#0B1E3F]">
              Search Package <span className="text-red-500">*</span>
            </label>
            <div className="rounded-xl border border-[#CBD5E0] bg-[#FAF6EC] p-3 space-y-3">
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0AEC0]"
                />
                <input
                  type="text"
                  value={packageSearch}
                  onChange={(e) => setPackageSearch(e.target.value)}
                  placeholder="Type package name"
                  disabled={submitting}
                  className="w-full rounded-lg border border-[#CBD5E0] bg-white pl-9 pr-3 py-2 text-sm text-[#1A202C] placeholder:text-[#A0AEC0] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 disabled:opacity-60"
                />
              </div>

              <div
                className={`rounded-lg ${loadingPackages || packageSearch.trim() ? "border" : ""} border-[#CBD5E0] bg-white max-h-44 overflow-y-auto`}
              >
                {loadingPackages ? (
                  <div className="flex items-center gap-2 text-xs text-[#4A5568] px-3 py-2.5">
                    <Loader2 size={14} className="animate-spin" /> Searching
                    packages...
                  </div>
                ) : !packageSearch.trim() ? null : packageOptions.length ===
                  0 ? (
                  <p className="text-xs text-[#4A5568] px-3 py-2.5">
                    No packages found.
                  </p>
                ) : (
                  packageOptions.map((pkg) => (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => {
                        setSelectedPackage(pkg);
                        setPackageSearch("");
                        setPackageOptions([]);
                      }}
                      disabled={submitting}
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

              {selectedPackage && (
                <div className="inline-flex items-center gap-2 rounded-full border border-[#CBD5E0] bg-white px-3 py-1.5 text-xs text-[#1A202C]">
                  <Package size={12} />
                  <span
                    className="max-w-45 truncate"
                    title={
                      selectedPackage.name || `Package #${selectedPackage.id}`
                    }
                  >
                    {selectedPackage.name || `Package #${selectedPackage.id}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedPackage(null)}
                    disabled={submitting}
                    className="text-[#718096] hover:text-red-600 transition-colors"
                    aria-label="Remove selected package"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#0B1E3F]">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              name="startDate"
              min={minStartDate}
              value={form.startDate}
              onChange={handleFieldChange}
              disabled={submitting}
              className="w-full text-sm rounded-lg border border-[#CBD5E0] bg-[#FAF6EC] px-3 py-2.5 text-[#1A202C] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 disabled:opacity-60"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#0B1E3F]">
              Payment Reference <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="paymentId"
              value={form.paymentId}
              onChange={handleFieldChange}
              placeholder="e.g. cf_pay_xxx"
              disabled={submitting}
              className="w-full text-sm rounded-lg border border-[#CBD5E0] bg-[#FAF6EC] px-3 py-2.5 text-[#1A202C] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 disabled:opacity-60"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="text-sm font-medium text-[#4A5568] border border-[#CBD5E0] bg-white rounded-lg px-4 py-2 hover:bg-[#FAF6EC] transition-colors disabled:opacity-50"
          >
            Close
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-[#0B1E3F] rounded-lg px-5 py-2 hover:bg-[#152d5a] transition-colors disabled:opacity-60"
          >
            {submitting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <PlusCircle size={14} />
            )}
            {submitting ? "Creating..." : "Create Subscription"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
