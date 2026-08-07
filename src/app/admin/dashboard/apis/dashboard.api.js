import api from "@/app/axios/axios";

export const dashboardApi = {
  fetchAdminDashboard: async () => {
    const res = await api.get("/dashboard/admin");
    return res.data?.data ?? res.data ?? null;
  },
};