"use client";

import { useState } from "react";
import type { VirtualCharger, VirtualEv } from "@/types";
import { apiPost } from "@/lib/api";
import { useAppStore } from "@/store";
import { mapEv } from "@/types";
import { Plug, Unplug } from "lucide-react";

interface EvPlugPanelProps {
  ev: VirtualEv;
  chargers: VirtualCharger[];
}

export function EvPlugPanel({ ev, chargers }: EvPlugPanelProps) {
  const upsertEv = useAppStore((s) => s.upsertEv);
  const [chargerId, setChargerId] = useState(chargers[0]?.id || "");
  const [connectorId, setConnectorId] = useState(1);
  const [loading, setLoading] = useState(false);

  const selectedCharger = chargers.find((c) => c.id === chargerId);
  const connectorCount = selectedCharger?.connectorCount || 1;

  async function handlePlug() {
    if (!chargerId) return;
    setLoading(true);
    try {
      const raw = await apiPost<Record<string, unknown>>(`/api/evs/${ev.id}/plug`, {
        charger_id: chargerId,
        connector_id: connectorId,
      });
      upsertEv(mapEv(raw));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Plug failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleUnplug() {
    setLoading(true);
    try {
      const raw = await apiPost<Record<string, unknown>>(`/api/evs/${ev.id}/unplug`);
      upsertEv(mapEv(raw));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Unplug failed");
    } finally {
      setLoading(false);
    }
  }

  if (ev.chargerId) {
    return (
      <div className="panel shadow-card">
        <div className="panel-header py-2">
          <h3 className="section-label">Connector</h3>
        </div>
        <div className="panel-body space-y-3">
          <div className="simulink-canvas p-4 text-center">
            <p className="text-sm text-muted font-mono">Plugged into</p>
            <p className="scope-readout text-lg mt-1">{ev.chargerId}</p>
            <p className="text-sm text-muted font-mono mt-1">
              Connector {ev.connectorId}
            </p>
          </div>
          <button
            onClick={handleUnplug}
            disabled={loading || ev.status === "charging"}
            className="matlab-btn w-full flex items-center justify-center gap-2 disabled:opacity-40"
          >
            <Unplug className="w-4 h-4" />
            Unplug
          </button>
          {ev.status === "charging" && (
            <p className="text-xs text-muted text-center font-mono">
              Stop charging before unplugging
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="panel shadow-card">
      <div className="panel-header py-2">
        <h3 className="section-label">Plug into Charger</h3>
      </div>
      <div className="panel-body space-y-3">
        {chargers.length === 0 ? (
          <p className="text-sm text-muted text-center py-4 font-mono">
            No chargers available. Create a charger first.
          </p>
        ) : (
          <>
            <div>
              <label className="scope-readout-label block mb-1">Charger</label>
              <select
                value={chargerId}
                onChange={(e) => {
                  setChargerId(e.target.value);
                  setConnectorId(1);
                }}
                className="matlab-select w-full"
              >
                {chargers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id} ({c.maxPowerKw} kW)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="scope-readout-label block mb-1">Connector</label>
              <select
                value={connectorId}
                onChange={(e) => setConnectorId(Number(e.target.value))}
                className="matlab-select w-full"
              >
                {Array.from({ length: connectorCount }, (_, i) => i + 1).map((n) => {
                  const occupied = selectedCharger?.pluggedEvs?.[String(n)];
                  return (
                    <option key={n} value={n} disabled={!!occupied}>
                      Connector {n}
                      {occupied ? ` (occupied by ${occupied})` : ""}
                    </option>
                  );
                })}
              </select>
            </div>
            <button
              onClick={handlePlug}
              disabled={loading || !chargerId}
              className="matlab-btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <Plug className="w-4 h-4" />
              Plug In
            </button>
          </>
        )}
      </div>
    </div>
  );
}
