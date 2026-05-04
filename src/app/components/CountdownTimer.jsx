'use client';

import { useState, useEffect } from 'react';

export default function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const target = new Date(targetDate).getTime();

    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (!mounted) return null;

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <span className="inline-flex items-center gap-1 font-mono font-bold text-[#BF9F00]">
      <span className="bg-[#BF9F00]/20 px-1.5 py-0.5 rounded text-xs">{pad(timeLeft.days)}d</span>
      <span className="bg-[#BF9F00]/20 px-1.5 py-0.5 rounded text-xs">{pad(timeLeft.hours)}h</span>
      <span className="bg-[#BF9F00]/20 px-1.5 py-0.5 rounded text-xs">{pad(timeLeft.minutes)}m</span>
      <span className="bg-[#BF9F00]/20 px-1.5 py-0.5 rounded text-xs">{pad(timeLeft.seconds)}s</span>
    </span>
  );
}
