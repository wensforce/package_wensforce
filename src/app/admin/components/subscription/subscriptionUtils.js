import { Ban, CheckCircle2, Clock3, XCircle } from "lucide-react";

export function formatDate(iso) {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatMoney(value) {
  return `Rs ${Number(value || 0).toLocaleString("en-IN")}`;
}

export function getDaysLeftMeta(endDate) {
  if (!endDate) {
    return {
      text: "-",
      className: "text-[#A0AEC0]",
      title: "No end date",
    };
  }

  const now = new Date();
  const end = new Date(endDate);
  if (Number.isNaN(end.getTime())) {
    return {
      text: "Invalid",
      className: "text-red-600",
      title: "Invalid end date",
    };
  }

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysLeft = Math.ceil((end.getTime() - now.getTime()) / msPerDay);

  if (daysLeft < 0) {
    return {
      text: `${Math.abs(daysLeft)} day(s) ago`,
      className: "text-red-600",
      title: `Expired on ${end.toLocaleDateString("en-IN")}`,
    };
  }

  if (daysLeft <= 3) {
    return {
      text: `${daysLeft} day(s)`,
      className: "text-amber-700 font-semibold",
      title: `Ends on ${end.toLocaleDateString("en-IN")}`,
    };
  }

  return {
    text: `${daysLeft} day(s)`,
    className: "text-[#1A202C]",
    title: `Ends on ${end.toLocaleDateString("en-IN")}`,
  };
}

export function getStatusUI(status) {
  const s = String(status || "pending").toUpperCase();

  if (s === "ACTIVE") {
    return {
      className: "bg-green-100 text-green-700",
      icon: <CheckCircle2 size={12} />,
      label: s,
    };
  }

  if (s === "EXPIRED") {
    return {
      className: "bg-red-100 text-red-700",
      icon: <XCircle size={12} />,
      label: s,
    };
  }

  if (s === "CANCELLED") {
    return {
      className: "bg-gray-200 text-gray-700",
      icon: <Ban size={12} />,
      label: s,
    };
  }

  return {
    className: "bg-amber-100 text-amber-700",
    icon: <Clock3 size={12} />,
    label: s,
  };
}
