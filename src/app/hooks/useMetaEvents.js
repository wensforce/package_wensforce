"use client";
import {
  getFbc,
  getFbp,
  pixelViewContent,
  pixelLead,
  pixelPurchase,
} from "@/app/lib/metaPixel.js";

async function sendCapi(payload) {
  await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/meta-event`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
    await sendCapi({
      eventName: "ViewContent",
      eventId,
      contentName,
      contentId,
      value,
    });
  }

  async function trackLead({ value = 0, phone, userData = {} }) {
    const nameParts = (userData.fullName || "").trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";
    const eventId = pixelLead({ value });
    await sendCapi({ eventName: "Lead", eventId, value, firstName, lastName, phone, ...userData });
  }

  async function trackPurchase({
    value,
    orderId,
    currency = "INR",
    phone,
    userData = {},
  }) {
    const nameParts = (userData.fullName || "").trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";
    const eventId = pixelPurchase({ value, orderId, currency });
    await sendCapi({
      eventName: "Purchase",
      eventId,
      value,
      orderId,
      currency,
      firstName,
      lastName,
      phone,
      ...userData,
    });
  }

  return { trackViewContent, trackLead, trackPurchase };
}
