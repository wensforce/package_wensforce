'use client';
import { getFbc, getFbp, pixelViewContent, pixelLead, pixelPurchase } from '@/app/lib/metaPixel.js';

async function sendCapi(payload) {
  await fetch('/api/meta-event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...payload,
      fbc: getFbc(),
      fbp: getFbp(),
      url: window.location.href,
    }),
  });
}

export function useMetaEvents() {

  async function trackViewContent({ contentName, contentId, value }) {
    const eventId = pixelViewContent({ contentName, contentId, value });
    await sendCapi({ eventName: 'ViewContent', eventId, contentName, contentId, value });
  }

  async function trackLead({ value = 0, userData = {} }) {
    const eventId = pixelLead({ value });
    await sendCapi({ eventName: 'Lead', eventId, value, ...userData });
  }

  async function trackPurchase({ value, orderId, currency = 'INR', userData = {} }) {
    const eventId = pixelPurchase({ value, orderId, currency });
    await sendCapi({ eventName: 'Purchase', eventId, value, orderId, currency, ...userData });
  }

  return { trackViewContent, trackLead, trackPurchase };
}