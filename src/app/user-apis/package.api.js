import api from "../axios/axios";
const PAGE_LIMIT = 10;
export const packageApiUser = {
  /**
   * Fetch a single package by ID, including associated services.
   * @param {number|string} id - Package ID
   * @returns {Promise<object|null>} - Package data, or null if not found
   */
  getPackageById: async (id) => {
    const res = await api.get(`/package/${id}`);
    return res.data?.data ?? null;
  },

  /**
   * Fetch all packages visible to normal users.
   * @returns {Promise<object>}
   */
  fetchUserPackages: async (category) => {
    const res = await api.get("/package/user", {
      params: { category },
    });
    return res.data;
  },
};
