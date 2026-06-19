"use client";

import type { VirtualCharger } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface ConnectorPanelProps {
  charger: VirtualCharger;
}

export function ConnectorPanel({ charger }: ConnectorPanelProps) {
  const connectors = Array.from({ length: charger.connectorCount }, (_, i) => i + 1);

  return (
    <div className="panel shadow-card">
      <div className="panel-header py-2">
        <h3 className="section-label">Connectors</h3>
      </div>
      <div className="panel-body space-y-2">
        {connectors.map((connectorId) => {
          const status =
            charger.connectorStatuses?.[connectorId - 1] || charger.status;
          const evId = charger.pluggedEvs?.[String(connectorId)];

          return (
            <div
              key={connectorId}
              className="flex items-center justify-between p-3 border border-border rounded-matlab bg-surface-raised"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-semibold text-ink">
                  C{connectorId}
                </span>
                <StatusBadge status={status} />
              </div>
              <div className="text-right">
                {evId ? (
                  <span className="text-xs font-mono text-matlab-blue">{evId}</span>
                ) : (
                  <span className="text-xs font-mono text-muted">No EV</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
