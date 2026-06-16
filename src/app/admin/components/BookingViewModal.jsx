"use client";

import { useState } from "react";
import {
  X,
  CheckCircle2,
  XCircle,
  AlertCircle,
  User,
  Phone,
  Package,
  CreditCard,
  MapPin,
  Calendar,
  Hash,
  Clock,
  Loader2,
  ChevronDown,
} from "lucide-react";
import api from "../../axios/axios";

const STATUS_CONFIG = {
  confirmed: { label: "Confirmed", icon: CheckCircle2, cls: "bg-green-100 text-green-700" },
  completed: { label: "Completed", icon: CheckCircle2, cls: "bg-green-100 text-green-700" },
  pending:   { label: "Pending",   icon: AlertCircle,  cls: "bg-yellow-100 text-yellow-700" },
  initiated: { label: "Initiated", icon: AlertCircle,  cls: "bg-blue-100 text-blue-600" },
  cancelled: { label: "Cancelled", icon: XCircle,      cls: "bg-red-100 text-red-600" },
  failed:    { label: "Failed",    icon: XCircle,      cls: "bg-red-100 text-red-700" },
};

const ALL_STATUSES = ["pending", "initiated", "confirmed", "completed", "cancelled", "failed"];

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function formatAmount(val, currency) {
  if (val == null) return "—";
  const symbol = currency === "INR" || !currency ? "₹" : currency + " ";
  return symbol + Number(val).toLocaleString("en-IN");
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-[#FAF6EC] flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon size={14} className="text-[#C9A24B]" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-[#A0AEC0] uppercase tracking-wide font-medium">{label}</p>
        <p className="text-sm text-[#1A202C] font-medium mt-0.5 break-all">{value || "—"}</p>
      </div>
    </div>
  );
}

export default function BookingViewModal({ booking, onClose, onStatusUpdated }) {
  const [selectedStatus, setSelectedStatus] = useState(booking.status);
  const [updating, setUpdating]             = useState(false);
  const [updateError, setUpdateError]       = useState(null);
  const [updateSuccess, setUpdateSuccess]   = useState(false);

  const cfg        = STATUS_CONFIG[booking.status] ?? { label: booking.status, icon: AlertCircle, cls: "bg-gray-100 text-gray-600" };
  const StatusIcon = cfg.icon;
  const isDirty    = selectedStatus !== booking.status;

  async function handleUpdateStatus() {
    if (!isDirty) return;
    setUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(false);
    try {
      await api.put(`/booking/status/${booking.id}`, { status: selectedStatus });
      setUpdateSuccess(true);
      onStatusUpdated?.(booking.id, selectedStatus);
      setTimeout(() => setUpdateSuccess(false), 2000);
    } catch (err) {
      setUpdateError(err?.response?.data?.message || "Failed to update status.");
    } finally {
      setUpdating(false);
    }
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#CBD5E0]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0B1E3F] flex items-center justify-center">
              <span className="text-[#C9A24B] font-bold text-sm">
                {booking.user?.name?.charAt(0)?.toUpperCase() ?? "?"}
              </span>
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0B1E3F]">Booking #{booking.id}</h2>
              <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${cfg.cls}`}>
                <StatusIcon size={10} />
                {cfg.label}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#A0AEC0] hover:text-[#0B1E3F] hover:bg-[#FAF6EC] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-6">

          {/* Customer */}
          <section>
            <h3 className="text-xs font-bold text-[#0B1E3F] uppercase tracking-wider mb-3">Customer</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DetailRow icon={User}  label="Name"   value={booking.user?.name} />
              <DetailRow icon={Phone} label="Mobile" value={booking.user?.mobileNumber} />
            </div>
          </section>

          <div className="border-t border-[#CBD5E0]" />

          {/* Booking Details */}
          <section>
            <h3 className="text-xs font-bold text-[#0B1E3F] uppercase tracking-wider mb-3">Booking Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DetailRow icon={Package}    label="Package"    value={booking.packageName} />
              <DetailRow icon={CreditCard} label="Amount"     value={formatAmount(booking.purchaseAmount, booking.currency)} />
              <DetailRow icon={Calendar}   label="Date"       value={formatDate(booking.purchaseDate)} />
              <DetailRow icon={Clock}      label="Validity"   value={booking.validity} />
              <DetailRow icon={MapPin}     label="City"       value={booking.serviceCity && booking.serviceCity !== "Not specified" ? booking.serviceCity : null} />
              <DetailRow icon={Hash}       label="Currency"   value={booking.currency} />
            </div>
          </section>

          {booking.cashfreeOrderId && (
            <>
              <div className="border-t border-[#CBD5E0]" />
              <section>
                <h3 className="text-xs font-bold text-[#0B1E3F] uppercase tracking-wider mb-3">Payment</h3>
                <DetailRow icon={Hash} label="Cashfree Order ID" value={booking.cashfreeOrderId} />
              </section>
            </>
          )}

          <div className="border-t border-[#CBD5E0]" />

          {/* Status Update */}
          <section>
            <h3 className="text-xs font-bold text-[#0B1E3F] uppercase tracking-wider mb-3">Update Status</h3>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full appearance-none text-sm bg-[#FAF6EC] border border-[#CBD5E0] rounded-lg px-3 py-2.5 pr-8 text-[#1A202C] outline-none focus:border-[#C9A24B] transition-colors cursor-pointer capitalize"
                >
                  {ALL_STATUSES.map((s) => (
                    <option key={s} value={s} className="capitalize">{s}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A0AEC0] pointer-events-none" />
              </div>
              <button
                onClick={handleUpdateStatus}
                disabled={!isDirty || updating}
                className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-lg bg-[#0B1E3F] text-white hover:bg-[#1E3A6F] transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {updating && <Loader2 size={13} className="animate-spin" />}
                {updating ? "Saving…" : "Save Status"}
              </button>
            </div>

            {updateSuccess && (
              <p className="flex items-center gap-1.5 mt-2 text-xs text-green-600 font-medium">
                <CheckCircle2 size={13} /> Status updated successfully
              </p>
            )}
            {updateError && (
              <p className="flex items-center gap-1.5 mt-2 text-xs text-red-600 font-medium">
                <XCircle size={13} /> {updateError}
              </p>
            )}
          </section>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-[#CBD5E0]">
          <button
            onClick={onClose}
            className="text-sm font-medium text-[#4A5568] border border-[#CBD5E0] px-4 py-2 rounded-lg hover:bg-[#FAF6EC] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
