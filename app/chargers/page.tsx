"use client";

import { useState } from "react";
import { useAppStore } from "@/store";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { apiPost, apiDelete } from "@/hooks/useInitialData";
import { mapCharger } from "@/types";
import { Plus, Plug, Unplug, Trash2 } from "lucide-react";
import Link from "next/link";

export default function ChargersPage() {
  const chargers = useAppStore((s) => s.chargers);
  const upsertCharger = useAppStore((s) => s.upsertCharger);
  const removeCharger = useAppStore((s) => s.removeCharger);
  const [id, setId] = useState("");
  const [power, setPower] = useState(22);
  const [connectors, setConnectors] = useState(1);
  const [loading, setLoading] = useState<string | null>(null);

  async function createCharger(e: React.FormEvent) {
    e.preventDefault();
    if (!id.trim()) return;
    try {
      const raw = await apiPost<Record<string, unknown>>("/api/chargers", {
        id: id.trim(),
        max_power_kw: power,
        connector_count: connectors,
      });
      upsertCharger(mapCharger(raw));
      setId("");
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed");
    }
  }

  async function toggleConnect(chargerId: string, connected: boolean) {
    setLoading(chargerId);
    try {
      const raw = await apiPost<Record<string, unknown>>(
        `/api/chargers/${chargerId}/${connected ? "disconnect" : "connect"}`
      );
      upsertCharger(mapCharger(raw));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(null);
    }
  }

  async function deleteCharger(chargerId: string) {
    if (!confirm(`Delete charger ${chargerId}?`)) return;
    await apiDelete(`/api/chargers/${chargerId}`);
    removeCharger(chargerId);
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="page-title">Charger Management</h1>
        <p className="page-desc">Create and manage virtual EV chargers</p>
      </header>

      <form
        onSubmit={createCharger}
        className="panel p-5 shadow-card grid grid-cols-1 sm:grid-cols-4 gap-4 items-end"
      >
        <div>
          <label className="scope-readout-label block mb-1">Charger ID</label>
          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="CP-001"
            className="matlab-input"
          />
        </div>
        <div>
          <label className="scope-readout-label block mb-1">Max Power (kW)</label>
          <input
            type="number"
            value={power}
            onChange={(e) => setPower(Number(e.target.value))}
            className="matlab-input"
          />
        </div>
        <div>
          <label className="scope-readout-label block mb-1">Connectors</label>
          <input
            type="number"
            min={1}
            max={4}
            value={connectors}
            onChange={(e) => setConnectors(Number(e.target.value))}
            className="matlab-input"
          />
        </div>
        <button type="submit" className="matlab-btn-primary flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" />
          Add Charger
        </button>
      </form>

      <div className="space-y-3">
        {chargers.map((c) => (
          <div
            key={c.id}
            className="panel p-4 shadow-card flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <Link href={`/chargers/${c.id}`} className="font-mono text-ink hover:text-matlab-blue font-semibold">
                {c.id}
              </Link>
              <StatusBadge status={c.status} />
              <span className="text-muted text-sm font-mono">{c.maxPowerKw} kW</span>
              <span className="text-muted text-sm font-mono">
                {c.isConnected ? (
                  <span className="text-matlab-green">● Connected</span>
                ) : (
                  "○ Offline"
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleConnect(c.id, c.isConnected)}
                disabled={loading === c.id}
                className="matlab-btn flex items-center gap-1.5 disabled:opacity-50"
              >
                {c.isConnected ? (
                  <>
                    <Unplug className="w-4 h-4" /> Disconnect
                  </>
                ) : (
                  <>
                    <Plug className="w-4 h-4" /> Connect
                  </>
                )}
              </button>
              <button
                onClick={() => deleteCharger(c.id)}
                className="matlab-btn p-1.5 text-muted hover:text-matlab-red"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {chargers.length === 0 && (
          <p className="text-center text-muted py-8 simulink-canvas">No chargers created yet</p>
        )}
      </div>
    </div>
  );
}
