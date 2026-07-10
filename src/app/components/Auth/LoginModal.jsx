"use client";

import { useState, useRef } from "react";
import { Shield, ArrowRight, Phone, ChevronLeft } from "lucide-react";
import api from "../../axios/axios";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";

const COUNTRY_CODES = [
  { code: "+91", flag: "🇮🇳", name: "India" },
  { code: "+1", flag: "🇺🇸", name: "United States" },
  { code: "+1", flag: "🇨🇦", name: "Canada" },
  { code: "+44", flag: "🇬🇧", name: "United Kingdom" },
  { code: "+61", flag: "🇦🇺", name: "Australia" },
  { code: "+971", flag: "🇦🇪", name: "UAE" },
  { code: "+966", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "+65", flag: "🇸🇬", name: "Singapore" },
  { code: "+60", flag: "🇲🇾", name: "Malaysia" },
  { code: "+49", flag: "🇩🇪", name: "Germany" },
  { code: "+33", flag: "🇫🇷", name: "France" },
  { code: "+81", flag: "🇯🇵", name: "Japan" },
  { code: "+86", flag: "🇨🇳", name: "China" },
  { code: "+92", flag: "🇵🇰", name: "Pakistan" },
  { code: "+880", flag: "🇧🇩", name: "Bangladesh" },
  { code: "+94", flag: "🇱🇰", name: "Sri Lanka" },
  { code: "+977", flag: "🇳🇵", name: "Nepal" },
  { code: "+27", flag: "🇿🇦", name: "South Africa" },
  { code: "+55", flag: "🇧🇷", name: "Brazil" },
  { code: "+7", flag: "🇷🇺", name: "Russia" },
];

export default function LoginModal({ onSuccess }) {
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const countdownRef = useRef(null);
  const otpRefs = useRef([]);

  const { login } = useAuth();

  const startCountdown = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setCountdown(30);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/auth/send-otp", {
        mobileNumber: selectedCountry.code + phone,
      });
      setStep("otp");
      startCountdown();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to send OTP. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await api.post("/auth/verify-otp", {
        mobileNumber: selectedCountry.code + phone,
        otp: otp.join(""),
      });
      await login(data.data.accessToken, data.data.user);
      onSuccess?.();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Invalid OTP. Please check and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const updated = [...otp];
    pasted.split("").forEach((char, i) => {
      updated[i] = char;
    });
    setOtp(updated);
    const nextEmpty = updated.findIndex((v) => !v);
    otpRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();
  };

  const handleResendViaSms = async () => {
    try {
      startCountdown();
      await api.post("/auth/resend-otp", {
        mobileNumber: selectedCountry.code + phone,
        platform: "SMS",
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to resend OTP via SMS.",
      );
    }
  };

  const handleResendViaWhatsapp = async () => {
    try {
      startCountdown();
      await api.post("/auth/resend-otp", {
        mobileNumber: selectedCountry.code + phone,
        platform: "Whatsapp",
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to resend OTP via WhatsApp.",
      );
    }
  };

  const handleBack = () => {
    setStep("phone");
    setOtp(["", "", "", "", "", ""]);
    if (countdownRef.current) clearInterval(countdownRef.current);
    setCountdown(0);
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
      style={{ background: "rgba(11,30,63,0.55)", backdropFilter: "blur(4px)" }}
    >
      {/* Modal card */}
      <div
        className="w-full max-w-md rounded-2xl shadow-2xl flex flex-col max-h-[92dvh] overflow-hidden"
        style={{
          background: "var(--color-white)",
          border: "1px solid var(--color-border)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-4 py-4 sm:px-7 sm:py-5 border-b shrink-0"
          style={{
            background: "var(--color-navy)",
            borderColor: "rgba(201,162,75,0.2)",
          }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: "rgba(201,162,75,0.15)",
              border: "1px solid rgba(201,162,75,0.4)",
            }}
          >
            <Shield size={16} style={{ color: "var(--color-gold)" }} />
          </div>
          <div>
            <p
              className="text-sm font-semibold"
              style={{
                color: "var(--color-white)",
                fontFamily: "var(--font-playfair)",
              }}
            >
              Sign in to continue
            </p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
              This page requires authentication
            </p>
          </div>
        </div>

        {/* Body */}
        <div
          className="px-4 py-5 sm:px-7 sm:py-6 space-y-5 sm:space-y-6 overflow-y-auto"
          style={{ background: "var(--color-cream)" }}
        >
          {/* Step dots */}
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: "var(--color-navy)" }}
            />
            <div
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                background:
                  step === "otp" ? "var(--color-navy)" : "var(--color-border)",
              }}
            />
          </div>

          {/* ── STEP 1 — Phone ── */}
          {step === "phone" && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-1">
                <h2
                  className="text-xl font-bold"
                  style={{
                    color: "var(--color-navy)",
                    fontFamily: "var(--font-playfair)",
                  }}
                >
                  Welcome back
                </h2>
                <p
                  className="text-xs"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Enter your mobile number to receive a one-time passcode
                </p>
              </div>

              <div
                className="rounded-xl p-4 sm:p-6 space-y-5 shadow-sm"
                style={{
                  background: "var(--color-white)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="modal-phone"
                      className="text-xs font-semibold uppercase tracking-widest"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      Mobile Number
                    </label>
                    <div className="relative flex min-w-0">
                      <div
                        className="relative shrink-0 rounded-l-xl"
                        style={{
                          width: "84px",
                          background: "var(--color-cream)",
                          border: "1px solid var(--color-border)",
                          borderRight: "none",
                        }}
                      >
                        {/* Visual label — shows only flag + code */}
                        <div
                          className="absolute inset-0 flex items-center justify-center gap-1 text-sm font-medium pointer-events-none select-none"
                          style={{ color: "var(--color-text-secondary)" }}
                        >
                          <span>{selectedCountry.flag}</span>
                          <span>{selectedCountry.code}</span>
                        </div>
                        {/* Native select — invisible but fully interactive; shows country names in OS picker */}
                        <select
                          value={`${selectedCountry.name}||${selectedCountry.code}`}
                          onChange={(e) => {
                            const [name, code] = e.target.value.split("||");
                            const found = COUNTRY_CODES.find(
                              (c) => c.name === name && c.code === code,
                            );
                            if (found) setSelectedCountry(found);
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          aria-label="Country code"
                        >
                          {COUNTRY_CODES.map((c, idx) => (
                            <option
                              key={`${c.name}-${c.code}-${idx}`}
                              value={`${c.name}||${c.code}`}
                            >
                              {c.flag} {c.code} — {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <input
                        id="modal-phone"
                        name="phone"
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        autoComplete="tel"
                        required
                        value={phone}
                        onChange={(e) =>
                          setPhone(
                            e.target.value.replace(/\D/g, "").slice(0, 10),
                          )
                        }
                        placeholder="98765 43210"
                        className="flex-1 min-w-0 pl-4 pr-10 py-3 rounded-r-xl text-sm outline-none transition-all duration-150 focus:ring-2"
                        style={{
                          background: "var(--color-cream)",
                          border: "1px solid var(--color-border)",
                          color: "var(--color-text-primary)",
                          "--tw-ring-color": "var(--color-gold)",
                        }}
                      />
                      <Phone
                        size={14}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ color: "var(--color-text-tertiary)" }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={phone.length < 10 || loading}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-light) 100%)",
                      color: "var(--color-white)",
                    }}
                  >
                    {loading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Next
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ── STEP 2 — OTP ── */}
          {step === "otp" && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-1.5 text-xs font-medium mb-3 transition-opacity hover:opacity-60"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  <ChevronLeft size={14} />
                  Change number
                </button>
                <h2
                  className="text-xl font-bold"
                  style={{
                    color: "var(--color-navy)",
                    fontFamily: "var(--font-playfair)",
                  }}
                >
                  Verify your number
                </h2>
                <p
                  className="text-xs"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  We sent a 6-digit OTP to{" "}
                  <span
                    className="font-semibold"
                    style={{ color: "var(--color-navy)" }}
                  >
                    {selectedCountry.code} {phone}
                  </span>
                </p>
              </div>

              <div
                className="rounded-xl p-4 sm:p-6 space-y-5 shadow-sm"
                style={{
                  background: "var(--color-white)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  <div className="space-y-2">
                    <label
                      className="text-xs font-semibold uppercase tracking-widest"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      One-Time Passcode
                    </label>
                    <div
                      className="flex gap-1.5 sm:gap-2 justify-between"
                      onPaste={handleOtpPaste}
                    >
                      {otp.map((digit, i) => (
                        <input
                          key={i}
                          ref={(el) => (otpRefs.current[i] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(i, e)}
                          className="w-full aspect-square text-center text-base sm:text-lg font-bold rounded-lg sm:rounded-xl outline-none transition-all duration-150 focus:ring-2"
                          style={{
                            background: digit
                              ? "var(--color-navy)"
                              : "var(--color-cream)",
                            border: digit
                              ? "1.5px solid var(--color-navy)"
                              : "1.5px solid var(--color-border)",
                            color: digit
                              ? "var(--color-white)"
                              : "var(--color-text-primary)",
                            "--tw-ring-color": "var(--color-gold)",
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={otp.some((d) => !d) || loading}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-light) 100%)",
                      color: "var(--color-white)",
                    }}
                  >
                    {loading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Verify & Sign In
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                </form>

                <div className="space-y-3">
                  <p
                    className="text-center text-xs"
                    style={{ color: "var(--color-text-tertiary)" }}
                  >
                    Didn't receive it?
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {/* WhatsApp */}
                    <button
                      type="button"
                      onClick={handleResendViaWhatsapp}
                      disabled={countdown > 0}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-80 active:scale-[0.97]"
                      style={{
                        background:
                          countdown > 0 ? "var(--color-cream)" : "#e8f9ef",
                        border: "1.5px solid",
                        borderColor:
                          countdown > 0 ? "var(--color-border)" : "#25D366",
                        color:
                          countdown > 0
                            ? "var(--color-text-tertiary)"
                            : "#128C4B",
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.555 4.126 1.526 5.856L.057 23.625a.75.75 0 00.918.918l5.77-1.469A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.699-.504-5.25-1.385l-.376-.22-3.895.991.991-3.894-.22-.377A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                      </svg>
                      {countdown > 0 ? `${countdown}s` : "via WhatsApp"}
                    </button>

                    {/* SMS */}
                    <button
                      type="button"
                      onClick={handleResendViaSms}
                      disabled={countdown > 0}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-80 active:scale-[0.97]"
                      style={{
                        background:
                          countdown > 0
                            ? "var(--color-cream)"
                            : "rgba(11,30,63,0.05)",
                        border: "1.5px solid",
                        borderColor:
                          countdown > 0
                            ? "var(--color-border)"
                            : "var(--color-navy)",
                        color:
                          countdown > 0
                            ? "var(--color-text-tertiary)"
                            : "var(--color-navy)",
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                      {countdown > 0 ? `${countdown}s` : "via SMS"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Trust line */}
          <div className="flex items-center justify-center gap-2">
            <Shield size={12} style={{ color: "var(--color-text-tertiary)" }} />
            <span
              className="text-xs"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              PSARA compliant
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
