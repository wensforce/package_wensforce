import { Ban, CheckCircle2, Clock3, XCircle } from "lucide-react";

export function formatDate(iso) {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatMoney(value) {
  return `Rs ${Number(value || 0).toLocaleString("en-IN")}`;
}

export function getStatusUI(status) {
  const s = String(status || "PENDING").toUpperCase();

  if (s === "ACTIVE" || s === "PAID" || s === "SUCCESS" || s === "COMPLETED") {
    return {
      className: "bg-green-100 text-green-700",
      icon: <CheckCircle2 size={12} />,
      label: s,
    };
  }

  if (s === "FAILED" || s === "EXPIRED") {
    return {
      className: "bg-red-100 text-red-700",
      icon: <XCircle size={12} />,
      label: s,
    };
  }

  if (s === "CANCELLED") {
    return {
      className: "bg-gray-200 text-gray-700",
      icon: <Ban size={12} />,
      label: s,
    };
  }

  return {
    className: "bg-amber-100 text-amber-700",
    icon: <Clock3 size={12} />,
    label: s,
  };
}
