"use client"
import { useState, useRef, useEffect } from "react";
import { authApiUser } from "@/app/user-apis/auth.api";
import { useAuth } from "@/app/context/AuthContext";
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
export const useAuthFlow = ({ onSuccess } = {}) => {
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const otpRefs = useRef([]);
  const countdownIntervalRef = useRef(null);
  const { login } = useAuth();

  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, []);

  const startCountdown = () => {
    setCountdown(60);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current);
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
      await authApiUser.sendOtp(selectedCountry.code + phone);
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
      const data = await authApiUser.verifyOtp(
        selectedCountry.code + phone,
        otp.join(""),
      );
      await login(data.data.accessToken, data.data.user);
      onSuccess?.(data.data.user);
    } catch (error) {
      console.error("handleVerifyOtp error:", error);
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
      await authApiUser.resendOtp(selectedCountry.code + phone, "SMS");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to resend OTP via SMS.",
      );
    }
  };

  const handleResendViaWhatsapp = async () => {
    try {
      startCountdown();
      await authApiUser.resendOtp(selectedCountry.code + phone, "Whatsapp");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to resend OTP via WhatsApp.",
      );
    }
  };

  const handleBack = () => {
    setStep("phone");
    setOtp(["", "", "", "", "", ""]);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    setCountdown(0);
  };
  return {
  // State
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

  // Handlers
  handleSendOtp,
  handleVerifyOtp,
  handleOtpChange,
  handleOtpKeyDown,
  handleOtpPaste,
  handleResendViaSms,
  handleResendViaWhatsapp,
  handleBack,
}
}



