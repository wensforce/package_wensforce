"use client";

import { useState } from "react";
import { useExitIntent } from "@/app/hooks/useExitIntent";

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);

  useExitIntent(() => setVisible(true));

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4">
      {/* Scrim */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setVisible(false)}
      />

      {/* Modal */}
      <div
        className="relative bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl animate-scale-in"
        style={{ boxShadow: "0 24px 64px rgba(11,30,63,0.25)" }}
      >
        <button
          onClick={() => setVisible(false)}
          className="absolute top-5 right-5 text-gray-300 hover:text-gray-500 text-xl leading-none"
          aria-label="Close"
        >
          ✕
        </button>

        <p className="text-[#C9A24B] text-[10px] tracking-[0.4em] uppercase font-semibold mb-3">
          Wait — before you go.
        </p>
        <h3 className="font-serif-display text-2xl font-bold text-[#0B1E3F] mb-2 leading-snug">
          Get Up to ₹10,000 Off Your Next Plan
        </h3>
        <p className="text-gray-500 text-sm font-light leading-relaxed mb-5">
          Refer a friend &amp; book any WENS FORCE plan together — and unlock up
          to <span className="font-semibold text-[#0B1E3F]">₹10,000 off</span>.
          The more you share, the more you save.
        </p>

        <div className="bg-[#F8F4EC] rounded-2xl px-5 py-4 mb-5 flex items-start gap-3">
          <span className="text-2xl mt-0.5">🎁</span>
          <div>
            <p className="text-[#0B1E3F] text-sm font-semibold mb-0.5">
              How to claim
            </p>
            <p className="text-gray-500 text-xs font-light leading-relaxed">
              Refer a friend → both book a plan → contact with WENS FORCE
              support → You will receive your discount.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setVisible(false);
            setTimeout(() => {
              const el = document.getElementById("plans");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }, 150);
          }}
          className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90"
          style={{
            background: "linear-gradient(135deg, #C9A24B 0%, #e0b85a 100%)",
          }}
        >
          View Plans &amp; Refer a Friend →
        </button>

        <button
          onClick={() => setVisible(false)}
          className="mt-4 w-full text-center text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          No thanks
        </button>
      </div>
    </div>
  );
}
