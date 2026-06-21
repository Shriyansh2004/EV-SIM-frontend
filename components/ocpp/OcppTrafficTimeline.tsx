import clsx from "clsx";
import type { OcppMessage } from "@/types";

interface OcppTrafficTimelineProps {
  messages: OcppMessage[];
  selectedId?: string | null;
  onSelect: (message: OcppMessage) => void;
  maxItems?: number;
}

export function OcppTrafficTimeline({
  messages,
  selectedId,
  onSelect,
  maxItems = 80,
}: OcppTrafficTimelineProps) {
  const recent = messages.slice(-maxItems);

  if (recent.length === 0) {
    return (
      <div className="rounded-matlab border border-dashed border-border bg-white/70 px-4 py-3 text-xs text-muted">
        Traffic timeline will appear once OCPP messages start flowing.
      </div>
    );
  }

  return (
    <div className="rounded-matlab border border-border bg-white px-3 py-2.5 shadow-inset">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
          Live traffic · last {recent.length}
        </p>
        <div className="flex items-center gap-3 text-[10px] text-muted">
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-matlab-green" />
            CP → CSMS
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-matlab-cyan" />
            CSMS → CP
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        {recent.map((message) => {
          const isCpToCsms = message.direction === "CP_TO_CSMS";
          const isSelected = message.id === selectedId;
          return (
            <button
              key={message.id}
              type="button"
              title={`${message.action} · ${new Date(message.timestamp).toLocaleTimeString()}`}
              onClick={() => onSelect(message)}
              className={clsx(
                "h-5 min-w-[5px] flex-1 rounded-sm transition-all duration-150",
                isCpToCsms ? "bg-matlab-green/70 hover:bg-matlab-green" : "bg-matlab-cyan/70 hover:bg-matlab-cyan",
                isSelected && "ring-2 ring-matlab-blue ring-offset-1 scale-y-125",
                message.messageType === "Error" && "bg-matlab-red/80 hover:bg-matlab-red"
              )}
            />
          );
        })}
      </div>
    </div>
  );
}
