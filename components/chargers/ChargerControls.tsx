"use client";

import { apiPost } from "@/hooks/useInitialData";
import { API_BASE } from "@/types";

interface ChargerControlsProps {
  chargerId: string;
  isConnected: boolean;
  sessionId?: string;
  onAction?: () => void;
}

export function ChargerControls({
  chargerId,
  isConnected,
  sessionId,
  onAction,
}: ChargerControlsProps) {
  async function handle(action: string, body?: Record<string, unknown>) {
    try {
      await apiPost(`/api/${action}`, body);
      onAction?.();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Action failed");
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        disabled={!isConnected}
        onClick={() =>
          handle("sessions/start", {
            charger_id: chargerId,
            connector_id: 1,
            id_token: "DEMO-TOKEN",
          })
        }
        className="px-4 py-2 bg-accent/20 text-accent border border-accent/40 rounded-lg text-sm hover:bg-accent/30 disabled:opacity-40"
      >
        Remote Start
      </button>
      <button
        disabled={!isConnected || !sessionId}
        onClick={() =>
          handle("sessions/stop", { charger_id: chargerId, session_id: sessionId })
        }
        className="px-4 py-2 bg-error/20 text-error border border-error/40 rounded-lg text-sm hover:bg-error/30 disabled:opacity-40"
      >
        Remote Stop
      </button>
      <button
        disabled={!isConnected}
        onClick={() =>
          handle("commands/reset", { charger_id: chargerId, reset_type: "Immediate" })
        }
        className="px-4 py-2 bg-surface text-muted border border-border rounded-lg text-sm hover:border-muted"
      >
        Reset
      </button>
      <button
        disabled={!isConnected}
        onClick={() =>
          handle("commands/availability", {
            charger_id: chargerId,
            connector_id: 0,
            operational_status: "Inoperative",
          })
        }
        className="px-4 py-2 bg-surface text-muted border border-border rounded-lg text-sm hover:border-muted"
      >
        Set Unavailable
      </button>
      <button
        disabled={!isConnected}
        onClick={() =>
          handle("commands/unlock", { charger_id: chargerId, connector_id: 1 })
        }
        className="px-4 py-2 bg-surface text-muted border border-border rounded-lg text-sm hover:border-muted"
      >
        Unlock Connector
      </button>
      <button
        disabled={!isConnected}
        onClick={() =>
          fetch(`${API_BASE}/api/chargers/${chargerId}/fault?fault_type=connector_error`, {
            method: "POST",
          })
        }
        className="px-4 py-2 bg-warning/20 text-warning border border-warning/40 rounded-lg text-sm hover:bg-warning/30 disabled:opacity-40"
      >
        Inject Fault
      </button>
    </div>
  );
}
