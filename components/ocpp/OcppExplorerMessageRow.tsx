import clsx from "clsx";
import type { OcppMessage } from "@/types";

interface OcppExplorerMessageRowProps {
  message: OcppMessage;
  selected: boolean;
  index: number;
  isLatest?: boolean;
}

function formatRelativeTime(timestamp: string) {
  const deltaMs = Date.now() - new Date(timestamp).getTime();
  if (deltaMs < 5_000) return "just now";
  if (deltaMs < 60_000) return `${Math.floor(deltaMs / 1000)}s ago`;
  if (deltaMs < 3_600_000) return `${Math.floor(deltaMs / 60_000)}m ago`;
  return `${Math.floor(deltaMs / 3_600_000)}h ago`;
}

export function OcppExplorerMessageRow({
  message,
  selected,
  index,
  isLatest = false,
}: OcppExplorerMessageRowProps) {
  const isCpToCsms = message.direction === "CP_TO_CSMS";
  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div
      data-msg-id={message.id}
      className={clsx(
        "group relative cursor-pointer rounded-matlab border pl-3 pr-3 py-2.5 transition-all duration-150",
        selected
          ? "border-matlab-blue bg-matlab-blue/[0.07] shadow-card ring-1 ring-matlab-blue/25"
          : "border-transparent bg-white/80 hover:border-border hover:bg-white hover:shadow-sm",
        isLatest && !selected && "border-matlab-green/30 bg-matlab-green/[0.04]"
      )}
    >
      <div
        className={clsx(
          "absolute left-0 top-2 bottom-2 w-[3px] rounded-full transition-colors",
          isCpToCsms ? "bg-matlab-green" : "bg-matlab-cyan",
          selected && "bg-matlab-blue"
        )}
      />

      <div className="flex items-start gap-2">
        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-title-bar font-mono text-[10px] font-semibold text-muted">
          {index}
        </span>
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[10px] text-muted tabular-nums">{time}</span>
            <span className="font-mono text-[10px] text-muted/80">{formatRelativeTime(message.timestamp)}</span>
            {isLatest && (
              <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide bg-matlab-green/15 text-matlab-green">
                Latest
              </span>
            )}
            <span
              className={clsx(
                "inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                isCpToCsms
                  ? "bg-matlab-green/15 text-matlab-green"
                  : "bg-matlab-cyan/15 text-[#0088b8]"
              )}
            >
              {isCpToCsms ? "CP → CSMS" : "CSMS → CP"}
            </span>
            <span
              className={clsx(
                "inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium",
                message.messageType === "Error"
                  ? "bg-matlab-red/10 text-matlab-red"
                  : message.messageType === "Response"
                    ? "bg-matlab-purple/10 text-matlab-purple"
                    : "bg-title-bar text-muted"
              )}
            >
              {message.messageType}
            </span>
          </div>
          <p className="font-mono text-[13px] font-semibold text-ink truncate">{message.action}</p>
          <p className="mt-1 font-mono text-[11px] text-muted truncate">
            {message.chargerId}
            <span className="mx-1.5 text-border">·</span>
            {JSON.stringify(message.payload).slice(0, 96)}
            {JSON.stringify(message.payload).length > 96 ? "…" : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
