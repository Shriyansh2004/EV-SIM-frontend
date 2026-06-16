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

const TRANSITIONS: [ChargerStatus, ChargerStatus][] = [
  ["Available", "Preparing"],
  ["Preparing", "Charging"],
  ["Charging", "Finishing"],
  ["Finishing", "Available"],
  ["Available", "Reserved"],
  ["Reserved", "Preparing"],
  ["Available", "Unavailable"],
  ["Available", "Faulted"],
  ["Charging", "SuspendedEV"],
  ["SuspendedEV", "Charging"],
];

export function ChargerStateDisplay({ current }: { current: ChargerStatus }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <h3 className="text-sm text-muted mb-4">OCPP State Machine</h3>
      <div className="flex flex-wrap gap-2">
        {STATES.map((state) => (
          <div
            key={state}
            className={clsx(
              "px-3 py-2 rounded-lg text-xs font-mono border transition-all",
              state === current
                ? "bg-accent/20 border-accent text-accent scale-105"
                : "bg-background border-border text-muted"
            )}
          >
            {state}
          </div>
        ))}
      </div>
      <p className="text-xs text-muted mt-4">
        Current state: <span className="text-accent font-mono">{current}</span>
      </p>
    </div>
  );
}
