import api from "@/app/axios/axios";

export const couponApi = {
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
};
