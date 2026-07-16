"use client";

import { useState, useEffect } from "react";
import {
  X,
  MapPin,
  Calendar,
  ChevronDown,
  Check,
  Info,
  Send,
  Loader2,
  Package,
  Search,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  IndianRupee,
  BadgePlus,
} from "lucide-react";
import { toast } from "sonner";
import { tripApiUser } from "@/app/user-apis/trip.api";
import { servicesApi } from "@/app/admin/services/apis/services.api";

// ── Config ────────────────────────────────────────────────────────────────────
const ASSETS_BASE = process.env.NEXT_PUBLIC_ASSETS_URL ?? "";

// ── Helpers ───────────────────────────────────────────────────────────────────
function getImageUrl(key) {
  if (!key) return null;
  if (key.startsWith("http")) return key;
  return `${ASSETS_BASE}/${key}`;
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatPrice(price) {
  if (price == null || price === "" || price === 0) return null;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

// Normalize any backend shape → always an array
function toArray(res) {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.items)) return res.items;
  if (Array.isArray(res.services)) return res.services;
  return [];
}

// ── Add Service Drawer ────────────────────────────────────────────────────────
function AddServiceDrawer({ packageId, onAdd, onClose, existingIds }) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [services, setServices] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const LIMIT = 10;

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  // Fetch not-included services for this package
  useEffect(() => {
    if (!packageId) return;
    let cancelled = false;
    setLoading(true);

    servicesApi
      .servicesNotIncluded(packageId, {
        page,
        limit: LIMIT,
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
      })
      .then((res) => {
        if (cancelled) return;
        const list = toArray(res);
        setServices(list);
        // Try to read total from response if available
        const total = res?.pagination?.totalPages ?? res?.totalPages ?? res?.meta?.totalPages ?? null;
        setTotalPages(total ?? (list.length < LIMIT ? page : page + 1));
      })
      .catch(() => {
        if (!cancelled) {
          setServices([]);
          toast.error("Failed to load additional services.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [packageId, page, debouncedSearch]);

  const selected = services.find((s) => s.id === selectedId);

  const handleAdd = () => {
    if (!selected) return;
    onAdd({
      id: selected.id,
      title: selected.title ?? selected.name,
      price: selected.price ?? selected.amount ?? selected.cost ?? null,
      thumbnailUrl: selected.thumbnailUrl ?? selected.thumbnailUrlKey ?? null,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        style={{ background: "var(--color-white)", maxHeight: "80vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 pt-5 pb-3 border-b flex-shrink-0"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div>
            <h3
              className="text-base font-bold"
              style={{ color: "var(--color-navy)", fontFamily: "var(--font-playfair)" }}
            >
              Add Extra Service
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Services not included in your package
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 transition-colors"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 py-3 flex-shrink-0">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search size={14} className="text-slate-400" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search extra services…"
              className="block w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border outline-none font-medium transition-colors focus:ring-1"
              style={{
                borderColor: "var(--color-border)",
                color: "var(--color-navy)",
                background: "var(--color-white)",
              }}
            />
          </div>
        </div>

        {/* Service List */}
        <div className="flex-1 overflow-y-auto px-5 pb-3 space-y-2">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 size={20} className="animate-spin text-slate-400" />
            </div>
          ) : services.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">
              {debouncedSearch ? "No services match your search." : "No additional services available."}
            </p>
          ) : (
            services.map((svc) => {
              const isAlreadyAdded = existingIds.includes(svc.id);
              const isSelected = selectedId === svc.id;
              const svcImg = getImageUrl(svc.thumbnailUrl ?? svc.thumbnailUrlKey);
              const price = svc.price ?? svc.amount ?? svc.cost ?? null;

              return (
                <div
                  key={svc.id}
                  onClick={() => !isAlreadyAdded && setSelectedId(svc.id)}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all ${
                    isAlreadyAdded
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer hover:bg-slate-50/60"
                  }`}
                  style={{
                    borderColor: isSelected ? "var(--color-navy)" : "var(--color-border)",
                    background: isSelected ? "rgba(15,31,69,0.04)" : undefined,
                  }}
                >
                  {/* Radio dot */}
                  <div
                    className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                    style={isSelected ? { borderColor: "var(--color-navy)" } : { borderColor: "#cbd5e1" }}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full" style={{ background: "var(--color-navy)" }} />
                    )}
                  </div>

                  {/* Thumbnail */}
                  <div className="w-11 h-11 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {svcImg ? (
                      <img src={svcImg} alt={svc.title ?? svc.name} className="w-full h-full object-cover" />
                    ) : (
                      <Package size={18} className="text-slate-400" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold truncate leading-tight" style={{ color: "var(--color-navy)" }}>
                      {svc.title ?? svc.name}
                    </h4>
                    {price != null ? (
                      <p className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-0.5">
                        <IndianRupee size={10} />
                        {formatPrice(price)?.replace("₹", "")}
                      </p>
                    ) : (
                      <p className="text-[10px] text-slate-400 mt-0.5">Price on request</p>
                    )}
                  </div>

                  {isAlreadyAdded && (
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full flex-shrink-0">
                      Added
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="flex items-center justify-between px-5 py-3 border-t flex-shrink-0"
            style={{ borderColor: "var(--color-border)" }}
          >
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft size={15} style={{ color: "var(--color-navy)" }} />
            </button>
            <span className="text-[11px] font-medium text-slate-500">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40 transition-colors"
            >
              <ChevronRight size={15} style={{ color: "var(--color-navy)" }} />
            </button>
          </div>
        )}

        {/* Footer Action */}
        <div
          className="px-5 pb-5 pt-3 flex-shrink-0 border-t"
          style={{ borderColor: "var(--color-border)" }}
        >
          <button
            onClick={handleAdd}
            disabled={!selectedId}
            className="w-full py-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:scale-100"
            style={{ background: "var(--color-navy)" }}
          >
            <Plus size={13} />
            Add Selected Service
          </button>
        </div>
      </div>
    </div>
  );
}

// ── RequestTripModal ──────────────────────────────────────────────────────────
export default function RequestTripModal({ plan, onClose }) {
  if (!plan) return null;

  const pkg = plan.package ?? {};
  const packageId = pkg.id ?? plan.packageId ?? null;
  const vehicleImg = getImageUrl(pkg.thumbnailUrl ?? pkg.thumbnailUrlKey);
  const tripsLeft = (plan.tripsTotal ?? 0) - (plan.tripsUsed ?? 0);

  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [tripDate, setTripDate] = useState("");
  const [tripType, setTripType] = useState("airport-transfer");

  // ── Included package services (live fetch, searchable) ───────────────────
  const [serviceQuery, setServiceQuery] = useState("");
  const [debouncedServiceQuery, setDebouncedServiceQuery] = useState("");
  const [packageServices, setPackageServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);

  // Debounce service search query
  useEffect(() => {
    const t = setTimeout(() => setDebouncedServiceQuery(serviceQuery.trim()), 350);
    return () => clearTimeout(t);
  }, [serviceQuery]);

  // Fetch included package services
  useEffect(() => {
    if (!packageId) { setPackageServices([]); return; }
    let cancelled = false;
    setLoadingServices(true);
    servicesApi
      .getPackageServices(packageId, debouncedServiceQuery)
      .then((rows) => {
        if (cancelled) return;
        const list = toArray(rows);
        setPackageServices(list);
        // Pre-select all on first load (no search active)
        if (!debouncedServiceQuery) {
          setSelectedServices(list.map((s) => s.id));
        }
      })
      .catch(() => { if (!cancelled) setPackageServices([]); })
      .finally(() => { if (!cancelled) setLoadingServices(false); });
    return () => { cancelled = true; };
  }, [packageId, debouncedServiceQuery]);

  // Derived: select-all state
  const allChecked = packageServices.length > 0 && selectedServices.length === packageServices.length;
  const someChecked = selectedServices.length > 0 && selectedServices.length < packageServices.length;

  const toggleAll = () => {
    if (allChecked) setSelectedServices([]);
    else setSelectedServices(packageServices.map((s) => s.id));
  };

  // Extra (not-included) services
  const [extraServices, setExtraServices] = useState([]); // { id, title, price, thumbnailUrl }
  const [showAddService, setShowAddService] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Derived: total additional cost from extra services
  const additionalAmount = extraServices.reduce(
    (sum, svc) => sum + (Number(svc.price) || 0),
    0,
  );

  // All IDs already in use — prevents duplicate picks in the drawer
  const allServiceIds = [
    ...packageServices.map((s) => s.id),
    ...extraServices.map((s) => s.id),
  ];

  const handleToggleService = (id) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleRemoveExtra = (id) => {
    setExtraServices((prev) => prev.filter((s) => s.id !== id));
  };

  const handleAddService = (svc) => {
    setExtraServices((prev) => [...prev, svc]);
  };

  const handleSubmit = async () => {
    if (!pickupLocation.trim()) { toast.error("Please enter a pickup location."); return; }
    if (!dropLocation.trim()) { toast.error("Please enter a drop location."); return; }
    if (!tripDate) { toast.error("Please select a trip date and time."); return; }

    setIsSubmitting(true);
    try {
      const includedSvcs = packageServices
        .filter((svc) => selectedServices.includes(svc.id))
        .map((svc) => ({ id: svc.id, name: svc.title ?? svc.name ?? `Service #${svc.id}` }));

      const addedSvcs = extraServices.map((svc) => ({
        id: svc.id,
        name: svc.title,
      }));

      const payload = {
        subscriptionId: plan.id,
        pickupLocation: pickupLocation.trim(),
        dropLocation: dropLocation.trim(),
        tripDate: new Date(tripDate).toISOString(),
        tripType,
        services: [...includedSvcs, ...addedSvcs],
        ...(extraServices.length > 0 && {
          additionalAmount: parseFloat(additionalAmount.toFixed(2)),
        }),
      };

      const data = await tripApiUser.requestTrip(payload);

      if (data?.success) {
        toast.success("Trip request submitted successfully!");
        onClose();
      } else {
        toast.error(data?.message || "Failed to submit trip request.");
      }
    } catch (error) {
      console.error("Error submitting trip request:", error);
      toast.error(error.response?.data?.message || "An error occurred while submitting request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          style={{ background: "var(--color-white)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1 rounded-full bg-[#c9a24b] hover:bg-slate-100 transition-colors z-10"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <X size={20} />
          </button>

          {/* Scrollable Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">

            {/* Header */}
            <div className="space-y-1">
              <h2
                className="text-2xl font-bold text-[26px]"
                style={{ color: "var(--color-navy)", fontFamily: "var(--font-playfair)" }}
              >
                Request a Trip
              </h2>
              <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                Fill in the details below to request your trip
              </p>
            </div>

            {/* ── Step 1: Package ── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                  style={{ background: "var(--color-navy)" }}
                >
                  1
                </div>
                <span className="font-bold text-xs" style={{ color: "var(--color-navy)" }}>
                  Select Package
                </span>
              </div>

              <div
                className="flex items-center gap-3 p-3 rounded-2xl border"
                style={{ borderColor: "var(--color-border)", background: "var(--color-white)" }}
              >
                <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {vehicleImg ? (
                    <img src={vehicleImg} alt={pkg.name ?? "Package"} className="w-full h-full object-cover" />
                  ) : (
                    <Package size={20} className="text-slate-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold truncate leading-tight" style={{ color: "var(--color-navy)" }}>
                    {pkg.name ?? "—"}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-tight">
                    {tripsLeft} {tripsLeft === 1 ? "trip" : "trips"} left • Valid till {formatDate(plan.endDate)}
                  </p>
                </div>
                <ChevronDown size={18} className="text-slate-400 flex-shrink-0 mr-1" />
              </div>
            </div>

            {/* ── Step 2: Trip Details ── */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                  style={{ background: "var(--color-navy)" }}
                >
                  2
                </div>
                <span className="font-bold text-xs" style={{ color: "var(--color-navy)" }}>
                  Trip Details
                </span>
              </div>

              <div className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Pickup Location</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <MapPin size={15} className="text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      placeholder="Airport Terminal 3"
                      className="block w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border focus:ring-1 transition-colors outline-none font-medium"
                      style={{
                        borderColor: "var(--color-border)",
                        color: "var(--color-navy)",
                        background: "var(--color-white)",
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Drop Location</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <MapPin size={15} className="text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={dropLocation}
                      onChange={(e) => setDropLocation(e.target.value)}
                      placeholder="Gurgaon Sector 45"
                      className="block w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border focus:ring-1 transition-colors outline-none font-medium"
                      style={{
                        borderColor: "var(--color-border)",
                        color: "var(--color-navy)",
                        background: "var(--color-white)",
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Trip Date & Time</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Calendar size={15} className="text-slate-400" />
                      </div>
                      <input
                        type="datetime-local"
                        value={tripDate}
                        onChange={(e) => setTripDate(e.target.value)}
                        className="block w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border focus:ring-1 transition-colors outline-none cursor-pointer font-medium"
                        style={{
                          borderColor: "var(--color-border)",
                          color: "var(--color-navy)",
                          background: "var(--color-white)",
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Trip Type</label>
                    <div className="relative">
                      <select
                        value={tripType}
                        onChange={(e) => setTripType(e.target.value)}
                        className="block w-full pl-3.5 pr-8 py-2.5 text-xs rounded-xl border focus:ring-1 transition-colors outline-none appearance-none cursor-pointer font-medium"
                        style={{
                          borderColor: "var(--color-border)",
                          color: "var(--color-navy)",
                          background: "var(--color-white)",
                        }}
                      >
                        <option value="airport-transfer">Airport Transfer</option>
                        <option value="8Hr/80Km">Local 8Hr/80Km</option>
                        <option value="Full day">Full day</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ChevronDown size={14} className="text-slate-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Step 3: Included Services ── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                  style={{ background: "var(--color-navy)" }}
                >
                  3
                </div>
                <span className="font-bold text-xs" style={{ color: "var(--color-navy)" }}>
                  Select Services{" "}
                  <span className="text-[10px] font-normal text-slate-400 ml-0.5">
                    (Included in your package)
                  </span>
                </span>
              </div>

              {/* Search filter */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Search size={14} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  value={serviceQuery}
                  onChange={(e) => setServiceQuery(e.target.value)}
                  placeholder="Filter services…"
                  disabled={loadingServices}
                  className="block w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border outline-none font-medium transition-colors focus:ring-1 disabled:opacity-60"
                  style={{
                    borderColor: "var(--color-border)",
                    color: "var(--color-navy)",
                    background: "var(--color-white)",
                  }}
                />
              </div>

              {loadingServices ? (
                <div className="flex items-center justify-center py-6 gap-2">
                  <Loader2 size={16} className="animate-spin text-slate-400" />
                  <span className="text-xs text-slate-400">Loading services…</span>
                </div>
              ) : packageServices.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">
                  {serviceQuery.trim() ? "No services match your filter." : "No services found for this package."}
                </p>
              ) : (
                <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
                  {/* Select all row */}
                  <label
                    className="flex items-center gap-3 px-3.5 py-2.5 border-b cursor-pointer select-none hover:bg-slate-50/60 transition-colors"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <input
                      type="checkbox"
                      checked={allChecked}
                      ref={(el) => { if (el) el.indeterminate = someChecked; }}
                      onChange={toggleAll}
                      className="w-4 h-4 rounded cursor-pointer accent-[var(--color-navy)]"
                    />
                    <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                      Select all ({packageServices.length})
                    </span>
                    {selectedServices.length > 0 && (
                      <span className="ml-auto text-[10px] font-semibold" style={{ color: "var(--color-navy)" }}>
                        {selectedServices.length} selected
                      </span>
                    )}
                  </label>

                  {/* Service rows */}
                  <div className="max-h-52 overflow-y-auto divide-y" style={{ borderColor: "var(--color-border)" }}>
                    {packageServices.map((svc) => {
                      const id = svc.id;
                      const label = svc.title ?? svc.name ?? `Service #${id}`;
                      const isSelected = selectedServices.includes(id);
                      const svcImg = getImageUrl(svc.thumbnailUrl ?? svc.thumbnailUrlKey);
                      const price = svc.price ?? svc.amount ?? svc.cost ?? null;
                      return (
                        <label
                          key={id}
                          className="flex items-center gap-3 px-3.5 py-3 cursor-pointer select-none hover:bg-slate-50/60 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleService(id)}
                            className="w-4 h-4 rounded cursor-pointer accent-[var(--color-navy)] flex-shrink-0"
                          />

                          <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                            {svcImg ? (
                              <img src={svcImg} alt={label} className="w-full h-full object-cover" />
                            ) : (
                              <Package size={16} className="text-slate-400" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold leading-tight truncate" style={{ color: "var(--color-navy)" }}>
                              {label}
                            </h4>
                            {svc.count != null && (
                              <p className="text-[10px] text-slate-400 mt-0.5">{svc.count} available</p>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {price != null ? (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5">
                                <IndianRupee size={9} />
                                {formatPrice(price)?.replace("₹", "")}
                              </span>
                            ) : null}
                            <span className="text-[10px] text-slate-300">#{id}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              <div
                className="flex items-start gap-2.5 p-3.5 rounded-2xl text-[11px] leading-snug font-medium"
                style={{ background: "#f0f5ff", color: "#2b6cb0" }}
              >
                <Info size={14} className="flex-shrink-0 mt-0.5 text-blue-500" />
                <span>You can only select services included in your package.</span>
              </div>
            </div>

            {/* ── Step 4: Extra Services ── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                    style={{ background: "var(--color-navy)" }}
                  >
                    4
                  </div>
                  <span className="font-bold text-xs" style={{ color: "var(--color-navy)" }}>
                    Add Extra Services{" "}
                    <span className="text-[10px] font-normal text-slate-400 ml-0.5">(Optional)</span>
                  </span>
                </div>

                <button
                  onClick={() => setShowAddService(true)}
                  className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all hover:opacity-80 active:scale-95 text-white"
                  style={{ background: "var(--color-navy)" }}
                >
                  <Plus size={11} />
                  Add
                </button>
              </div>

              {extraServices.length > 0 ? (
                <>
                  <div className="space-y-2">
                    {extraServices.map((svc) => {
                      const svcImg = getImageUrl(svc.thumbnailUrl);
                      return (
                        <div
                          key={svc.id}
                          className="flex items-center gap-3.5 p-3.5 rounded-2xl border"
                          style={{ borderColor: "var(--color-border)" }}
                        >
                          <div className="w-11 h-11 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                            {svcImg ? (
                              <img src={svcImg} alt={svc.title} className="w-full h-full object-cover" />
                            ) : (
                              <Package size={18} className="text-slate-400" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold leading-tight truncate" style={{ color: "var(--color-navy)" }}>
                              {svc.title}
                            </h4>
                            {svc.price != null ? (
                              <p className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-0.5">
                                <IndianRupee size={10} />
                                {formatPrice(svc.price)?.replace("₹", "")}
                              </p>
                            ) : (
                              <p className="text-[10px] text-slate-400 mt-0.5">Price on request</p>
                            )}
                          </div>

                          <button
                            onClick={() => handleRemoveExtra(svc.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors flex-shrink-0"
                          >
                            <Minus size={13} />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Additional cost summary */}
                  {additionalAmount > 0 && (
                    <div
                      className="flex items-center justify-between px-4 py-3 rounded-2xl border"
                      style={{ borderColor: "#c9a24b44", background: "#FFFDF5" }}
                    >
                      <div className="flex items-center gap-2">
                        <BadgePlus size={14} style={{ color: "#C9A24B" }} />
                        <span className="text-xs font-semibold" style={{ color: "var(--color-navy)" }}>
                          Additional Cost
                        </span>
                      </div>
                      <span className="text-sm font-bold flex items-center gap-0.5" style={{ color: "#C9A24B" }}>
                        <IndianRupee size={13} />
                        {additionalAmount.toLocaleString("en-IN", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div
                  className="rounded-2xl border border-dashed flex items-center justify-center py-5 gap-2 cursor-pointer hover:bg-slate-50/50 transition-colors"
                  style={{ borderColor: "var(--color-border)" }}
                  onClick={() => setShowAddService(true)}
                >
                  <Plus size={14} className="text-slate-300" />
                  <span className="text-xs text-slate-400 font-medium">No extra services added yet</span>
                </div>
              )}
            </div>

            {/* ── Footer ── */}
            <div className="space-y-4 pt-4 border-t border-slate-100 mt-2">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full cursor-pointer flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-bold transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:scale-100 text-white"
                style={{ background: "var(--color-navy)" }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={12} className="-rotate-12" />
                    Submit Trip Request
                  </>
                )}
              </button>
              <p className="text-[10px] text-slate-400 text-center font-medium">
                You can track your trip in Trip history
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Add Service Drawer */}
      {showAddService && (
        <AddServiceDrawer
          packageId={packageId}
          onAdd={handleAddService}
          onClose={() => setShowAddService(false)}
          existingIds={allServiceIds}
        />
      )}
    </>
  );
}