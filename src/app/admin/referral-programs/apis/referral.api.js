import api from "@/app/axios/axios";

const PAGE_LIMIT = 10;

export const referralApi = {
  fetchPrograms: async ({ page = 1, limit = PAGE_LIMIT, status, search } = {}) => {
    const params = { page, limit };
    if (status && status !== "all") params.status = status;
    if (search && search.trim()) params.search = search.trim();

    const res = await api.get("/admin/referral-programs", { params });
    const data = res.data?.data ?? res.data ?? {};
    const rows =
      data.programs ||
      data.data ||
      data.items ||
      (Array.isArray(data) ? data : []);
    const pagination = data.pagination || {
      page: data.page || page || 1,
      limit: data.limit || PAGE_LIMIT,
      total: data.total !== undefined ? data.total : rows.length,
      totalPages:
        Math.ceil(
          (data.total !== undefined ? data.total : rows.length) /
          (data.limit || PAGE_LIMIT)
        ) || 1,
    };

    return {
      rows: Array.isArray(rows) ? rows : [],
      pagination,
    };
  },

  getProgramById: async (id) => {
    const res = await api.get(`/admin/referral-programs/${id}`);
    return res.data?.data ?? res.data ?? null;
  },

  createProgram: async (payload) => {
    const res = await api.post("/admin/referral-programs", payload);
    return res.data?.data ?? res.data ?? null;
  },

  updateProgram: async (id, payload) => {
    const res = await api.patch(`/admin/referral-programs/${id}`, payload);
    return res.data?.data ?? res.data ?? null;
  },

  deleteProgram: async (id) => {
    const res = await api.delete(`/admin/referral-programs/${id}`);
    return res.data ?? null;
  },

  getProgramTracks: async (id, { page = 1, limit = PAGE_LIMIT } = {}) => {
    const res = await api.get(`/admin/referral-programs/${id}/track`, {
      params: { page, limit },
    });
    return res.data?.data ?? res.data ?? {};
  },

  fetchPackagesList: async () => {
    const res = await api.get("/package", { params: { page: 1, limit: 100 } });
    const data = res.data?.data ?? res.data ?? {};
    const packages =
      data.packages || data.items || (Array.isArray(data) ? data : []);
    return Array.isArray(packages) ? packages : [];
  },

  fetchCategories: async () => {
    const res = await api.get("/package/categories");
    return res.data?.data ?? [];
  },
};
