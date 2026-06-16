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
        <Link href="/chargers" className="text-accent text-sm mt-2 inline-block">
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
        <Link href="/chargers" className="text-muted hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-white font-mono">{charger.id}</h1>
          <div className="flex items-center gap-3 mt-1">
            <StatusBadge status={charger.status} />
            <span className="text-muted text-sm">
              {charger.maxPowerKw} kW · {charger.connectorCount} connector(s)
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ChargerStateDisplay current={charger.status} />
          <div className="bg-surface border border-border rounded-xl p-6">
            <h3 className="text-sm text-muted mb-4">Live Metrics</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-semibold text-charging">
                  {(session?.currentPowerKw ?? 0).toFixed(1)}
                </p>
                <p className="text-xs text-muted">kW</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-accent">
                  {(session?.energyKwh ?? 0).toFixed(2)}
                </p>
                <p className="text-xs text-muted">kWh</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-white">400</p>
                <p className="text-xs text-muted">Voltage (V)</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-white">
                  {session?.currentPowerKw
                    ? ((session.currentPowerKw * 1000) / 400).toFixed(1)
                    : "0"}
                </p>
                <p className="text-xs text-muted">Current (A)</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm text-muted mb-3">Controls</h3>
            <ChargerControls
              chargerId={charger.id}
              isConnected={charger.isConnected}
              sessionId={session?.id}
            />
          </div>
          <div>
            <h3 className="text-sm text-muted mb-3">OCPP Message Log</h3>
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
