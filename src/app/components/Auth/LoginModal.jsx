"use client";

import { useState } from "react";
import {
  Shield,
  ArrowRight,
  Phone,
  ChevronLeft,
  Sparkles,
  Gift,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import { useAuthFlow } from "../../hooks/useAuthFlow";
import { useAuth } from "../../context/AuthContext";
import { authApiUser } from "../../user-apis/auth.api";
import TermsAcceptanceStep from "./TermsAcceptanceStep";

export default function LoginModal({ onSuccess }) {
  const { user, login } = useAuth();
  const [registrationToken, setRegistrationToken] = useState(null);
  const [showTermsStep, setShowTermsStep] = useState(false);
  const [termsLoading, setTermsLoading] = useState(false);
  const [termsError, setTermsError] = useState("");
  const [showReferralStep, setShowReferralStep] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);
  const [referralCode, setReferralCode] = useState("");
  const [referralLoading, setReferralLoading] = useState(false);
  const [referralMessage, setReferralMessage] = useState("");
  const [referralError, setReferralError] = useState("");

  const finishOnboarding = () => {
    onSuccess?.();
  };

  const {
    step,
    phone,
    setPhone,
    selectedCountry,
    setSelectedCountry,
    otp,
    loading,
    countdown,
    otpRefs,
    COUNTRY_CODES,
    handleSendOtp,
    handleVerifyOtp,
    handleOtpChange,
    handleOtpKeyDown,
    handleOtpPaste,
    handleResendViaSms,
    handleResendViaWhatsapp,
    handleBack,
    newUser,
  } = useAuthFlow({
    onSuccess: (authUser, isNewUser, token) => {
      if (isNewUser && token) {
        setRegistrationToken(token);
        setShowReferralStep(false);
        setShowTermsStep(true);
        setTermsError("");
        return;
      }

      setPendingUser(authUser);
      finishOnboarding();
    },
  });

  const handleTermsAccept = async () => {
    if (!registrationToken) {
      setTermsError("Registration session expired. Please verify OTP again.");
      return;
    }

    setTermsLoading(true);
    setTermsError("");

    try {
      const res = await authApiUser.acceptTerms(registrationToken);
      if (res?.success && res?.data) {
        const { accessToken, user: createdUser } = res.data;
        login(accessToken, createdUser);
        setRegistrationToken(null);
        setPendingUser(createdUser);
        setShowTermsStep(false);
        setShowReferralStep(true);
        setReferralCode("");
        setReferralMessage("");
        setReferralError("");
      } else {
        setTermsError(res?.message || "Unable to accept terms. Please try again.");
      }
    } catch (error) {
      setTermsError(
        error?.response?.data?.message ||
          "Unable to accept terms. Please try again.",
      );
    } finally {
      setTermsLoading(false);
    }
  };

  const handleReferralSubmit = async (skip = false) => {
    if (skip) {
      setShowReferralStep(false);
      finishOnboarding();
      return;
    }

    if (!referralCode.trim()) {
      setReferralError("Please enter a referral code to continue.");
      return;
    }

    setReferralLoading(true);
    setReferralError("");
    setReferralMessage("");

    try {
      const res = await authApiUser.applyReferralCode(
        referralCode.trim(),
        "membership",
      );

      if (res?.success) {
        setReferralMessage("Referral code applied successfully.");
        window.setTimeout(() => {
          setShowReferralStep(false);
          finishOnboarding();
        }, 700);
      } else {
        setReferralError(res?.message || "Unable to apply referral code.");
      }
    } catch (error) {
      setReferralError(
        error?.response?.data?.message || "Unable to apply referral code.",
      );
    } finally {
      setReferralLoading(false);
    }
  };

  const shouldShowTermsStep = showTermsStep && !!registrationToken;
  const shouldShowReferralStep = showReferralStep && !!user;
  const onboardingActive = shouldShowTermsStep || shouldShowReferralStep;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
      style={{ background: "rgba(11,30,63,0.55)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="w-full max-w-md rounded-2xl shadow-2xl flex flex-col max-h-[92dvh] overflow-hidden"
        style={{
          background: "var(--color-white)",
          border: "1px solid var(--color-border)",
        }}
      >
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

        <div
          className="px-4 py-5 sm:px-7 sm:py-6 space-y-5 sm:space-y-6 overflow-y-auto"
          style={{ background: "var(--color-cream)" }}
        >
          {!onboardingActive && (
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
          )}

          {step === "phone" && !onboardingActive && (
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
                        <div
                          className="absolute inset-0 flex items-center justify-center gap-1 text-sm font-medium pointer-events-none select-none"
                          style={{ color: "var(--color-text-secondary)" }}
                        >
                          <span>{selectedCountry.flag}</span>
                          <span>{selectedCountry.code}</span>
                        </div>
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

          {step === "otp" && !onboardingActive && (
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
                      {countdown > 0 ? `${countdown}s` : "via WhatsApp"}
                    </button>

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
                      {countdown > 0 ? `${countdown}s` : "via SMS"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {shouldShowTermsStep && (
            <TermsAcceptanceStep
              compact
              onAccept={handleTermsAccept}
              loading={termsLoading}
              error={termsError}
            />
          )}

          {shouldShowReferralStep && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-1">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                  style={{
                    background: "rgba(201,162,75,0.12)",
                    border: "1px solid rgba(201,162,75,0.3)",
                  }}
                >
                  <Gift size={17} style={{ color: "var(--color-gold)" }} />
                </div>
                <h2
                  className="text-xl font-bold"
                  style={{
                    color: "var(--color-navy)",
                    fontFamily: "var(--font-playfair)",
                  }}
                >
                  Have a referral?
                </h2>
                <p
                  className="text-xs"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Enter a referral code to unlock membership benefits, or skip
                  and continue.
                </p>
              </div>

              <div
                className="rounded-xl p-4 sm:p-6 space-y-5 shadow-sm"
                style={{
                  background: "var(--color-white)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div className="space-y-1.5">
                  <label
                    className="text-xs font-semibold uppercase tracking-widest"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Referral Code
                  </label>
                  <div className="relative flex">
                    <div
                      className="flex items-center justify-center px-3.5 rounded-l-xl shrink-0"
                      style={{
                        background: "var(--color-cream)",
                        border: "1px solid var(--color-border)",
                        borderRight: "none",
                      }}
                    >
                      <Sparkles
                        size={14}
                        style={{ color: "var(--color-gold)" }}
                      />
                    </div>
                    <input
                      type="text"
                      value={referralCode}
                      onChange={(e) => {
                        setReferralCode(e.target.value.toUpperCase());
                        setReferralError("");
                      }}
                      placeholder="e.g. WENS2026"
                      autoFocus
                      className="flex-1 pl-4 pr-4 py-3 rounded-r-xl text-sm font-mono outline-none transition-all duration-150 focus:ring-2 tracking-widest uppercase"
                      style={{
                        background: "var(--color-cream)",
                        border: "1px solid var(--color-border)",
                        color: "var(--color-text-primary)",
                        "--tw-ring-color": "var(--color-gold)",
                      }}
                    />
                  </div>

                  {referralError && (
                    <p className="text-xs pl-0.5 mt-1" style={{ color: "#C53030" }}>
                      {referralError}
                    </p>
                  )}

                  {referralMessage && (
                    <div
                      className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs mt-1"
                      style={{
                        background: "#F0FFF4",
                        border: "1px solid #9AE6B4",
                        color: "#276749",
                      }}
                    >
                      <CheckCircle2 size={13} />
                      {referralMessage}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleReferralSubmit(false)}
                  disabled={referralLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-light) 100%)",
                    color: "var(--color-white)",
                  }}
                >
                  {referralLoading ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <>
                      Apply & Continue
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>

                <div className="flex items-center gap-3">
                  <div
                    className="flex-1 h-px"
                    style={{ background: "var(--color-border)" }}
                  />
                  <span
                    className="text-xs"
                    style={{ color: "var(--color-text-tertiary)" }}
                  >
                    or
                  </span>
                  <div
                    className="flex-1 h-px"
                    style={{ background: "var(--color-border)" }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleReferralSubmit(true)}
                  disabled={referralLoading}
                  className="w-full flex items-center justify-center py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:opacity-70 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    color: "var(--color-text-secondary)",
                    background: "var(--color-cream)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  Skip for now
                </button>
              </div>
            </div>
          )}

          {!onboardingActive && (
            <div className="flex items-center justify-center gap-2">
              <Shield size={12} style={{ color: "var(--color-text-tertiary)" }} />
              <span
                className="text-xs"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                PSARA compliant
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
