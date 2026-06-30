import api from "@/app/axios/axios";
const PAGE_LIMIT = 10;
export const couponApi = {
  /**
   * Fetch paginated coupons with optional search.
   *
   * @param {object} options
   * @param {number} options.page   - Current page number
   * @param {string} options.search - Search query string (matches coupon code)
   * @returns {Promise<{ rows: Array, pagination: object }>}
   */
  fetchCoupons: async ({ page, search }) => {
    const params = { page, limit: PAGE_LIMIT };
    if (search && search.trim()) params.search = search.trim();

    const res = await api.get("/coupon", { params });
    const data = res.data?.data ?? {};

    const rows = Array.isArray(data.coupons) ? data.coupons : [];
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
   * Create a new coupon.
   *
   * @param {object} payload - Coupon data to create
   * @returns {Promise<void>}
   */
  createCoupon: async (payload) => {
    await api.post("/coupon", payload);
  },

  /**
   * Update an existing coupon by ID.
   *
   * @param {string|number} id      - Coupon ID to update
   * @param {object}        payload - Updated coupon data
   * @returns {Promise<object>} - Updated coupon from response
   */
  updateCoupon: async (id, payload) => {
    const res = await api.put(`/coupon/${id}`, payload);
    return res.data?.data;
  },
  /**
   * Fetch a single coupon by ID, including its associated packages.
   *
   * @param {string|number} id - Coupon ID
   * @returns {Promise<object|null>} - Coupon data, or null if not found
   */
  getCouponById: async (id) => {
    const res = await api.get(`/coupon/${id}`);
    return res.data?.data ?? null;
  },
  /**
   * Delete a coupon by ID.
   *
   * @param {string|number} id - Coupon ID to delete
   * @returns {Promise<void>}
   */
  deleteCoupon: async (id) => {
    await api.delete(`/coupon/${id}`);
  },
};
