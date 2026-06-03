import { create } from "zustand";

export const useDashboardStore = create((set) => ({
  adminStats: null,
  setAdminStats: (stats) => set({ adminStats: stats }),
}));