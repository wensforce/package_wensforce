import api from "../axios/axios";

export const paymentApiUser = {
  /**
   * Create a new payment order.
   * @param {object} payload
   * @returns {Promise<object>}
   */
  createOrder: async (payload) => {
    const res = await api.post("/payment/create-order", payload);
    return res.data;
  },
};
