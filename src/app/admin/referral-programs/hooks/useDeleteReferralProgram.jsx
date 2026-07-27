"use client";

import { useState, useCallback } from "react";
import { referralApi } from "../apis/referral.api";
import { toast } from "sonner";

/**
 * Custom hook to handle deleting/cancelling a referral program.
 * Provides modal state management, API calls, and toast notifications.
 *
 * @param {object} [options]
 * @param {(program: any, response: any) => void} [options.onSuccess] - Callback fired after successful deletion
 * @param {(error: any) => void} [options.onError] - Callback fired on deletion error
 */
export function useDeleteReferralProgram({ onSuccess, onError } = {}) {
  const [programToDelete, setProgramToDelete] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  /**
   * Opens the delete modal for a specific program.
   */
  const confirmDelete = useCallback((program) => {
    setProgramToDelete(program);
    setDeleteError(null);
    setDeleteModalOpen(true);
  }, []);

  /**
   * Closes the delete confirmation modal and resets state.
   */
  const closeDeleteModal = useCallback(() => {
    if (deleting) return;
    setDeleteModalOpen(false);
    setProgramToDelete(null);
    setDeleteError(null);
  }, [deleting]);

  /**
   * Executes the delete/cancel API operation.
   * Can be called without parameters (uses programToDelete), or passed a program object/id.
   */
  const handleDelete = useCallback(
    async (target) => {
      let programObj = null;
      let targetId = null;

      if (target && typeof target === "object" && target.id) {
        programObj = target;
        targetId = target.id;
      } else if (typeof target === "number" || typeof target === "string") {
        targetId = target;
        programObj = programToDelete;
      } else {
        programObj = programToDelete;
        targetId = programToDelete?.id;
      }

      if (!targetId) return;

      setDeleting(true);
      setDeleteError(null);

      try {
        const res = await referralApi.deleteProgram(targetId);
        const msg = res?.message || "Referral program processed successfully";
        toast.success(msg);

        setDeleteModalOpen(false);
        const deletedItem = programObj;
        setProgramToDelete(null);

        if (onSuccess) {
          onSuccess(deletedItem, res);
        }
        return res;
      } catch (err) {
        console.error("Error deleting referral program:", err);
        const errMsg =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to delete referral program.";
        setDeleteError(errMsg);
        toast.error(errMsg);
        if (onError) {
          onError(err);
        }
      } finally {
        setDeleting(false);
      }
    },
    [programToDelete, onSuccess, onError],
  );

  return {
    programToDelete,
    setProgramToDelete,
    deleteModalOpen,
    setDeleteModalOpen,
    deleting,
    deleteError,
    confirmDelete,
    closeDeleteModal,
    handleDelete,
  };
}
