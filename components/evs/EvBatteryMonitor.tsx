"use client";

import type { VirtualEv } from "@/types";
import { SocGauge } from "@/components/charts/SocGauge";
import { Battery, Zap, Gauge } from "lucide-react";

interface EvBatteryMonitorProps {
  ev: VirtualEv;
}

export function EvBatteryMonitor({ ev }: EvBatteryMonitorProps) {
  const remainingKwh = ((100 - ev.socPercent) / 100) * ev.batteryCapacityKwh;
  const chargedKwh = (ev.socPercent / 100) * ev.batteryCapacityKwh;
  const eta =
    ev.status === "charging" && ev.currentPowerKw > 0
      ? ((ev.targetSocPercent - ev.socPercent) / 100) *
        ev.batteryCapacityKwh /
        ev.currentPowerKw
      : null;

  return (
    <div className="space-y-6">
      <SocGauge soc={ev.socPercent} />

      <div className="panel shadow-card">
        <div className="panel-header py-2">
          <h3 className="section-label">Scope: Battery Telemetry</h3>
        </div>
        <div className="panel-body">
          <div className="grid grid-cols-2 gap-4 matlab-figure p-4">
            <div className="text-center">
              <p className="scope-readout text-matlab-blue">{chargedKwh.toFixed(1)}</p>
              <p className="scope-readout-label mt-1 flex items-center justify-center gap-1">
                <Battery className="w-3 h-3" /> Charged (kWh)
              </p>
            </div>
            <div className="text-center">
              <p className="scope-readout text-matlab-orange">{remainingKwh.toFixed(1)}</p>
              <p className="scope-readout-label mt-1">Remaining (kWh)</p>
            </div>
            <div className="text-center">
              <p className="scope-readout">
                {ev.status === "charging" ? ev.currentPowerKw.toFixed(1) : "—"}
              </p>
              <p className="scope-readout-label mt-1 flex items-center justify-center gap-1">
                <Zap className="w-3 h-3" /> Power (kW)
              </p>
            </div>
            <div className="text-center">
              <p className="scope-readout">
                {ev.status === "charging" ? ev.voltageV.toFixed(0) : "—"}
              </p>
              <p className="scope-readout-label mt-1">Voltage (V)</p>
            </div>
            <div className="text-center">
              <p className="scope-readout">
                {ev.status === "charging" ? ev.currentA.toFixed(1) : "—"}
              </p>
              <p className="scope-readout-label mt-1">Current (A)</p>
            </div>
            <div className="text-center">
              <p className="scope-readout">
                {eta !== null ? `${eta.toFixed(0)} min` : "—"}
              </p>
              <p className="scope-readout-label mt-1 flex items-center justify-center gap-1">
                <Gauge className="w-3 h-3" /> ETA to Target
              </p>
            </div>
          </div>

          <div className="mt-4 px-4 pb-2">
            <div className="flex justify-between text-xs text-muted font-mono mb-1">
              <span>0%</span>
              <span>Target: {ev.targetSocPercent}%</span>
              <span>100%</span>
            </div>
            <div className="h-2 bg-surface-raised border border-border rounded-matlab overflow-hidden">
              <div
                className="h-full bg-matlab-blue transition-all duration-500"
                style={{ width: `${ev.socPercent}%` }}
              />
              <div
                className="h-0.5 bg-matlab-orange -mt-0.5 relative"
                style={{ width: `${ev.targetSocPercent}%`, opacity: 0.6 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
