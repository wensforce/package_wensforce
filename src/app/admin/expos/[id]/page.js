"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AlertTriangle, Loader2 } from "lucide-react";
import Modal from "../../components/Modal";
import ExpoDetailHeader from "../../components/expo/ExpoDetailHeader";
import ExpoOverviewCard from "../../components/expo/ExpoOverviewCard";
import { exposApi } from "../apis/expos.api";
import { formatExpoApiError } from "../utils/expoFormUtils";

export default function ExpoDetailPage() {
  const router = useRouter();
  const params = useParams();
  const expoId = params?.id;

  const [expo, setExpo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchExpo = useCallback(
    async ({ silent = false } = {}) => {
      if (!expoId) return;
      if (!silent) setLoading(true);
      else setRefreshing(true);
      setError(null);
      try {
        const data = await exposApi.getExpoById(expoId);
        setExpo(data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to fetch expo.");
      } finally {
        if (!silent) setLoading(false);
        else setRefreshing(false);
      }
    },
    [expoId],
  );

  useEffect(() => {
    fetchExpo();
  }, [fetchExpo]);

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    setShowDeleteModal(false);
    try {
      await exposApi.deleteExpo(expoId);
      router.push("/admin/expos");
    } catch (err) {
      setError(formatExpoApiError(err));
    } finally {
      setDeleting(false);
    }
  };

  if (loading && !expo) {
    return (
      <div className="p-8 min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2
            size={32}
            className="animate-spin text-[#C9A24B] mx-auto mb-3"
          />
          <p className="text-sm text-[#4A5568]">Loading expo details…</p>
        </div>
      </div>
    );
  }

  if (!expo && error) {
    return (
      <div className="p-6 md:p-8">
        <div className="bg-white rounded-2xl border border-[#CBD5E0] overflow-hidden">
          <ExpoDetailHeader
            onBack={() => router.back()}
            onRefresh={() => fetchExpo()}
            onEdit={() => {}}
            refreshing={refreshing}
          />
          <div className="p-8 text-center">
            <AlertTriangle size={34} className="mx-auto text-red-500 mb-3" />
            <p className="text-sm text-[#4A5568] mb-5">{error}</p>
            <button
              type="button"
              onClick={() => fetchExpo()}
              className="px-4 py-2 rounded-lg bg-[#0B1E3F] text-white text-sm"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="bg-white rounded-2xl border border-[#CBD5E0] overflow-hidden">
        <ExpoDetailHeader
          onBack={() => router.push("/admin/expos")}
          onRefresh={() => fetchExpo({ silent: true })}
          onEdit={() => router.push(`/admin/expos/edit/${expoId}`)}
          onDelete={() => setShowDeleteModal(true)}
          refreshing={refreshing}
          deleting={deleting}
        />
        {error && (
          <div className="mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
        <ExpoOverviewCard expo={expo} />
      </div>

      <Modal
        open={showDeleteModal}
        onClose={() => !deleting && setShowDeleteModal(false)}
        title="Delete expo"
      >
        <p className="text-sm text-[#4A5568] mb-6">
          Delete <strong>{expo?.name}</strong>? This cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            disabled={deleting}
            onClick={() => setShowDeleteModal(false)}
            className="px-4 py-2 rounded-lg border border-[#CBD5E0] text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={deleting}
            onClick={handleDeleteConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium disabled:opacity-60"
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
