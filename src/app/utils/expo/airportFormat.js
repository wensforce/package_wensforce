/** Display helpers for numeric airport distance (km) and travel time (hours). */

export function formatAirportDistanceKm(value) {
  if (value == null || value === "") return "—";
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  const rounded = Number.isInteger(n) ? n : Math.round(n * 10) / 10;
  return `${rounded} km`;
}

export function formatAirportTravelHours(value) {
  if (value == null || value === "") return "—";
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  const rounded = Number.isInteger(n) ? n : Math.round(n * 10) / 10;
  return rounded === 1 ? "1 hour" : `${rounded} hours`;
}

export function airportDistanceToFormValue(value) {
  if (value == null || value === "") return "";
  const n = Number(value);
  return Number.isNaN(n) ? "" : String(n);
}
