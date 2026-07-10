"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Eye, Pencil } from "lucide-react";
import { userApi } from "./apis/user.api";
import AdminTable from "../components/AdminTable";
import UserCreateUpdateModal from "../components/modals/UserCreateUpdateModal";
import { formatDate } from "../components/user/userUtils";
import { useFetchList } from "../hooks/useFetchList";
import { useModal } from "../hooks/useModal";
const PAGE_LIMIT = 10;
const COLUMNS = [
  { key: "id", label: "#" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "mobileNumber", label: "Mobile" },
  { key: "role", label: "Role" },
  { key: "city", label: "City" },
  { key: "createdAt", label: "Created" },
  { key: "actions", label: "Actions" },
];

export default function UsersPage() {
  const router = useRouter();

  // pagination stays local — the hook doesn't manage it
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_LIMIT,
    total: 0,
    totalPages: 1,
  });

  // create-modal visibility — no data needed, so `data` is just ignored
  const {
    isOpen: showCreate,
    open: openCreateModal,
    close: closeCreateModal,
  } = useModal();

  // edit-modal visibility + the user being edited, both driven by useModal
  const {
    isOpen: showEdit,
    data: selectedUser,
    open: openEditModal,
    close: closeEditModal,
  } = useModal();

  // stable wrapper: reads page/search from its own args, not closure
  const fetchUsersForHook = useCallback(async ({ search, page }) => {
    const { rows, pagination: pg } = await userApi.fetchUsers({ page, search });
    setPagination(pg);
    return rows;
  }, []);

  const {
    rows: users,
    loading,
    error,
    searchInput,
    setSearchInput,
    search,
    refetch,
  } = useFetchList({
    fetchFn: fetchUsersForHook,
    params: { page },
  });

  // reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  function handleView(user) {
    try {
      sessionStorage.setItem(`user_${user.id}`, JSON.stringify(user));
    } catch (err) {
      console.warn("Could not cache user for detail view:", err);
    }
    router.push(`/admin/users/${user.id}`);
  }

  function renderCell(user, key) {
    switch (key) {
      case "id":
        return (
          <span className="font-mono text-xs font-medium text-[#0B1E3F]">
            #{user.id}
          </span>
        );
      case "name":
        return (
          <span className="text-sm font-medium text-[#1A202C]">
            {user.name || "-"}
          </span>
        );
      case "email":
        return (
          <span className="text-xs text-[#4A5568]">{user.email || "-"}</span>
        );
      case "mobileNumber":
        return (
          <span className="text-xs text-[#4A5568]">
            {user.mobileNumber || "-"}
          </span>
        );
      case "role":
        return (
          <span className="inline-flex items-center rounded-md border border-[#CBD5E0] bg-[#FAF6EC] px-2 py-1 text-xs font-semibold text-[#0B1E3F] uppercase tracking-wide">
            {user.role || "user"}
          </span>
        );
      case "city":
        return (
          <span className="text-xs text-[#4A5568]">{user.city || "-"}</span>
        );
      case "createdAt":
        return (
          <span className="text-xs text-[#4A5568] whitespace-nowrap">
            {formatDate(user.createdAt)}
          </span>
        );
      case "actions":
        return (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleView(user)}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
            >
              <Eye size={14} /> View
            </button>
            <button
              type="button"
              onClick={() => openEditModal(user)}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md bg-[#FAF6EC] text-[#4A5568] hover:bg-[#EFE7D6] transition-colors"
            >
              <Pencil size={14} /> Edit
            </button>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <>
      <AdminTable
        icon={<Users size={18} className="text-[#C9A24B]" />}
        title="Users"
        subtitle={`${pagination.total} total user${pagination.total !== 1 ? "s" : ""}`}
        searchPlaceholder="Search by name, email, mobile, city..."
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        columns={COLUMNS}
        rows={users}
        renderCell={renderCell}
        rowKey={(user) => user.id}
        loading={loading}
        error={error}
        pagination={pagination}
        onPageChange={setPage}
        onRefresh={refetch}
        onCreate={openCreateModal}
        createLabel="New User"
        emptyIcon={<Users size={32} />}
        emptyText="No users found"
      />

      <UserCreateUpdateModal
        open={showCreate}
        onClose={closeCreateModal}
        onCreated={refetch}
      />

      <UserCreateUpdateModal
        open={showEdit}
        onClose={closeEditModal}
        user={selectedUser}
        onUpdated={refetch}
      />
    </>
  );
}
