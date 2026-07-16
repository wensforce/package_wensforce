import api from "../axios/axios";

export const offerApi = {
  /**
   * Fetch the active offer for the 'user' category.
   * @returns {Promise<object>}
   */
  getOfferForUser: async () => {
    const res = await api.get("/homepage/offer/category/user");
    return res.data;
  },

  /**
   * Alternatively, fetch the active offer by a dynamic category.
   * @param {string} category - The category of the offer (e.g., 'user', 'driver')
   * @returns {Promise<object>}
   */
  getOfferByCategory: async (category) => {
    const res = await api.get(`/homepage/offer/category/${category}`);
    return res.data;
  },
};
