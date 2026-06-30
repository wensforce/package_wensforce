"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AlertTriangle, Loader2 } from "lucide-react";
import { userApi } from "../apis/user.api";
import UserDetailHeader from "../../components/user/UserDetailHeader";
import UserOverviewCard from "../../components/user/UserOverviewCard";
import UserCreateUpdateModal from "../../components/modals/UserCreateUpdateModal";
import { useFetchList } from "../../hooks/useFetchList";

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id;

  const [user, setUser] = useState(null);
 const { loading, setLoading, error, setError } = useFetchList();
  const [refreshing, setRefreshing] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const fetchUser = useCallback(
    async ({ silent = false } = {}) => {
      if (!userId) return;

      if (!silent) setLoading(true);
      else setRefreshing(true);
      setError(null);

      try {
        if (!silent) {
          const cached = sessionStorage.getItem(`user_${userId}`);
          if (cached) {
            setUser(JSON.parse(cached));
          }
        }

        const data = await userApi.getUserById(userId);
setUser(data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to fetch user details.");
      } finally {
        if (!silent) setLoading(false);
        else setRefreshing(false);
      }
    },
    [userId]
  );

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (loading && !user) {
    return (
      <div className="p-8 min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin text-[#C9A24B] mx-auto mb-3" />
          <p className="text-sm text-[#4A5568]">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (!user && error) {
    return (
      <div className="p-6 md:p-8">
        <div className="bg-white rounded-2xl border border-[#CBD5E0] overflow-hidden">
          <UserDetailHeader
            onBack={() => router.push("/admin/users")}
            onRefresh={() => fetchUser()}
            onEdit={() => {}}
            refreshing={refreshing}
          />

          <div className="p-8 text-center">
            <AlertTriangle size={34} className="mx-auto text-red-500 mb-3" />
            <h2 className="text-lg font-semibold text-[#1A202C] mb-2">Unable to load user</h2>
            <p className="text-sm text-[#4A5568] mb-5">{error}</p>
            <button
              onClick={() => fetchUser()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0B1E3F] text-white text-sm font-medium hover:bg-[#152d5a] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8">
        <p className="text-sm text-[#4A5568]">User not found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 md:p-8 space-y-6">
        <div className="bg-white rounded-2xl border border-[#CBD5E0] overflow-hidden">
          <UserDetailHeader
            onBack={() => router.push("/admin/users")}
            onRefresh={() => fetchUser({ silent: true })}
            onEdit={() => setShowEdit(true)}
            refreshing={refreshing}
          />

          {error && (
            <div className="mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="p-6">
            <UserOverviewCard user={user} />
          </div>
        </div>
      </div>

      <UserCreateUpdateModal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        user={user}
        onUpdated={async (updatedUser) => {
          if (updatedUser) {
            setUser((prev) => ({ ...prev, ...updatedUser }));
          }
          setShowEdit(false);
          await fetchUser({ silent: true });
        }}
      />
    </>
  );
}
