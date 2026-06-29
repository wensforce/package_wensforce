"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Eye, Pencil } from "lucide-react";
import api from "../../axios/axios";
import AdminTable from "../components/AdminTable";
import UserCreateUpdateModal from "../components/modals/UserCreateUpdateModal";
import { formatDate } from "../components/user/userUtils";

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
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_LIMIT,
    total: 0,
    totalPages: 1,
  });
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = { page, limit: PAGE_LIMIT };
      if (search.trim()) params.search = search.trim();

      const res = await api.get("/user", { params });
      const data = res.data?.data ?? {};

      const rows = Array.isArray(data.users) ? data.users : [];
      const total = Number(data.meta?.totalUsers ?? rows.length ?? 0);
      const currentPage = Number(data.meta?.currentPage ?? page);
      const totalPages = Number(data.meta?.totalPages ?? Math.max(1, Math.ceil(total / PAGE_LIMIT)));
      const limit = Number(data.meta?.pageSize ?? PAGE_LIMIT);

      setUsers(rows);
      setPagination({
        page: currentPage,
        limit,
        total,
        totalPages: Math.max(1, totalPages),
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  function renderCell(user, key) {
    switch (key) {
      case "id":
        return <span className="font-mono text-xs font-medium text-[#0B1E3F]">#{user.id}</span>;
      case "name":
        return <span className="text-sm font-medium text-[#1A202C]">{user.name || "-"}</span>;
      case "email":
        return <span className="text-xs text-[#4A5568]">{user.email || "-"}</span>;
      case "mobileNumber":
        return <span className="text-xs text-[#4A5568]">{user.mobileNumber || "-"}</span>;
      case "role":
        return (
          <span className="inline-flex items-center rounded-md border border-[#CBD5E0] bg-[#FAF6EC] px-2 py-1 text-xs font-semibold text-[#0B1E3F] uppercase tracking-wide">
            {user.role || "user"}
          </span>
        );
      case "city":
        return <span className="text-xs text-[#4A5568]">{user.city || "-"}</span>;
      case "createdAt":
        return <span className="text-xs text-[#4A5568] whitespace-nowrap">{formatDate(user.createdAt)}</span>;
      case "actions":
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sessionStorage.setItem(`user_${user.id}`, JSON.stringify(user));
                router.push(`/admin/users/${user.id}`);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
            >
              <Eye size={14} /> View
            </button>
            <button
              onClick={() => {
                setSelectedUser(user);
                setShowEdit(true);
              }}
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
        onRefresh={fetchUsers}
        onCreate={() => setShowCreate(true)}
        createLabel="New User"
        emptyIcon={<Users size={32} />}
        emptyText="No users found"
      />

      <UserCreateUpdateModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={fetchUsers}
      />

      <UserCreateUpdateModal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        user={selectedUser}
        onUpdated={fetchUsers}
      />
    </>
  );
}
