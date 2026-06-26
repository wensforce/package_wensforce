"use client";

import { useRouter } from "next/navigation";
import { Car, Clock, Route, Shield, Pencil, Eye } from "lucide-react";

function formatPrice(value) {
  if (value == null) return "—";
  return `₹${Number(value).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

function discountPct(regular, discounted) {
  if (!regular || !discounted || discounted >= regular) return null;
  return Math.round(((regular - discounted) / regular) * 100);
}

export default function PackageCard({ pkg }) {
  const router = useRouter();
  const pct = discountPct(pkg.regularPrice, pkg.discountedPrice);

  return (
    <article className="flex flex-col bg-white rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow duration-200">

      {/* Thumbnail */}
      <div className="relative h-44 w-full overflow-hidden rounded-t-2xl bg-neutral-100">
        {pkg.thumbnailUrlKey ? (
          <img
            src={pkg.thumbnailUrlKey}
            alt={pkg.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-5xl opacity-20">📦</span>
          </div>
        )}

        <span
          className={`absolute top-3 right-3 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            pkg.isActive ? "bg-emerald-500 text-white" : "bg-neutral-400 text-white"
          }`}
        >
          {pkg.isActive ? "Active" : "Inactive"}
        </span>

        {pct && (
          <span className="absolute top-3 left-3 rounded-full bg-[#0B1E3F] text-white px-2.5 py-1 text-[11px] font-semibold">
            {pct}% off
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-4">

        <div>
          <h2 className="text-base font-semibold text-neutral-900 truncate">{pkg.name}</h2>
          {pkg.description && (
            <p className="mt-1 text-sm text-neutral-500 line-clamp-2 leading-relaxed">
              {pkg.description}
            </p>
          )}
        </div>

        <div className="flex items-baseline gap-3">
          <span className="text-xl font-bold text-[#0B1E3F]">
            {formatPrice(pkg.discountedPrice)}
          </span>
          {pkg.regularPrice && pkg.discountedPrice && pkg.regularPrice !== pkg.discountedPrice && (
            <span className="text-sm text-neutral-400 line-through">
              {formatPrice(pkg.regularPrice)}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-sm text-neutral-500">
          <div className="flex items-center gap-2">
            <Car size={13} className="shrink-0 text-neutral-400" />
            <span className="truncate">{pkg.vehicleType ?? "—"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Route size={13} className="shrink-0 text-neutral-400" />
            <span>{pkg.trips ? `${pkg.trips} trips` : "—"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={13} className="shrink-0 text-neutral-400" />
            <span>{pkg.validity ? `${pkg.validity} months` : "—"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield size={13} className="shrink-0 text-neutral-400" />
            <span className="truncate">{pkg.bodyguardType ?? "—"}</span>
          </div>
        </div>

        {pkg.tags && (
          <span className="self-start rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-500 font-medium">
            {pkg.tags}
          </span>
        )}

        <div className="mt-auto h-px bg-neutral-100" />

        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/admin/packages/edit/${pkg.id}`)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0B1E3F] py-2.5 text-xs font-semibold text-white hover:bg-[#152d5a] transition-colors"
          >
            <Pencil size={12} /> Edit
          </button>
          <button
            onClick={() => router.push(`/admin/packages/edit/${pkg.id}`)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-neutral-200 py-2.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            <Eye size={12} /> Details
          </button>
        </div>

      </div>
    </article>
  );
}
