"use client";

import Link from "next/link";
import { useAppStore } from "@/store";
import { MetricCard } from "@/components/ui/MetricCard";
import { ChargerGrid } from "@/components/chargers/ChargerGrid";
import { OcppMessageLog } from "@/components/ocpp/OcppMessageLog";
import { PowerChart } from "@/components/charts/PowerChart";
import { Plug, Activity, Zap, Wifi, Car, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const chargers = useAppStore((s) => s.chargers);
  const evs = useAppStore((s) => s.evs);
  const sessions = useAppStore((s) => s.sessions);
  const ocppMessages = useAppStore((s) => s.ocppMessages);

  const activeSessions = sessions.filter((s) => s.status === "active").length;
  const totalEnergy = sessions.reduce((sum, s) => sum + s.energyKwh, 0);
  const connected = chargers.filter((c) => c.isConnected).length;
  const chargingEvs = evs.filter((e) => e.status === "charging").length;

  return (
    <div className="space-y-7">
      <header>
        <h1 className="page-title">Dashboard</h1>
        <p className="page-desc">
          Live overview of virtual chargers and OCPP traffic
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <MetricCard label="Total Chargers" value={chargers.length} icon={Plug} />
        <MetricCard label="Electric Vehicles" value={evs.length} icon={Car} accent="text-matlab-purple" />
        <MetricCard
          label="Active Sessions"
          value={activeSessions}
          icon={Activity}
          accent="text-matlab-blue"
        />
        <MetricCard label="Total Energy" value={`${totalEnergy.toFixed(1)} kWh`} icon={Zap} />
        <MetricCard label="Connected" value={connected} icon={Wifi} accent="text-matlab-green" />
      </div>

      {chargingEvs > 0 && (
        <div className="panel p-3 shadow-card border-l-4 border-matlab-blue">
          <p className="text-sm font-mono text-ink">
            <span className="text-matlab-blue font-semibold">{chargingEvs}</span> EV
            {chargingEvs !== 1 ? "s" : ""} currently charging —{" "}
            <Link href="/evs" className="text-matlab-blue hover:underline">
              monitor SoC in EV section
            </Link>
          </p>
        </div>
      )}

      <section className="panel shadow-card">
        <div className="panel-header">
          <div>
            <h2 className="text-sm font-semibold text-ink">Charger grid</h2>
            <p className="text-xs text-muted mt-0.5">
              {chargers.length === 0
                ? "No chargers registered"
                : `${chargers.length} charger${chargers.length !== 1 ? "s" : ""} · ${connected} online`}
            </p>
          </div>
          <Link
            href="/chargers"
            className="inline-flex items-center gap-1 text-xs text-muted hover:text-matlab-blue transition-colors font-mono"
          >
            Manage
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="panel-body">
          <ChargerGrid chargers={chargers} />
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <section className="panel shadow-card flex flex-col min-h-[360px]">
          <div className="panel-header">
            <div>
              <h2 className="text-sm font-semibold text-ink">Recent OCPP</h2>
              <p className="text-xs text-muted mt-0.5">Last 10 messages</p>
            </div>
            <Link
              href="/ocpp-explorer"
              className="inline-flex items-center gap-1 text-xs text-muted hover:text-matlab-blue transition-colors font-mono"
            >
              Explorer
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="panel-body pt-0 flex-1">
            <OcppMessageLog messages={ocppMessages} limit={10} />
          </div>
        </section>

        <section className="panel shadow-card">
          <div className="panel-header">
            <div>
              <h2 className="text-sm font-semibold text-ink">Power draw</h2>
              <p className="text-xs text-muted mt-0.5">Active sessions only</p>
            </div>
          </div>
          <div className="panel-body pt-0">
            <PowerChart chargers={chargers} embedded />
          </div>
        </section>
      </div>
    </div>
  );
}
