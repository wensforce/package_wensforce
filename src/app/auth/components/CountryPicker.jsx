"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { COUNTRIES, popular, others } from "../data/countries";

function FlagImg({ code }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/w20/${code.toLowerCase()}.png`}
      srcSet={`https://flagcdn.com/w40/${code.toLowerCase()}.png 2x`}
      width={20}
      height={15}
      alt={code}
      className="rounded-sm object-cover shrink-0"
    />
  );
}

function CountryRow({ c, isActive, onPick }) {
  return (
    <button
      type="button"
      onClick={() => onPick(c)}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors duration-100 group"
      style={{ background: isActive ? "rgba(201,162,75,0.1)" : "transparent" }}
      onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "rgba(0,0,0,0.04)"; }}
      onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
    >
      <FlagImg code={c.code} />
      <span
        className="flex-1 text-sm truncate font-medium"
        style={{ color: isActive ? "#C9A24B" : "#1e293b" }}
      >
        {c.name}
      </span>
      <span
        className="text-xs font-mono shrink-0"
        style={{ color: isActive ? "#C9A24B" : "#94a3b8" }}
      >
        {c.dial}
      </span>
    </button>
  );
}

export default function CountryPicker({ selected, onSelect }) {
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef           = useRef(null);
  const searchRef         = useRef(null);

  /* Close on outside click */
  useEffect(() => {
    function handler(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", handler);
      setTimeout(() => searchRef.current?.focus(), 40);
    }
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  /* Close on Escape */
  useEffect(() => {
    function handler(e) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const q = query.toLowerCase().trim();
  const filtered = q
    ? COUNTRIES.filter((c) => c.name.toLowerCase().includes(q) || c.dial.includes(q))
    : null;

  function pick(c) { onSelect(c); setOpen(false); setQuery(""); }

  return (
    <div ref={wrapRef} className="relative shrink-0">

      {/* ── Trigger — standalone pill button ── */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 px-4 py-3.5 rounded-2xl w-full transition-all duration-150 hover:brightness-95 active:scale-[0.98]"
        style={{
          background: open ? "#f1f5f9" : "#f8fafc",
          border: open ? "1.5px solid #C9A24B" : "1.5px solid #e2e8f0",
          boxShadow: open ? "0 0 0 3px rgba(201,162,75,0.1)" : "none",
        }}
      >
        <FlagImg code={selected.code} />
        <span className="text-sm font-bold flex-1 text-left" style={{ color: "#1e293b" }}>
          {selected.dial}
        </span>
        <ChevronDown
          size={14}
          className="transition-transform duration-200 shrink-0"
          style={{
            color: "#94a3b8",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {/* ── Dropdown ── */}
      {open && (
        <div
          className="absolute left-0 top-full mt-2 z-50 rounded-2xl overflow-hidden"
          style={{
            width: 280,
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          {/* Search */}
          <div className="p-2">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
            >
              <Search size={13} style={{ color: "#94a3b8" }} className="shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search country or code…"
                className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-300 outline-none"
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} className="shrink-0">
                  <X size={12} style={{ color: "#94a3b8" }} />
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="overflow-y-auto px-2 pb-2" style={{ maxHeight: 240 }}>
            {filtered ? (
              filtered.length ? (
                filtered.map((c) => (
                  <CountryRow key={c.code} c={c} isActive={c.code === selected.code} onPick={pick} />
                ))
              ) : (
                <p className="text-center text-xs py-5 text-gray-400">No results</p>
              )
            ) : (
              <>
                <p className="text-[9px] font-bold tracking-[0.3em] uppercase px-3 pt-2 pb-1.5"
                  style={{ color: "#C9A24B" }}>
                  Popular
                </p>
                {popular.map((c) => (
                  <CountryRow key={c.code} c={c} isActive={c.code === selected.code} onPick={pick} />
                ))}
                <div className="my-1.5 mx-1" style={{ height: 1, background: "#f1f5f9" }} />
                <p className="text-[9px] font-bold tracking-[0.3em] uppercase px-3 pt-1.5 pb-1.5 text-gray-400">
                  All Countries
                </p>
                {others.map((c) => (
                  <CountryRow key={c.code} c={c} isActive={c.code === selected.code} onPick={pick} />
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
