"use client";

import type { VirtualEv } from "@/types";
import { SocGauge } from "@/components/charts/SocGauge";

interface EvBatteryPanelProps {
  ev: VirtualEv;
}

export function EvBatteryPanel({ ev }: EvBatteryPanelProps) {
  const remainingKwh =
    ((ev.targetSocPercent - ev.socPercent) / 100) * ev.batteryCapacityKwh;
  const etaMinutes =
    ev.currentPowerKw > 0 && remainingKwh > 0
      ? Math.ceil((remainingKwh / ev.currentPowerKw) * 60)
      : null;

  return (
    <div className="space-y-4">
      <SocGauge soc={ev.socPercent} />

      <div className="panel shadow-card">
        <div className="panel-header py-2">
          <h3 className="section-label">Battery Telemetry</h3>
        </div>
        <div className="panel-body">
          <div className="grid grid-cols-2 gap-4 matlab-figure p-4">
            <div className="text-center">
              <p className="scope-readout text-matlab-blue">
                {ev.currentPowerKw.toFixed(1)}
              </p>
              <p className="scope-readout-label mt-1">Power (kW)</p>
            </div>
            <div className="text-center">
              <p className="scope-readout text-matlab-orange">
                {ev.energyChargedKwh.toFixed(2)}
              </p>
              <p className="scope-readout-label mt-1">Session (kWh)</p>
            </div>
            <div className="text-center">
              <p className="scope-readout">{ev.voltageV.toFixed(0)}</p>
              <p className="scope-readout-label mt-1">Voltage (V)</p>
            </div>
            <div className="text-center">
              <p className="scope-readout">{ev.currentA.toFixed(1)}</p>
              <p className="scope-readout-label mt-1">Current (A)</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-muted">Battery capacity</span>
              <span>{ev.batteryCapacityKwh} kWh</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Max charge rate</span>
              <span>{ev.maxChargePowerKw} kW</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Target SoC</span>
              <span>{ev.targetSocPercent}%</span>
            </div>
            {etaMinutes !== null && ev.status === "charging" && (
              <div className="flex justify-between">
                <span className="text-muted">Est. time to target</span>
                <span className="text-matlab-blue">~{etaMinutes} min</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
