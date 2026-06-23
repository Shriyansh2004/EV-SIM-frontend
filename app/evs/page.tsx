"use client";

import { useAppStore } from "@/store";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { EvCreateForm } from "@/components/evs/EvCreateForm";
import { EvCard } from "@/components/evs/EvCard";
import { apiDelete } from "@/lib/api";
import { Car, Trash2 } from "lucide-react";
import { content } from "@/lib/content";

export default function EvsPage() {
  const page = content.appPages.evs;
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
      <PageHeader
        title={page.title}
        description={page.description}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard label={page.stats.totalEvs} value={evs.length} />
        <StatCard label={page.stats.pluggedIn} value={pluggedCount} accent="text-matlab-yellow" />
        <StatCard label={page.stats.charging} value={chargingCount} accent="text-matlab-blue" />
      </div>

      <EvCreateForm />

      <section>
        <h2 className="section-label mb-4">{page.fleetSectionTitle}</h2>
        {evs.length === 0 ? (
          <EmptyState
            icon={Car}
            title={page.emptyState.title}
            description={page.emptyState.description}
          />
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
                    className="absolute top-3 right-3 p-1.5 rounded-matlab bg-white border border-border text-muted hover:text-matlab-red hover:border-matlab-red/40 opacity-0 group-hover:opacity-100 transition-all shadow-matlab-btn z-10"
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
