"use client";

import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

/**
 * SubscriptionNotActiveModal - A premium reusable modal component displayed
 * when trying to request trips on an inactive subscription.
 *
 * @param {Object} props
 * @param {boolean} props.open - Control modal visibility
 * @param {() => void} props.onClose - Close callback
 * @param {string} [props.packageName] - The name of the package (optional)
 * @param {boolean} [props.isAdmin] - Adjust text if the viewer is an admin
 */
export default function SubscriptionNotActiveModal({
  open,
  onClose,
  packageName = "",
  isAdmin = false,
}) {
  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden transform transition-all duration-300 scale-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Close Icon */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Content */}
        <div className="p-8 text-center space-y-5">
          {/* Animated Warning Icon */}
          <div className="mx-auto w-14 h-14 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500 animate-pulse">
            <AlertTriangle size={28} />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-[#0B1E3F]">
              Subscription Not Active
            </h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
              {isAdmin ? (
                <>
                  Cannot create a trip for this subscription. The package{" "}
                  {packageName ? <strong>{packageName}</strong> : "membership"}{" "}
                  must be activated before requesting any trips.
                </>
              ) : (
                <>
                  Your membership for{" "}
                  {packageName ? <strong>{packageName}</strong> : "this package"}{" "}
                  is currently pending activation. You will be able to request
                  trips once it is approved and set to active by our team.
                </>
              )}
            </p>
          </div>

          {/* Action button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-[#0B1E3F] hover:bg-[#152d5a] text-white font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-blue-900/10"
          >
            {isAdmin ? "Dismiss" : "Okay, I understand"}
          </button>
        </div>
      </div>
    </div>
  );
}
