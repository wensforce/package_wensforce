/**
 * Formats package validity for display.
 * - Integer months (from DB) → "12 Months"
 * - null/empty → "Single Trip"
 * - Legacy string values (static data) → returned as-is
 */
export function formatPackageValidity(validity) {
  if (validity == null || validity === "") return "Single Trip";

  const n = Number(validity);
  if (!Number.isNaN(n) && Number.isInteger(n) && n > 0) {
    return `${n} Month${n !== 1 ? "s" : ""}`;
  }

  if (typeof validity === "string") return validity;

  return "Single Trip";
}

export function isSingleTripValidity(validity) {
  if (validity == null || validity === "") return true;
  const n = Number(validity);
  return Number.isNaN(n) || !Number.isInteger(n) || n <= 0;
}

/** Returns validity string suitable for booking records (always a string). */
export function formatPackageValidityForBooking(validity) {
  return formatPackageValidity(validity);
}
