import api from "@/app/axios/axios";

const PAGE_LIMIT = 10;




export const bookingApi = {
  /**
 * Fetch paginated bookings with optional status filter and search.
 *
 * @param {object} options
 * @param {number} options.page       - Current page number
 * @param {string} options.activeTab  - Status filter tab ("all" | "pending" | ...)
 * @param {string} options.search     - Search query string
 * @returns {Promise<{ rows: Array, pagination: object }>}
 */

  fetchBookings: async ({ page, activeTab, search }) => {
    const params = { page, limit: PAGE_LIMIT };
    if (activeTab && activeTab !== "all") params.status = activeTab;
    if (search && search.trim()) params.search = search.trim();
    const res = await api.get("booking", { params });
    const { data: rows, pagination } = res.data.data;
    return { rows, pagination };
  },
};
