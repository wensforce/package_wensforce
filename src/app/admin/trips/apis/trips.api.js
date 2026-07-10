import api from "../../../axios/axios";
const PAGE_LIMIT = 10;
export const tripApi = {
  /**
   * Create a new trip.
   * @param {object} payload - Trip data
   * @returns {Promise<object>}
   */
  createTrip: async (payload) => {
    const res = await api.post("/trip/create", payload);
    return res.data;
  },

  /**
   * Update an existing trip.
   * @param {number|string} id - Trip ID
   * @param {object} payload - Updated trip data
   * @returns {Promise<object>}
   */
  updateTrip: async (id, payload) => {
    const res = await api.put(`/trip/update/${id}`, payload);
    return res.data?.data;
  },

  /**
   * Fetch a single trip by ID.
   * @param {number|string} id - Trip ID
   * @returns {Promise<object|null>}
   */
  getTripById: async (id) => {
    const res = await api.get(`/trip/${id}`);
    return res.data?.data ?? null;
  },
  /**
   * Fetch paginated trips with optional search and date filter.
   * @param {object} options
   * @param {number} options.page     - Current page number
   * @param {string} options.search   - Search query string (pickup, drop, assignment, type, user)
   * @param {string} options.tripDate - Optional date filter (YYYY-MM-DD)
   * @returns {Promise<{ rows: Array, pagination: object }>}
   */
  fetchTrips: async ({ page, search, tripDate }) => {
    const params = { page, limit: PAGE_LIMIT };
    if (search && search.trim()) params.search = search.trim();
    if (tripDate) params.tripDate = tripDate;

    const res = await api.get("/trip/get-all", { params });
    const data = res.data?.data ?? {};

    const rows = Array.isArray(data.trips) ? data.trips : [];
    const total = Number(data.meta?.total ?? rows.length ?? 0);
    const currentPage = Number(data.meta?.page ?? page);
    const limit = Number(data.meta?.limit ?? PAGE_LIMIT);
    const totalPages = Number(
      data.meta?.totalPages ?? Math.max(1, Math.ceil(total / limit)),
    );

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
   * Approve a trip with an assignment ID.
   * @param {number|string} id - Trip ID
   * @param {string} assignmentId - Assignment ID to attach
   * @returns {Promise<object>}
   */
  approveTrip: async (id, assignmentId) => {
    const res = await api.post(`/trip/approve/${id}`, { assignmentId });
    return res.data;
  },

  /**
   * Mark a trip as completed.
   * @param {number|string} id - Trip ID
   * @returns {Promise<object>}
   */
  completeTrip: async (id) => {
    const res = await api.post(`/trip/complete/${id}`);
    return res.data;
  },

  /**
   * Cancel a trip with a reason.
   * @param {number|string} id - Trip ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise<object>}
   */
  cancelTrip: async (id, reason) => {
    const res = await api.post(`/trip/cancel/${id}`, { reason });
    return res.data;
  },

  /**
   * Delete a trip by ID.
   * @param {number|string} id - Trip ID to delete
   * @returns {Promise<void>}
   */
  deleteTrip: async (id) => {
    await api.delete(`/trip/delete/${id}`);
  },
};
