'use client';

import { useState, useEffect, useMemo } from 'react';
import { getExpoDisplayStatus } from '@/app/utils/expo/expoUtils';

export default function CountdownBadge({ expo, eventStart, eventEnd, status }) {
  const expoLike = useMemo(
    () => ({
      eventStart: expo?.eventStart ?? eventStart,
      eventEnd: expo?.eventEnd ?? eventEnd,
      status: expo?.status ?? status,
    }),
    [
      expo?.eventStart,
      expo?.eventEnd,
      expo?.status,
      eventStart,
      eventEnd,
      status,
    ],
  );

  const [display, setDisplay] = useState(() => getExpoDisplayStatus(expoLike));

  useEffect(() => {
    setDisplay(getExpoDisplayStatus(expoLike));
  }, [expoLike]);

  const badgeStyle = {
    display: 'inline-block',
    fontSize: '12px',
    fontWeight: '700',
    padding: '6px 12px',
    borderRadius: '6px',
    whiteSpace: 'nowrap',
  };

  if (display.status === 'upcoming') {
    return (
      <div
        style={{
          ...badgeStyle,
          background: 'rgba(201, 162, 39, 0.1)',
          border: '1px solid rgba(201, 162, 39, 0.3)',
          color: '#C9A227',
        }}
      >
        {display.label}
      </div>
    );
  }

  if (display.status === 'live') {
    return (
      <div
        style={{
          ...badgeStyle,
          background: 'rgba(31, 168, 85, 0.1)',
          border: '1px solid rgba(31, 168, 85, 0.3)',
          color: '#1FA855',
          animation: 'pulse 2s ease-in-out infinite',
        }}
      >
        {display.label}
      </div>
    );
  }

  if (display.status === 'cancelled') {
    return (
      <div
        style={{
          ...badgeStyle,
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          color: '#DC2626',
        }}
      >
        {display.label}
      </div>
    );
  }

  return (
    <div
      style={{
        ...badgeStyle,
        background: 'rgba(107, 114, 128, 0.1)',
        border: '1px solid rgba(107, 114, 128, 0.3)',
        color: '#6B7280',
      }}
    >
      {display.label}
    </div>
  );
}
