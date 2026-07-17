import api from "@/app/axios/axios";

export const offersApi = {
  fetchOffers: async () => {
    const res = await api.get("/offer");
    return res.data?.data ?? res.data ?? [];
  },
  getOfferById: async (id) => {
    const res = await api.get(`/offer/${id}`);
    return res.data?.data ?? res.data ?? null;
  },
  createOffer: async (payload) => {
    const res = await api.post("/offer", payload);
    return res.data?.data ?? res.data ?? null;
  },
  updateOffer: async (id, payload) => {
    const res = await api.put(`/offer/${id}`, payload);
    return res.data?.data ?? res.data ?? null;
  },
  deleteOffer: async (id) => {
    await api.delete(`/offer/${id}`);
  },
  fetchPackagesList: async () => {
    const res = await api.get("/package", { params: { page: 1, limit: 100 } });
    const data = res.data?.data ?? res.data ?? {};
    const packages = data.packages || data.items || (Array.isArray(data) ? data : []);
    return Array.isArray(packages) ? packages : [];
  }
};
