import api from "../axios/axios";
const PAGE_LIMIT = 10;
export const subscriptionApiUser = {
  /**
   * Fetch all subscriptions purchased by a user.
   
   * @returns {Promise<object|null>}
   */
  getMySubscriptions: async () => {
    const res = await api.get("/subscription/my");
    return res.data;
  },
  getMySubscriptionHistory: async () => {
    const res = await api.get("/subscription/my/history");
    return res.data;
  },
};
