"use client";

import { useState } from "react";
import { CalendarClock, MessageCircle } from "lucide-react";
import ScheduleCallModal from "./ScheduleCallModal";

const WA_NUMBER = "917304607954";
const DEFAULT_MSG =
  "Hi WENS Force, I'm exploring your subscription. Can you help me find the right tier?";

export default function FloatingWhatsApp({ tierContext = "" }) {
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(false);

  const message = tierContext
    ? `Hi WENS Force, I'm interested in the ${tierContext} membership. Can you help?`
    : DEFAULT_MSG;
  const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;

  return (
    <>
      <div className="fixed bottom-6 right-5 z-[9999] flex flex-col items-end gap-2.5">
        <button
          type="button"
          onClick={() => setScheduleOpen(true)}
          className="flex items-center gap-2.5 rounded-full bg-white pl-3.5 pr-1.5 py-1.5 text-[13px] font-medium text-[#0B1E3F] transition-colors hover:bg-[#FAF6EC]"
          style={{ boxShadow: "0 8px 24px rgba(11,30,63,0.14)" }}
          aria-label="Schedule a call"
        >
          Schedule
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0B1E3F]">
            <CalendarClock size={16} color="#C9A24B" strokeWidth={2} />
          </span>
        </button>

        <div
          className="relative"
          onMouseEnter={() => setShowBubble(true)}
          onMouseLeave={() => setShowBubble(false)}
        >
          {showBubble && (
            <div
              className="absolute right-full bottom-0 mr-2.5 bg-white rounded-2xl rounded-br-sm border border-gray-100 p-4 w-[240px] animate-scale-in"
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
                  type="button"
                  onClick={() => setShowBubble(false)}
                  className="text-xs text-gray-400 hover:text-gray-600 px-2"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 rounded-full bg-white pl-3.5 pr-1.5 py-1.5 text-[13px] font-medium text-[#0B1E3F] transition-colors hover:bg-[#FAF6EC]"
            style={{ boxShadow: "0 8px 24px rgba(11,30,63,0.14)" }}
            aria-label="Chat on WhatsApp"
          >
            WhatsApp
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366]">
              <MessageCircle size={16} color="#fff" strokeWidth={2} />
            </span>
          </a>
        </div>
      </div>

      <ScheduleCallModal
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
      />
    </>
  );
}
