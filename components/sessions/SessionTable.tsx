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
      <div className="text-center py-12 text-muted border border-dashed border-border rounded-xl">
        No charging sessions yet
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-border rounded-xl">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-surface text-muted text-left">
            <th className="px-4 py-3 font-medium">Session ID</th>
            <th className="px-4 py-3 font-medium">Charger</th>
            <th className="px-4 py-3 font-medium">Start</th>
            <th className="px-4 py-3 font-medium">End</th>
            <th className="px-4 py-3 font-medium">Energy</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s) => (
            <tr
              key={s.id}
              onClick={() => onSelect?.(s)}
              className="border-t border-border hover:bg-surface/50 cursor-pointer"
            >
              <td className="px-4 py-3 font-mono text-xs">{s.id.slice(0, 8)}…</td>
              <td className="px-4 py-3 font-mono">{s.chargerId}</td>
              <td className="px-4 py-3 text-muted">
                {new Date(s.startTime).toLocaleString()}
              </td>
              <td className="px-4 py-3 text-muted">
                {s.endTime ? new Date(s.endTime).toLocaleString() : "—"}
              </td>
              <td className="px-4 py-3">{s.energyKwh.toFixed(2)} kWh</td>
              <td className="px-4 py-3">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    s.status === "active"
                      ? "bg-charging/20 text-charging"
                      : s.status === "completed"
                        ? "bg-accent/20 text-accent"
                        : "bg-error/20 text-error"
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
