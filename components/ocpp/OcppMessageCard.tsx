import clsx from "clsx";
import type { OcppMessage } from "@/types";

export function OcppMessageCard({ message }: { message: OcppMessage }) {
  const isCpToCsms = message.direction === "CP_TO_CSMS";
  const time = new Date(message.timestamp).toLocaleTimeString();

  return (
    <div
      className={clsx(
        "font-mono text-[11px] px-2 py-1 rounded-matlab border-l-[3px]",
        isCpToCsms
          ? "border-l-matlab-green bg-matlab-green/5"
          : "border-l-matlab-cyan bg-matlab-cyan/5"
      )}
    >
      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
        <span className="text-muted">{time}</span>
        <span className={isCpToCsms ? "text-matlab-green font-semibold" : "text-matlab-cyan font-semibold"}>
          {isCpToCsms ? "CP → CSMS" : "CSMS → CP"}
        </span>
        <span className="text-ink font-semibold">{message.action}</span>
        <span className="text-muted">{message.messageType}</span>
      </div>
      <div className="text-muted truncate">
        {message.chargerId} · {JSON.stringify(message.payload).slice(0, 120)}
      </div>
    </div>
  );
}
