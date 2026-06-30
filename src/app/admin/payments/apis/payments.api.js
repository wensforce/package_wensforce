import api from "../../../axios/axios";
const PAGE_LIMIT = 10;
export const paymentApi = {
    /**
   * Fetch paginated payments with optional search.
   * @param {object} options
   * @param {number} options.page   - Current page number
   * @param {string} options.search - Search query string (user, package, order ID)
   * @returns {Promise<{ rows: Array, pagination: object }>}
   */
  fetchPayments: async ({ page, search }) => {
    const params = { page, limit: PAGE_LIMIT };
    if (search && search.trim()) params.search = search.trim();

    const res = await api.get("/payment", { params });
    const data = res.data?.data ?? {};

    const rows = Array.isArray(data.payments) ? data.payments : [];
    const total = Number(data.totalCount ?? rows.length ?? 0);
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
   * Fetch a single payment by ID.
   * @param {number|string} id - Payment ID
   * @returns {Promise<object|null>} - Payment data, or null if not found
   */
  getPaymentById: async (id) => {
    const res = await api.get(`/payment/${id}`);
    return res.data?.data || null;
  },
};