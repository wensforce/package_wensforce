'use client';

import { useEffect } from 'react';
import { useMetaEvents } from '@/app/hooks/useMetaEvents';

export default function MetaViewTracker({ plan }) {
  const { trackViewContent } = useMetaEvents();

  useEffect(() => {
    trackViewContent({
      contentName: plan.title,
      contentId: plan.id,
      value: plan.price,
    });
  }, [plan.id, plan.price]);

  return null;
}