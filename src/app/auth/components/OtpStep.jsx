import { ArrowRight, ChevronLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import OtpBoxes from "./OtpBoxes";
import ResendTimer from "./ResendTimer";

const WA_COOLDOWN = 60;

export default function OtpStep({ otp, onChange, onSubmit, onResend, onBack, onWhatsApp, country, phone, resendKey, isLoading }) {
  const filled = otp.every(Boolean);
  const displayPhone = phone.replace(/\D/g, "").slice(-10);

  const [waCooldown, setWaCooldown] = useState(WA_COOLDOWN);
  const waTimer = useRef(null);

  useEffect(() => {
    if (waCooldown <= 0) return;
    waTimer.current = setTimeout(() => setWaCooldown((s) => s - 1), 1000);
    return () => clearTimeout(waTimer.current);
  }, [waCooldown]);

  function handleWhatsApp() {
    onWhatsApp?.();
    setWaCooldown(WA_COOLDOWN);
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">

      {/* Sent-to label */}
      <p className="text-center text-sm text-gray-500">
        Sent to{" "}
        <span className="font-semibold text-gray-700">
          {country.dial} {displayPhone}
        </span>
      </p>

      {/* OTP boxes */}
      <OtpBoxes otp={otp} onChange={onChange} />

      {/* Verify CTA */}
      <button
        type="submit"
        disabled={!filled || isLoading}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        style={{
          background: filled
            ? "linear-gradient(135deg, #C9A24B 0%, #f0c940 50%, #C9A24B 100%)"
            : "#e2e8f0",
          color: filled ? "#1a0f00" : "#94a3b8",
          boxShadow: filled && !isLoading ? "0 8px 24px rgba(201,162,75,0.35)" : "none",
        }}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
            Verifying…
          </>
        ) : (
          <>
            Verify & Sign In
            <ArrowRight size={16} strokeWidth={2.5} />
          </>
        )}
      </button>

      {/* WhatsApp OTP */}
      <button
        type="button"
        onClick={handleWhatsApp}
        disabled={isLoading || waCooldown > 0}
        className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed"
        style={{
          background: waCooldown > 0 ? "#f0fdf4" : "#f0fdf4",
          border: `1.5px solid ${waCooldown > 0 ? "#bbf7d0" : "#86efac"}`,
          color: waCooldown > 0 ? "#4ade80" : "#16a34a",
          opacity: waCooldown > 0 ? 0.7 : 1,
        }}
      >
        {/* WhatsApp icon */}
        <svg width={17} height={17} viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        {waCooldown > 0 ? (
          <>
            Resend via WhatsApp in{" "}
            <span className="tabular-nums font-bold">
              {String(Math.floor(waCooldown / 60)).padStart(2, "0")}:
              {String(waCooldown % 60).padStart(2, "0")}
            </span>
          </>
        ) : (
          "Send OTP on WhatsApp"
        )}
      </button>

      {/* Resend */}
      <ResendTimer key={resendKey} initialSeconds={60} onResend={onResend} />

      {/* Back */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center justify-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors mx-auto"
      >
        <ChevronLeft size={13} />
        Change number
      </button>

    </form>
  );
}
