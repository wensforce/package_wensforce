import axios from "axios";
import { tokenManager } from "./tokenManager";
import { useAuthStore } from "@/store/auth.store";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // sends httpOnly cookie automatically
  headers: { "Content-Type": "application/json" },
});

// Attach in-memory token to every request
api.interceptors.request.use((config) => {
  const token = tokenManager.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 401 → silent refresh → retry original request
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    const isRefreshRequest = original.url?.includes("/auth/refresh-token");

    if (error.response?.status === 401 && !original._retry && !isRefreshRequest) {
      original._retry = true;
      try {
        const { data } = await api.post("/auth/refresh-token");
        tokenManager.set(data.data?.accessToken);
        original.headers.Authorization = `Bearer ${data.data?.accessToken}`;
        return api(original);
      } catch {
        tokenManager.clear();
        useAuthStore.getState().clearAuth();
      }
    }

    if (error.response?.status === 401 && isRefreshRequest) {
      tokenManager.clear();
      useAuthStore.getState().clearAuth();
    }

    return Promise.reject(error);
  },
);

export default api;
