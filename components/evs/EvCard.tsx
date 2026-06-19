"use client";

import Link from "next/link";
import type { VirtualEv } from "@/types";
import { EvStatusBadge } from "./EvStatusBadge";
import { Battery, Plug } from "lucide-react";

interface EvCardProps {
  ev: VirtualEv;
}

export function EvCard({ ev }: EvCardProps) {
  const socColor =
    ev.socPercent > 80
      ? "text-matlab-green"
      : ev.socPercent > 40
        ? "text-matlab-blue"
        : "text-matlab-orange";

  return (
    <Link
      href={`/evs/${ev.id}`}
      className="panel p-4 shadow-card hover:border-matlab-blue/40 transition-colors block"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono font-semibold text-ink truncate">{ev.id}</p>
          <p className="text-sm text-muted mt-0.5 truncate">
            {ev.vendor} {ev.model}
          </p>
          <p className="text-xs text-muted font-mono mt-1">{ev.evType}</p>
        </div>
        <EvStatusBadge status={ev.status} />
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div className="flex items-center gap-2">
          <Battery className={`w-4 h-4 ${socColor}`} />
          <span className={`scope-readout text-xl ${socColor}`}>
            {ev.socPercent.toFixed(0)}%
          </span>
          <span className="text-xs text-muted font-mono">
            / {ev.targetSocPercent}%
          </span>
        </div>
        {ev.chargerId && (
          <div className="flex items-center gap-1 text-xs text-muted font-mono">
            <Plug className="w-3 h-3" />
            {ev.chargerId} · C{ev.connectorId}
          </div>
        )}
      </div>

      {ev.status === "charging" && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-muted">Power</span>
            <span className="text-matlab-blue">{ev.currentPowerKw.toFixed(1)} kW</span>
          </div>
        </div>
      )}
    </Link>
  );
}
