import api from "../axios/axios";
import { getCampaignForSubmit } from "./campaignAttribution";

const WENS_WHATSAPP = "917304607954";

function createReferenceId() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  let id = "WF-";
  for (const byte of bytes) id += alphabet[byte % alphabet.length];
  return id;
}

function isWensWhatsAppUrl(url) {
  const host = url.hostname.replace(/^www\./, "");
  if (host !== "wa.me" && host !== "api.whatsapp.com") return false;
  const phone = url.pathname.replace(/\D/g, "");
  return phone.endsWith(WENS_WHATSAPP);
}

/**
 * For a WENS wa.me link: create a reference id, append it to the message,
 * and send that id plus the UTM cookie to /enquiry/whatsapp.
 * Other URLs are returned unchanged.
 */
export function trackWhatsAppClick(href) {
  if (typeof window === "undefined" || !href) return href;

  let url;
  try {
    url = new URL(href, window.location.origin);
  } catch {
    return href;
  }
  if (!isWensWhatsAppUrl(url)) return href;

  const referenceId = createReferenceId();
  const text = url.searchParams.get("text");
  url.searchParams.set(
    "text",
    text
      ? `${text}\n\nRef ID: ${referenceId}`
      : `Hi WENS Force. Ref ID: ${referenceId}`,
  );

  const payload = { referenceId };
  const campaign = getCampaignForSubmit(
    new URLSearchParams(window.location.search),
  );
  if (campaign) {
    payload.fromCampaign = true;
    payload.campaign = campaign;
  }
  api.post("/enquiry/whatsapp", payload).catch(() => {});

  return url.toString();
}
