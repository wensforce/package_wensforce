import api from "../axios/axios";

export const bookingApiUser = {
  /**
   * Create a new booking for a package subscription.
   * @param {object} payload
   * @returns {Promise<object>}
   */
  createBooking: async (payload) => {
    console.log(payload, "booking payload");
    const res = await api.post("/booking", payload);
    return res.data;
  },
};
