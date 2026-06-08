// Get cookie by name
export function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

// Build _fbc from fbclid URL param if cookie not present
export function getFbc() {
  const existing = getCookie('_fbc');
  if (existing) return existing;

  const params = new URLSearchParams(window.location.search);
  const fbclid = params.get('fbclid');
  if (fbclid) {
    const fbc = `fb.1.${Date.now()}.${fbclid}`;
    document.cookie = `_fbc=${fbc}; max-age=${60 * 60 * 24 * 90}; path=/`;
    return fbc;
  }
  return null;
}

export function getFbp() {
  return getCookie('_fbp');
}

// Generate unique event ID for deduplication
export function generateEventId(eventName) {
  return `${eventName}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

// ─── Fire Pixel Events ───────────────────────────────────

export function pixelViewContent({ contentName, contentId, value, currency = 'INR' }) {
  if (typeof fbq === 'undefined') return;
  const eventId = generateEventId('ViewContent');
  fbq('track', 'ViewContent', {
    content_name: contentName,
    content_ids: [contentId],
    value,
    currency,
  }, { eventID: eventId });
  return eventId;
}

export function pixelLead({ value = 0, currency = 'INR' }) {
  if (typeof fbq === 'undefined') return;
  const eventId = generateEventId('Lead');
  fbq('track', 'Lead', { value, currency }, { eventID: eventId });
  return eventId;
}

export function pixelPurchase({ value, currency = 'INR', orderId }) {
  if (typeof fbq === 'undefined') return;
  const eventId = generateEventId('Purchase');
  fbq('track', 'Purchase', {
    value,
    currency,
    order_id: orderId,
  }, { eventID: eventId });
  return eventId;
}