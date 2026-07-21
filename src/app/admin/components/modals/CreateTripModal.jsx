"use client";

import { useEffect, useRef, useState } from "react";
import {
  Loader2,
  PlusCircle,
  Search,
  UserRound,
  Repeat,
  ConciergeBell,
  X,
  PackageCheck,
  ShoppingBag,
  IndianRupee,
  BadgePlus,
} from "lucide-react";
import Modal from "../Modal";
import SubscriptionNotActiveModal from "@/app/components/SubscriptionNotActiveModal";

import { subscriptionApi } from "../../subscriptions/apis/subscription.api";
import { userApi } from "../../users/apis/user.api";
import { servicesApi } from "../../services/apis/services.api";
import { tripApi } from "../../trips/apis/trips.api";

const INITIAL_FORM = {
  assignmentId: "",
  pickupLocation: "",
  dropLocation: "",
  tripDate: "",
  tripType: "airport-transfer",
};

const TRIP_TYPE_OPTIONS = ["airport-transfer", "8Hour/80Km", "Full day"];

function toDateInputValue(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function formatPrice(price) {
  if (price == null || price === "") return null;
  const num = Number(price);
  if (Number.isNaN(num)) return null;
  return num.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export default function CreateTripModal({
  open,
  onClose,
  onCreated,
  trip,
  onUpdated,
}) {
  const isEditMode = Boolean(trip);
  const [form, setForm] = useState(INITIAL_FORM);

  // ── Subscription search ──────────────────────────────────────────────────
  const [subscriptionSearch, setSubscriptionSearch] = useState("");
  const [debouncedSubscriptionSearch, setDebouncedSubscriptionSearch] =
    useState("");
  const [subscriptionOptions, setSubscriptionOptions] = useState([]);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(false);

  // ── User search ──────────────────────────────────────────────────────────
  const [userSearch, setUserSearch] = useState("");
  const [debouncedUserSearch, setDebouncedUserSearch] = useState("");
  const [userOptions, setUserOptions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // ── Included package services ────────────────────────────────────────────
  const [serviceQuery, setServiceQuery] = useState("");
  const [debouncedServiceQuery, setDebouncedServiceQuery] = useState("");
  const [packageServices, setPackageServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [selectedServiceIds, setSelectedServiceIds] = useState(new Set());

  // ── Additional (not-included) services ───────────────────────────────────
  const [additionalServiceQuery, setAdditionalServiceQuery] = useState("");
  const [debouncedAdditionalServiceQuery, setDebouncedAdditionalServiceQuery] =
    useState("");
  const [additionalServicesOptions, setAdditionalServicesOptions] = useState(
    [],
  );
  const [loadingAdditionalServices, setLoadingAdditionalServices] =
    useState(false);
  // Map of id → full service object for selected additional services
  const [selectedAdditionalServices, setSelectedAdditionalServices] = useState(
    new Map(),
  );
  const additionalPage = useRef(1);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [inactiveModalOpen, setInactiveModalOpen] = useState(false);
  const [inactivePackageName, setInactivePackageName] = useState("");

  // ── Derived: total additional cost ───────────────────────────────────────
  const additionalAmount = Array.from(
    selectedAdditionalServices.values(),
  ).reduce((sum, svc) => sum + (Number(svc.price) || 0), 0);

  // ── Reset on open/close ───────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;

    if (trip) {
      setForm({
        assignmentId: trip.assignmentId || "",
        pickupLocation: trip.pickupLocation || "",
        dropLocation: trip.dropLocation || "",
        tripDate: toDateInputValue(trip.tripDate),
        tripType: trip.tripType || "airport-transfer",
      });

      const packageId =
        trip.subscription?.packageId ?? trip.subscription?.package?.id ?? null;

      setSelectedSubscription(
        trip.subscription
          ? {
              ...trip.subscription,
              packageId,
              id: trip.subscription.id ?? trip.subscriptionId,
            }
          : trip.subscriptionId
            ? { id: trip.subscriptionId, packageId }
            : null,
      );
      setSelectedUser(
        trip.user
          ? { ...trip.user, id: trip.user.id ?? trip.userId }
          : trip.userId
            ? { id: trip.userId }
            : null,
      );

      const preSelected = Array.isArray(trip.services)
        ? new Set(trip.services.filter((s) => s?.id).map((s) => Number(s.id)))
        : new Set();
      setSelectedServiceIds(preSelected);

      // Pre-fill additional services if present in edit mode
      if (
        Array.isArray(trip.additionalServices) &&
        trip.additionalServices.length > 0
      ) {
        const map = new Map(
          trip.additionalServices
            .filter((s) => s?.id)
            .map((s) => [Number(s.id), s]),
        );
        setSelectedAdditionalServices(map);
      } else {
        setSelectedAdditionalServices(new Map());
      }
    } else {
      setForm(INITIAL_FORM);
      setSelectedSubscription(null);
      setSelectedUser(null);
      setSelectedServiceIds(new Set());
      setSelectedAdditionalServices(new Map());
    }

    setSubscriptionSearch("");
    setDebouncedSubscriptionSearch("");
    setSubscriptionOptions([]);
    setLoadingSubscriptions(false);

    setUserSearch("");
    setDebouncedUserSearch("");
    setUserOptions([]);
    setLoadingUsers(false);

    setServiceQuery("");
    setDebouncedServiceQuery("");
    setPackageServices([]);
    setLoadingServices(false);

    setAdditionalServiceQuery("");
    setDebouncedAdditionalServiceQuery("");
    setAdditionalServicesOptions([]);
    setLoadingAdditionalServices(false);
    additionalPage.current = 1;

    setError(null);
  }, [open, trip]);

  // ── Debounces ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(
      () => setDebouncedSubscriptionSearch(subscriptionSearch.trim()),
      400,
    );
    return () => clearTimeout(t);
  }, [subscriptionSearch, open]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => setDebouncedUserSearch(userSearch.trim()), 400);
    return () => clearTimeout(t);
  }, [userSearch, open]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(
      () => setDebouncedServiceQuery(serviceQuery.trim()),
      350,
    );
    return () => clearTimeout(t);
  }, [serviceQuery, open]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      additionalPage.current = 1;
      setDebouncedAdditionalServiceQuery(additionalServiceQuery.trim());
    }, 350);
    return () => clearTimeout(t);
  }, [additionalServiceQuery, open]);

  // ── Fetch subscriptions ──────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const query = debouncedSubscriptionSearch;
    if (!query) {
      setSubscriptionOptions([]);
      setLoadingSubscriptions(false);
      return;
    }
    let cancelled = false;
    setLoadingSubscriptions(true);
    subscriptionApi
      .searchSubscriptions(query)
      .then((rows) => {
        if (!cancelled) setSubscriptionOptions(rows);
      })
      .catch(() => {
        if (!cancelled) setSubscriptionOptions([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingSubscriptions(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedSubscriptionSearch, open]);

  // ── Fetch users ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const query = debouncedUserSearch;
    if (!query) {
      setUserOptions([]);
      setLoadingUsers(false);
      return;
    }
    let cancelled = false;
    setLoadingUsers(true);
    userApi
      .searchUsers(query)
      .then((rows) => {
        if (!cancelled) setUserOptions(rows);
      })
      .catch(() => {
        if (!cancelled) setUserOptions([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingUsers(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedUserSearch, open]);

  // ── Fetch included package services ──────────────────────────────────────
  useEffect(() => {
    if (!open || !selectedSubscription?.packageId) {
      setPackageServices([]);
      setLoadingServices(false);
      return;
    }
    let cancelled = false;
    setLoadingServices(true);
    servicesApi
      .getPackageServices(selectedSubscription.packageId, debouncedServiceQuery)
      .then((rows) => {
        if (!cancelled) {
          const subServices = Array.isArray(selectedSubscription.services)
            ? selectedSubscription.services
            : [];
          const list = (rows ?? []).map((svc) => {
            const matchedSubSvc = subServices.find(
              (subSvc) => Number(subSvc.id) === Number(svc.id),
            );
            return {
              ...svc,
              count: matchedSubSvc ? matchedSubSvc.count : (svc.count ?? 0),
            };
          });
          setPackageServices(list);
        }
      })
      .catch(() => {
        if (!cancelled) setPackageServices([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingServices(false);
      });
    return () => {
      cancelled = true;
    };
  }, [
    selectedSubscription?.packageId,
    selectedSubscription?.services,
    debouncedServiceQuery,
    open,
  ]);

  // ── Fetch additional (not-included) services ──────────────────────────────
  useEffect(() => {
    if (!open || !selectedSubscription?.packageId) {
      setAdditionalServicesOptions([]);
      setLoadingAdditionalServices(false);
      return;
    }
    let cancelled = false;
    setLoadingAdditionalServices(true);
    servicesApi
      .servicesNotIncluded(selectedSubscription.packageId, {
        page: additionalPage.current,
        limit: 10,
        ...(debouncedAdditionalServiceQuery
          ? { search: debouncedAdditionalServiceQuery }
          : {}),
      })
      .then((res) => {
        if (cancelled) return;
        // Normalize: handle array, { data: [] }, { items: [] }, { services: [] }, or null
        const raw = res ?? [];
        const list = Array.isArray(raw)
          ? raw
          : Array.isArray(raw.data)
            ? raw.data
            : Array.isArray(raw.items)
              ? raw.items
              : Array.isArray(raw.services)
                ? raw.services
                : [];
        setAdditionalServicesOptions(list);
      })
      .catch(() => {
        if (!cancelled) setAdditionalServicesOptions([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingAdditionalServices(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedSubscription?.packageId, debouncedAdditionalServiceQuery, open]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  function setField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function toggleService(id) {
    setSelectedServiceIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selectedServiceIds.size === packageServices.length) {
      setSelectedServiceIds(new Set());
    } else {
      setSelectedServiceIds(new Set(packageServices.map((s) => Number(s.id))));
    }
  }

  function toggleAdditionalService(svc) {
    const id = Number(svc.id);
    setSelectedAdditionalServices((prev) => {
      const next = new Map(prev);
      if (next.has(id)) next.delete(id);
      else next.set(id, svc);
      return next;
    });
  }

  function removeAdditionalService(id) {
    setSelectedAdditionalServices((prev) => {
      const next = new Map(prev);
      next.delete(Number(id));
      return next;
    });
  }

  function handleSelectSubscription(sub) {
    if (sub.status !== "active") {
      setInactivePackageName(sub.package?.name || "");
      setInactiveModalOpen(true);
      return;
    }
    const packageId = sub.packageId ?? sub.package?.id ?? null;
    const enrichedSub = { ...sub, packageId };
    if (selectedSubscription?.packageId !== packageId) {
      setSelectedServiceIds(new Set());
      setSelectedAdditionalServices(new Map());
    }
    setSelectedSubscription(enrichedSub);
    setSubscriptionSearch("");
    setSubscriptionOptions([]);
    setServiceQuery("");
    setDebouncedServiceQuery("");
    setAdditionalServiceQuery("");
    setDebouncedAdditionalServiceQuery("");
    additionalPage.current = 1;
  }

  function validate() {
    if (!form.assignmentId.trim()) return "Assignment ID is required.";
    if (!selectedSubscription?.id)
      return "Please search and select a subscription.";
    if (!selectedUser?.id) return "Please search and select a user.";
    if (!form.pickupLocation.trim()) return "Pickup location is required.";
    if (!form.dropLocation.trim()) return "Drop location is required.";
    if (!form.tripDate) return "Trip date is required.";
    if (!form.tripType.trim()) return "Trip type is required.";
    if (!selectedServiceIds.size)
      return "Please select at least one included service.";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const services = packageServices
        .filter((svc) => selectedServiceIds.has(Number(svc.id)))
        .map((svc) => ({
          id: Number(svc.id),
          name: svc.title || svc.name || `Service #${svc.id}`,
        }));

      const additionalServices = Array.from(
        selectedAdditionalServices.values(),
      ).map((svc) => ({
        id: Number(svc.id),
        name: svc.title || svc.name || `Service #${svc.id}`,
      }));

      const payload = {
        assignmentId: form.assignmentId.trim(),
        subscriptionId: Number(selectedSubscription.id),
        pickupLocation: form.pickupLocation.trim(),
        dropLocation: form.dropLocation.trim(),
        tripDate: form.tripDate,
        tripType: form.tripType,
        services,
        packageName: selectedSubscription.package?.name ?? null,
        userId: Number(selectedUser.id),
        ...(additionalServices.length > 0 && {
          additionalServices,
          additionalAmount: parseFloat(additionalAmount.toFixed(2)),
        }),
      };

      if (isEditMode) {
        const updated = await tripApi.updateTrip(trip.id, payload);
        onUpdated?.(updated);
      } else {
        await tripApi.createTrip(payload);
        onCreated?.();
      }

      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          (isEditMode ? "Failed to update trip." : "Failed to create trip."),
      );
    } finally {
      setSubmitting(false);
    }
  }

  // ── Derived UI values ─────────────────────────────────────────────────────
  const allChecked =
    packageServices.length > 0 &&
    selectedServiceIds.size === packageServices.length;
  const someChecked =
    selectedServiceIds.size > 0 &&
    selectedServiceIds.size < packageServices.length;

  const selectedAdditionalList = Array.from(
    selectedAdditionalServices.values(),
  );

  return (
    <>
      <Modal
        open={open}
        onClose={() => {
          if (!submitting) onClose();
        }}
        title={isEditMode ? "Update Trip" : "New Trip"}
        description={
          isEditMode
            ? "Edit trip details and save changes."
            : "Create a trip by selecting subscription, user, and services."
        }
        size="xl"
      >
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">
              {error}
            </div>
          )}

          {/* ── Row 1: Assignment ID + Trip Date ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-[#0B1E3F]">
                Assignment ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.assignmentId}
                onChange={(e) => setField("assignmentId", e.target.value)}
                placeholder="e.g. WF-100"
                disabled={submitting}
                className="w-full text-sm rounded-lg border border-[#CBD5E0] bg-[#FAF6EC] px-3 py-2.5 text-[#1A202C] placeholder:text-[#A0AEC0] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 disabled:opacity-60"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-[#0B1E3F]">
                Trip Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={form.tripDate}
                onChange={(e) => setField("tripDate", e.target.value)}
                disabled={submitting}
                className="w-full text-sm rounded-lg border border-[#CBD5E0] bg-[#FAF6EC] px-3 py-2.5 text-[#1A202C] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 disabled:opacity-60"
              />
            </div>
          </div>

          {/* ── Row 2: Pickup + Drop ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-[#0B1E3F]">
                Pickup Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.pickupLocation}
                onChange={(e) => setField("pickupLocation", e.target.value)}
                placeholder="e.g. Mumbai"
                disabled={submitting}
                className="w-full text-sm rounded-lg border border-[#CBD5E0] bg-[#FAF6EC] px-3 py-2.5 text-[#1A202C] placeholder:text-[#A0AEC0] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 disabled:opacity-60"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-[#0B1E3F]">
                Drop Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.dropLocation}
                onChange={(e) => setField("dropLocation", e.target.value)}
                placeholder="e.g. Airport"
                disabled={submitting}
                className="w-full text-sm rounded-lg border border-[#CBD5E0] bg-[#FAF6EC] px-3 py-2.5 text-[#1A202C] placeholder:text-[#A0AEC0] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 disabled:opacity-60"
              />
            </div>
          </div>

          {/* ── Trip Type ── */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#0B1E3F]">
              Trip Type <span className="text-red-500">*</span>
            </label>
            <select
              value={form.tripType}
              onChange={(e) => setField("tripType", e.target.value)}
              disabled={submitting}
              className="w-full text-sm rounded-lg border border-[#CBD5E0] bg-[#FAF6EC] px-3 py-2.5 text-[#1A202C] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 disabled:opacity-60"
            >
              {TRIP_TYPE_OPTIONS.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* ── Row 3: Subscription + User ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Subscription search */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-[#0B1E3F]">
                Search Subscription <span className="text-red-500">*</span>
              </label>
              <div className="rounded-xl border border-[#CBD5E0] bg-[#FAF6EC] p-3 space-y-3">
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0AEC0]"
                  />
                  <input
                    type="text"
                    value={subscriptionSearch}
                    onChange={(e) => setSubscriptionSearch(e.target.value)}
                    placeholder="Type user, package, status..."
                    disabled={submitting}
                    className="w-full rounded-lg border border-[#CBD5E0] bg-white pl-9 pr-3 py-2 text-sm text-[#1A202C] placeholder:text-[#A0AEC0] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 disabled:opacity-60"
                  />
                </div>
                <div
                  className={`rounded-lg ${loadingSubscriptions || subscriptionSearch.trim() ? "border" : ""} border-[#CBD5E0] bg-white max-h-44 overflow-y-auto`}
                >
                  {loadingSubscriptions ? (
                    <div className="flex items-center gap-2 text-xs text-[#4A5568] px-3 py-2.5">
                      <Loader2 size={14} className="animate-spin" /> Searching
                      subscriptions...
                    </div>
                  ) : !subscriptionSearch.trim() ? null : subscriptionOptions.length ===
                    0 ? (
                    <p className="text-xs text-[#4A5568] px-3 py-2.5">
                      No subscriptions found.
                    </p>
                  ) : (
                    subscriptionOptions.map((sub) => (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => handleSelectSubscription(sub)}
                        disabled={submitting}
                        className="w-full flex items-center justify-between gap-3 px-3 py-2.5 text-left text-sm text-[#1A202C] hover:bg-[#FAF6EC] transition-colors disabled:opacity-60"
                      >
                        <span className="truncate">
                          #{sub.id}
                          {sub.user?.name ? ` - ${sub.user.name}` : ""}
                        </span>
                        <span className="text-xs text-[#4A5568] shrink-0">
                          {sub.package?.name ||
                            `Pkg #${sub.packageId ?? sub.package?.id ?? "-"}`}
                        </span>
                      </button>
                    ))
                  )}
                </div>
                {selectedSubscription && (
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#CBD5E0] bg-white px-3 py-1.5 text-xs text-[#1A202C]">
                    <Repeat size={12} />
                    <span
                      className="max-w-[160px] truncate"
                      title={`Subscription #${selectedSubscription.id}`}
                    >
                      Sub #{selectedSubscription.id}
                      {selectedSubscription.package?.name
                        ? ` · ${selectedSubscription.package.name}`
                        : ""}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSubscription(null);
                        setPackageServices([]);
                        setSelectedServiceIds(new Set());
                        setSelectedAdditionalServices(new Map());
                        setServiceQuery("");
                        setDebouncedServiceQuery("");
                        setAdditionalServiceQuery("");
                        setDebouncedAdditionalServiceQuery("");
                        setAdditionalServicesOptions([]);
                      }}
                      disabled={submitting}
                      className="text-[#718096] hover:text-red-600 transition-colors"
                      aria-label="Remove selected subscription"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* User search */}
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
                      className="max-w-[160px] truncate"
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
          </div>

          {/* ── Included Package Services ── */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-[#0B1E3F]">
                Included Services <span className="text-red-500">*</span>
              </label>
              {selectedServiceIds.size > 0 && (
                <span className="text-xs text-[#C9A24B] font-medium">
                  {selectedServiceIds.size} selected
                </span>
              )}
            </div>

            <div className="rounded-xl border border-[#CBD5E0] bg-[#FAF6EC] p-3 space-y-3">
              {!selectedSubscription ? (
                <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
                  <PackageCheck size={28} className="text-[#CBD5E0]" />
                  <p className="text-sm text-[#A0AEC0]">
                    Select a subscription above to see its included services.
                  </p>
                </div>
              ) : (
                <>
                  <div className="relative">
                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0AEC0]"
                    />
                    <input
                      type="text"
                      value={serviceQuery}
                      onChange={(e) => setServiceQuery(e.target.value)}
                      placeholder="Filter services…"
                      disabled={submitting || loadingServices}
                      className="w-full rounded-lg border border-[#CBD5E0] bg-white pl-9 pr-3 py-2 text-sm text-[#1A202C] placeholder:text-[#A0AEC0] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 disabled:opacity-60"
                    />
                  </div>

                  {loadingServices ? (
                    <div className="flex items-center gap-2 text-xs text-[#4A5568] px-1 py-2">
                      <Loader2 size={14} className="animate-spin" /> Loading
                      services…
                    </div>
                  ) : packageServices.length === 0 ? (
                    <p className="text-xs text-[#4A5568] px-1 py-2">
                      {serviceQuery.trim()
                        ? "No services match your filter."
                        : "No services found for this package."}
                    </p>
                  ) : (
                    <div className="rounded-lg border border-[#CBD5E0] bg-white overflow-hidden">
                      <label className="flex items-center gap-3 px-3 py-2.5 border-b border-[#EDF2F7] cursor-pointer hover:bg-[#FAF6EC] transition-colors select-none">
                        <input
                          type="checkbox"
                          checked={allChecked}
                          ref={(el) => {
                            if (el) el.indeterminate = someChecked;
                          }}
                          onChange={toggleAll}
                          disabled={submitting}
                          className="h-4 w-4 rounded border-[#CBD5E0] accent-[#0B1E3F] cursor-pointer disabled:opacity-60"
                        />
                        <span className="text-xs font-semibold text-[#4A5568] uppercase tracking-wide">
                          Select all ({packageServices.length})
                        </span>
                      </label>
                      <div className="max-h-52 overflow-y-auto divide-y divide-[#EDF2F7]">
                        {packageServices.map((service) => {
                          const id = Number(service.id);
                          const label =
                            service.title ||
                            service.name ||
                            `Service #${service.id}`;
                          const checked = selectedServiceIds.has(id);
                          const price = formatPrice(service.price);
                          return (
                            <label
                              key={service.id}
                              className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-[#FAF6EC] transition-colors select-none"
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleService(id)}
                                disabled={submitting}
                                className="h-4 w-4 rounded border-[#CBD5E0] accent-[#0B1E3F] cursor-pointer disabled:opacity-60 shrink-0"
                              />
                              {service.thumbnailUrl ? (
                                <img
                                  src={service.thumbnailUrl}
                                  alt={label}
                                  className="h-8 w-8 rounded-lg object-cover shrink-0 border border-[#EDF2F7]"
                                />
                              ) : (
                                <ConciergeBell
                                  size={13}
                                  className="text-[#C9A24B] shrink-0"
                                />
                              )}
                              <span
                                className="flex-1 text-sm text-[#1A202C] truncate min-w-0"
                                title={label}
                              >
                                {label}
                              </span>
                              <div className="flex items-center gap-2 shrink-0">
                                {price && (
                                  <span className="inline-flex items-center gap-0.5 text-xs font-medium text-[#2D7A4F] bg-green-50 border border-green-100 rounded-full px-2 py-0.5">
                                    <IndianRupee size={10} />
                                    {price}
                                  </span>
                                )}
                                {service.count != null && (
                                  <span className="inline-flex items-center rounded-full bg-[#FAF6EC] border border-[#CBD5E0] px-2 py-0.5 text-xs text-[#4A5568]">
                                    ×{service.count}
                                  </span>
                                )}
                                <span className="text-xs text-[#A0AEC0]">
                                  #{service.id}
                                </span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* ── Additional Services (not in package) ── */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <BadgePlus size={15} className="text-[#C9A24B]" />
                <label className="block text-sm font-semibold text-[#0B1E3F]">
                  Additional Services
                </label>
                <span className="text-xs text-[#718096] font-normal">
                  (not in package)
                </span>
              </div>
              {selectedAdditionalServices.size > 0 && (
                <span className="text-xs text-[#C9A24B] font-medium">
                  {selectedAdditionalServices.size} added
                </span>
              )}
            </div>

            <div className="rounded-xl border border-[#C9A24B]/40 bg-[#FAF6EC] p-3 space-y-3">
              {!selectedSubscription ? (
                <div className="flex flex-col items-center justify-center py-6 gap-2 text-center">
                  <ShoppingBag size={26} className="text-[#CBD5E0]" />
                  <p className="text-sm text-[#A0AEC0]">
                    Select a subscription to browse additional services.
                  </p>
                </div>
              ) : (
                <>
                  {/* Search input */}
                  <div className="relative">
                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0AEC0]"
                    />
                    <input
                      type="text"
                      value={additionalServiceQuery}
                      onChange={(e) =>
                        setAdditionalServiceQuery(e.target.value)
                      }
                      placeholder="Search extra services…"
                      disabled={submitting || loadingAdditionalServices}
                      className="w-full rounded-lg border border-[#CBD5E0] bg-white pl-9 pr-3 py-2 text-sm text-[#1A202C] placeholder:text-[#A0AEC0] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 disabled:opacity-60"
                    />
                  </div>

                  {/* Available list */}
                  {loadingAdditionalServices ? (
                    <div className="flex items-center gap-2 text-xs text-[#4A5568] px-1 py-2">
                      <Loader2 size={14} className="animate-spin" /> Loading
                      additional services…
                    </div>
                  ) : additionalServicesOptions.length === 0 ? (
                    <p className="text-xs text-[#4A5568] px-1 py-2">
                      {additionalServiceQuery.trim()
                        ? "No additional services match your search."
                        : "No additional services available for this package."}
                    </p>
                  ) : (
                    <div className="rounded-lg border border-[#CBD5E0] bg-white overflow-hidden">
                      <div className="max-h-52 overflow-y-auto divide-y divide-[#EDF2F7]">
                        {additionalServicesOptions.map((service) => {
                          const id = Number(service.id);
                          const label =
                            service.title ||
                            service.name ||
                            `Service #${service.id}`;
                          const isSelected = selectedAdditionalServices.has(id);
                          const price = formatPrice(service.price);
                          return (
                            <label
                              key={service.id}
                              className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors select-none ${
                                isSelected
                                  ? "bg-[#FAF6EC]"
                                  : "hover:bg-[#FAF6EC]"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() =>
                                  toggleAdditionalService(service)
                                }
                                disabled={submitting}
                                className="h-4 w-4 rounded border-[#CBD5E0] accent-[#C9A24B] cursor-pointer disabled:opacity-60 shrink-0"
                              />
                              {service.thumbnailUrl ? (
                                <img
                                  src={service.thumbnailUrl}
                                  alt={label}
                                  className="h-8 w-8 rounded-lg object-cover shrink-0 border border-[#EDF2F7]"
                                />
                              ) : (
                                <ConciergeBell
                                  size={13}
                                  className="text-[#C9A24B] shrink-0"
                                />
                              )}
                              <span
                                className="flex-1 text-sm text-[#1A202C] truncate min-w-0"
                                title={label}
                              >
                                {label}
                              </span>
                              <div className="flex items-center gap-2 shrink-0">
                                {price ? (
                                  <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-[#C9A24B] bg-[#FFF8E6] border border-[#C9A24B]/30 rounded-full px-2 py-0.5">
                                    <IndianRupee size={10} />
                                    {price}
                                  </span>
                                ) : (
                                  <span className="text-xs text-[#A0AEC0] italic">
                                    No price
                                  </span>
                                )}
                                <span className="text-xs text-[#A0AEC0]">
                                  #{service.id}
                                </span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Selected additional services summary + cost breakdown */}
                  {selectedAdditionalList.length > 0 && (
                    <div className="rounded-lg border border-[#C9A24B]/30 bg-white overflow-hidden">
                      {/* Header */}
                      <div className="flex items-center justify-between px-3 py-2 border-b border-[#EDF2F7] bg-[#FFFDF5]">
                        <span className="text-xs font-semibold text-[#0B1E3F] uppercase tracking-wide">
                          Added extras
                        </span>
                        <span className="text-xs text-[#718096]">
                          {selectedAdditionalList.length} service
                          {selectedAdditionalList.length > 1 ? "s" : ""}
                        </span>
                      </div>

                      {/* Individual line items */}
                      <div className="divide-y divide-[#EDF2F7]">
                        {selectedAdditionalList.map((svc) => {
                          const label =
                            svc.title || svc.name || `Service #${svc.id}`;
                          const price = formatPrice(svc.price);
                          return (
                            <div
                              key={svc.id}
                              className="flex items-center gap-3 px-3 py-2"
                            >
                              <ConciergeBell
                                size={12}
                                className="text-[#C9A24B] shrink-0"
                              />
                              <span
                                className="flex-1 text-sm text-[#1A202C] truncate min-w-0"
                                title={label}
                              >
                                {label}
                              </span>
                              <div className="flex items-center gap-2 shrink-0">
                                {price ? (
                                  <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-[#C9A24B]">
                                    <IndianRupee size={10} />
                                    {price}
                                  </span>
                                ) : (
                                  <span className="text-xs text-[#A0AEC0]">
                                    —
                                  </span>
                                )}
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeAdditionalService(svc.id)
                                  }
                                  disabled={submitting}
                                  className="text-[#A0AEC0] hover:text-red-500 transition-colors disabled:opacity-60"
                                  aria-label={`Remove ${label}`}
                                >
                                  <X size={13} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Total additional cost */}
                      <div className="flex items-center justify-between px-3 py-2.5 border-t border-[#C9A24B]/20 bg-[#FFFDF5]">
                        <span className="text-xs font-semibold text-[#0B1E3F]">
                          Additional Cost
                        </span>
                        <span className="inline-flex items-center gap-1 text-sm font-bold text-[#C9A24B]">
                          <IndianRupee size={13} />
                          {additionalAmount.toLocaleString("en-IN", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* ── Actions ── */}
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
              {submitting
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                  ? "Update Trip"
                  : "Create Trip"}
            </button>
          </div>
        </form>
      </Modal>

      <SubscriptionNotActiveModal
        open={inactiveModalOpen}
        onClose={() => setInactiveModalOpen(false)}
        packageName={inactivePackageName}
        isAdmin={true}
      />
    </>
  );
}
