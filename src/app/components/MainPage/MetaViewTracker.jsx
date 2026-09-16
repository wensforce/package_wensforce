'use client';

import { useEffect } from 'react';
import { useMetaEvents } from '@/app/hooks/useMetaEvents';

export default function MetaViewTracker({ plan }) {
  const { trackViewContent } = useMetaEvents();

  useEffect(() => {
    if (!plan?.id) return;
    trackViewContent({
      contentName: plan.title || plan.name,
      contentId: plan.id,
      value: plan.price ?? plan.discountedPrice ?? 0,
    });
  }, [plan?.id, plan?.title, plan?.name, plan?.price, plan?.discountedPrice]);

  return null;
}