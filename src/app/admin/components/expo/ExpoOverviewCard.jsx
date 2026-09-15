"use client";

import {
  formatAirportDistanceKm,
  formatAirportTravelHours,
} from "@/app/utils/expo/airportFormat";
import { getExpoPackageSummaries } from "../../expos/utils/expoPackageUtils";

function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso).slice(0, 10);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const STATUS_STYLES = {
  upcoming: "bg-blue-100 text-blue-800",
  ongoing: "bg-green-100 text-green-800",
  completed: "bg-gray-100 text-gray-700",
  cancelled: "bg-red-100 text-red-700",
};

function Field({ label, children }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#A0AEC0] mb-1">
        {label}
      </p>
      <div className="text-sm text-[#1A202C]">{children ?? "—"}</div>
    </div>
  );
}

function ListBlock({ items }) {
  if (!items?.length) return "—";
  return (
    <ul className="list-disc list-inside space-y-0.5 text-sm text-[#4A5568]">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function MediaImageGrid({ urls = [], emptyLabel = "None" }) {
  const list = (urls || []).filter(Boolean);
  if (!list.length) {
    return <span className="text-sm text-[#A0AEC0]">{emptyLabel}</span>;
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {list.map((url, index) => (
        <a
          key={`${url}-${index}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="group block rounded-lg overflow-hidden border border-[#CBD5E0] bg-[#FAF6EC] aspect-video"
          title={url}
        >
          <img
            src={url}
            alt=""
            className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
          />
        </a>
      ))}
    </div>
  );
}

function MediaVideoGrid({ urls = [], emptyLabel = "None" }) {
  const list = (urls || []).filter(Boolean);
  if (!list.length) {
    return <span className="text-sm text-[#A0AEC0]">{emptyLabel}</span>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {list.map((url, index) => (
        <div
          key={`${url}-${index}`}
          className="rounded-lg overflow-hidden border border-[#CBD5E0] bg-[#0B1E3F] aspect-video"
          title={url}
        >
          <video
            src={url}
            className="w-full h-full object-cover"
            controls
            preload="metadata"
            playsInline
          />
        </div>
      ))}
    </div>
  );
}

function MediaBannerPreview({ url }) {
  if (!url) {
    return <span className="text-sm text-[#A0AEC0]">None</span>;
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-lg overflow-hidden border border-[#CBD5E0] bg-[#FAF6EC] max-h-48"
      title={url}
    >
      <img src={url} alt="Banner" className="w-full h-full max-h-48 object-cover" />
    </a>
  );
}

export default function ExpoOverviewCard({ expo }) {
  const statusClass =
    STATUS_STYLES[expo.status] ?? "bg-[#FAF6EC] text-[#4A5568]";

  return (
    <div className="space-y-8 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="h-48 rounded-xl overflow-hidden border border-[#CBD5E0] bg-[#FAF8F4]">
            {expo.cardImage ? (
              <img
                src={expo.cardImage}
                alt={expo.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-[#CBD5E0] text-sm">
                No card image
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-3">
          <div className="flex flex-wrap items-start gap-2 justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[#1A202C] leading-snug">
                {expo.name}
              </h2>
              {expo.shortName && (
                <p className="text-sm text-[#718096] mt-1">{expo.shortName}</p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <span
                className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusClass}`}
              >
                {expo.status}
              </span>
            </div>
          </div>
          <p className="text-xs text-[#718096] font-mono">
            ID: {expo.id} · Slug: {expo.slug}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            <Field label="City">{expo.city}</Field>
            <Field label="Venue">{expo.venue}</Field>
            <Field label="Event & service window">{`${formatDate(expo.eventStart)} → ${formatDate(expo.eventEnd)}`}</Field>
          </div>
        </div>
      </div>

      <section className="rounded-xl border border-[#CBD5E0] p-5 space-y-4">
        <h3 className="text-sm font-semibold text-[#0B1E3F]">Airport</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Field label="Code">{expo.airportCode}</Field>
          <Field label="Name">{expo.airportName}</Field>
          <Field label="Distance">
            {formatAirportDistanceKm(expo.airportDistance)}
          </Field>
          <Field label="Travel time">
            {formatAirportTravelHours(expo.airportTravelTime)}
          </Field>
        </div>
      </section>

      <section className="rounded-xl border border-[#CBD5E0] p-5 space-y-4">
        <h3 className="text-sm font-semibold text-[#0B1E3F]">Coverage</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Pickup points">
            <ListBlock items={expo.pickupPoints} />
          </Field>
          <Field label="Amenities">
            <ListBlock items={expo.amenities} />
          </Field>
          <Field label="Drop location">{expo.dropLocation}</Field>
          <Field label="Service area">{expo.serviceArea}</Field>
        </div>
      </section>

      <section className="rounded-xl border border-[#CBD5E0] p-5 space-y-6">
        <h3 className="text-sm font-semibold text-[#0B1E3F]">Media</h3>
        <div className="space-y-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#A0AEC0] mb-2">
              Banner
            </p>
            <MediaBannerPreview url={expo.bannerImage} />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#A0AEC0] mb-2">
              Hero images
            </p>
            <MediaImageGrid urls={expo.heroImages} />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#A0AEC0] mb-2">
              Event gallery images
            </p>
            <MediaImageGrid urls={expo.eventImages} />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#A0AEC0] mb-2">
              Event gallery videos
            </p>
            <MediaVideoGrid urls={expo.eventVideos} />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-[#CBD5E0] p-5 space-y-3">
        <h3 className="text-sm font-semibold text-[#0B1E3F]">
          Linked packages ({getExpoPackageSummaries(expo).length})
        </h3>
        {getExpoPackageSummaries(expo).length === 0 ? (
          "—"
        ) : (
          <ul className="space-y-2">
            {getExpoPackageSummaries(expo).map((pkg) => (
              <li
                key={pkg.id}
                className="flex flex-wrap items-baseline gap-x-2 text-sm text-[#1A202C]"
              >
                <span className="font-medium">{pkg.name}</span>
                <span className="text-xs font-mono text-[#A0AEC0]">{pkg.id}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="grid grid-cols-2 gap-4 text-xs text-[#718096]">
        <Field label="Created">{formatDate(expo.createdAt)}</Field>
        <Field label="Updated">{formatDate(expo.updatedAt)}</Field>
      </div>
    </div>
  );
}
