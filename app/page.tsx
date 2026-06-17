"use client";

import Link from "next/link";
import { useAppStore } from "@/store";
import { MetricCard } from "@/components/ui/MetricCard";
import { ChargerGrid } from "@/components/chargers/ChargerGrid";
import { OcppMessageLog } from "@/components/ocpp/OcppMessageLog";
import { PowerChart } from "@/components/charts/PowerChart";
import { Plug, Activity, Zap, Wifi, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const chargers = useAppStore((s) => s.chargers);
  const sessions = useAppStore((s) => s.sessions);
  const ocppMessages = useAppStore((s) => s.ocppMessages);

  const activeSessions = sessions.filter((s) => s.status === "active").length;
  const totalEnergy = sessions.reduce((sum, s) => sum + s.energyKwh, 0);
  const connected = chargers.filter((c) => c.isConnected).length;

  return (
    <div className="space-y-7">
      <header>
        <h1 className="page-title">Dashboard</h1>
        <p className="page-desc">
          Live overview of virtual chargers and OCPP traffic
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard label="Total Chargers" value={chargers.length} icon={Plug} />
        <MetricCard
          label="Active Sessions"
          value={activeSessions}
          icon={Activity}
          accent="text-charging"
        />
        <MetricCard label="Total Energy" value={`${totalEnergy.toFixed(1)} kWh`} icon={Zap} />
        <MetricCard label="Connected" value={connected} icon={Wifi} accent="text-accent" />
      </div>

      <section className="panel shadow-card">
        <div className="panel-header">
          <div>
            <h2 className="text-sm font-medium text-white">Charger grid</h2>
            <p className="text-xs text-muted mt-0.5">
              {chargers.length === 0
                ? "No chargers registered"
                : `${chargers.length} charger${chargers.length !== 1 ? "s" : ""} · ${connected} online`}
            </p>
          </div>
          <Link
            href="/chargers"
            className="inline-flex items-center gap-1 text-xs text-muted hover:text-accent transition-colors"
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
              <h2 className="text-sm font-medium text-white">Recent OCPP</h2>
              <p className="text-xs text-muted mt-0.5">Last 10 messages</p>
            </div>
            <Link
              href="/ocpp-explorer"
              className="inline-flex items-center gap-1 text-xs text-muted hover:text-accent transition-colors"
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
              <h2 className="text-sm font-medium text-white">Power draw</h2>
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
