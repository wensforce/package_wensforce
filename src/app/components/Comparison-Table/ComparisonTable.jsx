"use client";

import {
  CheckCircle,
  X,
  Car,
  Users,
  ShieldCheck,
  Gem,
  Crown,
  Shield,
} from "lucide-react";
import { useComparison } from "./hooks/useComparison";
import { usePackages } from "../../hooks/usePackages";

// ─── Constants ────────────────────────────────────────────────────────────────
const INR = (n) => "₹" + Number(n).toLocaleString("en-IN");
const WA_NUMBER = "917304607954";

// Icons assigned by position (index). Falls back to Shield for extra packages.
const TIER_ICONS = [Car, Users, ShieldCheck, Gem, Crown];

// ─── Cell renderer ────────────────────────────────────────────────────────────
function CellValue({ value, isHighlight, isBold, isServiceRow }) {
  // Service row: null means package doesn't have this service → show ✗
  if (isServiceRow && (value === null || value === undefined)) {
    return (
      <span className="flex items-center justify-center">
        <X size={13} strokeWidth={2.5} className="text-red-300" />
      </span>
    );
  }

  // Empty / missing for non-service rows → em dash
  if (value === null || value === undefined || value === "—" || value === "") {
    return <span className="text-gray-200 text-sm">—</span>;
  }

  const str = String(value);

  // Armed security → green checkmark badge
  if (str.toLowerCase() === "armed") {
    return (
      <span className="flex items-center justify-center gap-1 text-xs font-semibold text-emerald-600">
        <CheckCircle size={12} strokeWidth={2} />
        Armed
      </span>
    );
  }

  // Service count e.g. "3×" → green with checkmark
  if (isServiceRow) {
    return (
      <span className="flex items-center justify-center gap-1 text-xs font-semibold text-emerald-600">
        <CheckCircle size={12} strokeWidth={2} />
        {str}
      </span>
    );
  }

  // Default text cell
  return (
    <span
      className={[
        "text-xs",
        isBold ? "font-bold" : "font-medium",
        isHighlight ? "text-[#C9A24B]" : "text-gray-700",
      ].join(" ")}
    >
      {str}
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ComparisonTable() {
  const waBase = `https://wa.me/${WA_NUMBER}?text=`;
 const { packages, bestValueId } = usePackages();

  // ── Guard: nothing to render ──────────────────────────────────────────────
  if (!packages || packages.length === 0) return null;

  const {
    effectiveHighlight,

    SERVICE_ROWS,
    STATIC_ROWS,
  } = useComparison({ packages, bestValueId });

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <section
      id="compare"
      className="w-full px-4 sm:px-8 py-16 max-w-6xl mx-auto"
    >
      {/* Section heading */}
      <div className="text-center mb-10">
        <p className="text-[#C9A24B] text-[10px] tracking-[0.4em] uppercase font-semibold mb-3">
          Side by Side
        </p>
        <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#0B1E3F] mb-3">
          Compare All {packages.length > 1 ? `${packages.length} ` : ""}
          {packages.length === 1 ? "Plan" : "Tiers"}
        </h2>
        <p className="text-gray-500 text-base font-light max-w-md mx-auto">
          Every feature at a glance — so you choose with complete clarity.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-3xl border border-gray-100 shadow-sm bg-white">
        <table className="w-full min-w-[700px] text-sm">
          {/* ── Column headers ─────────────────────────────────────────────── */}
          <thead>
            <tr className="border-b border-gray-100">
              {/* Empty label cell */}
              <th className="text-left px-6 py-5 text-xs text-gray-400 w-44 font-normal" />

              {packages.map((pkg, i) => {
                const TierIcon = TIER_ICONS[i] ?? Shield;
                const isHighlight = i === effectiveHighlight;

                return (
                  <th
                    key={pkg.id}
                    className={[
                      "px-3 py-5 text-center",
                      isHighlight
                        ? "bg-[#C9A24B]/6 border-x border-[#C9A24B]/15"
                        : "",
                    ].join(" ")}
                  >
                    <div className="flex flex-col items-center gap-1.5">
                      {/* Tier icon */}
                      <div
                        className={[
                          "w-8 h-8 rounded-xl flex items-center justify-center border",
                          isHighlight
                            ? "bg-[#C9A24B]/15 border-[#C9A24B]/25"
                            : "bg-gray-50 border-gray-100",
                        ].join(" ")}
                      >
                        <TierIcon
                          size={14}
                          strokeWidth={1.75}
                          className={
                            isHighlight ? "text-[#C9A24B]" : "text-gray-500"
                          }
                        />
                      </div>

                      {/* Package name */}
                      <div
                        className={[
                          "text-xs font-bold tracking-wide uppercase",
                          isHighlight ? "text-[#C9A24B]" : "text-gray-600",
                        ].join(" ")}
                      >
                        {pkg.name}
                      </div>

                      {/* Discounted price */}
                      <div
                        className={[
                          "text-[10px]",
                          isHighlight ? "text-[#C9A24B]/70" : "text-gray-400",
                        ].join(" ")}
                      >
                        {INR(pkg.discountedPrice)}* + GST 18% Extra/yr
                      </div>

                      {/* Strikethrough regular price if different */}
                      {pkg.regularPrice > pkg.discountedPrice && (
                        <div className="text-[9px] line-through text-gray-400">
                          {INR(pkg.regularPrice)}
                        </div>
                      )}

                      {/* Best value badge */}
                      {isHighlight && (
                        <div className="text-[9px] bg-[#C9A24B] text-black font-bold px-2.5 py-0.5 rounded-full tracking-wide">
                          BEST VALUE
                        </div>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* ── Data rows ──────────────────────────────────────────────────── */}
          <tbody>
            {[...STATIC_ROWS, ...SERVICE_ROWS].map((row, i) => (
              <tr
                key={row.label}
                className={[
                  "border-b border-gray-50",
                  i % 2 !== 0 ? "bg-gray-50/40" : "",
                ].join(" ")}
              >
                {/* Row label */}
                <td
                  className={[
                    "px-6 py-3.5 text-xs",
                    row.highlight ? "font-bold text-gray-700" : "text-gray-500",
                  ].join(" ")}
                >
                  {row.label}
                </td>

                {/* One cell per package */}
                {packages.map((pkg, j) => {
                  const isHighlight = j === effectiveHighlight;
                  const cellContent = row.render(pkg);

                  return (
                    <td
                      key={pkg.id}
                      className={[
                        "px-3 py-3.5 text-center",
                        isHighlight
                          ? "bg-[#C9A24B]/6 border-x border-[#C9A24B]/15"
                          : "",
                      ].join(" ")}
                    >
                      {/* JSX returned directly (e.g. the price cell) */}
                      {cellContent !== null &&
                      typeof cellContent === "object" ? (
                        <span className={isHighlight ? "text-[#C9A24B]" : ""}>
                          {cellContent}
                        </span>
                      ) : (
                        <CellValue
                          value={cellContent}
                          isHighlight={isHighlight}
                          isBold={!!row.highlight}
                          isServiceRow={!!row.isServiceRow}
                        />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>

          {/* ── CTA row ────────────────────────────────────────────────────── */}
          <tfoot>
            <tr className="border-t border-gray-100 bg-gray-50/50">
              <td className="px-6 py-4" />

              {packages.map((pkg, i) => {
                const isHighlight = i === effectiveHighlight;
                const msg = encodeURIComponent(
                  `Hi WENS Force, I'd like to join the ${pkg.name} membership (${INR(pkg.discountedPrice)}/yr). Please help me get started.`,
                );

                return (
                  <td
                    key={pkg.id}
                    className={[
                      "px-3 py-4 text-center",
                      isHighlight
                        ? "bg-[#C9A24B]/6 border-x border-[#C9A24B]/15"
                        : "",
                    ].join(" ")}
                  >
                    <a
                      href={`${waBase}${msg}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-[10px] whitespace-nowrap font-bold px-3 py-2 rounded-xl transition-all hover:opacity-90"
                      style={{
                        backgroundColor: isHighlight ? "#C9A24B" : "#0B1E3F",
                        color: isHighlight ? "#000" : "#fff",
                      }}
                    >
                      Get Started
                    </a>
                  </td>
                );
              })}
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
