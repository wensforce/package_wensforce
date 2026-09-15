import api from "@/app/axios/axios";

const PAGE_LIMIT = 10;

export const exposApi = {
  PAGE_LIMIT,

  fetchExpos: async ({ page, search }) => {
    const params = { page, limit: PAGE_LIMIT };
    if (search?.trim()) params.search = search.trim();

    const res = await api.get("/expo/admin/list", { params });
    const data = res.data?.data ?? {};
    const rows = data.expos ?? [];
    const pg = data.pagination ?? {
      page,
      limit: PAGE_LIMIT,
      total: rows.length,
      totalPages: 1,
    };

    return {
      rows,
      pagination: {
        ...pg,
        totalPages: Math.max(1, pg.totalPages ?? 1),
      },
    };
  },

  getExpoById: async (id) => {
    const res = await api.get(`/expo/admin/${id}`);
    return res.data?.data ?? null;
  },

  createExpo: async (payload) => {
    const res = await api.post("/expo/create", payload);
    return res.data?.data ?? null;
  },

  updateExpo: async (id, payload) => {
    const res = await api.put(`/expo/update/${id}`, payload);
    return res.data?.data ?? null;
  },

  deleteExpo: async (id) => {
    await api.delete(`/expo/delete/${id}`);
  },
};
