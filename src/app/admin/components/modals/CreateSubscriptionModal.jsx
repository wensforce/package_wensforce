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
import { useFormState } from "../../hooks/useFormState";

import { userApi } from "../../users/apis/user.api";
import { packageApi } from "../../packages/apis/packages.api";
import { subscriptionApi } from "../../subscriptions/apis/subscription.api";

const COUNTRY_CODES = [
  { code: "+91", flag: "🇮🇳", name: "India" },
  { code: "+1", flag: "🇺🇸", name: "United States" },
  { code: "+1", flag: "🇨🇦", name: "Canada" },
  { code: "+44", flag: "🇬🇧", name: "United Kingdom" },
  { code: "+61", flag: "🇦🇺", name: "Australia" },
  { code: "+971", flag: "🇦🇪", name: "UAE" },
  { code: "+966", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "+65", flag: "🇸🇬", name: "Singapore" },
  { code: "+60", flag: "🇲🇾", name: "Malaysia" },
  { code: "+49", flag: "🇩🇪", name: "Germany" },
  { code: "+33", flag: "🇫🇷", name: "France" },
  { code: "+81", flag: "🇯🇵", name: "Japan" },
  { code: "+86", flag: "🇨🇳", name: "China" },
  { code: "+92", flag: "🇵🇰", name: "Pakistan" },
  { code: "+880", flag: "🇧🇩", name: "Bangladesh" },
  { code: "+94", flag: "🇱🇰", name: "Sri Lanka" },
  { code: "+977", flag: "🇳🇵", name: "Nepal" },
  { code: "+27", flag: "🇿🇦", name: "South Africa" },
  { code: "+55", flag: "🇧🇷", name: "Brazil" },
  { code: "+7", flag: "🇷🇺", name: "Russia" },
];

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
  const { form, setForm, handleFieldChange } = useFormState(INITIAL_FORM);
  const [userSearch, setUserSearch] = useState("");
  const [debouncedUserSearch, setDebouncedUserSearch] = useState("");
  const [userOptions, setUserOptions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // New user registration state
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+91");
  const [newUserForm, setNewUserForm] = useState({
    mobileNumber: "",
    name: "",
    city: "",
  });

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
    Promise.resolve().then(() => {
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
      setIsCreatingUser(false);
      setSelectedCountryCode("+91");
      setNewUserForm({
        mobileNumber: "",
        name: "",
        city: "",
      });
    });
  }, [open, setForm]);

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
      Promise.resolve().then(() => {
        setUserOptions([]);
        setLoadingUsers(false);
      });
      return;
    }

    let cancelled = false;

    async function fetchUsers() {
      Promise.resolve().then(() => {
        setLoadingUsers(true);
      });
      try {
        const rows = await userApi.searchUsers(query);
        if (!cancelled) {
          Promise.resolve().then(() => {
            setUserOptions(rows);
          });
        }
      } catch {
        if (!cancelled) {
          Promise.resolve().then(() => {
            setUserOptions([]);
          });
        }
      } finally {
        if (!cancelled) {
          Promise.resolve().then(() => {
            setLoadingUsers(false);
          });
        }
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
      Promise.resolve().then(() => {
        setPackageOptions([]);
        setLoadingPackages(false);
      });
      return;
    }

    let cancelled = false;

    async function fetchPackages() {
      Promise.resolve().then(() => {
        setLoadingPackages(true);
      });
      try {
        const rows = await packageApi.searchPackages(query);
        if (!cancelled) {
          Promise.resolve().then(() => {
            setPackageOptions(rows);
          });
        }
      } catch {
        if (!cancelled) {
          Promise.resolve().then(() => {
            setPackageOptions([]);
          });
        }
      } finally {
        if (!cancelled) {
          Promise.resolve().then(() => {
            setLoadingPackages(false);
          });
        }
      }
    }

    fetchPackages();
    return () => {
      cancelled = true;
    };
  }, [debouncedPackageSearch, open]);

  function validateForm() {
    if (isCreatingUser) {
      const mobile = newUserForm.mobileNumber.trim();
      if (!mobile) return "New user mobile number is required.";
      const cleanMobile = mobile.replace(/[\s\-()+]/g, "");
      if (cleanMobile.length < 5 || !/^\d+$/.test(cleanMobile)) {
        return "Please enter a valid mobile number.";
      }
    } else {
      if (!selectedUser?.id) return "Please search and select a user.";
    }

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
      let finalUserId = selectedUser?.id;

      // Handle user registration on the fly
      if (isCreatingUser) {
        // Clean mobile number segment and prepend country code
        const cleanMobileBody = newUserForm.mobileNumber.trim().replace(/[\s\-()+]/g, "");
        const cleanMobile = selectedCountryCode + cleanMobileBody;

        const createdUser = await userApi.quickCreateUser({
          mobileNumber: cleanMobile,
          name: newUserForm.name.trim() || undefined,
          city: newUserForm.city.trim() || undefined,
        });

        if (!createdUser || !createdUser.id) {
          throw new Error("Failed to register new user profile.");
        }
        finalUserId = createdUser.id;
      }

      const payload = {
        userId: Number(finalUserId),
        packageId: Number(selectedPackage.id),
        startDate: new Date(form.startDate).toISOString(),
        paymentId: form.paymentId.trim(),
      };

      await subscriptionApi.createSubscription(payload);
      onCreated?.();
      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message || err?.message || "Failed to create subscription.",
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
      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          {/* User Search or Quick Create Card */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label className="block text-sm font-semibold text-[#0B1E3F]">
                {isCreatingUser ? "Register New User" : "Select User"} <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsCreatingUser(!isCreatingUser);
                  setError(null);
                }}
                disabled={submitting}
                className="text-xs font-semibold text-[#C9A24B] hover:underline hover:text-[#b0883b] transition-colors"
              >
                {isCreatingUser ? "← Search Existing" : "+ Register New User"}
              </button>
            </div>
            <div className="rounded-xl border border-[#CBD5E0] bg-[#FAF6EC]/50 p-4 space-y-4 min-h-[220px] flex flex-col justify-start">
              {!isCreatingUser ? (
                <>
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
                    className={`rounded-lg ${loadingUsers || userSearch.trim() ? "border" : ""} border-[#CBD5E0] bg-white max-h-40 overflow-y-auto`}
                  >
                    {loadingUsers ? (
                      <div className="flex items-center gap-2 text-xs text-[#4A5568] px-3 py-2.5">
                        <Loader2 size={14} className="animate-spin text-[#C9A24B]" /> Searching
                        users...
                      </div>
                    ) : !userSearch.trim() ? null : userOptions.length === 0 ? (
                      <div className="p-3 text-center space-y-2">
                        <p className="text-xs text-gray-500">No users found.</p>
                        <button
                          type="button"
                          onClick={() => {
                            setIsCreatingUser(true);
                            const cleanSearch = userSearch.trim();
                            let prefillMobile = cleanSearch;
                            let prefillCode = "+91";

                            for (const c of COUNTRY_CODES) {
                              if (cleanSearch.startsWith(c.code)) {
                                prefillCode = c.code;
                                prefillMobile = cleanSearch.slice(c.code.length);
                                break;
                              }
                            }

                            setSelectedCountryCode(prefillCode);
                            setNewUserForm((prev) => ({
                              ...prev,
                              mobileNumber: prefillMobile,
                            }));
                            setUserSearch("");
                            setUserOptions([]);
                          }}
                          className="text-xs font-bold text-[#0B1E3F] hover:underline"
                        >
                          Create user with &quot;{userSearch}&quot;?
                        </button>
                      </div>
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
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#CBD5E0] bg-white px-3 py-1.5 text-xs text-[#1A202C] self-start mt-2">
                      <UserRound size={12} className="text-[#C9A24B]" />
                      <span
                        className="max-w-[150px] truncate"
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
                </>
              ) : (
                <div className="space-y-3 animate-fade-in">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-[#4A5568] uppercase tracking-wider">
                      Mobile <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={selectedCountryCode}
                        onChange={(e) => setSelectedCountryCode(e.target.value)}
                        disabled={submitting}
                        className="rounded-lg border border-[#CBD5E0] bg-white px-2 py-1.5 text-xs text-[#1A202C] outline-none focus:border-[#C9A24B] shrink-0 transition-colors"
                        style={{ width: "90px" }}
                      >
                        {COUNTRY_CODES.map((c, idx) => (
                          <option key={`${c.code}-${c.name}-${idx}`} value={c.code}>
                            {c.flag} {c.code}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={newUserForm.mobileNumber}
                        onChange={(e) =>
                          setNewUserForm({
                            ...newUserForm,
                            mobileNumber: e.target.value,
                          })
                        }
                        placeholder="e.g. 9999999999"
                        disabled={submitting}
                        className="w-full rounded-lg border border-[#CBD5E0] bg-white px-3 py-1.5 text-xs text-[#1A202C] outline-none focus:border-[#C9A24B] disabled:opacity-60"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-[#4A5568] uppercase tracking-wider">
                        Name
                      </label>
                      <input
                        type="text"
                        value={newUserForm.name}
                        onChange={(e) =>
                          setNewUserForm({
                            ...newUserForm,
                            name: e.target.value,
                          })
                        }
                        placeholder="e.g. John Doe"
                        disabled={submitting}
                        className="w-full rounded-lg border border-[#CBD5E0] bg-white px-3 py-1.5 text-xs text-[#1A202C] outline-none focus:border-[#C9A24B] disabled:opacity-60"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-[#4A5568] uppercase tracking-wider">
                        City
                      </label>
                      <input
                        type="text"
                        value={newUserForm.city}
                        onChange={(e) =>
                          setNewUserForm({
                            ...newUserForm,
                            city: e.target.value,
                          })
                        }
                        placeholder="e.g. Mumbai"
                        disabled={submitting}
                        className="w-full rounded-lg border border-[#CBD5E0] bg-white px-3 py-1.5 text-xs text-[#1A202C] outline-none focus:border-[#C9A24B] disabled:opacity-60"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Package Search Card */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#0B1E3F]">
              Search Package <span className="text-red-500">*</span>
            </label>
            <div className="rounded-xl border border-[#CBD5E0] bg-[#FAF6EC]/50 p-4 space-y-4 min-h-[220px] flex flex-col justify-start">
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
                className={`rounded-lg ${loadingPackages || packageSearch.trim() ? "border" : ""} border-[#CBD5E0] bg-white max-h-40 overflow-y-auto`}
              >
                {loadingPackages ? (
                  <div className="flex items-center gap-2 text-xs text-[#4A5568] px-3 py-2.5">
                    <Loader2 size={14} className="animate-spin text-[#C9A24B]" /> Searching
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
                <div className="inline-flex items-center gap-2 rounded-full border border-[#CBD5E0] bg-white px-3 py-1.5 text-xs text-[#1A202C] self-start mt-2">
                  <Package size={12} className="text-[#C9A24B]" />
                  <span
                    className="max-w-[150px] truncate"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#CBD5E0] pt-4">
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
              className="w-full text-sm rounded-lg border border-[#CBD5E0] bg-[#FAF6EC]/30 px-3 py-2.5 text-[#1A202C] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 disabled:opacity-60"
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
              className="w-full text-sm rounded-lg border border-[#CBD5E0] bg-[#FAF6EC]/30 px-3 py-2.5 text-[#1A202C] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 disabled:opacity-60"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#CBD5E0]">
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
