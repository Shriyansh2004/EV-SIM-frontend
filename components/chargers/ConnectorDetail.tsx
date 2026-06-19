"use client";

import Link from "next/link";
import clsx from "clsx";
import { ArrowRight, Battery, Zap } from "lucide-react";
import type { ChargerStatus, VirtualCharger } from "@/types";
import { ChargerControls } from "@/components/chargers/ChargerControls";
import { ChargerStateDisplay } from "@/components/chargers/ChargerStateDisplay";
import { ConnectorStatusLog } from "@/components/chargers/ConnectorStatusLog";
import { PowerChart } from "@/components/charts/PowerChart";
import type { VirtualEv } from "@/types";
import type { OcppMessage } from "@/types";

interface ConnectorDetailProps {
  charger: VirtualCharger;
  connectorId: number;
  status: ChargerStatus;
  evId?: string;
  ev?: VirtualEv;
  sessionId?: string;
  isCharging: boolean;
  connectorMessages: OcppMessage[];
}

export function ConnectorDetail({
  charger,
  connectorId,
  status,
  evId,
  ev,
  sessionId,
  isCharging,
  connectorMessages,
}: ConnectorDetailProps) {
  const session =
    charger.currentSession?.connectorId === connectorId ? charger.currentSession : undefined;
  const power = session?.currentPowerKw ?? ev?.currentPowerKw ?? 0;
  const energy = session?.energyKwh ?? ev?.energyChargedKwh ?? 0;
  const utilization =
    charger.maxPowerKw > 0 ? Math.min((power / charger.maxPowerKw) * 100, 100) : 0;

  if (!evId) {
    return (
      <div className="panel shadow-card border-l-[3px] border-l-muted">
        <div className="panel-header py-2">
          <h3 className="text-sm font-semibold font-mono text-ink">C{connectorId}</h3>
          <span className="text-xs text-muted font-mono">No EV plugged in</span>
        </div>
        <div className="panel-body">
          <p className="text-sm text-muted font-mono">
            Plug an EV into this connector from the EV page to start monitoring and charging.
          </p>
          <div className="mt-4">
            <p className="section-label mb-2">Connector state</p>
            <ChargerStateDisplay current={status} embedded />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="panel shadow-card border-l-[3px] border-l-matlab-blue space-y-0">
      <div className="panel-header py-2">
        <div>
          <h3 className="text-sm font-semibold font-mono text-ink">C{connectorId}</h3>
          <p className="text-xs text-muted font-mono mt-0.5">
            {isCharging ? "Active session" : "EV plugged in"}
          </p>
        </div>
        <Link
          href={`/evs/${evId}`}
          className="inline-flex items-center gap-1 text-xs font-mono text-matlab-blue hover:underline"
        >
          {evId}
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="panel-body space-y-5">
        {ev && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="rounded-matlab bg-title-bar border border-border-subtle px-3 py-2.5 shadow-inset">
              <div className="flex items-center gap-1.5 mb-1">
                <Battery className="w-3 h-3 text-matlab-orange" />
                <p className="scope-readout-label">SoC</p>
              </div>
              <p className="font-mono text-lg font-semibold text-ink tabular-nums">
                {(ev.socPercent ?? 0).toFixed(0)}%
              </p>
            </div>
            <div className="rounded-matlab bg-title-bar border border-border-subtle px-3 py-2.5 shadow-inset">
              <p className="scope-readout-label">Energy</p>
              <p className="font-mono text-lg font-semibold text-matlab-orange mt-1 tabular-nums">
                {energy.toFixed(2)} kWh
              </p>
            </div>
            <div className="rounded-matlab bg-title-bar border border-border-subtle px-3 py-2.5 shadow-inset">
              <p className="scope-readout-label">Voltage</p>
              <p className="font-mono text-lg font-semibold text-ink mt-1 tabular-nums">
                {ev.voltageV || 400} V
              </p>
            </div>
            <div className="rounded-matlab bg-title-bar border border-border-subtle px-3 py-2.5 shadow-inset">
              <div className="flex items-center gap-1.5 mb-1">
                <Zap className="w-3 h-3 text-matlab-blue" />
                <p className="scope-readout-label">Current</p>
              </div>
              <p className="font-mono text-lg font-semibold text-ink tabular-nums">
                {(ev.currentA ?? 0).toFixed(1)} A
              </p>
            </div>
          </div>
        )}

        <div>
          <p className="section-label mb-2">Output utilization</p>
          <div className="flex items-center justify-between text-[11px] text-muted mb-1.5 font-mono">
            <span>{isCharging ? `${power.toFixed(1)} kW` : "idle"}</span>
            <span className="tabular-nums">
              {isCharging ? `${utilization.toFixed(0)}%` : "0%"}
            </span>
          </div>
          <div className="h-2 rounded-matlab bg-title-bar overflow-hidden border border-border shadow-inset">
            <div
              className={clsx(
                "h-full rounded-matlab transition-all duration-500",
                isCharging ? "bg-matlab-blue" : "bg-border w-0"
              )}
              style={{ width: isCharging ? `${utilization}%` : "0%" }}
            />
          </div>
        </div>

        <div>
          <p className="section-label mb-2">Connector state</p>
          <ChargerStateDisplay current={status} embedded />
        </div>

        {isCharging && (
          <div>
            <p className="section-label mb-2">Status log</p>
            <ConnectorStatusLog messages={connectorMessages} />
          </div>
        )}

        <div>
          <p className="section-label mb-2">Power draw</p>
          <PowerChart chargers={[charger]} embedded />
        </div>

        <div>
          <p className="section-label mb-2">Remote controls</p>
          <ChargerControls
            chargerId={charger.id}
            isConnected={charger.isConnected}
            sessionId={sessionId}
            connectorId={connectorId}
          />
          <p className="text-xs text-muted mt-2 font-mono leading-relaxed">
            {isCharging
              ? "Controls apply to this connector's active session."
              : "Start charging on this connector after the EV is plugged in."}
          </p>
        </div>
      </div>
    </div>
  );
}
