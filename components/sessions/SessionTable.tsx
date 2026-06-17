"use client";

import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Session } from "@/types";

export function SessionTable({
  sessions,
  onSelect,
}: {
  sessions: Session[];
  onSelect?: (s: Session) => void;
}) {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-12 text-muted simulink-canvas">
        No charging sessions yet
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-border rounded-matlab shadow-card">
      <table className="matlab-table">
        <thead>
          <tr>
            <th>Session ID</th>
            <th>Charger</th>
            <th>Start</th>
            <th>End</th>
            <th>Energy</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s) => (
            <tr key={s.id} onClick={() => onSelect?.(s)}>
              <td className="font-mono text-xs">{s.id.slice(0, 8)}…</td>
              <td className="font-mono">{s.chargerId}</td>
              <td className="text-muted">
                {new Date(s.startTime).toLocaleString()}
              </td>
              <td className="text-muted">
                {s.endTime ? new Date(s.endTime).toLocaleString() : "—"}
              </td>
              <td className="font-mono tabular-nums">{s.energyKwh.toFixed(2)} kWh</td>
              <td>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-matlab font-mono font-semibold uppercase border ${
                    s.status === "active"
                      ? "bg-matlab-blue/15 text-matlab-blue border-matlab-blue/30"
                      : s.status === "completed"
                        ? "bg-matlab-green/15 text-matlab-green border-matlab-green/30"
                        : "bg-matlab-red/15 text-matlab-red border-matlab-red/30"
                  }`}
                >
                  {s.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
