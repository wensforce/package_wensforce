"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  ArrowRight,
  Phone,
  ChevronLeft,
  ChevronDown,
  Search,
} from "lucide-react";
import api from "../axios/axios";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
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

export default function LoginPage() {
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const countdownRef = useRef(null);
  const otpRefs = useRef([]);
  const dropdownRef = useRef(null);

  const { login } = useAuth();
  const router = useRouter();
  // Start 30s cooldown
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

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
        setCountrySearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredCountries = COUNTRY_CODES.filter(
    (c) =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.code.includes(countrySearch),
  );

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
        error?.response?.data?.message || "Failed to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // TODO: call verify-OTP API with selectedCountry.code + phone + otp.join("")
      const { data } = await api.post("/auth/verify-otp", {
        mobileNumber: selectedCountry.code + phone,
        otp: otp.join(""),
      });
      await login(data.data.accessToken, data.data.user);
      // navigate to dashboard using router.push or similar
      if(data.data.user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Invalid OTP. Please check and try again."
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
        error?.response?.data?.message || "Failed to resend OTP via SMS."
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
        error?.response?.data?.message || "Failed to resend OTP via WhatsApp."
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
    <div
      className="min-h-screen flex"
      style={{ background: "var(--color-cream)" }}
    >
      {/* ── Left panel — brand visual ─────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[46%] relative overflow-hidden p-12"
        style={{ background: "var(--color-navy)" }}
      >
        {/* Decorative rings */}
        <div
          className="absolute -bottom-32 -left-32 w-120 h-120 rounded-full opacity-10"
          style={{ border: "1.5px solid var(--color-gold)" }}
        />
        <div
          className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full opacity-10"
          style={{ border: "1.5px solid var(--color-gold)" }}
        />
        <div
          className="absolute top-24 right-0 w-65 h-65 rounded-full opacity-[0.06]"
          style={{ background: "var(--color-gold)" }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              background: "rgba(201,162,75,0.15)",
              border: "1px solid rgba(201,162,75,0.4)",
            }}
          >
            <Shield size={20} style={{ color: "var(--color-gold)" }} />
          </div>
          <span
            className="text-xl font-semibold tracking-wide"
            style={{
              color: "var(--color-white)",
              fontFamily: "var(--font-playfair)",
            }}
          >
            WENS Force
          </span>
        </div>

        {/* Quote block */}
        <div className="relative z-10 space-y-6">
          <div
            className="w-12 h-0.5 rounded-full"
            style={{ background: "var(--color-gold)" }}
          />
          <h2
            className="text-4xl font-bold leading-tight"
            style={{
              color: "var(--color-white)",
              fontFamily: "var(--font-playfair)",
            }}
          >
            Luxury travel,
            <br />
            <span style={{ color: "var(--color-gold)" }}>redefined.</span>
          </h2>
          <p
            className="text-base leading-relaxed max-w-sm"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            India's only subscription combining premium vehicles, PSARA-licensed
            protection, and Darshan — pre-arranged for the year.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            {["5 Exclusive Tiers", "PSARA Licensed", "Darshan Access"].map(
              (tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1.5 rounded-full font-medium tracking-wide"
                  style={{
                    background: "rgba(201,162,75,0.12)",
                    border: "1px solid rgba(201,162,75,0.3)",
                    color: "var(--color-gold-light)",
                  }}
                >
                  {tag}
                </span>
              ),
            )}
          </div>
        </div>

        <p
          className="relative z-10 text-xs"
          style={{ color: "rgba(255,255,255,0.28)" }}
        >
          © 2026 WENS Force International Private Limited
        </p>
      </div>

      {/* ── Right panel ───────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 sm:px-12">
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2 mb-10">
          <Shield size={20} style={{ color: "var(--color-navy)" }} />
          <span
            className="text-lg font-semibold"
            style={{
              color: "var(--color-navy)",
              fontFamily: "var(--font-playfair)",
            }}
          >
            WENS Force
          </span>
        </div>

        <div className="w-full max-w-105 space-y-8">
          {/* Step indicator */}
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full transition-all duration-300"
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

          {/* ── STEP 1 — Phone ────────────────────────────────────── */}
          {step === "phone" && (
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-2">
                <h1
                  className="text-3xl font-bold"
                  style={{
                    color: "var(--color-navy)",
                    fontFamily: "var(--font-playfair)",
                  }}
                >
                  Welcome back
                </h1>
                <p
                  className="text-sm"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Enter your mobile number to receive a one-time passcode
                </p>
              </div>

              <div
                className="rounded-2xl p-8 space-y-6 shadow-sm"
                style={{
                  background: "var(--color-white)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <form onSubmit={handleSendOtp} className="space-y-5">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="phone"
                      className="text-xs font-semibold uppercase tracking-widest"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      Mobile Number
                    </label>
                    <div className="relative flex" ref={dropdownRef}>
                      {/* Country code trigger */}
                      <button
                        type="button"
                        onClick={() => {
                          setDropdownOpen((o) => !o);
                          setCountrySearch("");
                        }}
                        className="flex items-center gap-1.5 px-3 text-sm font-medium rounded-l-xl border-r-0 select-none transition-colors hover:opacity-80 whitespace-nowrap"
                        style={{
                          background: "var(--color-cream)",
                          border: "1px solid var(--color-border)",
                          borderRight: "none",
                          color: "var(--color-text-secondary)",
                          minWidth: "88px",
                        }}
                      >
                        <span>{selectedCountry.flag}</span>
                        <span>{selectedCountry.code}</span>
                        <ChevronDown
                          size={12}
                          className="transition-transform duration-200"
                          style={{
                            transform: dropdownOpen
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                          }}
                        />
                      </button>

                      {/* Dropdown panel */}
                      {dropdownOpen && (
                        <div
                          className="absolute left-0 top-full mt-1.5 z-50 rounded-xl overflow-hidden shadow-xl"
                          style={{
                            background: "var(--color-white)",
                            border: "1px solid var(--color-border)",
                            width: "240px",
                          }}
                        >
                          {/* Search */}
                          <div
                            className="flex items-center gap-2 px-3 py-2.5 border-b"
                            style={{ borderColor: "var(--color-border)" }}
                          >
                            <Search
                              size={13}
                              style={{ color: "var(--color-text-tertiary)" }}
                            />
                            <input
                              type="text"
                              autoFocus
                              value={countrySearch}
                              onChange={(e) => setCountrySearch(e.target.value)}
                              placeholder="Search country..."
                              className="flex-1 text-xs outline-none bg-transparent"
                              style={{ color: "var(--color-text-primary)" }}
                            />
                          </div>
                          {/* List */}
                          <ul className="max-h-52 overflow-y-auto">
                            {filteredCountries.length === 0 ? (
                              <li
                                className="px-4 py-3 text-xs"
                                style={{ color: "var(--color-text-tertiary)" }}
                              >
                                No results
                              </li>
                            ) : (
                              filteredCountries.map((c, idx) => (
                                <li key={`${c.code}-${c.name}-${idx}`}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedCountry(c);
                                      setDropdownOpen(false);
                                      setCountrySearch("");
                                    }}
                                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left transition-colors hover:opacity-80"
                                    style={{
                                      background:
                                        selectedCountry.name === c.name &&
                                        selectedCountry.code === c.code
                                          ? "var(--color-cream)"
                                          : "transparent",
                                      color: "var(--color-text-primary)",
                                    }}
                                  >
                                    <span className="text-base leading-none">
                                      {c.flag}
                                    </span>
                                    <span className="flex-1 truncate text-xs">
                                      {c.name}
                                    </span>
                                    <span
                                      className="text-xs font-medium shrink-0"
                                      style={{
                                        color: "var(--color-text-secondary)",
                                      }}
                                    >
                                      {c.code}
                                    </span>
                                  </button>
                                </li>
                              ))
                            )}
                          </ul>
                        </div>
                      )}

                      <input
                        id="phone"
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
                        className="flex-1 pl-4 pr-10 py-3 rounded-r-xl text-sm outline-none transition-all duration-150 focus:ring-2"
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
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
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

          {/* ── STEP 2 — OTP ──────────────────────────────────────── */}
          {step === "otp" && (
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-2">
                {/* Back */}
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-1.5 text-xs font-medium mb-4 transition-opacity hover:opacity-60"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  <ChevronLeft size={14} />
                  Change number
                </button>

                <h1
                  className="text-3xl font-bold"
                  style={{
                    color: "var(--color-navy)",
                    fontFamily: "var(--font-playfair)",
                  }}
                >
                  Verify your number
                </h1>
                <p
                  className="text-sm"
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
                className="rounded-2xl p-8 space-y-6 shadow-sm"
                style={{
                  background: "var(--color-white)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div className="space-y-2">
                    <label
                      className="text-xs font-semibold uppercase tracking-widest"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      One-Time Passcode
                    </label>

                    {/* OTP boxes */}
                    <div
                      className="flex gap-2.5 justify-between"
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
                          className="w-full aspect-square text-center text-lg font-bold rounded-xl outline-none transition-all duration-150 focus:ring-2"
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
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed pulse-ring"
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

                {/* Resend */}
                <div className="space-y-3">
                  <p
                    className="text-center text-xs"
                    style={{ color: "var(--color-text-tertiary)" }}
                  >
                    Didn't receive it?
                  </p>
                  <div className="grid grid-cols-2 gap-2.5">
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
                      {/* WhatsApp icon */}
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

          {/* Explore link */}
          <p
            className="text-center text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Don't have an account?{" "}
            <Link
              href="/"
              className="font-semibold transition-colors hover:opacity-70"
              style={{ color: "var(--color-gold)" }}
            >
              Explore memberships
            </Link>
          </p>

          {/* Trust line */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <Shield size={13} style={{ color: "var(--color-text-tertiary)" }} />
            <span
              className="text-xs"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              256-bit encrypted · PSARA compliant
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
