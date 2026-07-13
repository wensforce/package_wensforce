"use client";

import {
  Check,
  Shield,
  Car,
  Users,
  RotateCcw,
  Calendar,
  Headphones,
  Star,
  MapPin,
  Lock,
} from "lucide-react";
import { INR } from "@/app/(protected)/booking/booking-helpers";

/* ── Helpers (local to this panel) ───────────────────────────────────── */

const SERVICE_ICONS = [
  Star,
  Headphones,
  MapPin,
  Users,
  Lock,
  Car,
  Shield,
  Check,
];

const formatVehicleType = (v) => {
  if (!v) return "";
  const u = v.toUpperCase();
  return ["SUV", "MPV", "EV", "VIP", "VAN", "MUV"].includes(u)
    ? u
    : v.charAt(0).toUpperCase() + v.slice(1).toLowerCase();
};

const buildCapsules = (pkg) => {
  const items = [];
  if (pkg.trips)
    items.push({
      Icon: RotateCcw,
      text: `${pkg.trips} Trip${pkg.trips !== 1 ? "s" : ""}`,
    });
  if (pkg.validity)
    items.push({
      Icon: Calendar,
      text: `${pkg.validity} Month${pkg.validity !== 1 ? "s" : ""} Validity`,
    });
  if (pkg.vehicleModel && pkg.vehicleType)
    items.push({
      Icon: Car,
      text: `${pkg.vehicleModel} · ${formatVehicleType(pkg.vehicleType)}`,
    });
  else if (pkg.vehicleModel) items.push({ Icon: Car, text: pkg.vehicleModel });
  else if (pkg.vehicleType)
    items.push({ Icon: Car, text: formatVehicleType(pkg.vehicleType) });
  if (pkg.bodyguardType)
    items.push({ Icon: Shield, text: `${pkg.bodyguardType} Security` });
  return items;
};

/* ── Component ────────────────────────────────────────────────────────── */

export default function PackageSummaryPanel({ packageData, displayPrice }) {
  const { regularPrice: anchorPrice, discountedPrice: price } = packageData;
  const hasDiscount = anchorPrice > price;
  const capsules = buildCapsules(packageData);

  return (
    <div className="flex flex-col flex-shrink-0 w-full lg:w-[44%] overflow-y-auto">
      <div className="flex flex-col">
        {/* ── Thumbnail ── */}
        <div className="px-4 sm:px-5 pt-4 w-full">
          <div
            className="relative w-full overflow-hidden"
            style={{
              borderRadius: "16px",
              height: "clamp(220px, 52vw, 340px)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={packageData.thumbnailUrl}
              alt={packageData.name}
              className="absolute inset-0 w-full h-full object-cover object-center"
              style={{ filter: "brightness(0.52) saturate(0.85)" }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.05) 75%, transparent 100%)",
              }}
            />
            <div
              className="absolute bottom-0 left-0 right-0"
              style={{
                padding: "clamp(14px, 3.5vw, 24px)",
                paddingTop: "clamp(48px, 10vw, 90px)",
              }}
            >
              <p
                className="font-semibold uppercase tracking-[0.45em]"
                style={{
                  color: "#C9A24B",
                  fontSize: "clamp(7.5px, 1.1vw, 10px)",
                  marginBottom: "clamp(3px, 0.6vw, 6px)",
                }}
              >
                Membership {String(packageData.id || "01").padStart(2, "0")}
              </p>
              <h2
                className="font-black text-white uppercase leading-none"
                style={{
                  fontSize: "clamp(26px, 6vw, 44px)",
                  letterSpacing: "0.02em",
                  marginBottom: "clamp(4px, 0.8vw, 8px)",
                }}
              >
                {packageData.name}
              </h2>
              {packageData.tagline && (
                <p
                  className="text-white/60 font-light leading-snug"
                  style={{ fontSize: "clamp(11px, 1.5vw, 14px)" }}
                >
                  {packageData.tagline}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Info below thumbnail ── */}
        <div className="px-5 pt-5 pb-4 space-y-4">
          {/* Price row */}
          <div className="flex items-end gap-3 flex-wrap">
            <span
              className="font-black tabular-nums text-gray-900 leading-none"
              style={{ fontSize: "clamp(24px, 3vw, 32px)" }}
            >
              {displayPrice}
            </span>
            <span className="text-gray-400 text-xs mb-1">
              GST 18% Extra · / year, all-inclusive
            </span>
            {hasDiscount && (
              <span
                className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border mb-1"
                style={{
                  color: "#C9A24B",
                  borderColor: "rgba(201,162,75,0.4)",
                  background: "rgba(201,162,75,0.07)",
                }}
              >
                Save {INR(anchorPrice - price)}
              </span>
            )}
          </div>

          {/* Capsules */}
          {capsules.length > 0 && (
            <div
              className="rounded-xl p-3.5"
              style={{
                background: "#fafaf8",
                border: "1px solid rgba(201,162,75,0.18)",
              }}
            >
              <div className="flex flex-wrap gap-2">
                {capsules.map(({ Icon, text }, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium"
                    style={{
                      background: "rgba(201,162,75,0.08)",
                      color: "#6b5a2e",
                      border: "1px solid rgba(201,162,75,0.22)",
                    }}
                  >
                    <Icon
                      size={11}
                      strokeWidth={2}
                      style={{ color: "#C9A24B" }}
                    />
                    {text}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* What's Included */}
          {packageData.packageServices?.length > 0 && (
            <div>
              <p
                className="text-[9px] font-bold tracking-[0.4em] uppercase mb-3"
                style={{ color: "#888" }}
              >
                What&apos;s Included
              </p>
              <ul className="space-y-0">
                {packageData.packageServices.slice(0, 6).map((ps, i) => {
                  const IconComp = SERVICE_ICONS[i % SERVICE_ICONS.length];
                  const total = Math.min(packageData.packageServices.length, 6);
                  return (
                    <li
                      key={ps.service?.id ?? i}
                      className="flex items-center gap-3 py-2.5"
                      style={{
                        borderBottom:
                          i < total - 1 ? "1px solid rgba(0,0,0,0.05)" : "none",
                      }}
                    >
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: "rgba(201,162,75,0.15)" }}
                      >
                        <Check
                          size={10}
                          strokeWidth={3}
                          style={{ color: "#C9A24B" }}
                        />
                      </div>
                      <span className="text-gray-700 text-[13px] font-light">
                        {ps.count > 1 ? `${ps.count}× ` : ""}
                        {ps.service?.title ?? "Included Service"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
