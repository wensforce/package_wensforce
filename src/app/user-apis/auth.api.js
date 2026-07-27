import api from "../axios/axios";

export const authApiUser = {
  /**
   * Log the current user out.
   * @returns {Promise<object>}
   */
  logout: async () => {
    const res = await api.post("/auth/logout");
    return res.data;
  },

  /**
   * Send OTP to a user's mobile number.
   * @param {string} mobileNumber
   * @returns {Promise<object>}
   */
  sendOtp: async (mobileNumber) => {
    const res = await api.post("/auth/send-otp", { mobileNumber });
    return res.data;
  },

  /**
   * Verify the user's OTP.
   * @param {string} mobileNumber
   * @param {string} otp
   * @returns {Promise<object>}
   */
  verifyOtp: async (mobileNumber, otp) => {
    const res = await api.post("/auth/verify-otp", { mobileNumber, otp });
    return {
      ...res.data,
      status: res.status,
      statusCode: res.status,
    };
  },

  /**
   * Resend OTP via SMS or Whatsapp.
   * @param {string} mobileNumber
   * @param {"SMS"|"Whatsapp"} platform
   * @returns {Promise<object>}
   */
  resendOtp: async (mobileNumber, platform) => {
    const res = await api.post("/auth/resend-otp", { mobileNumber, platform });
    return res.data;
  },

  /**
   * Update the user's profile.
   * @param {object} payload
   * @returns {Promise<object>}
   */
  updateProfile: async (payload) => {
    const res = await api.put("/auth/update-profile", payload);
    return res.data;
  },

  /**
   * Fetch the authenticated user's referral summary for a category.
   * @param {string} category
   * @returns {Promise<object>}
   */
  getReferralSummary: async (category = "membership") => {
    const res = await api.get("/referral/summary", {
      params: { category },
    });
    return res.data;
  },

  /**
   * Apply a referral code for the authenticated user.
   * @param {string} referralCode
   * @param {string} category
   * @returns {Promise<object>}
   */
  applyReferralCode: async (referralCode, category = "membership") => {
    const res = await api.post(
      "/referral/apply",
      { referralCode },
      { params: { category } },
    );
    return res.data;
  },
};
