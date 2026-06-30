"use client";

import { useEffect, useState } from "react";

/**
 * Manages a debounced search input and resets pagination to page 1
 * whenever the debounced search value changes.
 *
 * @param {object} options
 * @param {number} [options.delay=400] - Debounce delay in ms
 * @param {(page: number) => void} options.setPage - Page setter to reset on search change
 * @returns {{
 *   searchInput: string,
 *   setSearchInput: (value: string) => void,
 *   search: string,
 * }}
 */
export function useSearch({ setPage } = {}) {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    setPage?.(1);
  }, [search]);

  return { searchInput, setSearchInput, search };
}