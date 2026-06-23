"use client";

import Link from "next/link";
import { useAppStore } from "@/store";
import { MetricCard } from "@/components/ui/MetricCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { PanelLink } from "@/components/ui/PanelLink";
import { ChargerGrid } from "@/components/chargers/ChargerGrid";
import { OcppMessageLog } from "@/components/ocpp/OcppMessageLog";
import { PowerChart } from "@/components/charts/PowerChart";
import { content } from "@/lib/content";
import { Plug, Activity, Zap, Wifi, Car, BatteryCharging } from "lucide-react";

export default function DashboardPage() {
  const page = content.appPages.dashboard;
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
      <PageHeader
        title={page.title}
        description={page.description}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <MetricCard label={page.metrics.totalChargers} value={chargers.length} icon={Plug} />
        <MetricCard label={page.metrics.electricVehicles} value={evs.length} icon={Car} accent="text-matlab-purple" />
        <MetricCard
          label={page.metrics.activeSessions}
          value={activeSessions}
          icon={Activity}
          accent="text-matlab-blue"
        />
        <MetricCard label={page.metrics.totalEnergy} value={`${totalEnergy.toFixed(1)} kWh`} icon={Zap} />
        <MetricCard label={page.metrics.connected} value={connected} icon={Wifi} accent="text-matlab-green" />
      </div>

      {chargingEvs > 0 && (
        <div className="alert-banner-info">
          <BatteryCharging className="w-4 h-4 text-matlab-blue shrink-0 mt-0.5" />
          <p className="text-sm font-mono text-ink leading-relaxed">
            <span className="text-matlab-blue font-semibold">{chargingEvs}</span> EV
            {chargingEvs !== 1 ? "s" : ""} {page.chargingAlert.prefix}{" "}
            <Link href={page.chargingAlert.linkHref} className="text-matlab-blue hover:underline underline-offset-2">
              {page.chargingAlert.linkText}
            </Link>
          </p>
        </div>
      )}

      <section className="panel shadow-card">
        <div className="panel-header">
          <div>
            <h2 className="text-sm font-semibold text-ink">{page.panels.chargerGrid.title}</h2>
            <p className="text-xs text-muted mt-0.5">
              {chargers.length === 0
                ? page.panels.chargerGrid.emptySubtext
                : `${chargers.length} charger${chargers.length !== 1 ? "s" : ""} · ${connected} online`}
            </p>
          </div>
          <PanelLink href="/chargers" label={page.panels.chargerGrid.manageLink} />
        </div>
        <div className="panel-body">
          <ChargerGrid chargers={chargers} />
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <section className="panel shadow-card flex flex-col min-h-[360px]">
          <div className="panel-header">
            <div>
              <h2 className="text-sm font-semibold text-ink">{page.panels.recentOcpp.title}</h2>
              <p className="text-xs text-muted mt-0.5">{page.panels.recentOcpp.subtitle}</p>
            </div>
            <PanelLink href="/ocpp-explorer" label={page.panels.recentOcpp.explorerLink} />
          </div>
          <div className="panel-body pt-0 flex-1">
            <OcppMessageLog messages={ocppMessages} limit={10} />
          </div>
        </section>

        <section className="panel shadow-card">
          <div className="panel-header">
            <div>
              <h2 className="text-sm font-semibold text-ink">{page.panels.powerDraw.title}</h2>
              <p className="text-xs text-muted mt-0.5">{page.panels.powerDraw.subtitle}</p>
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
