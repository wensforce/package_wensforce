import api from "@/app/axios/axios";

export const userApi = {
  /**
   * Search users by query string (used for autocomplete/suggestions).
   * @param {string} query - Search term (name, email, or mobile)
   * @returns {Promise<Array>} - Up to 5 matching user rows
   */
  searchUsers: async (query) => {
    const res = await api.get("/user", {
      params: { search: query, page: 1, limit: 5 },
    });
    const data = res.data?.data ?? res.data ?? {};
    const rows = data.users || data.data || data.items || (Array.isArray(data) ? data : []);
    return Array.isArray(rows) ? rows.slice(0, 5) : [];
  },

  /**
   * Create a new user.
   * @param {{ name: string, email: string, mobileNumber: string, role: string, city: string }} payload
   * @returns {Promise<object>} - Created user data
   */
  createUser: async (payload) => {
    const res = await api.post("/user", payload);
    return res.data?.data;
  },

  /**
   * Update an existing user.
   * @param {number|string} id - User ID
   * @param {Partial<{ name: string, email: string, mobileNumber: string, role: string, city: string }>} payload
   * @returns {Promise<object>} - Updated user data
   */
  updateUser: async (id, payload) => {
    const res = await api.put(`/user/${id}`, payload);
    return res.data?.data;
  },
};