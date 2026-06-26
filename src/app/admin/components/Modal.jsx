"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

/**
 * @typedef {Object} ModalProps
 * @property {boolean} open - Controls visibility of the modal
 * @property {() => void} onClose - Called when backdrop or close button is clicked
 * @property {string} [title] - Optional heading rendered in the modal header
 * @property {string} [description] - Optional subtext rendered below the title
 * @property {React.ReactNode} children - Modal body content
 * @property {"sm" | "md" | "lg" | "xl"} [size] - Max-width preset (default: "md")
 * @property {boolean} [hideClose] - When true the × button is not rendered
 */

const SIZE_MAP = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

/**
 * Shared modal shell — blurred backdrop, centered card, close button.
 * Composes with any content passed as `children`.
 *
 * @param {ModalProps} props
 */
export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
  hideClose = false,
}) {
  // Lock body scroll while open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Card */}
      <div
        className={`relative w-full ${SIZE_MAP[size] ?? SIZE_MAP.md} bg-white rounded-2xl shadow-2xl border border-[#CBD5E0] flex flex-col max-h-[90vh]`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        {/* Header */}
        {(title || !hideClose) && (
          <div className="flex items-start justify-between px-6 py-4 border-b border-[#CBD5E0] shrink-0">
            <div>
              {title && (
                <h2 id="modal-title" className="text-lg font-bold text-[#0B1E3F] leading-tight">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-sm text-[#4A5568] mt-0.5">{description}</p>
              )}
            </div>
            {!hideClose && (
              <button
                onClick={onClose}
                className="ml-4 shrink-0 p-1.5 rounded-lg text-[#A0AEC0] hover:text-[#0B1E3F] hover:bg-[#FAF6EC] transition-colors"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
