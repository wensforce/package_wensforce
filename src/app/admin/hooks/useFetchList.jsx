import { useState } from "react";
import { useSearch } from "./useSearch";

export function useFetchList(pageLimit = 10) {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { searchInput, setSearchInput, search } = useSearch({ setPage });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: pageLimit,
    total: 0,
    totalPages: 1,
  });

  return {
    page,
    setPage,
    loading,
    setLoading,
    error,
    setError,
    searchInput,
    setSearchInput,
    search,
    pagination,
    setPagination,
  };
}
