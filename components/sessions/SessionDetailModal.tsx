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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-surface border border-border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Session Detail</h2>
          <button onClick={onClose} className="text-muted hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div>
            <span className="text-muted">Charger</span>
            <p className="font-mono text-white">{session.chargerId}</p>
          </div>
          <div>
            <span className="text-muted">Status</span>
            <p className="text-white capitalize">{session.status}</p>
          </div>
          <div>
            <span className="text-muted">Energy</span>
            <p className="text-white">{session.energyKwh.toFixed(2)} kWh</p>
          </div>
          <div>
            <span className="text-muted">SoC</span>
            <p className="text-white">{session.socPercent?.toFixed(0) ?? "—"}%</p>
          </div>
        </div>
        <MeterValueChart meterValues={session.meterValues} />
      </div>
    </div>
  );
}
