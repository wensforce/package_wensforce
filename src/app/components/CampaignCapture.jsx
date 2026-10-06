"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { captureCampaignFromSearchParams } from "../lib/campaignAttribution";

/**
 * Runs on every page. When the URL has Google/Meta/UTM params,
 * persists them into the wf_campaign cookie for later enquiry/booking submit.
 */
export default function CampaignCapture() {
  const searchParams = useSearchParams();

  useEffect(() => {
    captureCampaignFromSearchParams(searchParams);
  }, [searchParams]);

  return null;
}
