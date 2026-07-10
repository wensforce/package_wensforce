"use client";

import { useState } from "react";
import Link from "next/link";

const INR = (n) => "₹" + Number(n).toLocaleString("en-IN");

/* ── Individual card with its own hover state ── */
function PlanCard({ p }) {
  const [isHovered, setIsHovered] = useState(false);
  const hasDiscount = p.regularPrice && p.regularPrice > p.discountedPrice;

  return (
    <Link
      href={`/membership/${p.id}`}
      className="group relative rounded-2xl overflow-hidden transition-all hover:-translate-y-1"
      style={{ boxShadow: "0 4px 16px -4px rgba(0,0,0,0.12)" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative p-5 h-full flex flex-col bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${p.thumbnailUrl})` }}
      >
        {/* Overlay — lightens slightly on hover */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{ backgroundColor: `rgba(0,0,0,${isHovered ? 0.42 : 0.55})` }}
        />

        {/* Gold border ring — appears on hover */}
        <div
          className="absolute inset-0 rounded-2xl border-2 transition-opacity duration-300 pointer-events-none"
          style={{
            borderColor: "#C9A24B",
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          <span className="text-[10px] font-black tracking-widest uppercase text-white mb-3">
            {p.name}
          </span>

          {hasDiscount && (
            <span className="text-[10px] line-through text-white/40">
              {INR(p.regularPrice)}
            </span>
          )}

          <div className="text-lg font-black leading-none mb-0.5 text-white">
            {INR(p.discountedPrice)}*
          </div>

          <div className="text-[9px] font-light mb-4 text-white/70">
            per year
          </div>

          <div
            className="mt-auto inline-flex items-center gap-1 text-[9px] font-bold px-2.5 py-1 rounded-full w-fit transition-all duration-300"
            style={{
              backgroundColor: isHovered
                ? "rgba(201,162,75,0.25)"
                : "rgba(255,255,255,0.10)",
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: isHovered
                ? "rgba(201,162,75,0.6)"
                : "rgba(255,255,255,0.20)",
              color: isHovered ? "#f0c940" : "rgba(255,255,255,0.80)",
            }}
          >
            View plan
            <span
              className="transition-transform duration-300"
              style={{ transform: isHovered ? "translateX(3px)" : "translateX(0)" }}
            >
              →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ── Section ── */
export default function OtherPlansSection({ plans, currentId }) {
  const list = (plans || []).filter((p) => p.id !== currentId);

  if (list.length === 0) return null;

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#C9A24B] text-[9px] tracking-[0.5em] uppercase font-semibold mb-3">
            Compare Options
          </p>
          <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#0B1E3F]">
            Explore other tiers
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {list.map((p) => (
            <PlanCard key={p.id} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}