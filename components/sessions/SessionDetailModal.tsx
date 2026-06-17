"use client";

import { MeterValueChart } from "./MeterValueChart";
import type { Session } from "@/types";
import { X } from "lucide-react";

export function SessionDetailModal({
  session,
  onClose,
}: {
  session: Session;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="panel max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-card-hover">
        <div className="panel-header">
          <h2 className="text-sm font-semibold text-ink">Figure: Session Detail</h2>
          <button onClick={onClose} className="text-muted hover:text-ink matlab-btn p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="panel-body">
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div>
              <span className="scope-readout-label">Charger</span>
              <p className="font-mono text-ink font-semibold">{session.chargerId}</p>
            </div>
            <div>
              <span className="scope-readout-label">Status</span>
              <p className="text-ink capitalize font-mono">{session.status}</p>
            </div>
            <div>
              <span className="scope-readout-label">Energy</span>
              <p className="scope-readout text-lg">{session.energyKwh.toFixed(2)} kWh</p>
            </div>
            <div>
              <span className="scope-readout-label">SoC</span>
              <p className="scope-readout text-lg">{session.socPercent?.toFixed(0) ?? "—"}%</p>
            </div>
          </div>
          <MeterValueChart meterValues={session.meterValues} />
        </div>
      </div>
    </div>
  );
}
