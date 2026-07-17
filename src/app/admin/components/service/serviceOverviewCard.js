"use client";

import { CheckCircle2, XCircle } from "lucide-react";

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * ServiceOverviewCard
 *
 * Mirrors UserOverviewCard's role: receives the full `service` object
 * and renders all display-only content inside the parent card.
 *
 * Props
 * ─────
 * service  object  — the service record from the API
 */
export default function ServiceOverviewCard({ service }) {
  const isActive = service.isActive;

  return (
    <div className="space-y-6">
      {/* Thumbnail + title + meta */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Thumbnail */}
        <div className="md:col-span-1">
          <div className="h-48 rounded-xl overflow-hidden flex items-center justify-center border border-[#CBD5E0] bg-[#FAF8F4]">
            {service.thumbnailUrl ? (
              <img
                src={service.thumbnailUrl}
                alt={service.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center text-[#CBD5E0]">
                <div className="text-4xl mb-1">🖼️</div>
                <p className="text-xs">No image</p>
              </div>
            )}
          </div>
        </div>

        {/* Title, status badge, quick-info grid */}
        <div className="md:col-span-2 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-start justify-between gap-4 mb-1">
              <h2 className="text-xl font-semibold text-[#1A202C] leading-snug">
                {service.title}
              </h2>

              {isActive ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-xs whitespace-nowrap shrink-0">
                  <CheckCircle2 size={13} />
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-600 font-semibold text-xs whitespace-nowrap shrink-0">
                  <XCircle size={13} />
                  Inactive
                </span>
              )}
            </div>

            <p className="text-xs text-[#718096]">
              ID:{" "}
              <span className="font-mono font-semibold text-[#4A5568]">
                {service.id}
              </span>
            </p>
          </div>

          {/* Price, Created / Updated */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-[#CBD5E0] bg-[#FAFAFA] px-4 py-3">
              <p className="text-xs font-semibold text-[#718096] mb-1">Price</p>
              <p className="text-sm font-semibold text-[#0B1E3F]">
                ₹{service.price != null ? Number(service.price).toLocaleString("en-IN") : "0"}
              </p>
            </div>
            <div className="rounded-xl border border-[#CBD5E0] bg-[#FAFAFA] px-4 py-3">
              <p className="text-xs font-semibold text-[#718096] mb-1">Created</p>
              <p className="text-sm font-medium text-[#1A202C]">
                {formatDate(service.createdAt)}
              </p>
            </div>
            <div className="rounded-xl border border-[#CBD5E0] bg-[#FAFAFA] px-4 py-3">
              <p className="text-xs font-semibold text-[#718096] mb-1">Updated</p>
              <p className="text-sm font-medium text-[#1A202C]">
                {formatDate(service.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#E8E3DB]" />

      {/* Description */}
      <div>
        <p className="text-xs font-semibold text-[#718096] uppercase tracking-wide mb-2">
          Description
        </p>
        <p className="text-sm text-[#1A202C] leading-relaxed whitespace-pre-wrap">
          {service.description || "No description provided."}
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-[#E8E3DB]" />

      {/* Status panel */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-[#CBD5E0] bg-[#FAFAFA] px-5 py-4">
        <div>
          <p className="text-xs font-semibold text-[#718096] uppercase tracking-wide mb-0.5">
            Status
          </p>
          <p className="text-sm font-semibold text-[#1A202C]">
            {isActive ? "Active and visible" : "Inactive and hidden"}
          </p>
        </div>

        <div
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
            isActive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {isActive ? (
            <CheckCircle2 size={14} />
          ) : (
            <XCircle size={14} />
          )}
          {isActive ? "Active" : "Inactive"}
        </div>
      </div>

      {/* Features */}
      {service.features && (
        <>
          <div className="border-t border-[#E8E3DB]" />

          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-[#718096] uppercase tracking-wide">
                Features
              </p>
              <span className="text-xs text-[#718096]">
                {Array.isArray(service.features)
                  ? service.features.length
                  : 1}{" "}
                item(s)
              </span>
            </div>

            {Array.isArray(service.features) ? (
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 rounded-xl bg-[#F8F9FA] border border-[#E8E3DB] px-4 py-3 text-sm text-[#1A202C]"
                  >
                    <CheckCircle2
                      size={15}
                      className="text-green-600 mt-0.5 shrink-0"
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[#4A5568]">{service.features}</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}