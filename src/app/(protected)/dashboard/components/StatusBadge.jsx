import { CheckCircle2, XCircle, Clock } from "lucide-react";

const STATUS_CONFIG = {
  SUCCESS: {
    label: "Active",
    icon: CheckCircle2,
    bg: "rgba(34,197,94,0.12)",
    color: "#22c55e",
  },
  PAID: {
    label: "Active",
    icon: CheckCircle2,
    bg: "rgba(34,197,94,0.12)",
    color: "#22c55e",
  },
  FAILED: {
    label: "Failed",
    icon: XCircle,
    bg: "rgba(239,68,68,0.12)",
    color: "#ef4444",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: XCircle,
    bg: "rgba(239,68,68,0.12)",
    color: "#ef4444",
  },
};

const FALLBACK = {
  label: "Pending",
  icon: Clock,
  bg: "rgba(234,179,8,0.12)",
  color: "#eab308",
};

export default function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status?.toUpperCase()] ?? FALLBACK;
  const Icon = cfg.icon;

  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider px-3 py-1.5 rounded-full uppercase"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      <Icon size={11} strokeWidth={2.5} />
      {cfg.label}
    </span>
  );
}
