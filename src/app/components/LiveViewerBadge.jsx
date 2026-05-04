'use client';

import { useState, useEffect } from 'react';

export default function LiveViewerBadge() {
  const [count, setCount] = useState(47);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => {
      setCount((prev) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        return Math.max(32, Math.min(71, prev + delta));
      });
    }, 3800);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="flex items-center gap-1.5 text-sm text-gray-600">
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
      </span>
      {mounted ? (
        <span>
          <strong className="text-black">{count}</strong> people viewing right now
        </span>
      ) : (
        <span>
          <strong className="text-black">47</strong> people viewing right now
        </span>
      )}
    </span>
  );
}
