"use client";

import { useState } from "react";

const WA_NUMBER = "917304607954";
const DEFAULT_MSG =
  "Hi WENS Force, I'm exploring your subscription. Can you help me find the right tier?";

export default function FloatingWhatsApp({ tierContext = "" }) {
  const [showBubble, setShowBubble] = useState(false);

  const message = tierContext
    ? `Hi WENS Force, I'm interested in the ${tierContext} membership. Can you help?`
    : DEFAULT_MSG;
  const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-17 right-6 z-[9999] flex flex-col items-end gap-3">
      {/* Greeting bubble */}
      {showBubble && (
        <div
          className="bg-white rounded-2xl rounded-br-sm shadow-2xl border border-gray-100 p-4 max-w-[240px] animate-scale-in"
          style={{ boxShadow: "0 8px 32px rgba(11,30,63,0.18)" }}
        >
          <p className="text-[11px] text-gray-500 uppercase tracking-widest mb-1 font-medium">
            WENS Concierge
          </p>
          <p className="text-sm text-gray-800 font-medium leading-snug">
            Hello! I&apos;m Aanya.
          </p>
          <p className="text-sm text-gray-600 font-light leading-snug mt-0.5">
            How may I help you today?
          </p>
          <div className="mt-3 flex gap-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center text-xs font-semibold py-2 px-3 rounded-lg text-white"
              style={{ backgroundColor: "#25D366" }}
            >
              Chat Now
            </a>
            <button
              onClick={() => setShowBubble(false)}
              className="text-xs text-gray-400 hover:text-gray-600 px-2"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowBubble(true)}
        onMouseLeave={() => setShowBubble(false)}
        className="wa-pulse flex items-center justify-center rounded-full shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95"
        style={{
          width: 60,
          height: 60,
          backgroundColor: "#25D366",
          boxShadow: "0 8px 24px rgba(37,211,102,0.4)",
        }}
        aria-label="Chat on WhatsApp"
      >
        {/* WhatsApp SVG icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width="28"
          height="28"
          fill="white"
        >
          <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.668 4.799 1.836 6.793L2 30l7.393-1.812A13.918 13.918 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6a11.543 11.543 0 01-5.88-1.604l-.42-.248-4.39 1.074 1.106-4.274-.272-.44A11.556 11.556 0 014.4 16C4.4 9.592 9.592 4.4 16 4.4S27.6 9.592 27.6 16 22.408 27.6 16 27.6zm6.327-8.627c-.348-.174-2.055-1.014-2.374-1.13-.318-.115-.55-.174-.78.174-.23.348-.894 1.13-1.097 1.362-.201.231-.404.26-.752.086-.348-.174-1.47-.542-2.799-1.727-1.034-.922-1.732-2.062-1.934-2.41-.202-.348-.022-.536.152-.71.156-.155.348-.405.522-.607.174-.202.23-.348.348-.58.115-.231.058-.434-.03-.607-.086-.174-.78-1.882-1.07-2.578-.282-.677-.568-.585-.78-.596-.201-.01-.434-.012-.665-.012-.23 0-.607.086-.926.434-.318.348-1.214 1.186-1.214 2.892 0 1.707 1.243 3.356 1.417 3.588.174.231 2.447 3.734 5.928 5.234.83.358 1.478.572 1.982.732.833.265 1.59.227 2.19.138.668-.1 2.055-.84 2.346-1.652.29-.81.29-1.505.202-1.652-.086-.145-.318-.231-.665-.405z" />
        </svg>
      </a>
    </div>
  );
}
