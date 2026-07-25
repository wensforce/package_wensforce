'use client';

import { useState, useEffect } from 'react';
import { calculateCountdown } from '../lib/expoUtils';

export default function CountdownBadge({ serviceStart, serviceEnd }) {
  // Server-rendered value for initial hydration
  const initialCountdown = calculateCountdown(serviceStart, serviceEnd);

  // Client-side state for updates
  const [countdown, setCountdown] = useState(initialCountdown);
  const [isClient, setIsClient] = useState(false);

  // Update countdown after mount (client-side only)
  useEffect(() => {
    setIsClient(true);
    // Recalculate to ensure we have the current date
    const newCountdown = calculateCountdown(serviceStart, serviceEnd);
    setCountdown(newCountdown);

    // No tick needed for day-level countdown; it updates on page reload
    // But if you want to update midnight, you could set a timer
  }, [serviceStart, serviceEnd]);

  const badgeStyle = {
    display: 'inline-block',
    fontSize: '12px',
    fontWeight: '700',
    padding: '6px 12px',
    borderRadius: '6px',
    whiteSpace: 'nowrap',
  };

  if (countdown.status === 'upcoming') {
    return (
      <div
        style={{
          ...badgeStyle,
          background: 'rgba(201, 162, 39, 0.1)',
          border: '1px solid rgba(201, 162, 39, 0.3)',
          color: '#C9A227',
        }}
      >
        {countdown.label}
      </div>
    );
  }

  if (countdown.status === 'live') {
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
        {countdown.label}
      </div>
    );
  }

  // ended
  return (
    <div
      style={{
        ...badgeStyle,
        background: 'rgba(107, 114, 128, 0.1)',
        border: '1px solid rgba(107, 114, 128, 0.3)',
        color: '#6B7280',
      }}
    >
      {countdown.label}
    </div>
  );
}
