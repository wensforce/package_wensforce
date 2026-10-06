/**
 * Campaign / ad attribution — capture Google, Meta & UTM params from the URL
 * into a first-party cookie, then attach them to enquiry (and other) submits.
 *
 * Cookie: wf_campaign (JSON, 90 days)
 */

export const CAMPAIGN_COOKIE = "wf_campaign";
export const CAMPAIGN_COOKIE_MAX_AGE = 60 * 60 * 24 * 90; // 90 days

/** App-owned query keys — never treated as campaign attribution */
const APP_SEARCH_PARAMS = new Set([
  "serviceType",
  "welcomeIndia",
  "currency",
  "expo",
  "videoUrl",
  "utm_coupon", // discount code — handled separately in coupons.js
]);

/** Known ad / click-id keys (plus anything starting with utm_) */
const CAMPAIGN_PARAM_KEYS = new Set([
  // Google Ads
  "gclid",
  "gbraid",
  "wbraid",
  "dclid",
  "gclsrc",
  // Meta / Facebook
  "fbclid",
  // Microsoft / TikTok / X / LinkedIn
  "msclkid",
  "ttclid",
  "twclid",
  "li_fat_id",
  // Common Google Ads ValueTrack
  "campaignid",
  "adgroupid",
  "creative",
  "keyword",
  "matchtype",
  "network",
  "device",
  "placement",
  "adposition",
]);

function isCampaignKey(key) {
  if (!key) return false;
  const lower = String(key).toLowerCase();
  if (APP_SEARCH_PARAMS.has(lower)) return false;
  return lower.startsWith("utm_") || CAMPAIGN_PARAM_KEYS.has(lower);
}

/** Pull campaign params from a URLSearchParams / searchParams-like object. */
export function collectCampaignParams(searchParams) {
  if (!searchParams) return {};
  const campaign = {};
  for (const [key, value] of searchParams.entries()) {
    if (!value || !isCampaignKey(key)) continue;
    campaign[key] = value;
  }
  return campaign;
}

function getCookieRaw(name) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookieRaw(name, value, maxAge) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAge}; path=/; SameSite=Lax`;
}

/** Read stored campaign attribution object (or null). */
export function getCampaignCookie() {
  try {
    const raw = getCookieRaw(CAMPAIGN_COOKIE);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Merge new URL params into the campaign cookie.
 * - New keys overwrite existing (last-touch for that key)
 * - Existing keys not in the URL are kept
 * - Records firstLandingPath / lastTouchAt
 */
export function captureCampaignFromSearchParams(searchParams) {
  if (typeof window === "undefined") return null;

  const fromUrl = collectCampaignParams(searchParams);
  if (Object.keys(fromUrl).length === 0) {
    return getCampaignCookie();
  }

  const existing = getCampaignCookie() || {};
  const now = new Date().toISOString();

  const next = {
    ...existing,
    ...fromUrl,
    lastTouchAt: now,
    lastLandingPath: window.location.pathname + window.location.search,
  };

  if (!existing.firstTouchAt) {
    next.firstTouchAt = now;
    next.firstLandingPath = window.location.pathname + window.location.search;
  }
  if (document.referrer && !existing.referrer) {
    next.referrer = document.referrer;
  }

  setCookieRaw(CAMPAIGN_COOKIE, JSON.stringify(next), CAMPAIGN_COOKIE_MAX_AGE);
  return next;
}

/**
 * Attribution to send with enquiry/booking:
 * cookie (persisted) + current URL params (freshest) + Meta _fbc/_fbp if present.
 */
export function getCampaignForSubmit(searchParams) {
  const fromCookie = getCampaignCookie() || {};
  const fromUrl = collectCampaignParams(searchParams);
  const merged = { ...fromCookie, ...fromUrl };

  // Meta browser cookies (set by Pixel / metaPixel.js)
  const fbc = getCookieRaw("_fbc");
  const fbp = getCookieRaw("_fbp");
  if (fbc) merged.fbc = fbc;
  if (fbp) merged.fbp = fbp;

  // Drop internal bookkeeping keys from the API payload if you prefer —
  // keep them; useful for first/last touch debugging on the backend.
  return Object.keys(merged).length > 0 ? merged : null;
}
