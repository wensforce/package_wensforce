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

export function formatDiscount(discountType, discountValue) {
  if (discountType === "percentage") {
    return `${discountValue}%`;
  }

  return `Rs ${Number(discountValue || 0).toLocaleString("en-IN")}`;
}

export function getStatusPill(isActive) {
  return isActive
    ? "inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700"
    : "inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-600";
}
