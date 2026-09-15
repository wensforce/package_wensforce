export function parseLinesOrCommas(text) {
  if (!text || !String(text).trim()) return [];
  return String(text)
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function joinList(list) {
  if (!Array.isArray(list) || list.length === 0) return "";
  return list.join("\n");
}

export function toDateInputValue(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    const dateOnly = String(iso).slice(0, 10);
    return /^\d{4}-\d{2}-\d{2}$/.test(dateOnly) ? dateOnly : "";
  }
  return d.toISOString().slice(0, 10);
}

export const EXPO_STATUSES = ["upcoming", "ongoing", "completed", "cancelled"];

/** Keep in sync with backend expoDateValidation.js */
export function validateExpoDateFields(fields) {
  const errors = [];
  const parse = (value, label) => {
    if (!value) throw new Error(`${label} is required`);
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) {
      throw new Error(`${label} must be a valid date`);
    }
    return d;
  };

  let eventStart;
  let eventEnd;

  try {
    eventStart = parse(fields.eventStart, "Event start");
  } catch (e) {
    errors.push(e.message);
  }
  try {
    eventEnd = parse(fields.eventEnd, "Event end");
  } catch (e) {
    errors.push(e.message);
  }

  if (eventStart && eventEnd && eventEnd < eventStart) {
    errors.push("Event end must be on or after event start");
  }

  return errors;
}

export function formatExpoApiError(err) {
  const data = err?.response?.data;
  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors.map((e) => e.msg).join(" ");
  }
  return data?.message || err?.message || "Request failed.";
}
