/**
 * UTM coupon codes for booking discounts.
 *
 * URL: /booking/{planId}?UTM_Coupon=STKH-10PCT
 * Cookie: stores the raw code as-is (UTM_Coupon)
 *
 * Only exact entries in `coupons` are valid.
 * Users cannot invent PACKAGEKEY-DISCOUNTKEY combos — add each live code here.
 */

export const COUPON_COOKIE = "UTM_Coupon";
export const COUPON_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/**
 * Full coupon string → { packageId, discountPercent, label }
 * Allowlist only — unknown codes are rejected.
 */
export const coupons = {
  // "STKH-JH769HJ": {
  //   packageId: "essential",
  //   discountPercent: 10,
  //   label: "10% off Essential",
  // },
  // "STKH-10PCT": {
  //   packageId: "essential",
  //   discountPercent: 10,
  //   label: "10% off Essential",
  // },
  // "STKH-20PCT": {
  //   packageId: "essential",
  //   discountPercent: 20,
  //   label: "20% off Essential",
  // },
  // "EXCT-10PCT": {
  //   packageId: "executive",
  //   discountPercent: 10,
  //   label: "10% off Executive",
  // },
  // "EXCT-20PCT": {
  //   packageId: "executive",
  //   discountPercent: 20,
  //   label: "20% off Executive",
  // },
  // "PRMM-10PCT": {
  //   packageId: "premium",
  //   discountPercent: 10,
  //   label: "10% off Premium",
  // },
  // "ELTE-10PCT": {
  //   packageId: "elite",
  //   discountPercent: 10,
  //   label: "10% off Elite",
  // },
  // "SVRN-10PCT": {
  //   packageId: "sovereign",
  //   discountPercent: 10,
  //   label: "10% off Sovereign",
  // },
  // "TCLA-10PCT": {
  //   packageId: "transfer-classic-arrival-mumbai",
  //   discountPercent: 10,
  //   label: "10% off Classic Arrival",
  // },
  // "TLUX-10PCT": {
  //   packageId: "transfer-luxury-arrival-mumbai",
  //   discountPercent: 10,
  //   label: "10% off Luxury Arrival",
  // },
  // "TAER-10PCT": {
  //   packageId: "transfer-aerobridge-welcome-mumbai",
  //   discountPercent: 10,
  //   label: "10% off Aerobridge Welcome",
  // },
};

export function setCouponCookie(code) {
  if (typeof document === "undefined" || !code) return;
  document.cookie = `${COUPON_COOKIE}=${encodeURIComponent(code)}; max-age=${COUPON_COOKIE_MAX_AGE}; path=/; SameSite=Lax`;
}

export function getCouponCookie() {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${COUPON_COOKIE}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

/** Resolve a raw coupon code to discount info, or null if not in allowlist. */
export function resolveCoupon(rawCode) {
  if (!rawCode || typeof rawCode !== "string") return null;
  const code = rawCode.trim().toUpperCase();
  if (!code) return null;

  const entry = coupons[code];
  if (!entry) return null;

  return { code, ...entry };
}

/** Apply coupon only if it matches the current plan. */
export function getApplicableCoupon(rawCode, planId) {
  const coupon = resolveCoupon(rawCode);
  if (!coupon || coupon.packageId !== planId) return null;
  return coupon;
}

export function applyDiscount(price, discountPercent) {
  const pct = Number(discountPercent) || 0;
  if (pct <= 0) return Math.ceil(Number(price) || 0);
  return Math.ceil((Number(price) || 0) * (1 - pct / 100));
}
