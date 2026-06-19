"use client";

import { useAppStore } from "@/store";
import { EvCreateForm } from "@/components/evs/EvCreateForm";
import { EvCard } from "@/components/evs/EvCard";
import { apiDelete } from "@/hooks/useInitialData";
import { Trash2 } from "lucide-react";

export default function EvsPage() {
  const evs = useAppStore((s) => s.evs);
  const removeEv = useAppStore((s) => s.removeEv);

  async function deleteEv(evId: string) {
    if (!confirm(`Delete EV ${evId}?`)) return;
    try {
      await apiDelete(`/api/evs/${evId}`);
      removeEv(evId);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  }

  const chargingCount = evs.filter((e) => e.status === "charging").length;
  const pluggedCount = evs.filter((e) => e.chargerId).length;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="page-title">Electric Vehicles</h1>
        <p className="page-desc">
          Create and simulate EVs — plug into chargers, charge, and monitor battery SoC
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="panel p-4 shadow-card text-center">
          <p className="scope-readout">{evs.length}</p>
          <p className="scope-readout-label mt-1">Total EVs</p>
        </div>
        <div className="panel p-4 shadow-card text-center">
          <p className="scope-readout text-matlab-yellow">{pluggedCount}</p>
          <p className="scope-readout-label mt-1">Plugged In</p>
        </div>
        <div className="panel p-4 shadow-card text-center">
          <p className="scope-readout text-matlab-blue">{chargingCount}</p>
          <p className="scope-readout-label mt-1">Charging</p>
        </div>
      </div>

      <EvCreateForm />

      <section>
        <h2 className="section-label mb-4">Fleet</h2>
        {evs.length === 0 ? (
          <p className="text-center text-muted py-12 simulink-canvas">
            No electric vehicles yet. Create one above.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {evs.map((ev) => (
              <div key={ev.id} className="relative group">
                <EvCard ev={ev} />
                {ev.status !== "charging" && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      deleteEv(ev.id);
                    }}
                    className="absolute top-3 right-3 p-1.5 rounded-matlab bg-white border border-border text-muted hover:text-matlab-red opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete EV"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
