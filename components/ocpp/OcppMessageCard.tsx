import clsx from "clsx";
import type { OcppMessage } from "@/types";

export function OcppMessageCard({ message }: { message: OcppMessage }) {
  const isCpToCsms = message.direction === "CP_TO_CSMS";
  const time = new Date(message.timestamp).toLocaleTimeString();

  return (
    <div
      className={clsx(
        "font-mono text-xs p-2 rounded border-l-2 animate-in fade-in",
        isCpToCsms
          ? "border-l-green-500 bg-green-500/5"
          : "border-l-cyan-500 bg-cyan-500/5"
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-muted">{time}</span>
        <span className={isCpToCsms ? "text-green-400" : "text-cyan-400"}>
          {isCpToCsms ? "CP → CSMS" : "CSMS → CP"}
        </span>
        <span className="text-white font-medium">{message.action}</span>
        <span className="text-muted">{message.messageType}</span>
      </div>
      <div className="text-muted truncate">
        {message.chargerId} · {JSON.stringify(message.payload).slice(0, 120)}
      </div>
    </div>
  );
}
