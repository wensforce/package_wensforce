import { isExpoVisibleOnHub } from "@/app/utils/expo/expoUtils";

function apiBase() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  return base.replace(/\/$/, "");
}

/**
 * @returns {Promise<Array>}
 */
async function parsePublicExposResponse(res) {
  if (!res.ok) return [];
  const json = await res.json();
  return json.data?.expos ?? [];
}

/** Server components / RSC */
export async function fetchPublicExpos() {
  const url = `${apiBase()}/expo/list`;
  if (!apiBase()) return [];

  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    return await parsePublicExposResponse(res);
  } catch (err) {
    console.error("fetchPublicExpos:", err);
    return [];
  }
}

/** Client components (e.g. ExpoHub) — visible in browser Network tab */
export async function fetchPublicExposClient() {
  const url = `${apiBase()}/expo/list`;
  if (!apiBase()) return [];

  try {
    const res = await fetch(url, { cache: "no-store" });
    return await parsePublicExposResponse(res);
  } catch (err) {
    console.error("fetchPublicExposClient:", err);
    return [];
  }
}

/**
 * @returns {Promise<object|null>}
 */
export async function fetchExpoById(id) {
  const url = `${apiBase()}/expo/by-id/${encodeURIComponent(id)}`;
  if (!apiBase()) return null;

  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch (err) {
    console.error("fetchExpoById:", err);
    return null;
  }
}

/** Non-ended expos for hub (list API already filters; client-side safety net). */
export function getActiveExposFromList(expos) {
  return (expos || []).filter(isExpoVisibleOnHub);
}

/** @deprecated Use getActiveExposFromList */
export function getFeaturedExposFromList(expos) {
  return getActiveExposFromList(expos);
}

/** @param {Array<{ id?: string, name: string } | string>} cities */
export function normalizeFilterCities(cities) {
  return (cities ?? [])
    .map((c) => (typeof c === "string" ? c : c?.name))
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
}

/** @param {Array<object>} months */
export function normalizeFilterMonths(months) {
  return (months ?? [])
    .map((m) => {
      if (m.key && m.month != null && m.year != null) {
        return {
          key: m.key,
          month: m.month,
          year: m.year,
          label: m.label ?? m.name ?? m.key,
        };
      }
      const id = m.id ?? m.key ?? "";
      const iso = String(id).match(/^(\d{4})-(\d{2})$/);
      if (iso) {
        const year = Number(iso[1]);
        const month = Number(iso[2]);
        const label =
          m.name ??
          new Date(year, month - 1, 1).toLocaleString("en-IN", {
            month: "long",
            year: "numeric",
          });
        return { key: `${year}-${String(month).padStart(2, "0")}`, month, year, label };
      }
      return null;
    })
    .filter(Boolean)
    .sort(
      (a, b) =>
        new Date(a.year, a.month - 1, 1) - new Date(b.year, b.month - 1, 1),
    );
}

async function parseCitiesAndMonthsResponse(res) {
  if (!res.ok) return { cities: [], months: [] };
  const json = await res.json();
  const data = json.data ?? {};
  return {
    cities: normalizeFilterCities(data.cities),
    months: normalizeFilterMonths(data.months),
  };
}

/**
 * Hub filter dropdowns — GET /expo/cities-and-months (server components).
 */
export async function fetchExpoCitiesAndMonths() {
  const url = `${apiBase()}/expo/cities-and-months`;
  if (!apiBase()) return { cities: [], months: [] };

  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    return await parseCitiesAndMonthsResponse(res);
  } catch (err) {
    console.error("fetchExpoCitiesAndMonths:", err);
    return { cities: [], months: [] };
  }
}

/** Same endpoint, for client components (e.g. ExpoHub). */
export async function fetchExpoCitiesAndMonthsClient() {
  const url = `${apiBase()}/expo/cities-and-months`;
  if (!apiBase()) return { cities: [], months: [] };

  try {
    const res = await fetch(url, { cache: "no-store" });
    return await parseCitiesAndMonthsResponse(res);
  } catch (err) {
    console.error("fetchExpoCitiesAndMonthsClient:", err);
    return { cities: [], months: [] };
  }
}
