"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import PhoneStep from "./components/PhoneStep";
import OtpStep from "./components/OtpStep";
import { DEFAULT_COUNTRY } from "./data/countries";
import { useAuth } from "./hooks/useAuth";
import ErrorBanner from "./components/ErrorBanner";

const OTP_LENGTH = 6;

export default function AuthPage() {
  const [step, setStep] = useState("phone");
  const [country, setCountry] = useState(DEFAULT_COUNTRY);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [resendKey, setResendKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { sendOtp, verifyOtp, resendOtp, logout, error } = useAuth();

  function handleSendOtp(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    sendOtp(country.dial + phone)
      .then(() => {
        setStep("otp");
        setResendKey((k) => k + 1);
        setLoading(false);
      })
      .catch(() => {
        setErrorMsg(error);
        setLoading(false);
      });
  }

  function handleVerifyOtp(e) {
    e.preventDefault();
    const code = otp.join("");
    console.log("Verify:", code, "phone:", country.dial, phone);
    setLoading(true);
    setErrorMsg("");
    verifyOtp(country.dial + phone, code)
      .catch((err) => {
        setErrorMsg(err?.response?.data?.message || err?.message || "Invalid OTP. Please try again.");
        setLoading(false);
      });
  }

  function handleResend() {
    setOtp(Array(OTP_LENGTH).fill(""));
    setResendKey((k) => k + 1);
    resendOtp(country.dial + phone, "SMS").catch(() => {
      setErrorMsg("Failed to resend OTP. Please try again.");
    });
  }

  function handleWhatsAppOtp() {
    resendOtp(country.dial + phone, "Whatsapp").catch(() => {
      setErrorMsg("Failed to send OTP via WhatsApp. Please try again.");
    });
  }

  function handleBack() {
    setStep("phone");
    setOtp(Array(OTP_LENGTH).fill(""));
    setLoading(false);
    setErrorMsg("");
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ backgroundColor: "#0B1E3F" }}
    >
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(201,162,75,0.04) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-64 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(201,162,75,0.12) 0%, transparent 70%)",
        }}
      />

      <div
        className="relative w-full max-w-sm rounded-3xl overflow-hidden"
        style={{
          background: "#ffffff",
          boxShadow:
            "0 4px 6px rgba(0,0,0,0.05), 0 24px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(201,162,75,0.12)",
        }}
      >
        <div
          style={{
            height: 3,
            background:
              "linear-gradient(90deg, transparent 0%, #C9A24B 40%, #f0c940 60%, transparent 100%)",
          }}
        />

        <div className="px-8 pt-9 pb-10">
          <div className="flex flex-col items-center text-center mb-8">
            <div
              className="rounded-2xl flex items-center justify-center mb-4"
              style={{
                width: 52,
                height: 52,
                background: "rgba(201,162,75,0.08)",
                border: "1px solid rgba(201,162,75,0.2)",
              }}
            >
              <ShieldCheck size={22} style={{ color: "#C9A24B" }} />
            </div>

            <p
              className="text-[9px] font-black tracking-[0.55em] uppercase mb-2"
              style={{ color: "#C9A24B" }}
            >
              WENS Force
            </p>

            <h1
              className="text-2xl font-bold leading-tight text-gray-900 mb-1.5"
              style={{ fontFamily: "var(--font-playfair, serif)" }}
            >
              {step === "phone" ? "Member Sign In" : "Enter OTP"}
            </h1>

            <p className="text-sm text-gray-400 font-light">
              {step === "phone"
                ? "Sign in to access your membership."
                : "We sent a 6-digit code to your number."}
            </p>
          </div>

          <ErrorBanner message={errorMsg || error} onDismiss={() => setErrorMsg("")} />

          {step === "phone" ? (
            <PhoneStep
              country={country}
              onCountryChange={setCountry}
              phone={phone}
              onPhoneChange={setPhone}
              onSubmit={handleSendOtp}
              isLoading={loading}
            />
          ) : (
            <OtpStep
              otp={otp}
              onChange={setOtp}
              onSubmit={handleVerifyOtp}
              onResend={handleResend}
              onBack={handleBack}
              onWhatsApp={handleWhatsAppOtp}
              country={country}
              phone={phone}
              resendKey={resendKey}
              isLoading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
}
