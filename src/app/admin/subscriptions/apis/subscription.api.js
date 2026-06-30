import api from "../../../axios/axios";
const PAGE_LIMIT = 10;
export const subscriptionApi = {
  /**
   * Fetch paginated subscriptions with optional search.
   * @param {object} options
   * @param {number} options.page   - Current page number
   * @param {string} options.search - Search query string (user, package, status)
   * @returns {Promise<{ rows: Array, pagination: object }>}
   */
  fetchSubscriptions: async ({ page, search }) => {
    const params = { page, limit: PAGE_LIMIT };
    if (search && search.trim()) params.search = search.trim();

    const res = await api.get("/subscription", { params });
    const data = res.data?.data ?? {};

    const rows = Array.isArray(data.subscriptions) ? data.subscriptions : [];
    const total = Number(data.total ?? rows.length ?? 0);
    const currentPage = Number(data.page ?? page);
    const limit = Number(data.limit ?? PAGE_LIMIT);

    return {
      rows,
      pagination: {
        page: currentPage,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  },
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
  /**
   * Fetch a single subscription by ID.
   * @param {number|string} id - Subscription ID
   * @returns {Promise<object|null>}
   */
  getSubscriptionById: async (id) => {
    const res = await api.get(`/subscription/${id}`);
    return res.data?.data ?? null;
  },

  /**
   * Verify or cancel a subscription, with optional admin remarks.
   * @param {number|string} id - Subscription ID
   * @param {"verify"|"cancel"} action - Action to perform
   * @param {string} [adminRemarks] - Optional remarks
   * @returns {Promise<object>} - Server response data
   */
  updateSubscriptionAction: async (id, action, adminRemarks) => {
    const payload = adminRemarks?.trim() ? { adminRemarks: adminRemarks.trim() } : {};
    const res = await api.put(`/subscription/${id}/${action}`, payload);
    return res.data;
  },
};
