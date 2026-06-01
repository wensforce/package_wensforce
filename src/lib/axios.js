import axios from "axios";
import { tokenManager } from "./tokenManager";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,                    // sends httpOnly cookie automatically
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

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const { data } = await api.post("/auth/refresh"); // cookie sent auto
        tokenManager.set(data.accessToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);                             // retry failed request
      } catch {
        tokenManager.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;