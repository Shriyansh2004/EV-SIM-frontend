"use client";

import { useAppStore } from "@/store";
import { MetricCard } from "@/components/ui/MetricCard";
import { ChargerGrid } from "@/components/chargers/ChargerGrid";
import { OcppMessageLog } from "@/components/ocpp/OcppMessageLog";
import { PowerChart } from "@/components/charts/PowerChart";
import { Plug, Activity, Zap, Wifi } from "lucide-react";

export default function DashboardPage() {
  const chargers = useAppStore((s) => s.chargers);
  const sessions = useAppStore((s) => s.sessions);
  const ocppMessages = useAppStore((s) => s.ocppMessages);

  const activeSessions = sessions.filter((s) => s.status === "active").length;
  const totalEnergy = sessions.reduce((sum, s) => sum + s.energyKwh, 0);
  const connected = chargers.filter((c) => c.isConnected).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="text-muted mt-1">
          Monitor virtual EV chargers and live OCPP protocol communication
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Chargers" value={chargers.length} icon={Plug} />
        <MetricCard
          label="Active Sessions"
          value={activeSessions}
          icon={Activity}
          accent="text-charging"
        />
        <MetricCard
          label="Total Energy"
          value={`${totalEnergy.toFixed(1)} kWh`}
          icon={Zap}
        />
        <MetricCard
          label="Connected"
          value={connected}
          icon={Wifi}
          accent="text-accent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-sm text-muted mb-3">Charger Grid</h2>
          <ChargerGrid chargers={chargers} />
        </div>
        <div>
          <h2 className="text-sm text-muted mb-3">Recent OCPP Messages</h2>
          <OcppMessageLog messages={ocppMessages} limit={10} />
        </div>
      </div>

      <PowerChart chargers={chargers} />
    </div>
  );
}
