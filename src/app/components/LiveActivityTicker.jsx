'use client';

import { useState, useEffect } from 'react';

const EVENTS = [
  { name: 'Mr. R.S.', location: 'Worli', action: 'just joined Elite', time: '7m ago' },
  { name: 'Ms. P.K.', location: 'Banjara Hills', action: 'upgraded to Sovereign', time: '14m ago' },
  { name: 'Mr. A.M.', location: 'Juhu', action: 'booked Darshan at Tirupati', time: '22m ago' },
  { name: 'Mrs. S.R.', location: 'Koramangala', action: 'just joined Premium', time: '31m ago' },
  { name: 'Mr. V.N.', location: 'Andheri West', action: 'upgraded to Elite', time: '45m ago' },
  { name: 'Mr. D.B.', location: 'Gurgaon', action: 'just joined Executive', time: '53m ago' },
  { name: 'Mrs. L.J.', location: 'Powai', action: 'booked armed escort', time: '1h ago' },
  { name: 'Mr. K.S.', location: 'Whitefield', action: 'just joined Sovereign', time: '1h 12m ago' },
];

export default function LiveActivityTicker() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [eventIdx, setEventIdx] = useState(0);
  const [animState, setAnimState] = useState('');

  useEffect(() => {
    if (dismissed) return;

    // Show first event after 8s, then every 70-90s
    const firstDelay = 8000;
    let timeout;
    let interval;

    const showNext = (idx) => {
      setEventIdx(idx % EVENTS.length);
      setAnimState('ticker-in');
      setVisible(true);

      // Auto-dismiss after 8 seconds
      timeout = setTimeout(() => {
        setAnimState('ticker-out');
        setTimeout(() => setVisible(false), 300);
      }, 8000);
    };

    const firstTimeout = setTimeout(() => {
      showNext(0);
      let count = 1;
      interval = setInterval(() => {
        showNext(count++);
      }, 80000); // ~80s interval
    }, firstDelay);

    return () => {
      clearTimeout(firstTimeout);
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [dismissed]);

  if (!visible || dismissed) return null;

  const ev = EVENTS[eventIdx];

  return (
    <div
      className={`fixed bottom-6 left-4 z-[9998] ${animState}`}
      style={{ maxWidth: 320 }}
    >
      <div
        className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-xl"
        style={{ boxShadow: '0 8px 24px rgba(11,30,63,0.14)' }}
      >
        {/* Green live dot */}
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
        </span>

        <p className="text-[12px] text-gray-700 leading-snug flex-1">
          <span className="font-semibold text-gray-900">{ev.name}</span>
          {' '}from{' '}
          <span className="font-medium">{ev.location}</span>
          {' '}{ev.action}
        </p>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] text-gray-400">{ev.time}</span>
          <button
            onClick={() => setDismissed(true)}
            className="text-gray-300 hover:text-gray-500 text-xs leading-none"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
