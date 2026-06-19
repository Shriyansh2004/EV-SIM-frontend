"use client";

import { useParams } from "next/navigation";
import { useAppStore } from "@/store";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ChargerStateDisplay } from "@/components/chargers/ChargerStateDisplay";
import { ChargerControls } from "@/components/chargers/ChargerControls";
import { ConnectorPanel } from "@/components/chargers/ConnectorPanel";
import { OcppMessageLog } from "@/components/ocpp/OcppMessageLog";
import { PowerChart } from "@/components/charts/PowerChart";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Plug, Wifi, Zap, Battery } from "lucide-react";
import clsx from "clsx";

export default function ChargerDetailPage() {
  const params = useParams();
  const chargerId = params.id as string;
  const charger = useAppStore((s) => s.chargers.find((c) => c.id === chargerId));
  const ocppMessages = useAppStore((s) => s.ocppMessages);

  if (!charger) {
    return (
      <div className="panel shadow-card p-12 text-center">
        <p className="text-muted">Charger not found</p>
        <Link
          href="/chargers"
          className="inline-flex items-center gap-1 text-matlab-blue text-sm mt-3 font-mono hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to chargers
        </Link>
      </div>
    );
  }

  const session = charger.currentSession;
  const power = session?.currentPowerKw ?? 0;
  const energy = session?.energyKwh ?? 0;
  const isCharging = charger.status === "Charging" && power > 0;
  const utilization =
    charger.maxPowerKw > 0 ? Math.min((power / charger.maxPowerKw) * 100, 100) : 0;
  const pluggedCount = Object.keys(charger.pluggedEvs ?? {}).length;

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <Link
          href="/chargers"
          className="text-muted hover:text-ink matlab-btn p-1.5 shrink-0 mt-0.5"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="page-title font-mono">{charger.id}</h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-1">
            <StatusBadge status={charger.status} />
            <span className="text-muted text-sm font-mono">
              {charger.maxPowerKw} kW · {charger.connectorCount} connector
              {charger.connectorCount !== 1 ? "s" : ""}
            </span>
            <span
              className={clsx(
                "text-sm font-mono",
                charger.isConnected ? "text-matlab-green" : "text-muted"
              )}
            >
              {charger.isConnected ? "● CSMS connected" : "○ Offline"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="panel p-4 shadow-card">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-3.5 h-3.5 text-matlab-blue" />
            <p className="scope-readout-label">Power draw</p>
          </div>
          <p
            className={clsx(
              "scope-readout text-xl",
              isCharging ? "text-matlab-blue" : "text-muted"
            )}
          >
            {isCharging ? power.toFixed(1) : "0.0"}
          </p>
          <p className="text-[11px] text-muted font-mono mt-1">
            {isCharging ? `${utilization.toFixed(0)}% of ${charger.maxPowerKw} kW` : "Idle"}
          </p>
        </div>

        <div className="panel p-4 shadow-card">
          <div className="flex items-center gap-2 mb-2">
            <Battery className="w-3.5 h-3.5 text-matlab-orange" />
            <p className="scope-readout-label">Energy</p>
          </div>
          <p className="scope-readout text-xl text-matlab-orange">{energy.toFixed(2)}</p>
          <p className="text-[11px] text-muted font-mono mt-1">kWh this session</p>
        </div>

        <div className="panel p-4 shadow-card">
          <div className="flex items-center gap-2 mb-2">
            <Wifi className="w-3.5 h-3.5 text-matlab-green" />
            <p className="scope-readout-label">CSMS link</p>
          </div>
          <p
            className={clsx(
              "text-xl font-mono font-semibold",
              charger.isConnected ? "text-matlab-green" : "text-muted"
            )}
          >
            {charger.isConnected ? "Online" : "Offline"}
          </p>
          <p className="text-[11px] text-muted font-mono mt-1">OCPP 2.0.1</p>
        </div>

        <div className="panel p-4 shadow-card">
          <div className="flex items-center gap-2 mb-2">
            <Plug className="w-3.5 h-3.5 text-matlab-purple" />
            <p className="scope-readout-label">Connectors</p>
          </div>
          <p className="scope-readout text-xl text-matlab-purple">
            {pluggedCount}/{charger.connectorCount}
          </p>
          <p className="text-[11px] text-muted font-mono mt-1">EVs plugged in</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ChargerStateDisplay current={charger.status} />
          <ConnectorPanel charger={charger} />

          <section className="panel shadow-card">
            <div className="panel-header py-2">
              <h3 className="section-label">Remote controls</h3>
            </div>
            <div className="panel-body space-y-3">
              <ChargerControls
                chargerId={charger.id}
                isConnected={charger.isConnected}
                sessionId={session?.id}
                connectorId={session?.connectorId ?? 1}
              />
              <p className="text-xs text-muted font-mono leading-relaxed">
                Plug an EV into a connector before remote start. Monitor SoC in the EV section.
              </p>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="panel shadow-card">
            <div className="panel-header py-2">
              <h3 className="section-label">Scope: live metrics</h3>
            </div>
            <div className="panel-body">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Voltage", value: "400", unit: "V" },
                  {
                    label: "Current",
                    value: power ? ((power * 1000) / 400).toFixed(1) : "0",
                    unit: "A",
                  },
                  { label: "SoC", value: session?.socPercent?.toFixed(0) ?? "—", unit: "%" },
                  { label: "Session", value: session?.id?.slice(0, 8) ?? "—", unit: "" },
                ].map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-matlab bg-title-bar border border-border-subtle px-3 py-2.5 shadow-inset"
                  >
                    <p className="scope-readout-label">{metric.label}</p>
                    <p className="font-mono text-lg font-semibold text-ink mt-0.5 tabular-nums">
                      {metric.value}
                      {metric.unit && (
                        <span className="text-xs text-muted font-normal ml-0.5">
                          {metric.unit}
                        </span>
                      )}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-[11px] text-muted mb-1.5 font-mono">
                  <span>Output utilization</span>
                  <span className="tabular-nums">
                    {isCharging ? `${utilization.toFixed(0)}%` : "idle"}
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
            </div>
          </section>

          <PowerChart chargers={[charger]} />

          {session?.evId && (
            <section className="panel shadow-card">
              <div className="panel-header py-2">
                <h3 className="section-label">Linked EV</h3>
              </div>
              <div className="panel-body">
                <Link
                  href={`/evs/${session.evId}`}
                  className="inline-flex items-center gap-1.5 font-mono text-matlab-blue hover:underline"
                >
                  {session.evId}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <p className="text-xs text-muted mt-2 font-mono leading-relaxed">
                  View battery SoC and charging details on the EV page.
                </p>
              </div>
            </section>
          )}
        </div>
      </div>

      <section className="panel shadow-card">
        <div className="panel-header">
          <div>
            <h2 className="text-sm font-semibold text-ink">OCPP message log</h2>
            <p className="text-xs text-muted mt-0.5 font-mono">Last 20 messages for this charger</p>
          </div>
        </div>
        <div className="panel-body pt-0">
          <OcppMessageLog messages={ocppMessages} chargerId={chargerId} limit={20} />
        </div>
      </section>
    </div>
  );
}
