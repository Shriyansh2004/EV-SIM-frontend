"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { ChevronRight, Zap } from "lucide-react";
import type { ChargerStatus, VirtualCharger } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ConnectorDetail } from "@/components/chargers/ConnectorDetail";
import { useAppStore } from "@/store";
import { filterOcppMessagesByConnector } from "@/lib/ocppFilters";

interface ConnectorPanelProps {
  charger: VirtualCharger;
}

const CHARGING_STATUSES: ChargerStatus[] = ["Charging", "SuspendedEV", "SuspendedEVSE"];

function isConnectorCharging(
  status: ChargerStatus,
  connectorId: number,
  activeChargingConnectorId?: number
) {
  return activeChargingConnectorId === connectorId && CHARGING_STATUSES.includes(status);
}

function defaultConnector(charger: VirtualCharger): number {
  const plugged = Object.entries(charger.pluggedEvs ?? {}).find(([, evId]) => evId);
  if (plugged) return Number(plugged[0]);
  if (charger.currentSession?.connectorId) return charger.currentSession.connectorId;
  return 1;
}

export function ConnectorPanel({ charger }: ConnectorPanelProps) {
  const ocppMessages = useAppStore((s) => s.ocppMessages);
  const evs = useAppStore((s) => s.evs);
  const connectors = Array.from({ length: charger.connectorCount }, (_, i) => i + 1);

  const activeChargingConnectorId = charger.currentSession?.connectorId;
  const activeSessionId =
    charger.currentSession?.connectorId != null ? charger.currentSession.id : undefined;

  const [selectedId, setSelectedId] = useState(() => defaultConnector(charger));

  useEffect(() => {
    const chargingId = activeChargingConnectorId;
    if (chargingId && CHARGING_STATUSES.includes(
      charger.connectorStatuses?.[chargingId - 1] ?? charger.status
    )) {
      setSelectedId(chargingId);
    }
  }, [activeChargingConnectorId, charger.connectorStatuses, charger.status]);

  const selectedStatus =
    charger.connectorStatuses?.[selectedId - 1] || charger.status;
  const selectedEvId = charger.pluggedEvs?.[String(selectedId)] ?? undefined;
  const selectedEv = selectedEvId ? evs.find((e) => e.id === selectedEvId) : undefined;
  const selectedCharging = Boolean(
    selectedEvId &&
      isConnectorCharging(selectedStatus, selectedId, activeChargingConnectorId)
  );
  const selectedMessages = filterOcppMessagesByConnector(
    ocppMessages,
    charger.id,
    selectedId,
    activeChargingConnectorId
  );

  return (
    <div className="space-y-4">
      <div className="relative pl-4 border-l-2 border-border space-y-1">
        {connectors.map((connectorId, index) => {
          const status =
            charger.connectorStatuses?.[connectorId - 1] || charger.status;
          const evId = charger.pluggedEvs?.[String(connectorId)] ?? undefined;
          const isSelected = selectedId === connectorId;
          const isCharging = Boolean(
            evId && isConnectorCharging(status, connectorId, activeChargingConnectorId)
          );
          const session =
            charger.currentSession?.connectorId === connectorId
              ? charger.currentSession
              : undefined;
          const power = session?.currentPowerKw ?? 0;
          const isLast = index === connectors.length - 1;

          return (
            <div key={connectorId} className="relative">
              <span
                className={clsx(
                  "absolute -left-4 top-4 w-4 h-px bg-border",
                  isLast && connectors.length > 1 && "hidden"
                )}
                aria-hidden
              />
              <div
                role="button"
                tabIndex={0}
                onClick={() => setSelectedId(connectorId)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedId(connectorId);
                  }
                }}
                className={clsx(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-matlab border text-left transition-colors font-mono cursor-pointer",
                  isSelected
                    ? "border-matlab-blue bg-matlab-blue/5 shadow-card"
                    : "border-border bg-white hover:border-matlab-blue/40 hover:bg-surface-raised"
                )}
              >
                <ChevronRight
                  className={clsx(
                    "w-4 h-4 shrink-0 transition-transform",
                    isSelected ? "text-matlab-blue rotate-90" : "text-muted"
                  )}
                />
                <span className="text-sm font-semibold text-ink">C{connectorId}</span>
                <StatusBadge status={status} />
                {isCharging && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-matlab-blue">
                    <Zap className="w-3 h-3" />
                    {power.toFixed(1)} kW
                  </span>
                )}
                <span className="ml-auto text-xs text-muted truncate max-w-[140px]">
                  {evId ?? "No EV"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative pl-4 border-l-2 border-matlab-blue/40">
        <span className="absolute -left-[5px] top-6 w-2 h-2 rounded-full bg-matlab-blue" />
        <ConnectorDetail
          charger={charger}
          connectorId={selectedId}
          status={selectedStatus}
          evId={selectedEvId}
          ev={selectedEv}
          sessionId={activeChargingConnectorId === selectedId ? activeSessionId : undefined}
          isCharging={selectedCharging}
          connectorMessages={selectedMessages}
        />
      </div>
    </div>
  );
}
