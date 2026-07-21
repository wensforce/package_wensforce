"use client";
import { useState, useEffect, useCallback, useRef } from "react";

const DEFAULT_DELAY = 400;

/**
 * Generic debounced-search + api-calling hook (no pagination).
 * Use for lists/dropdowns/autocomplete that just need search-driven fetching.
 *
 * @param {object} options
 * @param {(args: {search:string, [key:string]:any}) => Promise<{rows:any[]}> | Promise<any[]>} options.fetchFn
 * @param {number} [options.delay=400] - debounce delay in ms
 * @param {object} [options.params] - extra static/query params merged into every fetch call
 */
export function useFetchList({
  fetchFn,
  delay = DEFAULT_DELAY,
  params = {},
} = {}) {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // debounce raw input -> committed search term
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), delay);
    return () => clearTimeout(t);
  }, [searchInput, delay]);

  // stringify params so a fresh object literal each render doesn't retrigger fetch
  const paramsKey = JSON.stringify(params);

  const requestIdRef = useRef(0);

  const fetchList = useCallback(async () => {
    if (!fetchFn) return;
    const requestId = ++requestIdRef.current; // mark this call as "latest"
    setLoading(true);
    setError(null);
    try {
      const res = await fetchFn({ search, ...JSON.parse(paramsKey) });
      if (requestId !== requestIdRef.current) return; // stale response, discard
      // support fetchFn returning either { rows } or a bare array
      const list = Array.isArray(res) ? res : res?.rows || [];
      setRows(list);
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      setError(
        err?.response?.data?.message || err?.message || "Failed to load data.",
      );
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchFn, search, paramsKey]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return {
    rows,
    setRows,
    loading,
    setLoading,
    error,
    setError,
    searchInput,
    setSearchInput,
    search,
    refetch: fetchList,
  };
}
