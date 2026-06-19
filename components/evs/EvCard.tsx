"use client";

import Link from "next/link";
import clsx from "clsx";
import type { VirtualEv } from "@/types";
import { EvStatusBadge } from "./EvStatusBadge";
import { Battery, Plug, ChevronRight } from "lucide-react";

interface EvCardProps {
  ev: VirtualEv;
}

function socColor(soc: number) {
  if (soc > 80) return "text-matlab-green";
  if (soc > 40) return "text-matlab-blue";
  return "text-matlab-orange";
}

function socBarColor(soc: number) {
  if (soc > 80) return "bg-matlab-green";
  if (soc > 40) return "bg-matlab-blue";
  return "bg-matlab-orange";
}

export function EvCard({ ev }: EvCardProps) {
  const color = socColor(ev.socPercent);
  const barColor = socBarColor(ev.socPercent);

  return (
    <Link
      href={`/evs/${ev.id}`}
      className="panel shadow-card hover:shadow-card-hover hover:border-matlab-blue/35 transition-all duration-200 block group"
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono font-semibold text-ink truncate group-hover:text-matlab-blue transition-colors">
              {ev.id}
            </p>
            <p className="text-sm text-muted mt-0.5 truncate">
              {ev.vendor} {ev.model}
            </p>
            <p className="text-xs text-muted font-mono mt-1">{ev.evType}</p>
          </div>
          <EvStatusBadge status={ev.status} />
        </div>

        <div className="mt-4">
          <div className="flex items-end justify-between mb-2">
            <div className="flex items-center gap-2">
              <Battery className={clsx("w-4 h-4", color)} />
              <span className={clsx("scope-readout text-xl", color)}>
                {ev.socPercent.toFixed(0)}%
              </span>
              <span className="text-xs text-muted font-mono">/ {ev.targetSocPercent}%</span>
            </div>
            {ev.chargerId && (
              <div className="flex items-center gap-1 text-xs text-muted font-mono">
                <Plug className="w-3 h-3" />
                {ev.chargerId} · C{ev.connectorId}
              </div>
            )}
          </div>
          <div className="soc-bar">
            <div
              className={clsx("soc-bar-fill", barColor)}
              style={{ width: `${Math.min(ev.socPercent, 100)}%` }}
            />
          </div>
        </div>

        {ev.status === "charging" && (
          <div className="mt-3 pt-3 border-t border-border-subtle">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-muted">Power</span>
              <span className="text-matlab-blue font-semibold">
                {ev.currentPowerKw.toFixed(1)} kW
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 py-2 border-t border-border-subtle bg-title-bar/50 flex items-center justify-between text-xs text-muted group-hover:text-matlab-blue transition-colors font-mono">
        <span>View details</span>
        <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
      </div>
    </Link>
  );
}
