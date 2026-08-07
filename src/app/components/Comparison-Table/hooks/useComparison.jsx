const INR = (n) => "₹" + Number(n).toLocaleString("en-IN");
// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Search packageServices[] for a service matching any of the provided keywords
 * against serviceType, name, label, or type fields.
 * Returns the best "value" field found, or null.
 *
 * Adapt the field names (serviceType, quantity, value, etc.) once you share
 * the full packageServices structure — this covers the most common shapes.
 */
import React from "react";
import { formatPackageValidity } from "@/app/utils/formatPackageValidity";

function getService(packageServices = [], ...keywords) {
  if (!Array.isArray(packageServices)) return null;

  const service = packageServices.find((s) => {
    const haystack = [s.serviceType, s.name, s.label, s.type, s.serviceName]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return keywords.some((kw) => haystack.includes(kw.toLowerCase()));
  });

  if (!service) return null;

  // Try common "amount/count" field names in order of preference
  return (
    service.quantity ??
    service.count ??
    service.value ??
    service.amount ??
    service.visits ??
    service.label ??
    null
  );
}

// Format vehicleType + vehicleModel into one readable string
function formatVehicle(pkg) {
  const type = pkg.vehicleType ?? "";
  const model = pkg.vehicleModel ?? "";
  if (type && model) return `${type} · ${model}`;
  return type || model || "—";
}

// ─── Row definitions ──────────────────────────────────────────────────────────
// Each row has:
//   label     — left-column text
//   highlight — bold/accent treatment for the row label
//   render    — fn(pkg) → string | number | null | JSX
//
// Rows that pull from packageServices will show "—" gracefully until the
// backend structure is confirmed and keywords are tuned.

// ── 5 static rows — always shown ─────────────────────────────────────────────
const STATIC_ROWS = [
  {
    label: "Plan Price",
    highlight: true,
    render: (pkg) => (
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-xs font-bold text-inherit">
          {INR(pkg.discountedPrice)}
        </span>
        {pkg.regularPrice > pkg.discountedPrice && (
          <span className="text-[10px] line-through text-gray-400">
            {INR(pkg.regularPrice)}
          </span>
        )}
        <span className="text-[9px] text-gray-400 font-normal">
          + GST 18% / yr
        </span>
      </div>
    ),
  },
  {
    label: "Trips / Year",
    render: (pkg) => pkg.trips ?? "—",
  },
  {
    label: "Validity",
    render: (pkg) => formatPackageValidity(pkg.validity),
  },
  {
    label: "Vehicle Class",
    render: (pkg) => formatVehicle(pkg),
  },
  {
    label: "Security",
    render: (pkg) => pkg.bodyguardType ?? "—",
  },
];

export const useComparison = ({ packages = [], bestValueId }) => {
  // ── Determine which column gets the "BEST VALUE" highlight ───────────────
  const highlightIndex =
    bestValueId !== undefined
      ? packages.findIndex((p) => p.id === bestValueId)
      : Math.floor(packages.length / 2);

  const effectiveHighlight =
    highlightIndex === -1 ? Math.floor(packages.length / 2) : highlightIndex;

  // ── Build dynamic service rows from all unique service titles ─────────────
  // Each unique service title across all packages becomes one row.
  // Cell shows count (e.g. "3×") if the package has it, ✗ if not.
  const allServiceTitles = [
    ...new Set(
      packages.flatMap((p) =>
        (p.packageServices || []).map((s) => s.service?.title).filter(Boolean),
      ),
    ),
  ];

  const SERVICE_ROWS = allServiceTitles.map((title) => ({
    label: title.charAt(0).toUpperCase() + title.slice(1), // capitalise first letter
    isServiceRow: true,
    render: (pkg) => {
      const match = (pkg.packageServices || []).find(
        (s) => s.service?.title === title,
      );
      return match ? `${match.count}×` : null; // null → ✗ in CellValue
    },
  }));
  return {
    highlightIndex,
    effectiveHighlight,
    allServiceTitles,
    SERVICE_ROWS,
    STATIC_ROWS,
  };
};
