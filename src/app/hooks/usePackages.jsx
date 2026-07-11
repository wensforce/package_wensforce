"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setPackages,
  setPackagesLoading,
  setPackagesError,
} from "@/app/membership/slices/package-slice";
import api from "@/app/axios/axios";

let isFetching = false;

export function usePackages() {
  const dispatch = useDispatch();
  const packages = useSelector((state) =>
    Array.isArray(state.packages.value) ? state.packages.value : []
  );
  const error = useSelector((state) => state.packages.error ?? false);
  const loading =
    useSelector((state) => state.packages.loading ?? false) ||
    (packages.length === 0 && !error);

  useEffect(() => {
    if (packages.length > 0) return;
    if (isFetching) return;

    isFetching = true;
    const run = async () => {
      dispatch(setPackagesLoading(true));
      try {
        const res = await api.get("/package/user");
        const data = res?.data?.data ?? [];
        dispatch(setPackages(data));
      } catch (err) {
        console.error("usePackages: fetch failed", err);
        dispatch(setPackagesError(true));
      } finally {
        isFetching = false;
      }
    };
    run();
  }, [packages.length, dispatch]);

  // ── derived — single source of truth for both PlansSection + ComparisonTable
  //Can use api call for bestValueId
  const bestValueId =
    Array.isArray(packages) && packages.length > 0
      ? packages.find((p) => p.featured)?.id ??
        packages.find((p) => p.id === "premium")?.id ??
        packages[Math.floor(packages.length / 2)]?.id ??
        null
      : null;

  return { packages, loading, error, bestValueId };
}