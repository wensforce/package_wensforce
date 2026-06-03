"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/api/auth.api";
import { useAuthStore } from "@/store/auth.store";
import { tokenManager } from "@/lib/tokenManager";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setAuth, clearAuth, setInitialized } = useAuthStore();
  const router = useRouter();

  const sendOtp = async (mobileNumber) => {
    try {
      setLoading(true);
      setError(null);
      await authApi.sendOtp(mobileNumber);
    } catch (err) {
      setError(err.response?.data?.message ?? "Failed to send OTP");
      throw err; // re-throw to allow caller to handle navigation
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (mobileNumber, otp) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await authApi.verifyOtp(mobileNumber, otp);
      tokenManager.set(data.accessToken);
      setAuth(data.user);
      setInitialized(); // mark as initialized so layout skips the getProfile call
      router.push("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message ?? "OTP verification failed");
      throw err; // re-throw to allow caller to handle error display
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async (mobileNumber, platform) => {
    try {
      setLoading(true);
      setError(null);
      await authApi.resendOtp(mobileNumber, platform);
    } catch (err) {
      setError(err.response?.data?.message ?? "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      tokenManager.clear();
      clearAuth();
      router.push("/auth");
    }
  };

  return { logout, sendOtp, verifyOtp, resendOtp, loading, error };
};
