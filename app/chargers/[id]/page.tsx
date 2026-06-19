"use client";

import { useParams } from "next/navigation";
import { useAppStore } from "@/store";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ConnectorPanel } from "@/components/chargers/ConnectorPanel";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import clsx from "clsx";

export default function ChargerDetailPage() {
  const params = useParams();
  const chargerId = params.id as string;
  const charger = useAppStore((s) => s.chargers.find((c) => c.id === chargerId));

  if (!charger) {
    return (
      <div className="panel shadow-card p-12 text-center">
        <p className="text-muted">Charger not found</p>
        <Link
          href="/chargers"
          className="inline-flex items-center gap-1 text-matlab-blue text-sm mt-3 font-mono hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to chargers
        </Link>
      </div>
    );
  }

  const pluggedCount = Object.values(charger.pluggedEvs ?? {}).filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <Link
          href="/chargers"
          className="text-muted hover:text-ink matlab-btn p-1.5 shrink-0 mt-0.5"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="page-title font-mono">{charger.id}</h1>
          <p className="page-desc">Select a connector below to monitor and control</p>
        </div>
      </div>

      <section className="panel shadow-card">
        <div className="panel-header py-2">
          <h2 className="text-sm font-semibold font-mono text-ink">{charger.id}</h2>
          <StatusBadge status={charger.status} />
        </div>
        <div className="panel-body py-3">
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm font-mono text-muted">
            <span>{charger.maxPowerKw} kW max</span>
            <span>
              {charger.connectorCount} connector{charger.connectorCount !== 1 ? "s" : ""}
            </span>
            <span>
              {pluggedCount}/{charger.connectorCount} plugged in
            </span>
            <span
              className={clsx(
                charger.isConnected ? "text-matlab-green" : "text-muted"
              )}
            >
              {charger.isConnected ? "● CSMS online" : "○ CSMS offline"}
            </span>
          </div>
        </div>
      </section>

      <ConnectorPanel charger={charger} />
    </div>
  );
}
