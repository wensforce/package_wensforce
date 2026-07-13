"use client";

import { useState, useRef, useEffect } from "react";
import { Loader2, ImagePlus, X } from "lucide-react";
import Modal from "../Modal";
import { servicesApi } from "../../services/apis/services.api";
import { useFetchList } from "../../hooks/useFetchList";
import { useImagePreview } from "../../hooks/useImagePreview";
import { useFormState } from "../../hooks/useFormState";

export default function ServiceCreateModal({
  open,
  onClose,
  onCreated,
  onUpdated,
  service,
}) {
  const initialForm = { title: "", description: "", isActive: true };

  const { form, setForm, handleFieldChange: handleChange } = useFormState(initialForm);
  const {
    file: thumbnail,
    setFile: setThumbnail,
    previewUrl: preview,
    setPreviewUrl: setPreview,
    handleFileChange,
    removeImage,
  } = useImagePreview(service?.thumbnailUrl || null);

  const { loading, setLoading, error, setError } = useFetchList();

  const fileInputRef = useRef(null);
  const isEditMode = Boolean(service);

  useEffect(() => {
    if (!open) return;

    if (service) {
      setForm({
        title: service.title || "",
        description: service.description || "",
        isActive: service.isActive ?? true,
      });
      setThumbnail(null);
      setPreview(service.thumbnailUrl || null);
      setError(null);
    } else {
      setForm(initialForm);
      setThumbnail(null);
      setPreview(null);
      setError(null);
    }
  }, [service, open]);




  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!form.description.trim()) {
      setError("Description is required.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      if (isEditMode) {
        const updatedService = await servicesApi.updateService(
          service.id,
          form,
          thumbnail,
        );
        onUpdated?.(updatedService);
      } else {
        await servicesApi.createService(form, thumbnail);
        onCreated?.();
      }

      setForm(initialForm);
      removeImage(fileInputRef);
      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        (isEditMode
          ? "Failed to update service."
          : "Failed to create service."),
      );
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    if (loading) return;
    setForm(initialForm);
    removeImage(fileInputRef);
    setError(null);
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEditMode ? "Update Service" : "New Service"}
      description={
        isEditMode
          ? "Edit service details and save changes."
          : "Fill in the details below to create a new service."
      }
      size="md"
    >
      <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-[#0B1E3F]">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Essential"
            disabled={loading}
            className="w-full text-sm rounded-lg border border-[#CBD5E0] bg-[#FAF6EC] px-3 py-2.5 text-[#1A202C] placeholder:text-[#A0AEC0] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-colors disabled:opacity-60"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-[#0B1E3F]">
            Description<span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Short description of the service…"
            rows={3}
            disabled={loading}
            className="w-full text-sm rounded-lg border border-[#CBD5E0] bg-[#FAF6EC] px-3 py-2.5 text-[#1A202C] placeholder:text-[#A0AEC0] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-colors resize-none disabled:opacity-60"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-[#0B1E3F]">
            Thumbnail
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={loading}
          />

          {preview ? (
            <div className="relative w-full h-40 rounded-xl overflow-hidden border border-[#CBD5E0] bg-[#FAF6EC]">
              <img
                src={preview}
                alt="Thumbnail preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                  className="flex items-center gap-1.5 text-xs font-semibold text-white bg-[#0B1E3F]/80 rounded-lg px-3 py-1.5 hover:bg-[#0B1E3F] transition-colors"
                >
                  <ImagePlus size={13} /> Change
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(fileInputRef)}
                  disabled={loading}
                  className="flex items-center gap-1.5 text-xs font-semibold text-white bg-red-500/80 rounded-lg px-3 py-1.5 hover:bg-red-600 transition-colors"
                >
                  <X size={13} /> Remove
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="w-full h-32 rounded-xl border-2 border-dashed border-[#CBD5E0] bg-[#FAF6EC] hover:border-[#C9A24B] hover:bg-[#FAF6EC]/80 transition-colors flex flex-col items-center justify-center gap-2 disabled:opacity-50"
            >
              <ImagePlus size={24} className="text-[#A0AEC0]" />
              <span className="text-sm text-[#A0AEC0]">
                Click to upload image
              </span>
              <span className="text-xs text-[#CBD5E0]">
                {isEditMode
                  ? "Leave unchanged to keep current image"
                  : "PNG, JPG, WEBP"}
              </span>
            </button>
          )}
        </div>

        <div className="flex items-center justify-between rounded-lg border border-[#CBD5E0] bg-[#FAF6EC] px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-[#0B1E3F]">Active</p>
            <p className="text-xs text-[#4A5568]">
              Service will be visible to users
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={form.isActive}
            onClick={() =>
              !loading && setForm((p) => ({ ...p, isActive: !p.isActive }))
            }
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none
              ${form.isActive ? "bg-[#0B1E3F]" : "bg-[#CBD5E0]"}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200
                ${form.isActive ? "translate-x-5" : "translate-x-0"}`}
            />
          </button>
        </div>

        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="text-sm font-medium text-[#4A5568] border border-[#CBD5E0] bg-white rounded-lg px-4 py-2 hover:bg-[#FAF6EC] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 text-sm font-semibold text-white bg-[#0B1E3F] rounded-lg px-5 py-2 hover:bg-[#152d5a] transition-colors disabled:opacity-60"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {loading
              ? isEditMode
                ? "Updating…"
                : "Creating…"
              : isEditMode
                ? "Update Service"
                : "Create Service"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
