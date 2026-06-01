"use client";

import { useRef } from "react";

const OTP_LENGTH = 6;

export default function OtpBoxes({ otp, onChange }) {
  const refs = useRef([]);

  function handleChange(e, idx) {
    const val = e.target.value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[idx] = val;
    onChange(next);
    if (val && idx < OTP_LENGTH - 1) refs.current[idx + 1]?.focus();
  }

  function handleKey(e, idx) {
    if (e.key === "Backspace") {
      if (otp[idx]) {
        const next = [...otp];
        next[idx] = "";
        onChange(next);
      } else if (idx > 0) {
        refs.current[idx - 1]?.focus();
      }
      return;
    }
    if (e.key === "ArrowLeft"  && idx > 0)             refs.current[idx - 1]?.focus();
    if (e.key === "ArrowRight" && idx < OTP_LENGTH - 1) refs.current[idx + 1]?.focus();
  }

  function handlePaste(e) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((ch, i) => (next[i] = ch));
    onChange(next);
    refs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  }

  return (
    <div className="flex gap-2.5 justify-center">
      {otp.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => (refs.current[idx] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKey(e, idx)}
          onPaste={handlePaste}
          autoComplete="one-time-code"
          className="w-11 h-13 text-center text-lg font-bold rounded-xl outline-none transition-all duration-150 caret-transparent"
          style={{
            height: 52,
            background: digit ? "#fffbf0" : "#f8fafc",
            border: digit ? "1.5px solid #C9A24B" : "1.5px solid #e2e8f0",
            color: digit ? "#92720a" : "#64748b",
            boxShadow: digit ? "0 0 0 3px rgba(201,162,75,0.12)" : "none",
          }}
        />
      ))}
    </div>
  );
}
