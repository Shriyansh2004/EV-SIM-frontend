"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { ChevronDown, GitBranch } from "lucide-react";

const STEPS = [
  { label: "BootNotification", action: "BootNotification", side: "cp" as const },
  { label: "BootNotification Response", action: "BootNotification", side: "csms" as const },
  { label: "StatusNotification", action: "StatusNotification", side: "cp" as const },
  { label: "Heartbeat", action: "Heartbeat", side: "cp" as const },
  { label: "Authorize", action: "Authorize", side: "cp" as const },
  { label: "TransactionEvent (Started)", action: "TransactionEvent", side: "cp" as const },
  { label: "MeterValues / Updated", action: "MeterValues", side: "cp" as const },
  { label: "TransactionEvent (Ended)", action: "TransactionEvent", side: "cp" as const },
];

interface SequenceDiagramProps {
  liveActions?: string[];
}

export function SequenceDiagram({ liveActions = [] }: SequenceDiagramProps) {
  const [expanded, setExpanded] = useState(false);
  const liveSet = useMemo(() => new Set(liveActions), [liveActions]);
  const matchedCount = STEPS.filter((step) => liveSet.has(step.action)).length;

  return (
    <section className="panel shadow-card overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-raised/60"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-matlab border border-border bg-white shadow-matlab-btn">
            <GitBranch className="h-4 w-4 text-matlab-blue" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink">OCPP 2.0.1 Charging Sequence</p>
            <p className="text-xs text-muted truncate">
              Reference flow · {matchedCount}/{STEPS.length} steps seen in current traffic
            </p>
          </div>
        </div>
        <ChevronDown
          className={clsx(
            "h-4 w-4 shrink-0 text-muted transition-transform duration-200",
            expanded && "rotate-180"
          )}
        />
      </button>

      {expanded && (
        <div className="border-t border-border simulink-canvas overflow-x-auto p-5 min-w-0">
          <div className="flex items-start gap-8 min-w-[500px]">
            <div className="text-center">
              <div className="simulink-block text-matlab-green border-matlab-green w-24 text-center">
                Charge Point
              </div>
            </div>
            <div className="flex-1 space-y-3">
              {STEPS.map((step, i) => {
                const isLive = liveSet.has(step.action);
                return (
                  <div key={i} className="flex items-center gap-2">
                    <div
                      className={clsx(
                        "h-px flex-1",
                        step.side === "cp" ? "bg-matlab-green" : "bg-matlab-cyan",
                        !isLive && "opacity-30"
                      )}
                    />
                    <span
                      className={clsx(
                        "whitespace-nowrap px-2 py-1 text-[10px] font-mono simulink-block transition-all",
                        isLive
                          ? step.side === "cp"
                            ? "simulink-block-active text-matlab-green border-matlab-green"
                            : "border-matlab-cyan text-[#0088b8] bg-matlab-cyan/10 ring-1 ring-matlab-cyan/30"
                          : "text-ink/70"
                      )}
                    >
                      {step.label}
                    </span>
                    <div
                      className={clsx(
                        "h-px flex-1",
                        step.side === "cp" ? "bg-matlab-green/30" : "bg-matlab-cyan/30",
                        !isLive && "opacity-20"
                      )}
                    />
                  </div>
                );
              })}
            </div>
            <div className="text-center">
              <div className="simulink-block text-matlab-cyan border-matlab-cyan w-24 text-center">
                CSMS
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
