import api from "@/app/axios/axios";

export const servicesApiUser = {
  /**
   * Fetch services included in a specific package, with optional search filter.
   * @param {number|string} packageId - The package ID to fetch services for
   * @param {string} [query=""] - Optional search/filter term
   * @returns {Promise<Array>} - List of services belonging to the package
   */
  getPackageServices: async (packageId, query = "") => {
    const params = { page: 1, limit: 50 };
    if (query && query.trim()) params.search = query.trim();

    const res = await api.get(`/package/${packageId}/services`, { params });
    const rows = res.data?.data?.services ?? [];
    return Array.isArray(rows) ? rows : [];
  },

  // Get services that are not included in the package
  servicesNotIncluded: async (packageId, params) => {
    const res = await api.get(`/service/not-included/${packageId}`, { params });
    return res.data?.data;
  },
};
