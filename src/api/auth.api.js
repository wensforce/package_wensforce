import api from "../lib/axios";


export const authApi = {
    sendOtp: (mobileNumber) => api.post("/auth/send-otp", { mobileNumber }),
    verifyOtp: (mobileNumber, otp) => api.post("/auth/verify-otp", { mobileNumber, otp }),
    resendOtp: (mobileNumber) => api.post("/auth/resend-otp", { mobileNumber }),
    logout: () => api.post("/auth/logout"),
    getProfile: () => api.get("/auth/me"),
    refresh: () => api.post("/auth/refresh-token"),
};