import clsx from "clsx";
import type { ChargerStatus } from "@/types";

const STATUS_COLORS: Record<ChargerStatus, string> = {
  Available: "bg-accent/10 text-accent border-accent/25",
  Preparing: "bg-warning/10 text-warning border-warning/25",
  Charging: "bg-charging/10 text-charging border-charging/25",
  SuspendedEV: "bg-warning/10 text-warning border-warning/25",
  SuspendedEVSE: "bg-warning/10 text-warning border-warning/25",
  Finishing: "bg-finishing/10 text-finishing border-finishing/25",
  Reserved: "bg-muted/10 text-muted border-border",
  Unavailable: "bg-muted/10 text-muted border-border",
  Faulted: "bg-error/10 text-error border-error/25",
};

export function StatusBadge({ status }: { status: ChargerStatus }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border shrink-0",
        STATUS_COLORS[status] || STATUS_COLORS.Unavailable,
        status === "Charging" && "animate-pulse-charge"
      )}
    >
      {status}
    </span>
  );
}
