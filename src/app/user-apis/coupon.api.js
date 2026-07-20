import api from "../axios/axios";

export const couponApiUser = {
  /**
   * Validate a coupon code for a given package.
   * @param {string} code
   * @param {number} packageId
   * @returns {Promise<object>}
   */
  validateCoupon: async (code, packageId) => {
    const res = await api.get(`/coupon/validate?code=${code}&packageId=${packageId}`);
    return res.data;
  },
};
