import clsx from "clsx";
import type { EvStatus } from "@/types";
import { content } from "@/lib/content";

const STATUS_COLORS: Record<EvStatus, string> = {
  idle: "bg-muted/10 text-muted border-border",
  plugged: "bg-matlab-yellow/20 text-[#7a5c00] border-matlab-yellow/50",
  charging: "bg-matlab-blue/15 text-matlab-blue border-matlab-blue/40",
  full: "bg-matlab-green/15 text-matlab-green border-matlab-green/40",
  fault: "bg-matlab-red/15 text-matlab-red border-matlab-red/40",
};

const STATUS_DOT: Record<EvStatus, string> = {
  idle: "bg-muted",
  plugged: "bg-matlab-yellow",
  charging: "bg-matlab-blue",
  full: "bg-matlab-green",
  fault: "bg-matlab-red",
};

const STATUS_LABELS: Record<EvStatus, string> = content.status.ev as Record<EvStatus, string>;

export function EvStatusBadge({ status }: { status: EvStatus }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-matlab text-[10px] font-semibold border shrink-0 font-mono uppercase tracking-wide",
        STATUS_COLORS[status],
        status === "charging" && "animate-pulse-charge"
      )}
    >
      <span
        className={clsx(
          "w-1.5 h-1.5 rounded-full shrink-0",
          STATUS_DOT[status],
          status === "charging" && "animate-pulse-dot"
        )}
      />
      {STATUS_LABELS[status]}
    </span>
  );
}
