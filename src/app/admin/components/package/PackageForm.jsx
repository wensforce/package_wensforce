"use client";

import { useEffect, useRef, useState } from "react";
import {
  Loader2,
  ImagePlus,
  X,
  Plus,
  Trash2,
  Search,
  Film,
  Play,
} from "lucide-react";

import { packageApi } from "../../packages/apis/packages.api";
import { servicesApi } from "../../services/apis/services.api";
import { useImagePreview } from "../../hooks/useImagePreview";
import { useFormState } from "../../hooks/useFormState";

const emptyServiceItem = { id: "", title: "", query: "", count: 1 };

const initialFormState = {
  name: "",
  description: "",
  regularPrice: "",
  discountedPrice: "",
  services: [{ ...emptyServiceItem }],
  vehicleType: "",
  vehicleModel: "",
  bodyguardType: "",
  trips: "",
  validity: "",
  isActive: true,
  category: "",
  tags: "",
};

// Shared input class — xl radius, CBD5E0 border, FAF6EC bg, gold focus ring
const inputCls =
  "w-full rounded-xl border border-[#CBD5E0] bg-[#FAF6EC] px-4 py-3 text-sm text-[#1A202C] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-colors disabled:opacity-60";

// Shared section-card class
const cardCls = "rounded-2xl border border-[#CBD5E0] bg-white p-6";

export default function PackageForm({ packageId, initialData, onSaved }) {
  const isEditMode = Boolean(packageId);
  const { form, setForm, handleFieldChange } = useFormState(initialFormState);
  const {
    file: thumbnail,
    setFile: setThumbnail,
    previewUrl: preview,
    setPreviewUrl: setPreview,
    handleFileChange,
    removeImage,
  } = useImagePreview(initialData?.thumbnailUrl || null);

  const [existingThumbnailKey, setExistingThumbnailKey] = useState(null);
  const [serviceSuggestions, setServiceSuggestions] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showThumbnailOverlay, setShowThumbnailOverlay] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [existingVideos, setExistingVideos] = useState([]);

  const fileInputRef = useRef(null);
  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const serviceSearchTimeouts = useRef({});

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name ?? "",
        description: initialData.description ?? "",
        regularPrice: initialData.regularPrice ?? "",
        discountedPrice: initialData.discountedPrice ?? "",
        services:
          Array.isArray(initialData.packageServices) &&
          initialData.packageServices.length > 0
            ? initialData.packageServices.map((ps) => ({
                id: ps.service?.id ?? "",
                title: ps.service?.title ?? ps.service?.name ?? "",
                query: ps.service?.title ?? ps.service?.name ?? "",
                count: ps.count ?? 1,
              }))
            : [{ ...emptyServiceItem }],
        vehicleType: initialData.vehicleType ?? "",
        vehicleModel: initialData.vehicleModel ?? "",
        bodyguardType: initialData.bodyguardType ?? "",
        trips: initialData.trips ?? "",
        validity: initialData.validity ?? "",
        isActive: initialData.isActive ?? true,
        category: initialData.category ?? "",
        tags: initialData.tags ?? "",
      });
      setExistingThumbnailKey(initialData.thumbnailUrlKey ?? null);
      setPreview(initialData.thumbnailUrl ?? null);
      setThumbnail(null);
      setError(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setExistingPhotos(
        Array.isArray(initialData.photos)
          ? initialData.photos.map((p) => ({ key: p.key ?? p.url, url: p.url }))
          : [],
      );
      setPhotos([]);
      setExistingVideos(
        Array.isArray(initialData.videos)
          ? initialData.videos.map((v) => ({
              key: v.key ?? v.url,
              url: v.url,
              name: v.name ?? "",
            }))
          : [],
      );
      setVideos([]);
    } else {
      setForm(initialFormState);
      setThumbnail(null);
      setPreview(null);
      setExistingThumbnailKey(null);
      setExistingPhotos([]);
      setPhotos([]);
      setExistingVideos([]);
      setVideos([]);
      setError(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [initialData]);

  useEffect(() => {
    return () => {
      Object.values(serviceSearchTimeouts.current).forEach(clearTimeout);
      photos.forEach((p) => URL.revokeObjectURL(p.previewUrl));
      videos.forEach((v) => URL.revokeObjectURL(v.previewUrl));
    };
  }, []);

  // ── Photo handlers ───────────────────────────────────────────────────────────
  function handleAddPhotos(e) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setPhotos((prev) => [
      ...prev,
      ...files.map((file) => ({ file, previewUrl: URL.createObjectURL(file) })),
    ]);
    e.target.value = "";
  }
  function removeNewPhoto(index) {
    setPhotos((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].previewUrl);
      updated.splice(index, 1);
      return updated;
    });
  }
  function removeExistingPhoto(index) {
    setExistingPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  // ── Video handlers ───────────────────────────────────────────────────────────
  function handleAddVideos(e) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setVideos((prev) => [
      ...prev,
      ...files.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
        name: file.name,
      })),
    ]);
    e.target.value = "";
  }
  function removeNewVideo(index) {
    setVideos((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].previewUrl);
      updated.splice(index, 1);
      return updated;
    });
  }
  function removeExistingVideo(index) {
    setExistingVideos((prev) => prev.filter((_, i) => i !== index));
  }

  // ── Service handlers ─────────────────────────────────────────────────────────
  function handleServiceChange(index, field, value) {
    setForm((prev) => {
      const services = [...prev.services];
      services[index] = { ...services[index], [field]: value };
      return { ...prev, services };
    });
  }
  function addServiceRow() {
    setForm((prev) => ({
      ...prev,
      services: [...prev.services, { ...emptyServiceItem }],
    }));
  }
  function clearServiceSuggestions(index) {
    setServiceSuggestions((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
  }
  function handleServiceQueryChange(index, value) {
    setForm((prev) => {
      const services = [...prev.services];
      services[index] = { ...services[index], query: value, id: "", title: "" };
      return { ...prev, services };
    });
    clearServiceSuggestions(index);
    if (serviceSearchTimeouts.current[index])
      clearTimeout(serviceSearchTimeouts.current[index]);
    if (!value.trim()) return;
    serviceSearchTimeouts.current[index] = setTimeout(async () => {
      try {
        const rows = await servicesApi.searchServices(value.trim());
        setServiceSuggestions((prev) => ({ ...prev, [index]: rows }));
      } catch (err) {
        console.warn("PackageForm: service search failed", err);
      }
    }, 300);
  }
  function getSelectedServiceIds(excludeIndex) {
    return new Set(
      form.services
        .filter((item, idx) => idx !== excludeIndex && item.id !== "")
        .map((item) => String(item.id)),
    );
  }
  function selectServiceSuggestion(index, service) {
    const alreadyUsed = getSelectedServiceIds(index);
    if (alreadyUsed.has(String(service.id))) {
      setError(
        `"${service.title ?? service.name ?? "This service"}" is already added.`,
      );
      setServiceSuggestions((prev) => ({
        ...prev,
        [index]: (prev[index] ?? []).filter((s) => s.id !== service.id),
      }));
      return;
    }
    setError(null);
    setForm((prev) => {
      const services = [...prev.services];
      services[index] = {
        ...services[index],
        id: service.id,
        title: service.title ?? service.name ?? "",
        query: service.title ?? service.name ?? "",
      };
      return { ...prev, services };
    });
    clearServiceSuggestions(index);
  }
  function removeServiceRow(index) {
    setForm((prev) => {
      const services = prev.services.filter((_, idx) => idx !== index);
      return {
        ...prev,
        services: services.length > 0 ? services : [{ ...emptyServiceItem }],
      };
    });
  }

  // ── Validation ───────────────────────────────────────────────────────────────
  function validateForm() {
    if (!form.name.trim()) return "Name is required.";
    if (!form.description.trim()) return "Description is required.";
    if (!form.regularPrice || Number(form.regularPrice) <= 0)
      return "Regular price must be a positive number.";
    if (!form.discountedPrice || Number(form.discountedPrice) <= 0)
      return "Discounted price must be a positive number.";
    if (!form.vehicleType.trim()) return "Vehicle type is required.";
    if (!form.vehicleModel.trim()) return "Vehicle model is required.";
    if (!form.bodyguardType.trim()) return "Bodyguard type is required.";
    if (!form.trips || Number(form.trips) <= 0)
      return "Trips must be a positive integer.";
    if (!form.validity || Number(form.validity) <= 0)
      return "Validity must be a positive integer.";
    if (!form.category) return "Category is required.";
    const serviceItems = form.services.filter((item) => item.id !== "");
    if (serviceItems.length === 0) return "At least one service is required.";
    for (const item of serviceItems) {
      if (!item.id || Number(item.id) <= 0)
        return "Each service ID must be a positive integer.";
      if (item.count && Number(item.count) <= 0)
        return "Service count must be a positive integer.";
    }
    const seenIds = new Set();
    for (const item of serviceItems) {
      const idKey = String(item.id);
      if (seenIds.has(idKey))
        return `Duplicate service: "${item.title || idKey}". Please remove it.`;
      seenIds.add(idKey);
    }
    if (!existingThumbnailKey && !thumbnail)
      return "Thumbnail image is required.";
    return null;
  }

  // ── Submit ───────────────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        regularPrice: Number(form.regularPrice),
        discountedPrice: Number(form.discountedPrice),
        vehicleType: form.vehicleType.trim(),
        vehicleModel: form.vehicleModel.trim(),
        bodyguardType: form.bodyguardType.trim(),
        trips: Number(form.trips),
        validity: Number(form.validity),
        isActive: form.isActive,
        category: form.category.toLowerCase().trim(),
        tags: form.tags.trim(),
        services: form.services
          .filter((item) => item.id !== "")
          .map((item) => ({
            id: Number(item.id),
            count: item.count ? Number(item.count) : undefined,
          })),
        existingPhotoKeys: existingPhotos.map((p) => p.key),
        existingVideoKeys: existingVideos.map((v) => v.key),
      };
      if (isEditMode) {
        await packageApi.updatePackage(
          packageId,
          payload,
          thumbnail,
          existingThumbnailKey,
          photos.map((p) => p.file),
          videos.map((v) => v.file),
        );
      } else {
        await packageApi.createPackage(
          payload,
          thumbnail,
          photos.map((p) => p.file),
          videos.map((v) => v.file),
        );
      }
      onSaved?.();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save package.");
    } finally {
      setSaving(false);
    }
  }

  const totalPhotos = existingPhotos.length + photos.length;
  const totalVideos = existingVideos.length + videos.length;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ── Error banner ── */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.9fr_1fr]">
        {/* ══════════════════════════════ LEFT COLUMN ══════════════════════════════ */}
        <div className="space-y-6">
          {/* ── Package details ── */}
          <div className={cardCls}>
            <div className="mb-5 border-b border-[#CBD5E0] pb-4">
              <h3 className="text-base font-semibold text-[#1A202C]">
                Package details
              </h3>
              <p className="mt-1 text-sm text-[#4A5568]">
                Set the name, description, and pricing for this package.
              </p>
            </div>

            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-[#0B1E3F]">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleFieldChange}
                  disabled={saving}
                  placeholder="Package name"
                  className={inputCls}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-[#0B1E3F]">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFieldChange}
                  disabled={saving}
                  rows={5}
                  placeholder="Short description of the package"
                  className={`${inputCls} resize-none placeholder:text-[#A0AEC0]`}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-[#0B1E3F]">
                    Regular price <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="regularPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.regularPrice}
                    onChange={handleFieldChange}
                    disabled={saving}
                    placeholder="₹ 1999"
                    className={`${inputCls} appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-[#0B1E3F]">
                    Discounted price <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="discountedPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.discountedPrice}
                    onChange={handleFieldChange}
                    disabled={saving}
                    placeholder="₹ 1499"
                    className={`${inputCls} appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Package services ── */}
          <div className={cardCls}>
            <div className="mb-5 flex flex-col gap-3 border-b border-[#CBD5E0] pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-semibold text-[#1A202C]">
                  Package services <span className="text-red-500">*</span>
                </h3>
                <p className="mt-1 text-sm text-[#4A5568]">
                  Add service items included in this package.
                </p>
              </div>
              <button
                type="button"
                onClick={addServiceRow}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-[#0B1E3F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#152d5a] transition-colors disabled:opacity-50"
              >
                <Plus size={14} /> Add service
              </button>
            </div>

            <div className="space-y-3">
              {form.services.map((serviceItem, index) => {
                const selectedElsewhere = getSelectedServiceIds(index);
                const visibleSuggestions = (
                  serviceSuggestions[index] ?? []
                ).filter((option) => !selectedElsewhere.has(String(option.id)));

                return (
                  <div
                    key={index}
                    className="grid gap-4 rounded-xl border border-[#CBD5E0] bg-[#FAF6EC] p-4 sm:grid-cols-[2.4fr_0.9fr_auto] items-start"
                  >
                    <div className="relative space-y-1.5">
                      <label className="block text-sm font-semibold text-[#0B1E3F]">
                        Service
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[#A0AEC0]">
                          <Search size={15} />
                        </div>
                        <input
                          type="text"
                          value={serviceItem.query}
                          onChange={(e) =>
                            handleServiceQueryChange(index, e.target.value)
                          }
                          disabled={saving}
                          placeholder="Search service…"
                          className={`${inputCls} pl-10 bg-white`}
                        />
                      </div>
                      {visibleSuggestions.length > 0 && (
                        <div className="absolute left-0 right-0 z-20 mt-1 overflow-hidden rounded-xl border border-[#CBD5E0] bg-white shadow-lg">
                          {visibleSuggestions.map((option) => (
                            <button
                              type="button"
                              key={option.id}
                              onClick={() =>
                                selectServiceSuggestion(index, option)
                              }
                              className="w-full px-4 py-2.5 text-left text-sm text-[#1A202C] hover:bg-[#FAF6EC] transition-colors"
                            >
                              {option.title ??
                                option.name ??
                                `Service ${option.id}`}
                            </button>
                          ))}
                        </div>
                      )}
                      {serviceItem.id && (
                        <div className="mt-1 rounded-lg bg-[#F0F8FF] px-3 py-2 text-xs text-[#0B1E3F]">
                          Selected: {serviceItem.title}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-sm font-semibold text-[#0B1E3F]">
                        Count
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={serviceItem.count}
                        onChange={(e) =>
                          handleServiceChange(index, "count", e.target.value)
                        }
                        disabled={saving}
                        className={`${inputCls} appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                      />
                    </div>

                    <div className="flex flex-col space-y-1.5">
                      <span
                        className="block text-sm select-none invisible"
                        aria-hidden="true"
                      >
                        Remove
                      </span>
                      <button
                        type="button"
                        onClick={() => removeServiceRow(index)}
                        disabled={saving || form.services.length === 1}
                        className="inline-flex h-[46px] w-full items-center justify-center gap-1.5 rounded-full bg-red-100 px-4 text-sm font-semibold text-red-700 hover:bg-red-200 transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={15} /> Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Photos ── */}
          <div className={cardCls}>
            <div className="mb-5 flex flex-col gap-3 border-b border-[#CBD5E0] pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-[#1A202C]">
                    Photos
                  </h3>
                  {totalPhotos > 0 && (
                    <span className="inline-flex items-center justify-center rounded-full bg-[#0B1E3F] px-2.5 py-0.5 text-xs font-semibold text-white">
                      {totalPhotos}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-[#4A5568]">
                  Upload gallery photos for this package.
                </p>
              </div>
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-[#0B1E3F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#152d5a] transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                <ImagePlus size={14} /> Add photos
              </button>
            </div>

            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleAddPhotos}
              disabled={saving}
            />

            {totalPhotos > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                {existingPhotos.map((photo, i) => (
                  <div
                    key={`existing-photo-${i}`}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-[#CBD5E0] bg-[#FAF6EC]"
                  >
                    <img
                      src={photo.url}
                      alt={`Photo ${i + 1}`}
                      className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                    <button
                      type="button"
                      onClick={() => removeExistingPhoto(i)}
                      disabled={saving}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-red-600 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 shadow-sm transition-all duration-200 hover:bg-red-50 disabled:opacity-50"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {photos.map((photo, i) => (
                  <div
                    key={`new-photo-${i}`}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-[#C9A24B]/40 bg-[#FAF6EC] ring-1 ring-[#C9A24B]/20"
                  >
                    <img
                      src={photo.previewUrl}
                      alt={`New photo ${i + 1}`}
                      className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                    <span className="absolute left-2 top-2 rounded-full bg-[#C9A24B] px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm">
                      New
                    </span>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                    <button
                      type="button"
                      onClick={() => removeNewPhoto(i)}
                      disabled={saving}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-red-600 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 shadow-sm transition-all duration-200 hover:bg-red-50 disabled:opacity-50"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  disabled={saving}
                  className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#CBD5E0] bg-[#FAF6EC] text-[#718096] transition-colors hover:border-[#C9A24B] hover:bg-[#FAF9F0] hover:text-[#C9A24B] disabled:opacity-50"
                >
                  <Plus size={20} />
                  <span className="text-xs font-semibold">Add more</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                disabled={saving}
                className="flex h-40 w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[#CBD5E0] bg-[#FAF6EC] text-[#4A5568] transition-colors hover:border-[#C9A24B] hover:bg-[#FAF9F0] disabled:opacity-50"
              >
                <ImagePlus size={26} className="text-[#A0AEC0]" />
                <div>
                  <p className="text-sm font-semibold text-[#4A5568]">
                    Upload photos
                  </p>
                  <p className="mt-1 text-xs text-[#718096]">
                    PNG, JPG, WEBP · Select multiple
                  </p>
                </div>
              </button>
            )}
          </div>

          {/* ── Videos ── */}
          <div className={cardCls}>
            <div className="mb-5 flex flex-col gap-3 border-b border-[#CBD5E0] pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-[#1A202C]">
                    Videos
                  </h3>
                  {totalVideos > 0 && (
                    <span className="inline-flex items-center justify-center rounded-full bg-[#0B1E3F] px-2.5 py-0.5 text-xs font-semibold text-white">
                      {totalVideos}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-[#4A5568]">
                  Attach video walkthroughs or showcase reels.
                </p>
              </div>
              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-[#0B1E3F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#152d5a] transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                <Film size={14} /> Add videos
              </button>
            </div>

            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              multiple
              className="hidden"
              onChange={handleAddVideos}
              disabled={saving}
            />

            {totalVideos > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {existingVideos.map((video, i) => (
                  <div
                    key={`existing-video-${i}`}
                    className="group relative overflow-hidden rounded-xl border border-[#CBD5E0] bg-[#FAF6EC]"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-[#0B1E3F]/5">
                      <video
                        src={video.url}
                        className="h-full w-full object-cover"
                        preload="metadata"
                        muted
                        playsInline
                        onMouseEnter={(e) => e.currentTarget.play()}
                        onMouseLeave={(e) => {
                          e.currentTarget.pause();
                          e.currentTarget.currentTime = 0;
                        }}
                      />
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center group-hover:opacity-0 transition-opacity duration-200">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40">
                          <Play
                            size={18}
                            className="translate-x-0.5 text-white"
                            fill="white"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2.5">
                      <Film size={13} className="shrink-0 text-[#718096]" />
                      <span className="truncate text-xs font-medium text-[#4A5568]">
                        {video.name || `Video ${i + 1}`}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeExistingVideo(i)}
                      disabled={saving}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-red-600 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 shadow-sm transition-all duration-200 hover:bg-red-50 disabled:opacity-50"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {videos.map((video, i) => (
                  <div
                    key={`new-video-${i}`}
                    className="group relative overflow-hidden rounded-xl border border-[#C9A24B]/40 bg-[#FAF6EC] ring-1 ring-[#C9A24B]/20"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-[#0B1E3F]/5">
                      <video
                        src={video.previewUrl}
                        className="h-full w-full object-cover"
                        preload="metadata"
                        muted
                        playsInline
                        onMouseEnter={(e) => e.currentTarget.play()}
                        onMouseLeave={(e) => {
                          e.currentTarget.pause();
                          e.currentTarget.currentTime = 0;
                        }}
                      />
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center group-hover:opacity-0 transition-opacity duration-200">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40">
                          <Play
                            size={18}
                            className="translate-x-0.5 text-white"
                            fill="white"
                          />
                        </div>
                      </div>
                      <span className="absolute left-2 top-2 rounded-full bg-[#C9A24B] px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm">
                        New
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2.5">
                      <Film size={13} className="shrink-0 text-[#718096]" />
                      <span className="truncate text-xs font-medium text-[#4A5568]">
                        {video.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeNewVideo(i)}
                      disabled={saving}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-red-600 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 shadow-sm transition-all duration-200 hover:bg-red-50 disabled:opacity-50"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  disabled={saving}
                  className="flex aspect-video flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#CBD5E0] bg-[#FAF6EC] text-[#718096] transition-colors hover:border-[#C9A24B] hover:bg-[#FAF9F0] hover:text-[#C9A24B] disabled:opacity-50"
                >
                  <Plus size={20} />
                  <span className="text-xs font-semibold">Add more</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                disabled={saving}
                className="flex h-40 w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[#CBD5E0] bg-[#FAF6EC] text-[#4A5568] transition-colors hover:border-[#C9A24B] hover:bg-[#FAF9F0] disabled:opacity-50"
              >
                <Film size={26} className="text-[#A0AEC0]" />
                <div>
                  <p className="text-sm font-semibold text-[#4A5568]">
                    Upload videos
                  </p>
                  <p className="mt-1 text-xs text-[#718096]">
                    MP4, MOV, WEBM · Select multiple
                  </p>
                </div>
              </button>
            )}
          </div>

          {/* ── Category & Tags ── */}
          <div className={cardCls}>
            <div className="mb-5 border-b border-[#CBD5E0] pb-4">
              <h3 className="text-base font-semibold text-[#1A202C]">
                Category &amp; Tags
              </h3>
              <p className="mt-1 text-sm text-[#4A5568]">
                Define the category and tags to organize this package.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-[#0B1E3F]">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleFieldChange}
                  disabled={saving}
                  className={inputCls}
                >
                  <option value="">Select category</option>
                  <option value="membership">Membership</option>
                  <option value="welcome_india">Welcome India</option>
                  <option value="corporate">Corporate</option>
                  <option value="pilgrims">Pilgrims</option>
                  <option value="multi-region">Multi-Region</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-[#0B1E3F]">
                  Tags
                </label>
                <input
                  name="tags"
                  value={form.tags}
                  onChange={handleFieldChange}
                  disabled={saving}
                  placeholder="e.g. VIP, luxury, travel"
                  className={inputCls}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════ RIGHT COLUMN ═════════════════════════════ */}
        <aside className="space-y-6">
          {/* ── Thumbnail ── */}
          <div className={cardCls}>
            <div className="mb-4 border-b border-[#CBD5E0] pb-4">
              <label className="block text-sm font-semibold text-[#1A202C]">
                Thumbnail <span className="text-red-500">*</span>
              </label>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={saving}
            />
            {preview ? (
              <div className="relative w-full overflow-hidden rounded-xl border border-[#CBD5E0] bg-[#FAF6EC]">
                <img
                  src={preview}
                  alt="Thumbnail preview"
                  className="h-64 w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 opacity-100 lg:opacity-0 lg:hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={saving}
                    className="flex items-center gap-1.5 rounded-full bg-[#0B1E3F]/80 px-4 py-2 text-xs font-semibold text-white hover:bg-[#0B1E3F] transition-colors"
                  >
                    <ImagePlus size={14} /> Change
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      removeImage(fileInputRef);
                      setExistingThumbnailKey(null);
                    }}
                    disabled={saving}
                    className="flex items-center gap-1.5 rounded-full bg-red-500/80 px-4 py-2 text-xs font-semibold text-white hover:bg-red-600 transition-colors"
                  >
                    <X size={14} /> Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={saving}
                className="flex h-64 w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[#CBD5E0] bg-[#FAF6EC] px-4 text-center text-[#4A5568] hover:border-[#C9A24B] hover:bg-[#FAF9F0] transition-colors disabled:opacity-50"
              >
                <ImagePlus size={26} />
                <div>
                  <p className="text-sm font-semibold">Upload thumbnail</p>
                  <p className="mt-1 text-xs text-[#718096]">PNG, JPG, WEBP</p>
                </div>
              </button>
            )}
          </div>

          {/* ── Vehicle details ── */}
          <div className={cardCls}>
            <div className="mb-5 border-b border-[#CBD5E0] pb-4">
              <h3 className="text-base font-semibold text-[#1A202C]">
                Vehicle details
              </h3>
              <p className="mt-1 text-sm text-[#4A5568]">
                Match the package to the correct vehicle and bodyguard setup.
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-[#0B1E3F]">
                  Vehicle type <span className="text-red-500">*</span>
                </label>
                <input
                  name="vehicleType"
                  value={form.vehicleType}
                  onChange={handleFieldChange}
                  disabled={saving}
                  placeholder="Sedan, SUV…"
                  className={inputCls}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-[#0B1E3F]">
                  Vehicle model <span className="text-red-500">*</span>
                </label>
                <input
                  name="vehicleModel"
                  value={form.vehicleModel}
                  onChange={handleFieldChange}
                  disabled={saving}
                  placeholder="Innova, City…"
                  className={inputCls}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-[#0B1E3F]">
                  Bodyguard type <span className="text-red-500">*</span>
                </label>
                <input
                  name="bodyguardType"
                  value={form.bodyguardType}
                  onChange={handleFieldChange}
                  disabled={saving}
                  placeholder="Armed, Unarmed…"
                  className={inputCls}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-[#0B1E3F]">
                    Trips <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="trips"
                    type="number"
                    min="1"
                    value={form.trips}
                    onChange={handleFieldChange}
                    disabled={saving}
                    placeholder="10"
                    className={`${inputCls} appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-[#0B1E3F]">
                    Validity (months) <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="validity"
                    type="number"
                    min="1"
                    value={form.validity}
                    onChange={handleFieldChange}
                    disabled={saving}
                    placeholder="12"
                    className={`${inputCls} appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Active status ── */}
          <div className="rounded-2xl border border-[#CBD5E0] bg-[#FAF6EC] p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#1A202C]">
                  Active status
                </p>
                <p className="mt-1 text-sm text-[#4A5568]">
                  When active, this package is visible to customers.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={form.isActive}
                onClick={() =>
                  setForm((prev) => ({ ...prev, isActive: !prev.isActive }))
                }
                disabled={saving}
                className={`relative h-7 w-14 shrink-0 rounded-full transition-colors duration-200 focus:outline-none ${
                  form.isActive ? "bg-[#0B1E3F]" : "bg-[#CBD5E0]"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform duration-200 ${
                    form.isActive ? "translate-x-7" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* ── Footer ── */}
      <div className="flex flex-col-reverse gap-4 border-t border-[#CBD5E0] pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[#4A5568]">
          {isEditMode
            ? "Save to update the package details."
            : "Create the package once all required fields are complete."}
        </p>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 cursor-pointer rounded-full bg-[#0B1E3F] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#152d5a] transition-colors disabled:opacity-50"
        >
          {saving && <Loader2 size={15} className="animate-spin" />}
          {saving
            ? isEditMode
              ? "Saving…"
              : "Creating…"
            : isEditMode
              ? "Save package"
              : "Create package"}
        </button>
      </div>
    </form>
  );
}
