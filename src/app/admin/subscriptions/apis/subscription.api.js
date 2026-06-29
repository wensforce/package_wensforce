import api from "../../../axios/axios";

export const subscriptionApi = {
  /**
   * Create a new subscription.
   * @param {{ userId: number, packageId: number, startDate: string, paymentId: string }} payload
   * @returns {Promise<object>} - Created subscription data
   */
  createSubscription: async (payload) => {
    const res = await api.post("/subscription", payload);
    return res.data;
  },
    /**
   * Search subscriptions by query string.
   * @param {string} query - Search term (user, package, status)
   * @returns {Promise<Array>} - Up to 5 matching subscription rows
   */
  searchSubscriptions: async (query) => {
    const res = await api.get("/subscription", {
      params: { search: query, page: 1, limit: 5 },
    });
    const data = res.data?.data ?? res.data ?? {};
    const rows =
      data.subscriptions || data.items || data.data ||
      (Array.isArray(data) ? data : []);
    return Array.isArray(rows) ? rows.slice(0, 5) : [];
  },
};
