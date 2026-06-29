import api from "@/app/axios/axios";


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
};