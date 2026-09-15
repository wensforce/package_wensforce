"use client";

import { useEffect, useState } from "react";
import { Loader2, Search, Check } from "lucide-react";
import { exposApi } from "../../expos/apis/expos.api";
import { packageApi } from "../../packages/apis/packages.api";
import {
  EXPO_STATUSES,
  formatExpoApiError,
  joinList,
  parseLinesOrCommas,
  toDateInputValue,
  validateExpoDateFields,
} from "../../expos/utils/expoFormUtils";
import { packageNameMapFromExpo } from "../../expos/utils/expoPackageUtils";
import { airportDistanceToFormValue } from "@/app/utils/expo/airportFormat";
import {
  ExpoMultiImageDropzone,
  ExpoMultiVideoDropzone,
  ExpoSingleImageDropzone,
} from "./ExpoImageDropzone";

const inputCls =
  "w-full rounded-xl border border-[#CBD5E0] bg-[#FAF6EC] px-3.5 py-2.5 text-xs md:text-sm text-[#1A202C] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-colors disabled:opacity-60";

const sectionCls =
  "rounded-xl border border-[#CBD5E0] bg-white p-5 space-y-4 shadow-sm";

function parseOptionalNonNegativeNumber(raw) {
  if (raw === "" || raw == null) return null;
  const n = Number(raw);
  if (Number.isNaN(n) || n < 0) {
    throw new Error("Distance and travel time must be non-negative numbers.");
  }
  return n;
}

function emptyForm() {
  return {
    id: "",
    slug: "",
    name: "",
    shortName: "",
    city: "",
    venue: "",
    eventStart: "",
    eventEnd: "",
    status: "upcoming",
    cardImage: "",
    bannerImage: "",
    heroImages: [],
    eventImages: [],
    eventVideos: [],
    airportCode: "",
    airportName: "",
    airportDistance: "",
    airportTravelTime: "",
    pickupPointsText: "",
    dropLocation: "",
    serviceArea: "",
    amenitiesText: "",
    packageIds: [],
  };
}

function fromExpo(expo) {
  if (!expo) return emptyForm();
  return {
    id: expo.id ?? "",
    slug: expo.slug ?? "",
    name: expo.name ?? "",
    shortName: expo.shortName ?? "",
    city: expo.city ?? "",
    venue: expo.venue ?? "",
    eventStart: toDateInputValue(expo.eventStart),
    eventEnd: toDateInputValue(expo.eventEnd),
    status: expo.status ?? "upcoming",
    cardImage: expo.cardImage ?? "",
    bannerImage: expo.bannerImage ?? "",
    heroImages: Array.isArray(expo.heroImages) ? [...expo.heroImages] : [],
    eventImages: Array.isArray(expo.eventImages) ? [...expo.eventImages] : [],
    eventVideos: Array.isArray(expo.eventVideos) ? [...expo.eventVideos] : [],
    airportCode: expo.airportCode ?? "",
    airportName: expo.airportName ?? "",
    airportDistance: airportDistanceToFormValue(expo.airportDistance),
    airportTravelTime: airportDistanceToFormValue(expo.airportTravelTime),
    pickupPointsText: joinList(expo.pickupPoints),
    dropLocation: expo.dropLocation ?? "",
    serviceArea: expo.serviceArea ?? "",
    amenitiesText: joinList(expo.amenities),
    packageIds: Array.isArray(expo.packageIds) ? [...expo.packageIds] : [],
  };
}

function toPayload(form) {
  return {
    id: form.id.trim(),
    slug: form.slug.trim(),
    name: form.name.trim(),
    shortName: form.shortName.trim() || null,
    city: form.city.trim(),
    venue: form.venue.trim(),
    eventStart: form.eventStart,
    eventEnd: form.eventEnd,
    serviceStart: form.eventStart,
    serviceEnd: form.eventEnd,
    status: form.status,
    featured: false,
    cardImage: form.cardImage.trim() || null,
    bannerImage: form.bannerImage.trim() || null,
    heroImages: form.heroImages,
    eventImages: form.eventImages,
    eventVideos: form.eventVideos,
    airportCode: form.airportCode.trim() || null,
    airportName: form.airportName.trim() || null,
    airportDistance: parseOptionalNonNegativeNumber(form.airportDistance),
    airportTravelTime: parseOptionalNonNegativeNumber(form.airportTravelTime),
    pickupPoints: parseLinesOrCommas(form.pickupPointsText),
    dropLocation: form.dropLocation.trim() || null,
    serviceArea: form.serviceArea.trim() || null,
    amenities: parseLinesOrCommas(form.amenitiesText),
    packageIds: form.packageIds,
  };
}

export default function ExpoForm({ expoId = null, initialData = null, onSaved }) {
  const isEdit = Boolean(expoId);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [pkgSearch, setPkgSearch] = useState("");
  const [pkgResults, setPkgResults] = useState([]);
  const [pkgLoading, setPkgLoading] = useState(false);
  const [packageNames, setPackageNames] = useState({});

  useEffect(() => {
    if (isEdit) {
      setForm(fromExpo(initialData));
      setPackageNames(packageNameMapFromExpo(initialData));
      return;
    }
    setForm({
      ...emptyForm(),
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : "",
    });
  }, [initialData, isEdit]);

  useEffect(() => {
    if (!pkgSearch.trim()) {
      setPkgResults([]);
      return;
    }
    const t = setTimeout(async () => {
      setPkgLoading(true);
      try {
        const rows = await packageApi.searchPackages(pkgSearch.trim());
        setPkgResults(Array.isArray(rows) ? rows : []);
      } catch {
        setPkgResults([]);
      } finally {
        setPkgLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [pkgSearch]);

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function rememberPackageName(pkg) {
    const label = pkg.name || pkg.title || pkg.id;
    setPackageNames((prev) => ({ ...prev, [pkg.id]: label }));
    return label;
  }

  function togglePackage(pkg) {
    rememberPackageName(pkg);
    setForm((prev) => {
      const has = prev.packageIds.includes(pkg.id);
      return {
        ...prev,
        packageIds: has
          ? prev.packageIds.filter((x) => x !== pkg.id)
          : [...prev.packageIds, pkg.id],
      };
    });
  }

  function removePackageId(id) {
    setForm((prev) => ({
      ...prev,
      packageIds: prev.packageIds.filter((x) => x !== id),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.city.trim() || !form.venue.trim()) {
      setError("Name, city, and venue are required.");
      return;
    }
    if (!isEdit && !form.slug.trim()) {
      setError("Slug is required when creating an expo.");
      return;
    }
    if (!form.id.trim()) {
      setError("Expo ID is missing. Refresh the page and try again.");
      return;
    }
    const dateErrors = validateExpoDateFields({
      eventStart: form.eventStart,
      eventEnd: form.eventEnd,
    });
    if (dateErrors.length > 0) {
      setError(dateErrors.join(" "));
      return;
    }

    let payload;
    try {
      payload = toPayload(form);
    } catch (err) {
      setError(err.message);
      return;
    }

    setSaving(true);
    try {
      if (isEdit) {
        await exposApi.updateExpo(expoId, payload);
      } else {
        await exposApi.createExpo(payload);
      }
      onSaved?.();
    } catch (err) {
      setError(formatExpoApiError(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className={sectionCls}>
        <h3 className="text-sm font-semibold text-[#0B1E3F]">Basic info</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-[#4A5568] mb-1 block">
              ID <span className="text-[#A0AEC0]">(read-only)</span>
            </label>
            <input
              className={inputCls}
              value={form.id}
              readOnly
              disabled
              title="UUID assigned by the system"
            />
            <p className="text-[10px] text-[#A0AEC0] mt-1">
              UUID — assigned automatically, not editable.
            </p>
          </div>
          <div>
            <label className="text-xs font-medium text-[#4A5568] mb-1 block">
              Slug
            </label>
            <input
              className={inputCls}
              value={form.slug}
              onChange={(e) => setField("slug", e.target.value)}
              placeholder="gcprs-2026"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-medium text-[#4A5568] mb-1 block">
              Name
            </label>
            <input
              className={inputCls}
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[#4A5568] mb-1 block">
              Short name
            </label>
            <input
              className={inputCls}
              value={form.shortName}
              onChange={(e) => setField("shortName", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[#4A5568] mb-1 block">
              Status
            </label>
            <select
              className={inputCls}
              value={form.status}
              onChange={(e) => setField("status", e.target.value)}
            >
              {EXPO_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-[#4A5568] mb-1 block">
              City
            </label>
            <input
              className={inputCls}
              value={form.city}
              onChange={(e) => setField("city", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[#4A5568] mb-1 block">
              Venue
            </label>
            <input
              className={inputCls}
              value={form.venue}
              onChange={(e) => setField("venue", e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      <div className={sectionCls}>
        <h3 className="text-sm font-semibold text-[#0B1E3F]">Event dates</h3>
        <p className="text-xs text-[#718096]">
          Service availability uses the same start and end dates automatically.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ["eventStart", "Start"],
            ["eventEnd", "End"],
          ].map(([key, label]) => (
            <div key={key}>
              <label className="text-xs font-medium text-[#4A5568] mb-1 block">
                {label}
              </label>
              <input
                type="date"
                className={inputCls}
                value={form[key]}
                onChange={(e) => setField(key, e.target.value)}
                required
              />
            </div>
          ))}
        </div>
      </div>

      <div className={sectionCls}>
        <h3 className="text-sm font-semibold text-[#0B1E3F]">Media</h3>
        <p className="text-xs text-[#718096]">
          Upload images to S3 (JPEG, PNG, WebP, GIF). Drag and drop or click each
          zone to select files.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ExpoSingleImageDropzone
            label="Card image"
            value={form.cardImage}
            onChange={(url) => setField("cardImage", url)}
            disabled={saving}
          />
          <ExpoSingleImageDropzone
            label="Banner image"
            value={form.bannerImage}
            onChange={(url) => setField("bannerImage", url)}
            disabled={saving}
          />
          <ExpoMultiImageDropzone
            label="Hero images"
            values={form.heroImages}
            onChange={(urls) => setField("heroImages", urls)}
            disabled={saving}
          />
          <ExpoMultiImageDropzone
            label="Event gallery images"
            values={form.eventImages}
            onChange={(urls) => setField("eventImages", urls)}
            disabled={saving}
          />
          <ExpoMultiVideoDropzone
            label="Event gallery videos"
            values={form.eventVideos}
            onChange={(urls) => setField("eventVideos", urls)}
            disabled={saving}
          />
        </div>
      </div>

      <div className={sectionCls}>
        <h3 className="text-sm font-semibold text-[#0B1E3F]">Airport</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-[#4A5568] mb-1 block">
              Airport code
            </label>
            <input
              className={inputCls}
              value={form.airportCode}
              onChange={(e) => setField("airportCode", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[#4A5568] mb-1 block">
              Airport name
            </label>
            <input
              className={inputCls}
              value={form.airportName}
              onChange={(e) => setField("airportName", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[#4A5568] mb-1 block">
              Distance to city (km)
            </label>
            <input
              type="number"
              min="0"
              step="any"
              className={inputCls}
              value={form.airportDistance}
              onChange={(e) => setField("airportDistance", e.target.value)}
              placeholder="e.g. 28"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[#4A5568] mb-1 block">
              Travel time (hours)
            </label>
            <input
              type="number"
              min="0"
              step="any"
              className={inputCls}
              value={form.airportTravelTime}
              onChange={(e) => setField("airportTravelTime", e.target.value)}
              placeholder="e.g. 1"
            />
          </div>
        </div>
      </div>

      <div className={sectionCls}>
        <h3 className="text-sm font-semibold text-[#0B1E3F]">Coverage</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-[#4A5568] mb-1 block">
              Pickup points (one per line)
            </label>
            <textarea
              className={`${inputCls} min-h-[80px]`}
              value={form.pickupPointsText}
              onChange={(e) => setField("pickupPointsText", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[#4A5568] mb-1 block">
              Amenities (one per line)
            </label>
            <textarea
              className={`${inputCls} min-h-[80px]`}
              value={form.amenitiesText}
              onChange={(e) => setField("amenitiesText", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[#4A5568] mb-1 block">
              Drop location
            </label>
            <input
              className={inputCls}
              value={form.dropLocation}
              onChange={(e) => setField("dropLocation", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[#4A5568] mb-1 block">
              Service area
            </label>
            <input
              className={inputCls}
              value={form.serviceArea}
              onChange={(e) => setField("serviceArea", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className={sectionCls}>
        <h3 className="text-sm font-semibold text-[#0B1E3F]">Packages</h3>
        <p className="text-xs text-[#718096]">
          Search packages by name and attach to this expo.
        </p>
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0AEC0]"
          />
          <input
            className={`${inputCls} pl-9`}
            placeholder="Search packages…"
            value={pkgSearch}
            onChange={(e) => setPkgSearch(e.target.value)}
          />
        </div>
        {pkgLoading && (
          <p className="text-xs text-[#718096] flex items-center gap-2">
            <Loader2 size={14} className="animate-spin" /> Searching…
          </p>
        )}
        {pkgResults.length > 0 && (
          <ul className="border border-[#CBD5E0] rounded-xl divide-y divide-[#EDF2F7] max-h-48 overflow-y-auto">
            {pkgResults.map((pkg) => {
              const selected = form.packageIds.includes(pkg.id);
              return (
                <li key={pkg.id}>
                  <button
                    type="button"
                    onClick={() => togglePackage(pkg)}
                    className="w-full flex items-center justify-between px-3 py-2 text-left text-sm hover:bg-[#FAF6EC]"
                  >
                    <span>
                      <span className="font-medium text-[#1A202C]">
                        {pkg.name || pkg.title}
                      </span>
                      <span className="text-xs text-[#718096] ml-2 font-mono">
                        {pkg.id}
                      </span>
                    </span>
                    {selected && <Check size={16} className="text-[#C9A24B]" />}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        {form.packageIds.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {form.packageIds.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => removePackageId(id)}
                className="text-xs px-2.5 py-1 rounded-lg bg-[#0B1E3F] text-white hover:bg-[#152d5a] max-w-full truncate"
                title={`${packageNames[id] || id} (${id}) — click to remove`}
              >
                <span className="font-medium">{packageNames[id] || id}</span>
                <span className="opacity-70 font-mono ml-1.5 text-[10px]">
                  {id}
                </span>
                <span className="ml-1">×</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B1E3F] text-white text-sm font-semibold hover:bg-[#152d5a] disabled:opacity-60"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          {isEdit ? "Save changes" : "Create expo"}
        </button>
      </div>
    </form>
  );
}
