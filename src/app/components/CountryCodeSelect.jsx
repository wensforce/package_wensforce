"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";

export default function CountryCodeSelect({ countries, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = countries.find((c) => c.code === value) ?? countries[0];
  const filtered = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.includes(search),
  );

  return (
    <div className="relative shrink-0" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          setSearch("");
        }}
        className="flex h-full items-center gap-1.5 whitespace-nowrap rounded-md border border-[var(--color-border)] bg-white px-3 py-2.5 text-[15px] text-[var(--color-text-primary)] outline-none transition hover:border-[var(--color-gold)]/60 focus:border-[var(--color-gold)] focus:ring-2 focus:ring-[var(--color-gold-light)]"
      >
        <span>{selected.flag}</span>
        <span>{selected.code}</span>
        <ChevronDown
          size={13}
          className="text-[var(--color-text-tertiary)] transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1.5 w-64 overflow-hidden rounded-lg border border-[var(--color-border)] bg-white shadow-xl">
          <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-3 py-2.5">
            <Search size={13} className="text-[var(--color-text-tertiary)]" />
            <input
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country..."
              className="flex-1 bg-transparent text-xs text-[var(--color-text-primary)] outline-none"
            />
          </div>
          <ul className="max-h-52 overflow-y-auto">
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-xs text-[var(--color-text-tertiary)]">
                No results
              </li>
            ) : (
              filtered.map((c, idx) => (
                <li key={`${c.code}-${c.name}-${idx}`}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(c.code);
                      setOpen(false);
                      setSearch("");
                    }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm transition hover:bg-[var(--color-cream)]"
                    style={{
                      background:
                        selected.name === c.name && selected.code === c.code
                          ? "var(--color-cream)"
                          : "transparent",
                    }}
                  >
                    <span className="text-base leading-none">{c.flag}</span>
                    <span className="flex-1 truncate text-xs text-[var(--color-text-primary)]">
                      {c.name}
                    </span>
                    <span className="shrink-0 text-xs font-medium text-[var(--color-text-secondary)]">
                      {c.code}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
