"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";

const APP_PARAMS = new Set(["serviceType", "welcomeIndia"]);

const CAMPAIGN_PARAM_KEYS = new Set([
  "gclid",
  "gbraid",
  "wbraid",
  "dclid",
  "gclsrc",
  "fbclid",
  "msclkid",
  "ttclid",
  "twclid",
  "li_fat_id",
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

function getEnquiryCategory(pathname, searchParams) {
  if (
    pathname?.startsWith("/airport-concierge") ||
    pathname?.includes("airport-concierge")
  ) {
    return "airport-concierge";
  }
  if (searchParams.get("welcomeIndia") === "true") {
    return "welcome-india";
  }
  return "membership";
}

function buildEnquiryHref(pathname, searchParams) {
  const category = getEnquiryCategory(pathname, searchParams);
  const params = new URLSearchParams();

  for (const [key, value] of searchParams.entries()) {
    if (!value || APP_PARAMS.has(key)) continue;
    const lower = key.toLowerCase();
    if (lower.startsWith("utm_") || CAMPAIGN_PARAM_KEYS.has(lower)) {
      params.set(key, value);
    }
  }

  const qs = params.toString();
  return qs ? `/enquiry/${category}/?${qs}` : `/enquiry/${category}`;
}

export default function FloatingEnquiry() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (pathname?.startsWith("/enquiry") || pathname?.startsWith("/admin")) {
    return null;
  }

  const href = buildEnquiryHref(pathname, searchParams);

  return (
    <>
      <style>{`
        .enquiry-float {
          position: fixed;
          bottom: calc(4.25rem + 60px + 12px);
          right: 1.5rem;
          z-index: 9999;
        }

        @media (max-width: 640px) {
          .enquiry-float {
            bottom: calc(1.5rem + 60px + 12px);
            right: 1rem;
          }
        }

        .enquiry-float-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 8px 24px rgba(11, 30, 63, 0.22);
          border: 1.5px solid rgba(11, 30, 63, 0.08);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          text-decoration: none;
        }

        .enquiry-float-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 10px 28px rgba(11, 30, 63, 0.28);
        }

        .enquiry-float-btn:active {
          transform: scale(0.95);
        }

        .enquiry-float-tooltip {
          position: absolute;
          right: calc(100% + 12px);
          top: 50%;
          transform: translateY(-50%);
          white-space: nowrap;
          background: #0B1E3F;
          color: #fff;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          padding: 0.45rem 0.75rem;
          border-radius: 0.5rem;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease, transform 0.2s ease;
          box-shadow: 0 6px 16px rgba(11, 30, 63, 0.25);
        }

        .enquiry-float-tooltip::after {
          content: "";
          position: absolute;
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          border: 6px solid transparent;
          border-left-color: #0B1E3F;
        }

        .enquiry-float-btn:hover .enquiry-float-tooltip,
        .enquiry-float-btn:focus-visible .enquiry-float-tooltip {
          opacity: 1;
          transform: translateY(-50%) translateX(-2px);
        }
      `}</style>

      <div className="enquiry-float">
        <Link
          href={href}
          className="enquiry-float-btn"
          aria-label="Send an enquiry"
        >
          <span className="enquiry-float-tooltip" role="tooltip">
            Send an Enquiry
          </span>
          <Image
            src="/enquiry-icon.png"
            alt=""
            width={36}
            height={36}
            className="pointer-events-none"
            priority={false}
          />
        </Link>
      </div>
    </>
  );
}
