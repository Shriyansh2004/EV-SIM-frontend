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
        className="matlab-btn-primary disabled:opacity-40"
      >
        Remote Start
      </button>
      <button
        disabled={!isConnected || !sessionId}
        onClick={() =>
          handle("sessions/stop", { charger_id: chargerId, session_id: sessionId })
        }
        className="matlab-btn-danger disabled:opacity-40"
      >
        Remote Stop
      </button>
      <button
        disabled={!isConnected}
        onClick={() =>
          handle("commands/reset", { charger_id: chargerId, reset_type: "Immediate" })
        }
        className="matlab-btn disabled:opacity-40"
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
        className="matlab-btn disabled:opacity-40"
      >
        Set Unavailable
      </button>
      <button
        disabled={!isConnected}
        onClick={() =>
          handle("commands/unlock", { charger_id: chargerId, connector_id: 1 })
        }
        className="matlab-btn disabled:opacity-40"
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
        className="matlab-btn-warning disabled:opacity-40"
      >
        Inject Fault
      </button>
    </div>
  );
}
