import clsx from "clsx";
import type { ChargerStatus } from "@/types";

const STATUS_COLORS: Record<ChargerStatus, string> = {
  Available: "bg-matlab-green/15 text-matlab-green border-matlab-green/40",
  Preparing: "bg-matlab-yellow/20 text-[#7a5c00] border-matlab-yellow/50",
  Charging: "bg-matlab-blue/15 text-matlab-blue border-matlab-blue/40",
  SuspendedEV: "bg-matlab-yellow/20 text-[#7a5c00] border-matlab-yellow/50",
  SuspendedEVSE: "bg-matlab-yellow/20 text-[#7a5c00] border-matlab-yellow/50",
  Finishing: "bg-matlab-purple/15 text-matlab-purple border-matlab-purple/40",
  Reserved: "bg-muted/10 text-muted border-border",
  Unavailable: "bg-muted/10 text-muted border-border",
  Faulted: "bg-matlab-red/15 text-matlab-red border-matlab-red/40",
};

export function StatusBadge({ status }: { status: ChargerStatus }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2 py-0.5 rounded-matlab text-[10px] font-semibold border shrink-0 font-mono uppercase tracking-wide",
        STATUS_COLORS[status] || STATUS_COLORS.Unavailable,
        status === "Charging" && "animate-pulse-charge"
      )}
    >
      {status}
    </span>
  );
}
