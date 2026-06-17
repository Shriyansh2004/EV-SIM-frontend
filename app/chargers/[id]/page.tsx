"use client";

import { useParams } from "next/navigation";
import { useAppStore } from "@/store";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ChargerStateDisplay } from "@/components/chargers/ChargerStateDisplay";
import { ChargerControls } from "@/components/chargers/ChargerControls";
import { OcppMessageLog } from "@/components/ocpp/OcppMessageLog";
import { SocGauge } from "@/components/charts/SocGauge";
import { PowerChart } from "@/components/charts/PowerChart";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ChargerDetailPage() {
  const params = useParams();
  const chargerId = params.id as string;
  const charger = useAppStore((s) => s.chargers.find((c) => c.id === chargerId));
  const ocppMessages = useAppStore((s) => s.ocppMessages);

  if (!charger) {
    return (
      <div className="text-center py-12">
        <p className="text-muted">Charger not found</p>
        <Link href="/chargers" className="text-matlab-blue text-sm mt-2 inline-block font-mono">
          ← Back to chargers
        </Link>
      </div>
    );
  }

  const session = charger.currentSession;
  const soc = session?.socPercent ?? 20;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/chargers" className="text-muted hover:text-ink matlab-btn p-1.5">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="page-title font-mono">{charger.id}</h1>
          <div className="flex items-center gap-3 mt-1">
            <StatusBadge status={charger.status} />
            <span className="text-muted text-sm font-mono">
              {charger.maxPowerKw} kW · {charger.connectorCount} connector(s)
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ChargerStateDisplay current={charger.status} />
          <div className="panel shadow-card">
            <div className="panel-header py-2">
              <h3 className="section-label">Scope: Live Metrics</h3>
            </div>
            <div className="panel-body">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center matlab-figure p-4">
                <div>
                  <p className="scope-readout">{(session?.currentPowerKw ?? 0).toFixed(1)}</p>
                  <p className="scope-readout-label mt-1">kW</p>
                </div>
                <div>
                  <p className="scope-readout text-matlab-orange">
                    {(session?.energyKwh ?? 0).toFixed(2)}
                  </p>
                  <p className="scope-readout-label mt-1">kWh</p>
                </div>
                <div>
                  <p className="scope-readout text-ink">400</p>
                  <p className="scope-readout-label mt-1">Voltage (V)</p>
                </div>
                <div>
                  <p className="scope-readout text-ink">
                    {session?.currentPowerKw
                      ? ((session.currentPowerKw * 1000) / 400).toFixed(1)
                      : "0"}
                  </p>
                  <p className="scope-readout-label mt-1">Current (A)</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="section-label mb-3">Controls</h3>
            <ChargerControls
              chargerId={charger.id}
              isConnected={charger.isConnected}
              sessionId={session?.id}
            />
          </div>
          <div>
            <h3 className="section-label mb-3">Command Window: OCPP Log</h3>
            <OcppMessageLog messages={ocppMessages} chargerId={chargerId} limit={20} />
          </div>
        </div>
        <div className="space-y-6">
          <SocGauge soc={soc} />
          <PowerChart chargers={[charger]} />
        </div>
      </div>
    </div>
  );
}
