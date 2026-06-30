"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  Ban,
  CheckCircle2,
  Loader2,
  Pencil,
  RefreshCw,
  ShieldAlert,
  Trash2,
  UserRound,
  Repeat,
  ConciergeBell,
} from "lucide-react";
import { tripApi } from "../apis/trips.api";
import { useModal } from "../../hooks/useModal";
import CreateTripModal from "../../components/modals/CreateTripModal";
import { useFetchList } from "../../hooks/useFetchList";
import Modal from "../../components/Modal";
function formatDate(iso) {
  if (!iso) return "-";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStatusUI(status) {
  const s = String(status || "pending").toUpperCase();

  if (["CANCELLED", "CANCELED"].includes(s)) {
    return {
      className: "bg-red-100 text-red-700",
      icon: <Ban size={11} />,
      label: "CANCELLED",
    };
  }

  if (["CONFIRMED", "COMPLETED", "ACTIVE"].includes(s)) {
    return {
      className: "bg-green-100 text-green-700",
      icon: <CheckCircle2 size={11} />,
      label: s,
    };
  }

  return {
    className: "bg-amber-100 text-amber-700",
    icon: <Loader2 size={11} />,
    label: s,
  };
}

export default function TripDetailPage() {
  const router = useRouter();
  const params = useParams();
  const tripId = params?.id;

  const [trip, setTrip] = useState(null);
  const { loading, setLoading, error, setError } = useFetchList();  

  const [refreshing, setRefreshing] = useState(false);
  const [approving, setApproving] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Modal state, all driven by the useModal hook
  const editModal = useModal();
  const approveModal = useModal();
  const completeModal = useModal();
  const cancelModal = useModal();
  const deleteModal = useModal();

  const [approveAssignmentId, setApproveAssignmentId] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [approveError, setApproveError] = useState(null);
  const [cancelError, setCancelError] = useState(null);

  const fetchTrip = useCallback(
    async ({ silent = false } = {}) => {
      if (!tripId) return;

      if (!silent) setLoading(true);
      else setRefreshing(true);
      setError(null);

      try {
        if (!silent) {
          const cached = sessionStorage.getItem(`trip_${tripId}`);
          if (cached) {
            setTrip(JSON.parse(cached));
          }
        }

        const data = await tripApi.getTripById(tripId);
        setTrip(data);
      } catch (err) {
        setError(
          err?.response?.data?.message || "Failed to fetch trip details.",
        );
      } finally {
        if (!silent) setLoading(false);
        else setRefreshing(false);
      }
    },
    [tripId],
  );

  useEffect(() => {
    fetchTrip();
  }, [fetchTrip]);

  const status = String(trip?.status || "").toLowerCase();
  const isCancelled = ["cancelled", "canceled"].includes(status);
  const canApprove = ![
    "confirmed",
    "completed",
    "active",
    "cancelled",
    "canceled",
  ].includes(status);
  const canComplete = ["confirmed", "active"].includes(status);
  const canCancel = !["completed", "cancelled", "canceled"].includes(status);
  const statusUI = useMemo(() => getStatusUI(trip?.status), [trip?.status]);

  async function handleApproveConfirm() {
    if (!tripId || !canApprove || approving) return;

    const assignmentId = approveAssignmentId.trim();
    if (!assignmentId) {
      setApproveError("Assignment ID is required.");
      return;
    }

    setApproving(true);
    setError(null);
    setApproveError(null);

    try {
      await tripApi.approveTrip(tripId, assignmentId);

      approveModal.close();
      await fetchTrip({ silent: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to approve trip.");
    } finally {
      setApproving(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!tripId) return;

    setDeleting(true);
    setError(null);
    deleteModal.close();

    try {
      await tripApi.deleteTrip(tripId);
      router.push("/admin/trips");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete trip.");
    } finally {
      setDeleting(false);
    }
  }

  async function handleCompleteConfirm() {
    if (!tripId || !canComplete || completing) return;

    setCompleting(true);
    setError(null);

    try {
      await tripApi.completeTrip(tripId);
      completeModal.close();
      await fetchTrip({ silent: true });
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to mark trip as completed.",
      );
    } finally {
      setCompleting(false);
    }
  }

  async function handleCancelConfirm() {
    if (!tripId || !canCancel || cancelling) return;

    const reason = cancelReason.trim();
    if (!reason) {
      setCancelError("Cancel reason is required.");
      return;
    }

    setCancelling(true);
    setError(null);
    setCancelError(null);

    try {
      await tripApi.cancelTrip(tripId, reason);
      cancelModal.close();
      setCancelReason("");
      await fetchTrip({ silent: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to cancel trip.");
    } finally {
      setCancelling(false);
    }
  }

  if (loading && !trip) {
    return (
      <div className="p-8 min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2
            size={32}
            className="animate-spin text-[#C9A24B] mx-auto mb-3"
          />
          <p className="text-sm text-[#4A5568]">Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (!trip && error) {
    return (
      <div className="p-6 md:p-8">
        <div className="bg-white rounded-2xl border border-[#CBD5E0] overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 border-b border-[#CBD5E0] bg-white">
            <button
              onClick={() => router.push("/admin/trips")}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#4A5568] hover:text-[#0B1E3F] transition-colors"
            >
              <ArrowLeft size={16} /> Back
            </button>

            <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3F]">
              Trip Details
            </h1>

            <button
              onClick={() => fetchTrip()}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0B1E3F] text-white text-sm font-semibold hover:bg-[#152d5a] transition-colors"
            >
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          <div className="p-8 text-center">
            <AlertTriangle size={34} className="mx-auto text-red-500 mb-3" />
            <h2 className="text-lg font-semibold text-[#1A202C] mb-2">
              Unable to load trip
            </h2>
            <p className="text-sm text-[#4A5568] mb-5">{error}</p>
            <button
              onClick={() => fetchTrip()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0B1E3F] text-white text-sm font-medium hover:bg-[#152d5a] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="p-8">
        <p className="text-sm text-[#4A5568]">Trip not found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 md:p-8 space-y-6">
        <div className="bg-white rounded-2xl border border-[#CBD5E0] overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 border-b border-[#CBD5E0] bg-white">
            <button
              onClick={() => router.push("/admin/trips")}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#4A5568] hover:text-[#0B1E3F] transition-colors"
            >
              <ArrowLeft size={16} /> Back
            </button>

            <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3F]">
              Trip Details
            </h1>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => fetchTrip({ silent: true })}
                disabled={
                  refreshing ||
                  approving ||
                  completing ||
                  cancelling ||
                  deleting
                }
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0B1E3F] text-white text-sm font-semibold hover:bg-[#152d5a] transition-colors disabled:opacity-60"
              >
                <RefreshCw
                  size={14}
                  className={refreshing ? "animate-spin" : ""}
                />
                {refreshing ? "Refreshing" : "Refresh"}
              </button>

              <button
                onClick={() => editModal.open()}
                disabled={approving || completing || cancelling || deleting}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#CBD5E0] bg-white text-[#1A202C] text-sm font-medium hover:bg-[#FAF6EC] transition-colors disabled:opacity-50"
              >
                <Pencil size={14} /> Edit
              </button>
            </div>
          </div>

          {error && (
            <div className="mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="p-6 space-y-6">
            <section className="bg-[#FAF6EC] rounded-2xl border border-[#E2E8F0] p-5">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="text-base font-semibold text-[#0B1E3F]">
                  Trip Overview
                </h2>
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${statusUI.className}`}
                >
                  {statusUI.icon} {statusUI.label}
                </span>
              </div>

              <dl className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 text-sm">
                <div>
                  <dt className="text-[#718096] mb-1">Trip ID</dt>
                  <dd className="text-[#1A202C] font-semibold">#{trip.id}</dd>
                </div>
                <div>
                  <dt className="text-[#718096] mb-1">Assignment ID</dt>
                  <dd className="text-[#1A202C] font-semibold">
                    {trip.assignmentId || "-"}
                  </dd>
                </div>
                <div>
                  <dt className="text-[#718096] mb-1">Trip Date</dt>
                  <dd className="text-[#1A202C] font-semibold">
                    {formatDate(trip.tripDate)}
                  </dd>
                </div>
                <div>
                  <dt className="text-[#718096] mb-1">Pickup</dt>
                  <dd className="text-[#1A202C] font-semibold">
                    {trip.pickupLocation || "-"}
                  </dd>
                </div>
                <div>
                  <dt className="text-[#718096] mb-1">Drop</dt>
                  <dd className="text-[#1A202C] font-semibold">
                    {trip.dropLocation || "-"}
                  </dd>
                </div>
                <div>
                  <dt className="text-[#718096] mb-1">Trip Type</dt>
                  <dd className="text-[#1A202C] font-semibold">
                    {trip.tripType || "-"}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
                <h3 className="text-sm font-semibold text-[#0B1E3F] inline-flex items-center gap-2">
                  <BadgeCheck size={14} className="text-green-600" /> Approve
                </h3>
                <p className="text-xs text-[#4A5568] mt-2">
                  Assign an Assignment ID and verify this trip.
                </p>
                <button
                  onClick={() => {
                    setApproveError(null);
                    approveModal.open(trip?.assignmentId || "");
                    setApproveAssignmentId(trip?.assignmentId || "");
                  }}
                  disabled={
                    !canApprove ||
                    approving ||
                    completing ||
                    cancelling ||
                    deleting
                  }
                  className="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-60"
                >
                  <CheckCircle2 size={14} />{" "}
                  {approving
                    ? "Approving"
                    : canApprove
                      ? "Approve Trip"
                      : "Already Approved"}
                </button>
              </div>

              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
                <h3 className="text-sm font-semibold text-[#0B1E3F] inline-flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#C9A24B]" /> Complete
                </h3>
                <p className="text-xs text-[#4A5568] mt-2">
                  Mark this trip as completed after service delivery.
                </p>
                <button
                  onClick={() => completeModal.open()}
                  disabled={
                    !canComplete ||
                    completing ||
                    approving ||
                    cancelling ||
                    deleting
                  }
                  className="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0B1E3F] text-white text-sm font-semibold hover:bg-[#152d5a] transition-colors disabled:opacity-60"
                >
                  <CheckCircle2 size={14} />{" "}
                  {completing
                    ? "Completing"
                    : canComplete
                      ? "Mark Completed"
                      : "Not Allowed"}
                </button>
              </div>

              <div className="rounded-2xl border border-[#F7D4D4] bg-[#FFF8F8] p-5">
                <h3 className="text-sm font-semibold text-[#7F1D1D] inline-flex items-center gap-2">
                  <Ban size={14} className="text-red-600" /> Cancel
                </h3>
                <p className="text-xs text-[#7F1D1D] mt-2">
                  Cancel this trip when it cannot be served.
                </p>
                <button
                  onClick={() => {
                    setCancelReason("");
                    setCancelError(null);
                    cancelModal.open();
                  }}
                  disabled={
                    !canCancel ||
                    cancelling ||
                    approving ||
                    completing ||
                    deleting ||
                    isCancelled
                  }
                  className="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-60"
                >
                  <Ban size={14} />{" "}
                  {cancelling
                    ? "Cancelling"
                    : isCancelled
                      ? "Already Cancelled"
                      : "Cancel Trip"}
                </button>
              </div>
            </section>

            <section className="rounded-2xl border border-red-200 bg-red-50 p-5">
              <h3 className="text-sm font-semibold text-red-700 inline-flex items-center gap-2">
                <ShieldAlert size={14} /> Danger Zone
              </h3>
              <p className="text-xs text-red-700 mt-2">
                Delete is permanent and should be used only for incorrect
                records.
              </p>

              <button
                onClick={() => deleteModal.open()}
                disabled={deleting || approving || completing || cancelling}
                className="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-60"
              >
                <Trash2 size={14} /> {deleting ? "Deleting" : "Delete"}
              </button>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
                <h3 className="text-sm font-semibold text-[#0B1E3F] mb-4 inline-flex items-center gap-2">
                  <UserRound size={14} className="text-[#C9A24B]" /> User
                </h3>
                <p className="text-sm font-semibold text-[#1A202C]">
                  {trip.user?.name || `User #${trip.userId}`}
                </p>
                <p className="text-xs text-[#4A5568] mt-1">
                  {trip.user?.email || "-"}
                </p>
                <p className="text-xs text-[#4A5568] mt-1">
                  {trip.user?.mobileNumber || "-"}
                </p>
                {trip.user?.id && (
                  <Link
                    href={`/admin/users/${trip.user.id}`}
                    className="inline-flex mt-3 text-xs font-semibold text-[#0B1E3F] hover:text-[#C9A24B] transition-colors"
                  >
                    View User
                  </Link>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
                <h3 className="text-sm font-semibold text-[#0B1E3F] mb-4 inline-flex items-center gap-2">
                  <Repeat size={14} className="text-[#C9A24B]" /> Subscription
                </h3>
                <p className="text-sm font-semibold text-[#1A202C]">
                  #{trip.subscription?.id || trip.subscriptionId || "-"}
                </p>
                <p className="text-xs text-[#4A5568] mt-1 uppercase">
                  {trip.subscription?.status || "-"}
                </p>
                <p className="text-xs text-[#4A5568] mt-1">
                  Start: {formatDate(trip.subscription?.startDate)}
                </p>
                <p className="text-xs text-[#4A5568] mt-1">
                  End: {formatDate(trip.subscription?.endDate)}
                </p>
                {(trip.subscription?.id || trip.subscriptionId) && (
                  <Link
                    href={`/admin/subscriptions/${trip.subscription?.id || trip.subscriptionId}`}
                    className="inline-flex mt-3 text-xs font-semibold text-[#0B1E3F] hover:text-[#C9A24B] transition-colors"
                  >
                    View Subscription
                  </Link>
                )}
              </div>
            </section>

            <section className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
              <h3 className="text-sm font-semibold text-[#0B1E3F] mb-4 inline-flex items-center gap-2">
                <ConciergeBell size={14} className="text-[#C9A24B]" /> Services
              </h3>

              {Array.isArray(trip.services) && trip.services.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {trip.services.map((service) => (
                    <span
                      key={service.id}
                      className="inline-flex items-center rounded-full border border-[#CBD5E0] bg-[#FAF6EC] px-3 py-1.5 text-xs font-medium text-[#1A202C]"
                    >
                      #{service.id} {service.name || "Service"}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#718096]">No services linked.</p>
              )}
            </section>
          </div>
        </div>
      </div>

      <CreateTripModal
        open={editModal.isOpen}
        onClose={() => editModal.close()}
        trip={trip}
        onUpdated={async (updatedTrip) => {
          if (updatedTrip) {
            setTrip((prev) => ({ ...prev, ...updatedTrip }));
          }
          editModal.close();
          await fetchTrip({ silent: true });
        }}
      />

      <Modal
        open={approveModal.isOpen}
        onClose={() => {
          if (approving) return;
          approveModal.close();
          setApproveError(null);
        }}
        title="Approve Trip"
        description="Enter Assignment ID and confirm approval."
      >
        <div className="p-6 space-y-4">
          {approveError && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">
              {approveError}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#0B1E3F]">
              Assignment ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={approveAssignmentId}
              onChange={(e) => setApproveAssignmentId(e.target.value)}
              placeholder="e.g. WF-100"
              disabled={approving}
              className="w-full text-sm rounded-lg border border-[#CBD5E0] bg-[#FAF6EC] px-3 py-2.5 text-[#1A202C] placeholder:text-[#A0AEC0] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 disabled:opacity-60"
            />
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => {
                approveModal.close();
                setApproveError(null);
              }}
              disabled={approving}
              className="text-sm font-medium text-[#4A5568] border border-[#CBD5E0] bg-white rounded-lg px-4 py-2 hover:bg-[#FAF6EC] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleApproveConfirm}
              disabled={approving}
              className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-green-600 rounded-lg px-4 py-2 hover:bg-green-700 transition-colors disabled:opacity-60"
            >
              <CheckCircle2 size={14} />{" "}
              {approving ? "Approving..." : "Confirm"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={completeModal.isOpen}
        onClose={() => !completing && completeModal.close()}
        title="Mark Trip as Completed"
        description="This confirms the trip has been fully served."
      >
        <div className="p-6">
          <p className="text-[#4A5568] text-sm mb-6">
            Confirm marking trip <strong>#{trip?.id}</strong> as completed?
          </p>
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => completeModal.close()}
              disabled={completing}
              className="text-sm font-medium text-[#4A5568] border border-[#CBD5E0] bg-white rounded-lg px-4 py-2 hover:bg-[#FAF6EC] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleCompleteConfirm}
              disabled={completing}
              className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-[#0B1E3F] rounded-lg px-4 py-2 hover:bg-[#152d5a] transition-colors disabled:opacity-60"
            >
              <CheckCircle2 size={14} />{" "}
              {completing ? "Completing..." : "Confirm Complete"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={cancelModal.isOpen}
        onClose={() => {
          if (cancelling) return;
          cancelModal.close();
          setCancelError(null);
        }}
        title="Cancel Trip"
        description="Please provide a reason for cancellation."
      >
        <div className="p-6 space-y-4">
          {cancelError && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">
              {cancelError}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#0B1E3F]">
              Cancellation Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Add reason for cancelling this trip"
              rows={4}
              disabled={cancelling}
              className="w-full text-sm rounded-lg border border-[#CBD5E0] bg-[#FAF6EC] px-3 py-2.5 text-[#1A202C] placeholder:text-[#A0AEC0] outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 disabled:opacity-60"
            />
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => {
                cancelModal.close();
                setCancelError(null);
              }}
              disabled={cancelling}
              className="text-sm font-medium text-[#4A5568] border border-[#CBD5E0] bg-white rounded-lg px-4 py-2 hover:bg-[#FAF6EC] transition-colors disabled:opacity-50"
            >
              Keep Trip
            </button>
            <button
              onClick={handleCancelConfirm}
              disabled={cancelling}
              className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-red-600 rounded-lg px-4 py-2 hover:bg-red-700 transition-colors disabled:opacity-60"
            >
              <Ban size={14} />{" "}
              {cancelling ? "Cancelling..." : "Confirm Cancel"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={deleteModal.isOpen}
        onClose={() => !deleting && deleteModal.close()}
        title="Delete Trip"
        description="This action cannot be undone."
      >
        <div className="p-6">
          <p className="text-[#4A5568] text-sm mb-6">
            Are you sure you want to delete trip <strong>#{trip?.id}</strong>?
          </p>
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => deleteModal.close()}
              disabled={deleting}
              className="text-sm font-medium text-[#4A5568] border border-[#CBD5E0] bg-white rounded-lg px-4 py-2 hover:bg-[#FAF6EC] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="text-sm font-semibold text-white bg-red-600 rounded-lg px-4 py-2 hover:bg-red-700 transition-colors disabled:opacity-60"
            >
              {deleting ? "Deleting..." : "Delete Trip"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}