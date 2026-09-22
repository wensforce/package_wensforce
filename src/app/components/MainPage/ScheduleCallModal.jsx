"use client";

import { useEffect, useRef, useState } from "react";
import {
  X,
  Phone,
  Users,
  Loader2,
  CheckCircle2,
  ChevronDown,
  Search,
  CalendarClock,
} from "lucide-react";
import { scheduleApiUser } from "@/app/user-apis/schedule.api";
import { COUNTRY_CODES } from "@/app/hooks/useAuthFlow";

const TIME_SLOTS = [
  { id: "morning", label: "Morning (10 AM – 1 PM)", hour: 10, minute: 0 },
  { id: "afternoon", label: "Afternoon (1 PM – 5 PM)", hour: 13, minute: 0 },
  { id: "evening", label: "Evening (5 PM – 8 PM)", hour: 17, minute: 0 },
];

function pad(n) {
  return String(n).padStart(2, "0");
}

function todayISO() {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  return new Date(d.getTime() - offset * 60000).toISOString().slice(0, 10);
}

function combineDateTime(date, slot) {
  const day = date || todayISO();
  const hour = slot?.hour ?? 10;
  const minute = slot?.minute ?? 0;
  return `${day}T${pad(hour)}:${pad(minute)}:00+05:30`;
}

function formatDisplayWhen(date, slot) {
  if (!date) return slot?.label || "Flexible";
  const [y, m, d] = date.split("-");
  const pretty = `${d}/${m}/${y}`;
  return `${pretty} · ${slot?.label || ""}`;
}

const MODES = [
  { id: "call", label: "Call", Icon: Phone },
  { id: "meeting", label: "Meeting", Icon: Users },
];

const EMPTY_FORM = {
  mode: "call",
  name: "",
  phone: "",
  date: "",
  slot: TIME_SLOTS[0].id,
  note: "",
};

export default function ScheduleCallModal({ open, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const dropdownRef = useRef(null);
  const isMeeting = form.mode === "meeting";
  const selectedSlot =
    TIME_SLOTS.find((slot) => slot.id === form.slot) || TIME_SLOTS[0];

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setForm(EMPTY_FORM);
      setSelectedCountry(COUNTRY_CODES[0]);
      setDropdownOpen(false);
      setCountrySearch("");
      setSubmitting(false);
      setError("");
      setSuccess(false);
      setSubmitted(null);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
        setCountrySearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!open) return null;

  const filteredCountries = COUNTRY_CODES.filter(
    (c) =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.code.includes(countrySearch),
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setError("");
    setSubmitting(true);

    try {
      const type = form.mode === "meeting" ? "meeting" : "call";
      const scheduledAt = combineDateTime(form.date.trim(), selectedSlot);
      const phone = `${selectedCountry.code} ${form.phone.trim()}`;

      const res = await scheduleApiUser.create({
        type,
        name: form.name.trim(),
        phone,
        scheduledAt,
        note: form.note.trim(),
        pageUrl: window.location.href,
      });

      if (res?.success === false) {
        throw new Error(res.message || "Could not submit your request.");
      }

      setSubmitted({
        type,
        name: form.name.trim(),
        phone,
        when: formatDisplayWhen(form.date.trim(), selectedSlot),
      });
      setSuccess(true);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Could not submit your request. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="relative bg-white rounded-3xl p-7 sm:p-9 max-w-md w-full shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto"
        style={{ boxShadow: "0 24px 64px rgba(11,30,63,0.25)" }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="schedule-call-title"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-300 hover:text-gray-500 text-xl leading-none"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {success && submitted ? (
          <div className="text-center pt-2">
            <div
              className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-5"
              style={{
                background: "linear-gradient(135deg,#C9A24B 0%,#e0b85a 100%)",
                boxShadow: "0 10px 28px rgba(201,162,75,0.35)",
              }}
            >
              <CheckCircle2 size={30} color="#0B1E3F" strokeWidth={2.2} />
            </div>
            <p className="text-[#C9A24B] text-[10px] tracking-[0.4em] uppercase font-semibold mb-2">
              Request received
            </p>
            <h3
              id="schedule-call-title"
              className="font-serif-display text-2xl font-bold text-[#0B1E3F] mb-2 leading-snug"
            >
              {submitted.type === "meeting"
                ? "Meeting request sent"
                : "Call request sent"}
            </h3>
            <p className="text-gray-500 text-sm font-light leading-relaxed mb-6">
              Our concierge will confirm with you shortly on WhatsApp or phone.
            </p>

            <div className="text-left rounded-2xl border border-[#C9A24B]/20 bg-[#FAF6EC] px-4 py-3.5 space-y-2.5 mb-6">
              <div className="flex justify-between gap-3 text-sm">
                <span className="text-gray-400">Type</span>
                <span className="font-semibold text-[#0B1E3F] capitalize">
                  {submitted.type}
                </span>
              </div>
              <div className="flex justify-between gap-3 text-sm">
                <span className="text-gray-400">Name</span>
                <span className="font-semibold text-[#0B1E3F]">
                  {submitted.name}
                </span>
              </div>
              <div className="flex justify-between gap-3 text-sm">
                <span className="text-gray-400">Phone</span>
                <span className="font-semibold text-[#0B1E3F]">
                  {submitted.phone}
                </span>
              </div>
              <div className="flex justify-between gap-3 text-sm">
                <span className="text-gray-400">When</span>
                <span className="font-semibold text-[#0B1E3F] text-right">
                  {submitted.when}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #0B1E3F 0%, #1a3a6b 100%)",
                color: "#C9A24B",
              }}
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
              style={{
                background: "rgba(201,162,75,0.12)",
                border: "1px solid rgba(201,162,75,0.3)",
              }}
            >
              {isMeeting ? (
                <Users size={20} style={{ color: "#C9A24B" }} />
              ) : (
                <Phone size={20} style={{ color: "#C9A24B" }} />
              )}
            </div>

            <p className="text-[#C9A24B] text-[10px] tracking-[0.4em] uppercase font-semibold mb-2">
              Concierge
            </p>
            <h3
              id="schedule-call-title"
              className="font-serif-display text-2xl font-bold text-[#0B1E3F] mb-1.5 leading-snug"
            >
              {isMeeting ? "Schedule a meeting" : "Schedule a call"}
            </h3>
            <p className="text-gray-500 text-sm font-light leading-relaxed mb-5">
              {isMeeting
                ? "Pick a time for a meeting. Our team will confirm shortly."
                : "Tell us when to reach you. Our team will confirm the call shortly."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div
                className="grid grid-cols-2 p-1 rounded-xl bg-[#FAF6EC] border border-[#C9A24B]/20"
                role="tablist"
                aria-label="Call or meeting"
              >
                {MODES.map(({ id, label, Icon }) => {
                  const active = form.mode === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setForm({ ...form, mode: id })}
                      className="flex items-center justify-center gap-1.5 py-2 rounded-[10px] text-xs font-semibold transition-all"
                      style={
                        active
                          ? {
                              background:
                                "linear-gradient(135deg, #0B1E3F 0%, #1a3a6b 100%)",
                              color: "#C9A24B",
                              boxShadow: "0 4px 12px rgba(11,30,63,0.18)",
                            }
                          : { color: "#6B7280" }
                      }
                    >
                      <Icon size={13} />
                      {label}
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 tracking-[0.22em] uppercase">
                  Full name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  minLength={2}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Rajan Mehta"
                  className="w-full px-3.5 py-2.5 text-sm text-gray-800 rounded-xl border border-gray-200 outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/10 placeholder:text-gray-300"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 tracking-[0.22em] uppercase">
                  Phone <span className="text-red-400">*</span>
                </label>
                <div className="relative flex" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen((o) => !o);
                      setCountrySearch("");
                    }}
                    className="flex items-center gap-1 px-2.5 text-sm font-medium rounded-l-xl border border-r-0 border-gray-200 bg-[#FAF6EC] text-gray-600 whitespace-nowrap"
                    style={{ minWidth: "86px" }}
                  >
                    <span>{selectedCountry.flag}</span>
                    <span>{selectedCountry.code}</span>
                    <ChevronDown
                      size={12}
                      className="transition-transform duration-200"
                      style={{
                        transform: dropdownOpen
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      }}
                    />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute left-0 top-full mt-1.5 z-50 w-[240px] rounded-xl overflow-hidden bg-white border border-gray-200 shadow-xl">
                      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-gray-100">
                        <Search size={13} className="text-gray-400" />
                        <input
                          type="text"
                          autoFocus
                          value={countrySearch}
                          onChange={(e) => setCountrySearch(e.target.value)}
                          placeholder="Search country..."
                          className="flex-1 text-xs outline-none bg-transparent text-gray-800"
                        />
                      </div>
                      <ul className="max-h-52 overflow-y-auto">
                        {filteredCountries.length === 0 ? (
                          <li className="px-4 py-3 text-xs text-gray-400">
                            No results
                          </li>
                        ) : (
                          filteredCountries.map((c, idx) => (
                            <li key={`${c.code}-${c.name}-${idx}`}>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedCountry(c);
                                  setDropdownOpen(false);
                                  setCountrySearch("");
                                }}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left hover:bg-[#FAF6EC]"
                                style={{
                                  background:
                                    selectedCountry.name === c.name &&
                                    selectedCountry.code === c.code
                                      ? "#FAF6EC"
                                      : "transparent",
                                }}
                              >
                                <span className="text-base leading-none">
                                  {c.flag}
                                </span>
                                <span className="flex-1 truncate text-xs text-gray-800">
                                  {c.name}
                                </span>
                                <span className="text-xs font-medium text-gray-500 shrink-0">
                                  {c.code}
                                </span>
                              </button>
                            </li>
                          ))
                        )}
                      </ul>
                    </div>
                  )}

                  <input
                    type="tel"
                    inputMode="numeric"
                    required
                    value={form.phone}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        phone: e.target.value.replace(/\D/g, "").slice(0, 15),
                      })
                    }
                    placeholder="98765 43210"
                    className="flex-1 px-3.5 py-2.5 text-sm text-gray-800 rounded-r-xl border border-gray-200 outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/10 placeholder:text-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1.5 tracking-[0.22em] uppercase">
                    Date
                  </label>
                  <input
                    type="date"
                    min={todayISO()}
                    value={form.date}
                    onChange={(e) =>
                      setForm({ ...form, date: e.target.value })
                    }
                    className="w-full px-3 py-2.5 text-sm text-gray-800 rounded-xl border border-gray-200 outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/10"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1.5 tracking-[0.22em] uppercase">
                    Time
                  </label>
                  <select
                    value={form.slot}
                    onChange={(e) =>
                      setForm({ ...form, slot: e.target.value })
                    }
                    className="w-full px-3 py-2.5 text-sm text-gray-800 rounded-xl border border-gray-200 outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/10 bg-white"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot.id} value={slot.id}>
                        {slot.label.split(" (")[0]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 tracking-[0.22em] uppercase">
                  Note
                </label>
                <textarea
                  rows={2}
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder={
                    isMeeting
                      ? "Anything we should know before the meeting?"
                      : "Anything we should know before the call?"
                  }
                  className="w-full px-3.5 py-2.5 text-sm text-gray-800 rounded-xl border border-gray-200 outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/10 placeholder:text-gray-300 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background:
                    "linear-gradient(135deg, #C9A24B 0%, #e0b85a 100%)",
                  color: "#0B1E3F",
                }}
              >
                {submitting ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    {isMeeting ? <Users size={15} /> : <CalendarClock size={15} />}
                    {isMeeting ? "Request a meeting" : "Request a call"}
                  </>
                )}
              </button>
              {error && (
                <p className="text-center text-red-500 text-xs">{error}</p>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
}
