"use client";

import { useState } from "react";
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
} from "lucide-react";
import { toast } from "sonner";
import { tripApiUser } from "@/app/user-apis/trip.api";

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

// ── RequestTripModal ──────────────────────────────────────────────────────────
export default function RequestTripModal({ plan, onClose }) {
  if (!plan) return null;

  const pkg = plan.package ?? {};
  const vehicleImg = getImageUrl(pkg.thumbnailUrl ?? pkg.thumbnailUrlKey);
  const tripsLeft = (plan.tripsTotal ?? 0) - (plan.tripsUsed ?? 0);

  // Form State
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [tripDate, setTripDate] = useState("");
  const [tripType, setTripType] = useState("airport-transfer");
  const [selectedServices, setSelectedServices] = useState(
    (plan.services ?? []).map((s) => s.id),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toggle service selection
  const handleToggleService = (id) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // Submit Handler
  const handleSubmit = async () => {
    if (!pickupLocation.trim()) {
      toast.error("Please enter a pickup location.");
      return;
    }
    if (!dropLocation.trim()) {
      toast.error("Please enter a drop location.");
      return;
    }
    if (!tripDate) {
      toast.error("Please select a trip date and time.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        subscriptionId: plan.id,
        pickupLocation: pickupLocation.trim(),
        dropLocation: dropLocation.trim(),
        tripDate: new Date(tripDate).toISOString(),
        tripType,
        services: (plan.services ?? [])
          .filter((svc) => selectedServices.includes(svc.id))
          .map((svc) => ({
            name: svc.title,
            price: 1,
            id: svc.id,
          })),
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
      toast.error(
        error.response?.data?.message ||
          "An error occurred while submitting request.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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

        {/* Modal Scrollable Content Container */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Header */}
          <div className="space-y-1">
            <h2
              className="text-2xl font-bold font-serif-display text-[26px]"
              style={{
                color: "var(--color-navy)",
                fontFamily: "var(--font-playfair)",
              }}
            >
              Request a Trip
            </h2>
            <p
              className="text-xs"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Fill in the details below to request your trip
            </p>
          </div>

          {/* Step 1: Select Package */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                style={{ background: "var(--color-navy)" }}
              >
                1
              </div>
              <span
                className="font-bold text-xs"
                style={{ color: "var(--color-navy)" }}
              >
                Select Package
              </span>
            </div>

            {/* Locked Active Package Card */}
            <div
              className="flex items-center gap-3 p-3 rounded-2xl border"
              style={{
                borderColor: "var(--color-border)",
                background: "var(--color-white)",
              }}
            >
              <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                {vehicleImg ? (
                  <img
                    src={vehicleImg}
                    alt={pkg.name ?? "Package"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package size={20} className="text-slate-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4
                  className="text-sm font-bold truncate leading-tight"
                  style={{ color: "var(--color-navy)" }}
                >
                  {pkg.name ?? "—"}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5 leading-tight">
                  {tripsLeft} {tripsLeft === 1 ? "trip" : "trips"} left • Valid
                  till {formatDate(plan.endDate)}
                </p>
              </div>
              <ChevronDown
                size={18}
                className="text-slate-400 flex-shrink-0 mr-1"
              />
            </div>
          </div>

          {/* Step 2: Trip Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                style={{ background: "var(--color-navy)" }}
              >
                2
              </div>
              <span
                className="font-bold text-xs"
                style={{ color: "var(--color-navy)" }}
              >
                Trip Details
              </span>
            </div>

            {/* Form Fields */}
            <div className="space-y-3.5">
              {/* Pickup Location */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">
                  Pickup Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <MapPin size={15} className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder="Airport Terminal 3"
                    className="block w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border focus:ring-1 focus:ring-navy focus:border-navy transition-colors outline-none font-medium"
                    style={{
                      borderColor: "var(--color-border)",
                      color: "var(--color-navy)",
                      background: "var(--color-white)",
                    }}
                  />
                </div>
              </div>

              {/* Drop Location */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">
                  Drop Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <MapPin size={15} className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={dropLocation}
                    onChange={(e) => setDropLocation(e.target.value)}
                    placeholder="Gurgaon Sector 45"
                    className="block w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border focus:ring-1 focus:ring-navy focus:border-navy transition-colors outline-none font-medium"
                    style={{
                      borderColor: "var(--color-border)",
                      color: "var(--color-navy)",
                      background: "var(--color-white)",
                    }}
                  />
                </div>
              </div>

              {/* Two Column Row (Date/Time & Type) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Trip Date & Time */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">
                    Trip Date & Time
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Calendar size={15} className="text-slate-400" />
                    </div>
                    <input
                      type="datetime-local"
                      value={tripDate}
                      onChange={(e) => setTripDate(e.target.value)}
                      className="block w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border focus:ring-1 focus:ring-navy focus:border-navy transition-colors outline-none cursor-pointer font-medium"
                      style={{
                        borderColor: "var(--color-border)",
                        color: "var(--color-navy)",
                        background: "var(--color-white)",
                      }}
                    />
                  </div>
                </div>

                {/* Trip Type */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">
                    Trip Type
                  </label>
                  <div className="relative">
                    <select
                      value={tripType}
                      onChange={(e) => setTripType(e.target.value)}
                      className="block w-full pl-3.5 pr-8 py-2.5 text-xs rounded-xl border focus:ring-1 focus:ring-navy focus:border-navy transition-colors outline-none appearance-none cursor-pointer font-medium"
                      style={{
                        borderColor: "var(--color-border)",
                        color: "var(--color-navy)",
                        background: "var(--color-white)",
                      }}
                    >
                      <option value="airport-transfer">Airport Transfer</option>
                      <option value="8Hr/80Km">Local 8Hr/80Km</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <ChevronDown size={14} className="text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Select Services */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                style={{ background: "var(--color-navy)" }}
              >
                3
              </div>
              <span
                className="font-bold text-xs"
                style={{ color: "var(--color-navy)" }}
              >
                Select Services{" "}
                <span className="text-[10px] font-normal text-slate-400 ml-0.5">
                  (Included in your package)
                </span>
              </span>
            </div>

            {/* Services List */}
            <div className="space-y-2">
              {plan.services && plan.services.length > 0 ? (
                plan.services.map((svc) => {
                  const isSelected = selectedServices.includes(svc.id);
                  const svcImg = getImageUrl(
                    svc.thumbnailUrl ?? svc.thumbnailUrlKey,
                  );

                  return (
                    <div
                      key={svc.id}
                      onClick={() => handleToggleService(svc.id)}
                      className="flex items-center gap-3.5 p-3.5 rounded-2xl border transition-all cursor-pointer hover:bg-slate-50/50"
                      style={{ borderColor: "var(--color-border)" }}
                    >
                      {/* Checkbox Icon wrapper */}
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all flex-shrink-0 ${
                          isSelected
                            ? "bg-slate-900 border-slate-900 text-white"
                            : "border-slate-300 hover:border-slate-400"
                        }`}
                        style={
                          isSelected
                            ? {
                                background: "var(--color-navy)",
                                borderColor: "var(--color-navy)",
                              }
                            : {}
                        }
                      >
                        {isSelected && (
                          <Check size={12} className="stroke-[3]" />
                        )}
                      </div>

                      {/* Service Thumbnail */}
                      <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {svcImg ? (
                          <img
                            src={svcImg}
                            alt={svc.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package size={20} className="text-slate-400" />
                        )}
                      </div>

                      {/* Title & Availability */}
                      <div className="flex-1 min-w-0">
                        <h4
                          className="text-xs font-bold leading-tight truncate"
                          style={{ color: "var(--color-navy)" }}
                        >
                          {svc.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                          {svc.count ?? 0} available
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-400 text-center py-2">
                  No services included in this package.
                </p>
              )}
            </div>

            {/* Info Message Box */}
            <div
              className="flex items-start gap-2.5 p-3.5 rounded-2xl text-[11px] leading-snug font-medium"
              style={{ background: "#f0f5ff", color: "#2b6cb0" }}
            >
              <Info size={14} className="flex-shrink-0 mt-0.5 text-blue-500" />
              <span>
                You can only select services included in your package.
              </span>
            </div>
          </div>

          {/* Footer Area */}
          <div className="space-y-4 pt-4 border-t border-slate-100 mt-2">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Submit Action Box */}
              <div className="w-full sm:flex-1 flex flex-col items-stretch">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full cursor-pointer flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-bold transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:scale-100 text-white"
                  style={{
                    background: "var(--color-navy)",
                  }}
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
              </div>
            </div>

            {/* Helper Text at the very bottom of the component */}
            <p className="text-[10px] text-slate-400 text-center font-medium">
              You can track your trip in Trip history
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
