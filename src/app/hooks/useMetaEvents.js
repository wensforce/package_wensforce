"use client";

import { useCallback } from "react";
import {
  getFbc,
  getFbp,
  pixelViewContent,
  pixelAddToCart,
  pixelInitiateCheckout,
  pixelAddPaymentInfo,
  pixelCompleteRegistration,
  pixelContact,
} from "@/app/lib/metaPixel.js";

const ADD_PAYMENT_INFO_KEY = "wf_capi_add_payment_info_sent";

function splitName(fullName = "") {
  const parts = String(fullName || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" ") || "",
  };
}

async function sendCapi(payload) {
  if (typeof window === "undefined") return;
  if (!payload?.eventName || !payload?.eventId) return;

  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  try {
    await fetch(`${base}/capi/send-capi-event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName: payload.eventName,
        eventId: payload.eventId,
        phone: payload.phone || undefined,
        email: payload.email || undefined,
        firstName: payload.firstName || undefined,
        lastName: payload.lastName || undefined,
        value: payload.value ?? 0,
        currency: payload.currency || "INR",
        contentName: payload.contentName || undefined,
        contentId: payload.contentId || undefined,
        orderId: payload.orderId || undefined,
        fbc: getFbc(),
        fbp: getFbp(),
        url: window.location.href,
      }),
    });
  } catch (err) {
    console.error("[CAPI] failed to send", payload.eventName, err);
  }
}

function withUserFields({ phone, userData = {} } = {}) {
  const { firstName, lastName } = splitName(userData.fullName);
  return {
    phone: phone || userData.phone,
    email: userData.email,
    firstName: userData.firstName || firstName,
    lastName: userData.lastName || lastName,
  };
}

export function useMetaEvents() {
  const trackViewContent = useCallback(
    async ({
      contentName,
      contentId,
      value = 0,
      currency = "INR",
      phone,
      userData = {},
    } = {}) => {
      const eventId = pixelViewContent({
        contentName,
        contentId,
        value,
        currency,
      });
      await sendCapi({
        eventName: "ViewContent",
        eventId,
        contentName,
        contentId,
        value,
        currency,
        ...withUserFields({ phone, userData }),
      });
    },
    [],
  );

  const trackAddToCart = useCallback(
    async ({
      contentName,
      contentId,
      value = 0,
      currency = "INR",
      orderId,
      phone,
      userData = {},
    } = {}) => {
      const eventId = pixelAddToCart({
        contentName,
        contentId,
        value,
        currency,
      });
      await sendCapi({
        eventName: "AddToCart",
        eventId,
        contentName,
        contentId,
        value,
        currency,
        orderId,
        ...withUserFields({ phone, userData }),
      });
    },
    [],
  );

  const trackInitiateCheckout = useCallback(
    async ({
      contentName,
      contentId,
      value = 0,
      currency = "INR",
      phone,
      userData = {},
    } = {}) => {
      const eventId = pixelInitiateCheckout({
        contentName,
        contentId,
        value,
        currency,
      });
      await sendCapi({
        eventName: "InitiateCheckout",
        eventId,
        contentName,
        contentId,
        value,
        currency,
        ...withUserFields({ phone, userData }),
      });
    },
    [],
  );

  const trackAddPaymentInfo = useCallback(
    async ({
      contentName,
      contentId,
      value = 0,
      currency = "INR",
      phone,
      userData = {},
    } = {}) => {
      if (typeof window !== "undefined") {
        try {
          if (sessionStorage.getItem(ADD_PAYMENT_INFO_KEY) === "1") return;
          sessionStorage.setItem(ADD_PAYMENT_INFO_KEY, "1");
        } catch {
          // sessionStorage can be blocked; still fire once per call site
        }
      }

      const eventId = pixelAddPaymentInfo({
        contentName,
        contentId,
        value,
        currency,
      });
      await sendCapi({
        eventName: "AddPaymentInfo",
        eventId,
        contentName,
        contentId,
        value,
        currency,
        ...withUserFields({ phone, userData }),
      });
    },
    [],
  );

  const trackCompleteRegistration = useCallback(
    async ({ phone, userData = {} } = {}) => {
      const eventId = pixelCompleteRegistration();
      await sendCapi({
        eventName: "CompleteRegistration",
        eventId,
        ...withUserFields({ phone, userData }),
      });
    },
    [],
  );

  const trackContact = useCallback(async ({ phone, userData = {} } = {}) => {
    const eventId = pixelContact();
    await sendCapi({
      eventName: "Contact",
      eventId,
      ...withUserFields({ phone, userData }),
    });
  }, []);

  return {
    trackViewContent,
    trackAddToCart,
    trackInitiateCheckout,
    trackAddPaymentInfo,
    trackCompleteRegistration,
    trackContact,
  };
}
