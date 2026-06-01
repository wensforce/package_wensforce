import { AlertCircle, X } from "lucide-react";

export default function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div
      className="flex items-start gap-3 px-4 py-3.5 rounded-2xl mb-5 text-sm"
      style={{
        background: "#fff1f2",
        border: "1.5px solid #fecdd3",
      }}
      role="alert"
    >
      <AlertCircle size={16} className="shrink-0 mt-0.5" style={{ color: "#e11d48" }} />
      <p className="flex-1 font-medium leading-snug" style={{ color: "#9f1239" }}>
        {message}
      </p>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 transition-opacity hover:opacity-60"
          style={{ color: "#e11d48" }}
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
