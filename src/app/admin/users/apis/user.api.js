import api from "@/app/axios/axios";

const PAGE_LIMIT = 10;
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
    const rows =
      data.users ||
      data.data ||
      data.items ||
      (Array.isArray(data) ? data : []);
    return Array.isArray(rows) ? rows.slice(0, 5) : [];
  },
  /**
   * Fetch a single user by ID.
   * @param {number|string} id - User ID
   * @returns {Promise<object|null>}
   */
  getUserById: async (id) => {
    const res = await api.get(`/user/${id}`);
    return res.data?.data ?? null;
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
   * Fetch paginated users with optional search.
   * @param {object} options
   * @param {number} options.page   - Current page number
   * @param {string} options.search - Search query string (name, email, mobile, city)
   * @returns {Promise<{ rows: Array, pagination: object }>}
   */
  fetchUsers: async ({ page, search }) => {
    const params = { page, limit: PAGE_LIMIT };
    if (search && search.trim()) params.search = search.trim();

    const res = await api.get("/user", { params });
    const data = res.data?.data ?? {};

    const rows = Array.isArray(data.users) ? data.users : [];
    const total = Number(data.meta?.totalUsers ?? rows.length ?? 0);
    const currentPage = Number(data.meta?.currentPage ?? page);
    const totalPages = Number(
      data.meta?.totalPages ?? Math.max(1, Math.ceil(total / PAGE_LIMIT)),
    );
    const limit = Number(data.meta?.pageSize ?? PAGE_LIMIT);

    return {
      rows,
      pagination: {
        page: currentPage,
        limit,
        total,
        totalPages: Math.max(1, totalPages),
      },
    };
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
