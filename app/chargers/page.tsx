"use client";

import { useState } from "react";
import { useAppStore } from "@/store";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { apiPost, apiDelete } from "@/hooks/useInitialData";
import { mapCharger } from "@/types";
import { Plus, Plug, Unplug, Trash2 } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

export default function ChargersPage() {
  const chargers = useAppStore((s) => s.chargers);
  const upsertCharger = useAppStore((s) => s.upsertCharger);
  const removeCharger = useAppStore((s) => s.removeCharger);
  const [id, setId] = useState("");
  const [power, setPower] = useState(22);
  const [connectors, setConnectors] = useState(1);
  const [loading, setLoading] = useState<string | null>(null);

  const connectedCount = chargers.filter((c) => c.isConnected).length;
  const chargingCount = chargers.filter((c) => c.status === "Charging").length;

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
    <div className="space-y-6">
      <header>
        <h1 className="page-title">Charger Management</h1>
        <p className="page-desc">Create and manage virtual EV chargers</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="panel p-4 shadow-card text-center">
          <p className="scope-readout">{chargers.length}</p>
          <p className="scope-readout-label mt-1">Total Chargers</p>
        </div>
        <div className="panel p-4 shadow-card text-center">
          <p className="scope-readout text-matlab-green">{connectedCount}</p>
          <p className="scope-readout-label mt-1">CSMS Connected</p>
        </div>
        <div className="panel p-4 shadow-card text-center">
          <p className="scope-readout text-matlab-blue">{chargingCount}</p>
          <p className="scope-readout-label mt-1">Charging</p>
        </div>
      </div>

      <section className="panel shadow-card">
        <div className="panel-header py-2">
          <h2 className="section-label">Add charger</h2>
        </div>
        <form onSubmit={createCharger} className="panel-body grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
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
      </section>

      <section>
        <h2 className="section-label mb-4">Fleet</h2>
        {chargers.length === 0 ? (
          <div className="panel shadow-card p-12 text-center">
            <Plug className="w-8 h-8 text-muted mx-auto mb-3" />
            <p className="text-sm text-muted font-mono">No chargers created yet</p>
            <p className="text-xs text-muted mt-1">Add your first virtual charger above</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {chargers.map((c) => (
              <article
                key={c.id}
                className={clsx(
                  "panel shadow-card border-l-[3px]",
                  c.isConnected ? "border-l-matlab-green" : "border-l-muted"
                )}
              >
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 min-w-0">
                    <Link
                      href={`/chargers/${c.id}`}
                      className="font-mono text-ink hover:text-matlab-blue font-semibold"
                    >
                      {c.id}
                    </Link>
                    <StatusBadge status={c.status} />
                    <span className="text-muted text-sm font-mono">{c.maxPowerKw} kW</span>
                    <span className="text-muted text-sm font-mono">
                      {c.connectorCount} connector{c.connectorCount !== 1 ? "s" : ""}
                    </span>
                    <span
                      className={clsx(
                        "text-sm font-mono",
                        c.isConnected ? "text-matlab-green" : "text-muted"
                      )}
                    >
                      {c.isConnected ? "● Connected" : "○ Offline"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
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
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
