"use client";

import { useState } from "react";
import type { VirtualEv } from "@/types";
import { apiPost } from "@/lib/api";
import { Play, Square } from "lucide-react";

interface EvChargeControlsProps {
  ev: VirtualEv;
}

export function EvChargeControls({ ev }: EvChargeControlsProps) {
  const [loading, setLoading] = useState(false);

  const canStart =
    ev.status === "plugged" && !!ev.chargerId && ev.socPercent < ev.targetSocPercent;
  const canStop = ev.status === "charging";

  async function handleStart() {
    setLoading(true);
    try {
      await apiPost(`/api/evs/${ev.id}/start-charging`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Start charging failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleStop() {
    setLoading(true);
    try {
      const raw = await apiPost<Record<string, unknown>>(`/api/evs/${ev.id}/stop-charging`);
      if (raw && typeof raw === "object") {
        // session stop triggers ev_update via websocket
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Stop charging failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="panel shadow-card">
      <div className="panel-header py-2">
        <h3 className="section-label">Charging Controls</h3>
      </div>
      <div className="panel-body">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleStart}
            disabled={!canStart || loading}
            className="matlab-btn-primary flex items-center gap-2 disabled:opacity-40"
          >
            <Play className="w-4 h-4" />
            Start Charging
          </button>
          <button
            onClick={handleStop}
            disabled={!canStop || loading}
            className="matlab-btn-danger flex items-center gap-2 disabled:opacity-40"
          >
            <Square className="w-4 h-4" />
            Stop Charging
          </button>
        </div>
        {!ev.chargerId && (
          <p className="text-xs text-muted mt-3 font-mono">
            Plug the EV into a charger connector first.
          </p>
        )}
        {ev.chargerId && ev.status === "plugged" && (
          <p className="text-xs text-muted mt-3 font-mono">
            EV is plugged in and ready to charge.
          </p>
        )}
        {ev.socPercent >= ev.targetSocPercent && ev.status !== "charging" && (
          <p className="text-xs text-matlab-green mt-3 font-mono">
            Target SoC ({ev.targetSocPercent}%) reached.
          </p>
        )}
      </div>
    </div>
  );
}
