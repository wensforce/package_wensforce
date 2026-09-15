"use client";

import { useCallback, useRef, useState } from "react";
import { Film, ImagePlus, Loader2, Upload, X } from "lucide-react";
import { uploadImageToS3, rollbackS3Upload } from "../../utils/s3Upload";

const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/gif";
const VIDEO_ACCEPT = "video/mp4,video/webm,video/quicktime";

function pickImageFiles(fileList) {
  return Array.from(fileList || []).filter((f) =>
    f.type.startsWith("image/"),
  );
}

function pickVideoFiles(fileList) {
  return Array.from(fileList || []).filter((f) =>
    f.type.startsWith("video/"),
  );
}

function storedUrlFromUpload({ publicUrl, key }) {
  return publicUrl || key || "";
}

const zoneBase =
  "relative rounded-xl border-2 border-dashed transition-colors cursor-pointer overflow-hidden";
const zoneIdle = "border-[#CBD5E0] bg-[#FAF6EC] hover:border-[#C9A24B]/60 hover:bg-[#FAF6EC]";
const zoneActive = "border-[#C9A24B] bg-[#C9A24B]/10";

export function ExpoSingleImageDropzone({
  label,
  value,
  onChange,
  disabled = false,
  hint = "Drag & drop an image, or click to browse",
}) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const processFiles = useCallback(
    async (files) => {
      const images = pickImageFiles(files);
      if (!images.length || disabled) return;
      const file = images[0];
      setUploadError(null);
      setUploading(true);
      let uploadedKey = null;
      try {
        const result = await uploadImageToS3(file);
        uploadedKey = result.key;
        onChange(storedUrlFromUpload(result));
      } catch (err) {
        if (uploadedKey) await rollbackS3Upload(uploadedKey);
        setUploadError(err?.message || "Upload failed.");
      } finally {
        setUploading(false);
      }
    },
    [disabled, onChange],
  );

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    processFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-[#4A5568] block">{label}</label>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onClick={() => !disabled && !uploading && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragOver(false);
        }}
        onDrop={onDrop}
        className={`${zoneBase} ${dragOver ? zoneActive : zoneIdle} ${disabled ? "opacity-60 pointer-events-none" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={IMAGE_ACCEPT}
          className="hidden"
          disabled={disabled || uploading}
          onChange={(e) => {
            processFiles(e.target.files);
            e.target.value = "";
          }}
        />

        {value ? (
          <div className="relative h-40">
            <img
              src={value}
              alt=""
              className="w-full h-full object-cover"
            />
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange("");
                }}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70"
                title="Remove"
              >
                <X size={14} />
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-10 px-4 text-center">
            {uploading ? (
              <Loader2 size={28} className="animate-spin text-[#C9A24B]" />
            ) : (
              <Upload size={28} className="text-[#A0AEC0]" />
            )}
            <p className="text-xs text-[#4A5568] max-w-[220px]">
              {uploading ? "Uploading…" : hint}
            </p>
          </div>
        )}
      </div>
      {uploadError && (
        <p className="text-xs text-red-600">{uploadError}</p>
      )}
    </div>
  );
}

export function ExpoMultiImageDropzone({
  label,
  values = [],
  onChange,
  disabled = false,
  hint = "Drag & drop images, or click to browse (multiple allowed)",
}) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const processFiles = useCallback(
    async (files) => {
      const images = pickImageFiles(files);
      if (!images.length || disabled) return;
      setUploadError(null);
      setUploading(true);
      const uploadedKeys = [];
      const newUrls = [];
      try {
        for (const file of images) {
          const result = await uploadImageToS3(file);
          uploadedKeys.push(result.key);
          newUrls.push(storedUrlFromUpload(result));
        }
        onChange([...values, ...newUrls]);
      } catch (err) {
        await Promise.all(uploadedKeys.map((k) => rollbackS3Upload(k)));
        setUploadError(err?.message || "Upload failed.");
      } finally {
        setUploading(false);
      }
    },
    [disabled, onChange, values],
  );

  const removeAt = (index) => {
    onChange(values.filter((_, i) => i !== index));
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    processFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-2 md:col-span-2">
      <label className="text-xs font-medium text-[#4A5568] block">{label}</label>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && !uploading && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragOver(false);
        }}
        onDrop={onDrop}
        className={`${zoneBase} ${dragOver ? zoneActive : zoneIdle} ${disabled ? "opacity-60 pointer-events-none" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={IMAGE_ACCEPT}
          multiple
          className="hidden"
          disabled={disabled || uploading}
          onChange={(e) => {
            processFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <div className="flex flex-col items-center justify-center gap-2 py-8 px-4 text-center">
          {uploading ? (
            <Loader2 size={26} className="animate-spin text-[#C9A24B]" />
          ) : (
            <ImagePlus size={26} className="text-[#A0AEC0]" />
          )}
          <p className="text-xs text-[#4A5568] max-w-[280px]">
            {uploading ? "Uploading…" : hint}
          </p>
        </div>
      </div>
      {uploadError && (
        <p className="text-xs text-red-600">{uploadError}</p>
      )}
      {values.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {values.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="relative aspect-video rounded-lg overflow-hidden border border-[#CBD5E0] bg-[#FAF6EC]"
            >
              <img src={url} alt="" className="w-full h-full object-cover" />
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeAt(index)}
                  className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/50 text-white hover:bg-black/70"
                  title="Remove"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ExpoMultiVideoDropzone({
  label,
  values = [],
  onChange,
  disabled = false,
  hint = "Drag & drop videos (MP4, WebM, MOV), or click to browse",
}) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const processFiles = useCallback(
    async (files) => {
      const videos = pickVideoFiles(files);
      if (!videos.length || disabled) return;
      setUploadError(null);
      setUploading(true);
      const uploadedKeys = [];
      const newUrls = [];
      try {
        for (const file of videos) {
          const result = await uploadImageToS3(file);
          uploadedKeys.push(result.key);
          newUrls.push(storedUrlFromUpload(result));
        }
        onChange([...values, ...newUrls]);
      } catch (err) {
        await Promise.all(uploadedKeys.map((k) => rollbackS3Upload(k)));
        setUploadError(err?.message || "Upload failed.");
      } finally {
        setUploading(false);
      }
    },
    [disabled, onChange, values],
  );

  const removeAt = (index) => {
    onChange(values.filter((_, i) => i !== index));
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    processFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-2 md:col-span-2">
      <label className="text-xs font-medium text-[#4A5568] block">{label}</label>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && !uploading && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragOver(false);
        }}
        onDrop={onDrop}
        className={`${zoneBase} ${dragOver ? zoneActive : zoneIdle} ${disabled ? "opacity-60 pointer-events-none" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={VIDEO_ACCEPT}
          multiple
          className="hidden"
          disabled={disabled || uploading}
          onChange={(e) => {
            processFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <div className="flex flex-col items-center justify-center gap-2 py-8 px-4 text-center">
          {uploading ? (
            <Loader2 size={26} className="animate-spin text-[#C9A24B]" />
          ) : (
            <Film size={26} className="text-[#A0AEC0]" />
          )}
          <p className="text-xs text-[#4A5568] max-w-[280px]">
            {uploading ? "Uploading…" : hint}
          </p>
        </div>
      </div>
      {uploadError && (
        <p className="text-xs text-red-600">{uploadError}</p>
      )}
      {values.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {values.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="relative aspect-video rounded-lg overflow-hidden border border-[#CBD5E0] bg-[#0B1E3F]"
            >
              <video
                src={url}
                className="w-full h-full object-cover"
                controls
                preload="metadata"
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeAt(index)}
                  className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/50 text-white hover:bg-black/70"
                  title="Remove"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
