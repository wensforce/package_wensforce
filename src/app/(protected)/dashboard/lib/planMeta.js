export const PLAN_META = {
  essential: {
    accentColor: "#6B8DD6",
    label: "Essential",
    trips: 3,
    vehicle: "Standard Sedan (5-Seater)",
    bodyguard: "MMA Fighter",
    price: 24999,
  },
  executive: {
    accentColor: "#C9A24B",
    label: "Executive",
    trips: 6,
    vehicle: "Premium Sedan / MUV",
    bodyguard: "Ex-Police Officer",
    price: 44999,
  },
  premium: {
    accentColor: "#9B7FD4",
    label: "Premium",
    trips: 10,
    vehicle: "Luxury SUV",
    bodyguard: "Ex-Army Jawan",
    price: 69999,
  },
  elite: {
    accentColor: "#E07B39",
    label: "Elite",
    trips: 15,
    vehicle: "Luxury SUV (7-Seater)",
    bodyguard: "Ex-NSG / Para SF",
    price: 99999,
  },
  sovereign: {
    accentColor: "#D4AF37",
    label: "Sovereign",
    trips: 24,
    vehicle: "Ultra-Luxury SUV / Convoy",
    bodyguard: "Ex-SPG / Elite Commando",
    price: 199999,
  },
};

/**
 * Extract plan key from a WENS order ID (e.g. "WENS_ELITE_1234567890").
 * Returns null if not found.
 */
export function getPlanKeyFromOrderId(orderId = "") {
  const lower = orderId.toLowerCase();
  for (const key of Object.keys(PLAN_META)) {
    if (lower.includes(key)) return key;
  }
  return null;
}

/** Format a number as INR string. */
export const formatINR = (n) =>
  n != null ? "₹" + Number(n).toLocaleString("en-IN") : "—";

/** Format an ISO date string to "01 Jun 2026". */
export const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/** Add 1 year to an ISO date string. */
export const addOneYear = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  d.setFullYear(d.getFullYear() + 1);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
