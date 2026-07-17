'use client';

import { useState } from 'react';

const WA_NUMBER = '917304607954';
const DEFAULT_MSG = "Hi WENS Force, I'm exploring your subscription. Can you help me find the right tier?";

export default function FloatingWhatsApp({ tierContext = '' }) {
  const [showBubble, setShowBubble] = useState(false);

  const message = tierContext
    ? `Hi WENS Force, I'm interested in the ${tierContext} membership. Can you help?`
    : DEFAULT_MSG;
  const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;

  return (
    <>
      <style>{`
        .wa-container {
          position: fixed;
          bottom: 4.25rem;
          right: 1.5rem;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
        }

        @media (max-width: 640px) {
          .wa-container {
            bottom: 1.5rem;
            right: 1rem;
          }
        }

        .wa-bubble {
          background: white;
          border-radius: 1rem;
          border-bottom-right-radius: 0.125rem;
          box-shadow: 0 8px 32px rgba(11, 30, 63, 0.18);
          border: 1px solid #f3f4f6;
          padding: 1rem;
          max-width: 240px;
          animation: slideInBubble 0.3s ease-out;
        }

        @keyframes slideInBubble {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .wa-bubble-label {
          font-size: 0.6875rem;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.25rem;
          font-weight: 500;
        }

        .wa-bubble-name {
          font-size: 0.875rem;
          color: #1f2937;
          font-weight: 500;
          line-height: 1.4;
        }

        .wa-bubble-text {
          font-size: 0.875rem;
          color: #4b5563;
          font-weight: 300;
          line-height: 1.4;
          margin-top: 0.125rem;
        }

        .wa-bubble-buttons {
          margin-top: 0.75rem;
          display: flex;
          gap: 0.5rem;
        }

        .wa-chat-btn {
          flex: 1;
          text-align: center;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.5rem 0.75rem;
          border-radius: 0.5rem;
          background-color: #25D366;
          color: white;
          text-decoration: none;
          transition: background-color 0.2s ease;
          border: none;
          cursor: pointer;
        }

        .wa-chat-btn:hover {
          background-color: #20ba5a;
        }

        .wa-close-btn {
          font-size: 0.75rem;
          color: #d1d5db;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          transition: color 0.2s ease;
        }

        .wa-close-btn:hover {
          color: #4b5563;
        }

        .wa-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 60px;
          background-color: #25D366;
          border-radius: 50%;
          box-shadow: 0 8px 24px rgba(37, 211, 102, 0.4);
          text-decoration: none;
          transition: all 0.2s ease;
          border: none;
          cursor: pointer;
        }

        .wa-button:hover {
          transform: scale(1.1);
        }

        .wa-button:active {
          transform: scale(0.95);
        }

        .wa-button svg {
          width: 28px;
          height: 28px;
          fill: white;
        }

        .wa-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>

      <div className="wa-container">
        {/* Greeting bubble */}
        {showBubble && (
          <div className="wa-bubble">
            <p className="wa-bubble-label">WENS Concierge</p>
            <p className="wa-bubble-name">Hello! I'm Aanya.</p>
            <p className="wa-bubble-text">How may I help you today?</p>
            <div className="wa-bubble-buttons">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="wa-chat-btn"
              >
                Chat Now
              </a>
              <button
                onClick={() => setShowBubble(false)}
                className="wa-close-btn"
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
          className="wa-button wa-pulse"
          aria-label="Chat on WhatsApp"
        >
          {/* WhatsApp SVG icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            width="28"
            height="28"
          >
            <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.668 4.799 1.836 6.793L2 30l7.393-1.812A13.918 13.918 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6a11.543 11.543 0 01-5.88-1.604l-.42-.248-4.39 1.074 1.106-4.274-.272-.44A11.556 11.556 0 014.4 16C4.4 9.592 9.592 4.4 16 4.4S27.6 9.592 27.6 16 22.408 27.6 16 27.6zm6.327-8.627c-.348-.174-2.055-1.014-2.374-1.13-.318-.115-.55-.174-.78.174-.23.348-.894 1.13-1.097 1.362-.201.231-.404.26-.752.086-.348-.174-1.47-.542-2.799-1.727-1.034-.922-1.732-2.062-1.934-2.41-.202-.348-.022-.536.152-.71.156-.155.348-.405.522-.607.174-.202.23-.348.348-.58.115-.231.058-.434-.03-.607-.086-.174-.78-1.882-1.07-2.578-.282-.677-.568-.585-.78-.596-.201-.01-.434-.012-.665-.012-.23 0-.607.086-.926.434-.318.348-1.214 1.186-1.214 2.892 0 1.707 1.243 3.356 1.417 3.588.174.231 2.447 3.734 5.928 5.234.83.358 1.478.572 1.982.732.833.265 1.59.227 2.19.138.668-.1 2.055-.84 2.346-1.652.29-.81.29-1.505.202-1.652-.086-.145-.318-.231-.665-.405z" />
          </svg>
        </a>
      </div>
    </>
  );
}
