"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function DatePicker({ value, onChange, minDate, placeholder }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const min = startOfDay(minDate ?? new Date());
  const selectedDate = value ? new Date(`${value}T00:00:00`) : null;
  const [viewDate, setViewDate] = useState(selectedDate ?? min);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const startWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const today = new Date();
  const canGoPrevMonth = new Date(year, month, 1) > min;

  const displayLabel = selectedDate
    ? selectedDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : placeholder ?? "Select date";

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2.5 rounded-md border border-[var(--color-border)] bg-white px-3.5 py-2.5 text-[15px] outline-none transition hover:border-[var(--color-gold)]/60 focus:border-[var(--color-gold)] focus:ring-2 focus:ring-[var(--color-gold-light)]"
      >
        <CalendarDays
          size={15}
          className="shrink-0 text-[var(--color-gold-dark)]"
          strokeWidth={1.75}
        />
        <span
          className={
            selectedDate
              ? "text-[var(--color-text-primary)]"
              : "text-[var(--color-text-tertiary)]"
          }
        >
          {displayLabel}
        </span>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1.5 w-72 rounded-lg border border-[var(--color-border)] bg-white p-3 shadow-xl">
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              disabled={!canGoPrevMonth}
              onClick={() => setViewDate(new Date(year, month - 1, 1))}
              className="rounded-md p-1.5 text-[var(--color-text-secondary)] transition hover:bg-[var(--color-cream)] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-semibold text-[var(--color-navy)]">
              {MONTHS[month]} {year}
            </span>
            <button
              type="button"
              onClick={() => setViewDate(new Date(year, month + 1, 1))}
              className="rounded-md p-1.5 text-[var(--color-text-secondary)] transition hover:bg-[var(--color-cream)]"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-[var(--color-text-tertiary)]">
            {WEEKDAYS.map((w) => (
              <div key={w} className="py-1">
                {w}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, idx) => {
              if (day === null) return <div key={`empty-${idx}`} />;

              const cellDate = new Date(year, month, day);
              const disabled = cellDate < min;
              const selected =
                selectedDate &&
                selectedDate.getFullYear() === year &&
                selectedDate.getMonth() === month &&
                selectedDate.getDate() === day;
              const isToday =
                today.getFullYear() === year &&
                today.getMonth() === month &&
                today.getDate() === day;

              return (
                <button
                  key={day}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    onChange(toISODate(cellDate));
                    setOpen(false);
                  }}
                  className="aspect-square rounded-md text-[13px] transition disabled:cursor-not-allowed disabled:text-[var(--color-text-tertiary)] disabled:opacity-40 enabled:hover:bg-[var(--color-cream)]"
                  style={{
                    background: selected ? "var(--color-navy)" : undefined,
                    color: selected
                      ? "var(--color-gold-light)"
                      : "var(--color-text-primary)",
                    border:
                      isToday && !selected
                        ? "1px solid var(--color-gold)"
                        : undefined,
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
