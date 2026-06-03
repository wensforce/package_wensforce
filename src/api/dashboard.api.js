import api from "../lib/axios";

export const dashboardApi = {
    getAdminStats: () => api.get("/dashboard/admin"),
    // getRecentUsers: () => api.get("/admin/recent-users"),
    // getRecentTrips: () => api.get("/admin/recent-trips"),
};