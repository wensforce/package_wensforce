import api from "../../axios/axios";

export const authApi = {
  /**
   * Log the current user out (invalidates session/token on server).
   * @returns {Promise<object>} - Server response data
   */
  logout: async () => {
    const res = await api.post("/auth/logout");
    return res.data;
  },
};
