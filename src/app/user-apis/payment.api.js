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
  /**
   * Fetch User's Payment History.
   *
   * @returns {Promise<object>}
   */
  getMyPayments: async () => {
    const res = await api.get("/payment/user");
    return res.data;
  },
};
