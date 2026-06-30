"use client";

import { useEffect, useState } from "react";
import { Loader2, PlusCircle, Search, UserRound, Repeat, ConciergeBell, X } from "lucide-react";
import Modal from "../Modal";

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

export default function CreateTripModal({ open, onClose, onCreated, trip, onUpdated }) {
  const isEditMode = Boolean(trip);
  const [form, setForm] = useState(INITIAL_FORM);

  const [subscriptionSearch, setSubscriptionSearch] = useState("");
  const [debouncedSubscriptionSearch, setDebouncedSubscriptionSearch] = useState("");
  const [subscriptionOptions, setSubscriptionOptions] = useState([]);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(false);

  const [userSearch, setUserSearch] = useState("");
  const [debouncedUserSearch, setDebouncedUserSearch] = useState("");
  const [userOptions, setUserOptions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [serviceSearch, setServiceSearch] = useState("");
  const [debouncedServiceSearch, setDebouncedServiceSearch] = useState("");
  const [serviceOptions, setServiceOptions] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

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
      setSelectedSubscription(
        trip.subscription
          ? { ...trip.subscription, id: trip.subscription.id ?? trip.subscriptionId }
          : trip.subscriptionId
            ? { id: trip.subscriptionId }
            : null
      );
      setSelectedUser(
        trip.user
          ? { ...trip.user, id: trip.user.id ?? trip.userId }
          : trip.userId
            ? { id: trip.userId }
            : null
      );
      setSelectedServices(
        Array.isArray(trip.services)
          ? trip.services
            .filter((svc) => svc?.id)
            .map((svc) => ({
              id: svc.id,
              name: svc.name || svc.title || `Service #${svc.id}`,
            }))
          : []
      );
    } else {
      setForm(INITIAL_FORM);
      setSelectedSubscription(null);
      setSelectedUser(null);
      setSelectedServices([]);
    }

    setSubscriptionSearch("");
    setDebouncedSubscriptionSearch("");
    setSubscriptionOptions([]);
    setLoadingSubscriptions(false);

    setUserSearch("");
    setDebouncedUserSearch("");
    setUserOptions([]);
    setLoadingUsers(false);

    setServiceSearch("");
    setDebouncedServiceSearch("");
    setServiceOptions([]);
    setLoadingServices(false);

    setError(null);
  }, [open, trip]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => setDebouncedSubscriptionSearch(subscriptionSearch.trim()), 400);
    return () => clearTimeout(t);
  }, [subscriptionSearch, open]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => setDebouncedUserSearch(userSearch.trim()), 400);
    return () => clearTimeout(t);
  }, [userSearch, open]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => setDebouncedServiceSearch(serviceSearch.trim()), 400);
    return () => clearTimeout(t);
  }, [serviceSearch, open]);

  useEffect(() => {
    if (!open) return;
    const query = debouncedSubscriptionSearch;
    if (!query) {
      setSubscriptionOptions([]);
      setLoadingSubscriptions(false);
      return;
    }

    let cancelled = false;

    async function fetchSubscriptions() {
      setLoadingSubscriptions(true);
      try {
        const rows = await subscriptionApi.searchSubscriptions(query);
        if (!cancelled) setSubscriptionOptions(rows);
      } catch {
        if (!cancelled) setSubscriptionOptions([]);
      } finally {
        if (!cancelled) setLoadingSubscriptions(false);
      }
    }

    fetchSubscriptions();
    return () => { cancelled = true; };
  }, [debouncedSubscriptionSearch, open]);

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
    return () => { cancelled = true; };
  }, [debouncedUserSearch, open]);

  useEffect(() => {
    if (!open) return;
    const query = debouncedServiceSearch;
    if (!query) {
      setServiceOptions([]);
      setLoadingServices(false);
      return;
    }

    let cancelled = false;

    async function fetchServices() {
      setLoadingServices(true);
      try {
        const rows = await servicesApi.searchServices(query);
        if (!cancelled) setServiceOptions(rows);
      } catch {
        if (!cancelled) setServiceOptions([]);
      } finally {
        if (!cancelled) setLoadingServices(false);
      }
    }

    fetchServices();
    return () => { cancelled = true; };
  }, [debouncedServiceSearch, open]);

  function setField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    if (!form.assignmentId.trim()) return "Assignment ID is required.";
    if (!selectedSubscription?.id) return "Please search and select a subscription.";
    if (!selectedUser?.id) return "Please search and select a user.";
    if (!form.pickupLocation.trim()) return "Pickup location is required.";
    if (!form.dropLocation.trim()) return "Drop location is required.";
    if (!form.tripDate) return "Trip date is required.";
    if (!form.tripType.trim()) return "Trip type is required.";
    if (!selectedServices.length) return "Please add at least one service.";
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
      const payload = {
        assignmentId: form.assignmentId.trim(),
        subscriptionId: Number(selectedSubscription.id),
        pickupLocation: form.pickupLocation.trim(),
        dropLocation: form.dropLocation.trim(),
        tripDate: form.tripDate,
        tripType: form.tripType,
        services: selectedServices.map((svc) => ({
          id: Number(svc.id),
          name: svc.name,
        })),
        userId: Number(selectedUser.id),
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
      setError(err?.response?.data?.message || (isEditMode ? "Failed to update trip." : "Failed to create trip."));
    } finally {
      setSubmitting(false);
    }
  }

  function selectService(service) {
    const mapped = {
      id: service.id,
      name: service.title || service.name || `Service #${service.id}`,
    };

    setSelectedServices((prev) => {
      if (prev.some((item) => Number(item.id) === Number(mapped.id))) return prev;
      return [...prev, mapped];
    });

    setServiceSearch("");
    setServiceOptions([]);
  }

  function removeService(serviceId) {
    setSelectedServices((prev) => prev.filter((item) => Number(item.id) !== Number(serviceId)));
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        if (!submitting) onClose();
      }}
      title={isEditMode ? "Update Trip" : "New Trip"}
      description={isEditMode ? "Edit trip details and save changes." : "Create a trip by selecting subscription, user, and services."}
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
            <label className="block text-sm font-semibold text-[#0B1E3F]">Assignment ID <span className="text-red-500">*</span></label>
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
            <label className="block text-sm font-semibold text-[#0B1E3F]">Trip Date <span className="text-red-500">*</span></label>
            <input
              type="date"
              value={form.tripDate}
              onChange={(e) => setField("tripDate", e.target.value)}
              disabled={submitting}
              className="w-full text-sm rounded-lg border border-[#CBD5E0] bg-[#FAF6EC] px-3 py-2.5 text-[#1A202C] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 disabled:opacity-60"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#0B1E3F]">Pickup Location <span className="text-red-500">*</span></label>
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
            <label className="block text-sm font-semibold text-[#0B1E3F]">Drop Location <span className="text-red-500">*</span></label>
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

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-[#0B1E3F]">Trip Type <span className="text-red-500">*</span></label>
          <select
            value={form.tripType}
            onChange={(e) => setField("tripType", e.target.value)}
            disabled={submitting}
            className="w-full text-sm rounded-lg border border-[#CBD5E0] bg-[#FAF6EC] px-3 py-2.5 text-[#1A202C] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 disabled:opacity-60"
          >
            {TRIP_TYPE_OPTIONS.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#0B1E3F]">Search Subscription <span className="text-red-500">*</span></label>
            <div className="rounded-xl border border-[#CBD5E0] bg-[#FAF6EC] p-3 space-y-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0AEC0]" />
                <input
                  type="text"
                  value={subscriptionSearch}
                  onChange={(e) => setSubscriptionSearch(e.target.value)}
                  placeholder="Type user, package, status..."
                  disabled={submitting}
                  className="w-full rounded-lg border border-[#CBD5E0] bg-white pl-9 pr-3 py-2 text-sm text-[#1A202C] placeholder:text-[#A0AEC0] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 disabled:opacity-60"
                />
              </div>

              <div className={`rounded-lg ${loadingSubscriptions || subscriptionSearch.trim() ? "border" : ""} border-[#CBD5E0] bg-white max-h-44 overflow-y-auto`}>
                {loadingSubscriptions ? (
                  <div className="flex items-center gap-2 text-xs text-[#4A5568] px-3 py-2.5">
                    <Loader2 size={14} className="animate-spin" /> Searching subscriptions...
                  </div>
                ) : !subscriptionSearch.trim() ? null : subscriptionOptions.length === 0 ? (
                  <p className="text-xs text-[#4A5568] px-3 py-2.5">No subscriptions found.</p>
                ) : (
                  subscriptionOptions.map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => {
                        setSelectedSubscription(sub);
                        setSubscriptionSearch("");
                        setSubscriptionOptions([]);
                      }}
                      disabled={submitting}
                      className="w-full flex items-center justify-between gap-3 px-3 py-2.5 text-left text-sm text-[#1A202C] hover:bg-[#FAF6EC] transition-colors disabled:opacity-60"
                    >
                      <span className="truncate">#{sub.id} {sub.user?.name ? `- ${sub.user.name}` : ""}</span>
                      <span className="text-xs text-[#4A5568] shrink-0">{sub.package?.name || `Pkg #${sub.packageId ?? "-"}`}</span>
                    </button>
                  ))
                )}
              </div>

              {selectedSubscription && (
                <div className="inline-flex items-center gap-2 rounded-full border border-[#CBD5E0] bg-white px-3 py-1.5 text-xs text-[#1A202C]">
                  <Repeat size={12} />
                  <span className="max-w-45 truncate" title={`Subscription #${selectedSubscription.id}`}>
                    Subscription #{selectedSubscription.id}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedSubscription(null)}
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

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#0B1E3F]">Search User <span className="text-red-500">*</span></label>
            <div className="rounded-xl border border-[#CBD5E0] bg-[#FAF6EC] p-3 space-y-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0AEC0]" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Type name, email or mobile"
                  disabled={submitting}
                  className="w-full rounded-lg border border-[#CBD5E0] bg-white pl-9 pr-3 py-2 text-sm text-[#1A202C] placeholder:text-[#A0AEC0] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 disabled:opacity-60"
                />
              </div>

              <div className={`rounded-lg ${loadingUsers || userSearch.trim() ? "border" : ""} border-[#CBD5E0] bg-white max-h-44 overflow-y-auto`}>
                {loadingUsers ? (
                  <div className="flex items-center gap-2 text-xs text-[#4A5568] px-3 py-2.5">
                    <Loader2 size={14} className="animate-spin" /> Searching users...
                  </div>
                ) : !userSearch.trim() ? null : userOptions.length === 0 ? (
                  <p className="text-xs text-[#4A5568] px-3 py-2.5">No users found.</p>
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
                      <span className="truncate">{user.name || user.email || user.mobileNumber || `User #${user.id}`}</span>
                      <span className="text-xs text-[#4A5568] shrink-0">#{user.id}</span>
                    </button>
                  ))
                )}
              </div>

              {selectedUser && (
                <div className="inline-flex items-center gap-2 rounded-full border border-[#CBD5E0] bg-white px-3 py-1.5 text-xs text-[#1A202C]">
                  <UserRound size={12} />
                  <span className="max-w-45 truncate" title={selectedUser.name || selectedUser.email || selectedUser.mobileNumber || `User #${selectedUser.id}`}>
                    {selectedUser.name || selectedUser.email || selectedUser.mobileNumber || `User #${selectedUser.id}`}
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

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-[#0B1E3F]">Search Services <span className="text-red-500">*</span></label>
          <div className="rounded-xl border border-[#CBD5E0] bg-[#FAF6EC] p-3 space-y-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0AEC0]" />
              <input
                type="text"
                value={serviceSearch}
                onChange={(e) => setServiceSearch(e.target.value)}
                placeholder="Type service name"
                disabled={submitting}
                className="w-full rounded-lg border border-[#CBD5E0] bg-white pl-9 pr-3 py-2 text-sm text-[#1A202C] placeholder:text-[#A0AEC0] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 disabled:opacity-60"
              />
            </div>

            <div className={`rounded-lg ${loadingServices || serviceSearch.trim() ? "border" : ""} border-[#CBD5E0] bg-white max-h-44 overflow-y-auto`}>
              {loadingServices ? (
                <div className="flex items-center gap-2 text-xs text-[#4A5568] px-3 py-2.5">
                  <Loader2 size={14} className="animate-spin" /> Searching services...
                </div>
              ) : !serviceSearch.trim() ? null : serviceOptions.length === 0 ? (
                <p className="text-xs text-[#4A5568] px-3 py-2.5">No services found.</p>
              ) : (
                serviceOptions.map((service) => {
                  const label = service.title || service.name || `Service #${service.id}`;
                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => selectService(service)}
                      disabled={submitting}
                      className="w-full flex items-center justify-between gap-3 px-3 py-2.5 text-left text-sm text-[#1A202C] hover:bg-[#FAF6EC] transition-colors disabled:opacity-60"
                    >
                      <span className="truncate">{label}</span>
                      <span className="text-xs text-[#4A5568] shrink-0">#{service.id}</span>
                    </button>
                  );
                })
              )}
            </div>

            {selectedServices.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedServices.map((service) => (
                  <div
                    key={service.id}
                    className="inline-flex items-center gap-2 rounded-full border border-[#CBD5E0] bg-white px-3 py-1.5 text-xs text-[#1A202C]"
                  >
                    <ConciergeBell size={12} />
                    <span className="max-w-45 truncate" title={service.name}>{service.name}</span>
                    <button
                      type="button"
                      onClick={() => removeService(service.id)}
                      disabled={submitting}
                      className="text-[#718096] hover:text-red-600 transition-colors"
                      aria-label={`Remove ${service.name}`}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
            {submitting ? <Loader2 size={14} className="animate-spin" /> : <PlusCircle size={14} />}
            {submitting ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Trip" : "Create Trip")}
          </button>
        </div>
      </form>
    </Modal>
  );
}