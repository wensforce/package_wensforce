// Get cookie by name
export function getCookie(name) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

// Build _fbc from fbclid URL param if cookie not present
export function getFbc() {
  const existing = getCookie("_fbc");
  if (existing) return existing;

  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  const fbclid = params.get("fbclid");
  if (fbclid) {
    const fbc = `fb.1.${Date.now()}.${fbclid}`;
    document.cookie = `_fbc=${fbc}; max-age=${60 * 60 * 24 * 90}; path=/`;
    return fbc;
  }
  return null;
}

export function getFbp() {
  return getCookie("_fbp");
}

// Generate unique event ID for pixel + CAPI deduplication
export function generateEventId(eventName) {
  return `${eventName}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function firePixel(eventName, params = {}) {
  const eventId = generateEventId(eventName);
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", eventName, params, { eventID: eventId });
  }
  return eventId;
}

// ─── Fire Pixel Events ───────────────────────────────────

export function pixelViewContent({
  contentName,
  contentId,
  value,
  currency = "INR",
}) {
  return firePixel("ViewContent", {
    content_name: contentName,
    content_ids: contentId ? [contentId] : undefined,
    value,
    currency,
  });
}

export function pixelAddToCart({
  contentName,
  contentId,
  value,
  currency = "INR",
}) {
  return firePixel("AddToCart", {
    content_name: contentName,
    content_ids: contentId ? [contentId] : undefined,
    value,
    currency,
  });
}

export function pixelInitiateCheckout({
  contentName,
  contentId,
  value,
  currency = "INR",
}) {
  return firePixel("InitiateCheckout", {
    content_name: contentName,
    content_ids: contentId ? [contentId] : undefined,
    value,
    currency,
  });
}

export function pixelAddPaymentInfo({
  contentName,
  contentId,
  value,
  currency = "INR",
}) {
  return firePixel("AddPaymentInfo", {
    content_name: contentName,
    content_ids: contentId ? [contentId] : undefined,
    value,
    currency,
  });
}

export function pixelCompleteRegistration({ value = 0, currency = "INR" } = {}) {
  return firePixel("CompleteRegistration", { value, currency });
}

export function pixelContact() {
  return firePixel("Contact");
}

export function pixelLead({ value = 0, currency = "INR" }) {
  return firePixel("Lead", { value, currency });
}

export function pixelPurchase({ value, currency = "INR", orderId }) {
  return firePixel("Purchase", {
    value,
    currency,
    order_id: orderId,
  });
}
