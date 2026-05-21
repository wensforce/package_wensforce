'use client';
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function GTMPageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "page_view",
      page_path: pathname,
    });
  }, [pathname]);

  return null;
}
