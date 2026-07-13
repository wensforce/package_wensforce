import api from "../axios/axios";
const PAGE_LIMIT = 10;
export const packageApiUser = {
  /**
   * Fetch paginated packages with optional search.
   * @param {object} options
   * @param {number} options.page   - Current page number
   * @param {string} options.search - Search query string
   * @returns {Promise<{ rows: Array, pagination: object }>}
   */
  fetchPackages: async ({ page, search }) => {
    const params = { page, limit: PAGE_LIMIT };
    if (search && search.trim()) params.search = search.trim();

    const res = await api.get("/package", { params });
    const data = res.data?.data ?? res.data ?? {};
    const rows =
      data.packages ||
      data.data ||
      data.items ||
      (Array.isArray(data) ? data : []);
    const pagination = data.pagination || {
      page,
      limit: PAGE_LIMIT,
      total: rows.length,
      totalPages: Math.ceil(rows.length / PAGE_LIMIT) || 1,
    };

    return {
      rows: Array.isArray(rows) ? rows : [],
      pagination,
    };
  },

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
  fetchUserPackages: async () => {
    const res = await api.get("/package/user");
    return res.data;
  },
};
