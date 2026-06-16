import clsx from "clsx";
import type { ChargerStatus } from "@/types";

const STATUS_COLORS: Record<ChargerStatus, string> = {
  Available: "bg-accent/20 text-accent border-accent/40",
  Preparing: "bg-warning/20 text-warning border-warning/40",
  Charging: "bg-charging/20 text-charging border-charging/40 animate-pulse-charge",
  SuspendedEV: "bg-warning/20 text-warning border-warning/40",
  SuspendedEVSE: "bg-warning/20 text-warning border-warning/40",
  Finishing: "bg-finishing/20 text-finishing border-finishing/40",
  Reserved: "bg-muted/20 text-muted border-muted/40",
  Unavailable: "bg-muted/20 text-muted border-muted/40",
  Faulted: "bg-error/20 text-error border-error/40",
};

export function StatusBadge({ status }: { status: ChargerStatus }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        STATUS_COLORS[status] || STATUS_COLORS.Unavailable
      )}
    >
      {status}
    </span>
  );
}
