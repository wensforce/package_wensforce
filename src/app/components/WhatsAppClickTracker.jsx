"use client";

import { useEffect } from "react";
import { trackWhatsAppClick } from "../lib/whatsappLead";

/**
 * Catches every WENS wa.me link click on the site.
 * Buttons that call window.open should use trackWhatsAppClick themselves.
 */
export default function WhatsAppClickTracker() {
  useEffect(() => {
    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = event.target.closest?.("a[href]");
      if (!anchor) return;

      const tracked = trackWhatsAppClick(anchor.href);
      if (tracked === anchor.href) return;

      event.preventDefault();
      window.open(tracked, anchor.target || "_blank", "noopener,noreferrer");
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
