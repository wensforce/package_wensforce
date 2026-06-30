"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, ImagePlus, X, Plus, Trash2, Search } from "lucide-react";

import { packageApi } from "../../packages/apis/packages.api";
import { servicesApi } from "../../services/apis/services.api";

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
};

export default function PackageForm({ packageId, initialData, onSaved }) {
  const isEditMode = Boolean(packageId);
  const [form, setForm] = useState(initialFormState);
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);
  const [existingThumbnailKey, setExistingThumbnailKey] = useState(null);
  const [serviceSuggestions, setServiceSuggestions] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const serviceSearchTimeouts = useRef({});

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name ?? "",
        description: initialData.description ?? "",
        regularPrice: initialData.regularPrice ?? "",
        discountedPrice: initialData.discountedPrice ?? "",
        services:
          Array.isArray(initialData.services) && initialData.services.length > 0
            ? initialData.services.map((service) => ({
                id: service.id ?? "",
                title: service.title ?? service.name ?? "",
                query: service.title ?? service.name ?? "",
                count: service.count ?? 1,
              }))
            : [{ ...emptyServiceItem }],
        vehicleType: initialData.vehicleType ?? "",
        vehicleModel: initialData.vehicleModel ?? "",
        bodyguardType: initialData.bodyguardType ?? "",
        trips: initialData.trips ?? "",
        validity: initialData.validity ?? "",
        isActive: initialData.isActive ?? true,
      });
      setExistingThumbnailKey(initialData.thumbnailUrlKey ?? null);
      setPreview(initialData.thumbnailUrlKey ?? null);
      setThumbnail(null);
      setError(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } else {
      setForm(initialFormState);
      setThumbnail(null);
      setPreview(null);
      setExistingThumbnailKey(null);
      setError(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [initialData]);

  useEffect(() => {
    return () => {
      Object.values(serviceSearchTimeouts.current).forEach(clearTimeout);
      if (preview && thumbnail) URL.revokeObjectURL(preview);
    };
  }, [preview, thumbnail]);

  function handleFieldChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

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
    if (serviceSearchTimeouts.current[index]) {
      clearTimeout(serviceSearchTimeouts.current[index]);
    }

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

  function selectServiceSuggestion(index, service) {
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

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (preview && thumbnail) URL.revokeObjectURL(preview);
    setThumbnail(file);
    setPreview(URL.createObjectURL(file));
  }

  function removeImage() {
    if (preview && thumbnail) URL.revokeObjectURL(preview);
    setThumbnail(null);
    setPreview(null);
    setExistingThumbnailKey(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

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

    const serviceItems = form.services.filter((item) => item.id !== "");
    if (serviceItems.length === 0) return "At least one service is required.";

    for (const item of serviceItems) {
      if (!item.id || Number(item.id) <= 0)
        return "Each service ID must be a positive integer.";
      if (item.count && Number(item.count) <= 0)
        return "Service count must be a positive integer.";
    }

    if (!existingThumbnailKey && !thumbnail)
      return "Thumbnail image is required.";

    return null;
  }

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
        services: form.services
          .filter((item) => item.id !== "")
          .map((item) => ({
            id: Number(item.id),
            count: item.count ? Number(item.count) : undefined,
          })),
      };

      if (isEditMode) {
        await packageApi.updatePackage(
          packageId,
          payload,
          thumbnail,
          existingThumbnailKey,
        );
      } else {
        await packageApi.createPackage(payload, thumbnail);
      }

      onSaved?.();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save package.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 px-8 py-8">
      <div className="rounded-4xl border border-[#E8E3DB] bg-[#F8F6F1] p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#718096]">
              Package builder
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-[#0B1E3F]">
              {isEditMode ? "Update package" : "Create package"}
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-[#4A5568]">
              {isEditMode
                ? "Edit package details and save changes to update the listing."
                : "Complete the required fields and publish a modern package offering."}
            </p>
          </div>
          <div className="rounded-3xl border border-[#E8E3DB] bg-white px-5 py-4 text-sm text-[#4A5568] shadow-sm">
            <div className="font-semibold text-[#0B1E3F]">
              {isEditMode ? "Editing package" : "New package"}
            </div>
            <p className="mt-2 text-xs leading-5">
              {isEditMode
                ? "Your changes will be saved instantly after submission."
                : "Add a package that matches your service catalog and pricing."}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.9fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-[#E8E3DB] bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-xl font-semibold text-[#0B1E3F]">
                  Package details
                </h3>
                <p className="mt-1 text-sm text-[#4A5568]">
                  Set the name, description, and pricing for this package.
                </p>
              </div>
            </div>

            <div className="space-y-6">
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
                  className="w-full rounded-3xl border border-[#CBD5E0] bg-[#FAF6EC] px-4 py-3 text-sm text-[#1A202C] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-colors disabled:opacity-60"
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
                  className="w-full rounded-3xl border border-[#CBD5E0] bg-[#FAF6EC] px-4 py-3 text-sm text-[#1A202C] placeholder:text-[#A0AEC0] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-colors resize-none disabled:opacity-60"
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
                    className="w-full rounded-3xl border border-[#CBD5E0] bg-[#FAF6EC] px-4 py-3 text-sm text-[#1A202C] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-colors disabled:opacity-60"
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
                    className="w-full rounded-3xl border border-[#CBD5E0] bg-[#FAF6EC] px-4 py-3 text-sm text-[#1A202C] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-colors disabled:opacity-60"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[#E8E3DB] bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-xl font-semibold text-[#0B1E3F]">
                  Package services
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

            <div className="space-y-4">
              {form.services.map((serviceItem, index) => (
                <div
                  key={index}
                  className="grid gap-4 rounded-3xl border border-[#E8E3DB] bg-[#FAF6EC] p-4 sm:grid-cols-[2.4fr_0.9fr_auto] items-start"
                >
                  <div className="relative space-y-1.5">
                    <label className="block text-sm font-semibold text-[#0B1E3F]">
                      Service
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[#A0AEC0]">
                        <Search size={16} />
                      </div>
                      <input
                        type="text"
                        value={serviceItem.query}
                        onChange={(e) =>
                          handleServiceQueryChange(index, e.target.value)
                        }
                        disabled={saving}
                        placeholder="Search service…"
                        className="w-full rounded-3xl border border-[#CBD5E0] bg-white px-12 py-3 text-sm text-[#1A202C] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-colors disabled:opacity-60"
                      />
                    </div>
                    {serviceSuggestions[index] &&
                      serviceSuggestions[index].length > 0 && (
                        <div className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-3xl border border-[#CBD5E0] bg-white shadow-lg">
                          {serviceSuggestions[index].map((option) => (
                            <button
                              type="button"
                              key={option.id}
                              onClick={() =>
                                selectServiceSuggestion(index, option)
                              }
                              className="w-full px-4 py-3 text-left text-sm text-[#1A202C] hover:bg-[#F5F5F5]"
                            >
                              {option.title ??
                                option.name ??
                                `Service ${option.id}`}
                            </button>
                          ))}
                        </div>
                      )}
                    {serviceItem.id && (
                      <div className="mt-1 rounded-3xl bg-[#F0F8FF] px-3 py-2 text-xs text-[#0B1E3F]">
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
                      className="w-full rounded-3xl border border-[#CBD5E0] bg-white px-4 py-3 text-sm text-[#1A202C] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-colors disabled:opacity-60"
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
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-[#E8E3DB] bg-white p-6 shadow-sm">
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-[#0B1E3F]">
                Thumbnail <span className="text-red-500">*</span>
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={saving}
              />
              {console.log(preview, "thumbnail preview")}
              {preview ? (
                <div className="relative w-full overflow-hidden rounded-3xl border border-[#CBD5E0] bg-[#FAF6EC]">
                  <img
                    src={preview}
                    alt="Thumbnail preview"
                    className="h-72 w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
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
                      onClick={removeImage}
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
                  className="flex h-72 w-full flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-[#CBD5E0] bg-[#FAF6EC] px-4 text-center text-[#4A5568] hover:border-[#C9A24B] hover:bg-[#FAF6EC]/80 transition-colors disabled:opacity-50"
                >
                  <ImagePlus size={28} />
                  <div className="text-sm font-semibold">Upload thumbnail</div>
                  <div className="text-xs text-[#718096]">PNG, JPG, WEBP</div>
                </button>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-[#E8E3DB] bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-[#0B1E3F]">
                Vehicle details
              </h3>
              <p className="mt-1 text-sm text-[#4A5568]">
                Match the package to the proper vehicle and bodyguard setup.
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-[#0B1E3F]">
                  Vehicle type
                </label>
                <input
                  name="vehicleType"
                  value={form.vehicleType}
                  onChange={handleFieldChange}
                  disabled={saving}
                  placeholder="Sedan, SUV…"
                  className="w-full rounded-3xl border border-[#CBD5E0] bg-[#FAF6EC] px-4 py-3 text-sm text-[#1A202C] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-colors disabled:opacity-60"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-[#0B1E3F]">
                  Vehicle model
                </label>
                <input
                  name="vehicleModel"
                  value={form.vehicleModel}
                  onChange={handleFieldChange}
                  disabled={saving}
                  placeholder="Innova, City…"
                  className="w-full rounded-3xl border border-[#CBD5E0] bg-[#FAF6EC] px-4 py-3 text-sm text-[#1A202C] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-colors disabled:opacity-60"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-[#0B1E3F]">
                  Bodyguard type
                </label>
                <input
                  name="bodyguardType"
                  value={form.bodyguardType}
                  onChange={handleFieldChange}
                  disabled={saving}
                  placeholder="Armed, Unarmed…"
                  className="w-full rounded-3xl border border-[#CBD5E0] bg-[#FAF6EC] px-4 py-3 text-sm text-[#1A202C] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-colors disabled:opacity-60"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-[#0B1E3F]">
                    Trips
                  </label>
                  <input
                    name="trips"
                    type="number"
                    min="1"
                    value={form.trips}
                    onChange={handleFieldChange}
                    disabled={saving}
                    placeholder="10"
                    className="w-full rounded-3xl border border-[#CBD5E0] bg-[#FAF6EC] px-4 py-3 text-sm text-[#1A202C] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-colors disabled:opacity-60"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-[#0B1E3F]">
                    Validity (months)
                  </label>
                  <input
                    name="validity"
                    type="number"
                    min="1"
                    value={form.validity}
                    onChange={handleFieldChange}
                    disabled={saving}
                    placeholder="12"
                    className="w-full rounded-3xl border border-[#CBD5E0] bg-[#FAF6EC] px-4 py-3 text-sm text-[#1A202C] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-colors disabled:opacity-60"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[#E8E3DB] bg-[#FAF6EC] p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#0B1E3F]">
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
                className={`relative h-7 w-14 rounded-full transition-colors duration-200 focus:outline-none ${
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

      <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[#4A5568]">
          {isEditMode
            ? "Save to update the package details."
            : "Create the package once all required fields are complete."}
        </p>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0B1E3F] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0B1E3F]/10 hover:bg-[#152d5a] transition-colors disabled:opacity-50"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
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
