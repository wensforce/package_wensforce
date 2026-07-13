import api from "../axios/axios";

export const tripApiUser = {
  /**
   * Request a new trip for a subscription.
   * @param {object} payload
   * @param {number} payload.subscriptionId
   * @param {string} payload.pickupLocation
   * @param {string} payload.dropLocation
   * @param {string} payload.tripDate
   * @param {string} payload.tripType
   * @param {Array<{ id: number, name: string, price: number }>} payload.services
   * @returns {Promise<object>}
   */
  requestTrip: async (payload) => {
    const res = await api.post("/trip/request", payload);
    return res.data;
  },

  /**
   * Fetch all trips requested by the logged-in user.
   * @returns {Promise<object>}
   */
  getMyTrips: async () => {
    const res = await api.get("/trip/mine");
    return res.data;
  },
};
