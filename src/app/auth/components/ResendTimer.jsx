"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";

export default function ResendTimer({ initialSeconds = 60, onResend }) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const timerRef = useRef(null);

  useEffect(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (seconds <= 0) return;
    timerRef.current = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [seconds]);

  if (seconds > 0) {
    return (
      <p className="text-center text-sm text-gray-400">
        Resend OTP in{" "}
        <span className="font-semibold tabular-nums" style={{ color: "#C9A24B" }}>
          {String(Math.floor(seconds / 60)).padStart(2, "0")}:
          {String(seconds % 60).padStart(2, "0")}
        </span>
      </p>
    );
  }

  return (
    <button
      type="button"
      onClick={onResend}
      className="flex items-center gap-1.5 mx-auto text-sm font-semibold transition-opacity hover:opacity-70"
      style={{ color: "#C9A24B" }}
    >
      <RotateCcw size={13} />
      Resend OTP
    </button>
  );
}
