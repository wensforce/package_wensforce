"use client";

import { useEffect, useRef } from "react";
import { useMetaEvents } from "@/app/hooks/useMetaEvents";

export default function MetaViewTracker({ plan }) {
  const { trackViewContent } = useMetaEvents();
  const trackedId = useRef(null);

  useEffect(() => {
    if (!plan?.id || trackedId.current === plan.id) return;
    trackedId.current = plan.id;
    void trackViewContent({
      contentName: plan.title || plan.name,
      contentId: plan.id,
      value: plan.price ?? plan.discountedPrice ?? 0,
    });
  }, [plan?.id, plan?.title, plan?.name, plan?.price, plan?.discountedPrice, trackViewContent]);

  return null;
}