import type { ChargerStatus } from "@/types";
import clsx from "clsx";

const STATES: ChargerStatus[] = [
  "Available",
  "Preparing",
  "Charging",
  "SuspendedEV",
  "Finishing",
  "Reserved",
  "Unavailable",
  "Faulted",
];

export function ChargerStateDisplay({ current }: { current: ChargerStatus }) {
  return (
    <div className="panel shadow-card">
      <div className="panel-header py-2">
        <h3 className="section-label">Simulink: OCPP State Machine</h3>
      </div>
      <div className="panel-body simulink-canvas p-4">
        <div className="flex flex-wrap gap-2">
          {STATES.map((state) => (
            <div
              key={state}
              className={clsx(
                "simulink-block transition-all",
                state === current && "simulink-block-active scale-105"
              )}
            >
              {state}
            </div>
          ))}
        </div>
        <p className="text-xs text-muted mt-4 font-mono">
          Current state: <span className="text-matlab-blue font-semibold">{current}</span>
        </p>
      </div>
    </div>
  );
}
