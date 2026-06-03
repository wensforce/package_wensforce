import { dashboardApi } from "@/api/dashboard.api";
import React from "react";
import { useDashboardStore } from "@/store/admin/dashboard.store";

export const useAdminStats = () => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await dashboardApi.getAdminStats();
      useDashboardStore.setState({ adminStats: data.data });
      return data?.data;
    } catch (err) {
      setError(err.response?.data?.message ?? "Failed to fetch stats");
      throw err; // re-throw to allow caller to handle error display
    } finally {
      setLoading(false);
    }
  };

  return { fetchStats, loading, error };
};
