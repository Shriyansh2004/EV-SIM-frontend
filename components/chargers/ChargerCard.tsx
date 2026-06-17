import Link from "next/link";
import clsx from "clsx";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { VirtualCharger } from "@/types";
import { Zap, ChevronRight } from "lucide-react";

const STATUS_ACCENT: Record<string, string> = {
  Available: "border-l-matlab-green",
  Charging: "border-l-matlab-blue",
  Preparing: "border-l-matlab-yellow",
  SuspendedEV: "border-l-matlab-yellow",
  SuspendedEVSE: "border-l-matlab-yellow",
  Finishing: "border-l-matlab-purple",
  Faulted: "border-l-matlab-red",
  Reserved: "border-l-muted",
  Unavailable: "border-l-muted",
};

export function ChargerCard({ charger }: { charger: VirtualCharger }) {
  const power = charger.currentSession?.currentPowerKw ?? 0;
  const utilization = charger.maxPowerKw > 0 ? (power / charger.maxPowerKw) * 100 : 0;
  const isCharging = charger.status === "Charging" && power > 0;

  return (
    <Link href={`/chargers/${charger.id}`} className="block group">
      <article
        className={clsx(
          "relative bg-white border border-border rounded-matlab overflow-hidden shadow-card",
          "transition-all duration-200 hover:border-matlab-blue/50 hover:shadow-card-hover",
          "border-l-[3px]",
          STATUS_ACCENT[charger.status] ?? "border-l-muted"
        )}
      >
        <div className="p-4">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="min-w-0">
              <h3 className="font-mono text-[14px] text-ink font-semibold truncate">
                {charger.id}
              </h3>
              <p className="text-xs text-muted mt-1 font-mono">
                {charger.connectorCount} connector{charger.connectorCount > 1 ? "s" : ""}
                <span className="mx-1.5 text-border">|</span>
                {charger.maxPowerKw} kW max
              </p>
            </div>
            <StatusBadge status={charger.status} />
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="rounded-matlab bg-title-bar border border-border-subtle px-3 py-2 shadow-inset">
              <p className="scope-readout-label">Link</p>
              <p
                className={clsx(
                  "text-sm font-mono font-semibold mt-0.5",
                  charger.isConnected ? "text-matlab-green" : "text-muted"
                )}
              >
                {charger.isConnected ? "Online" : "Offline"}
              </p>
            </div>
            <div className="rounded-matlab bg-title-bar border border-border-subtle px-3 py-2 shadow-inset">
              <p className="scope-readout-label">Draw</p>
              <p
                className={clsx(
                  "text-sm font-mono font-semibold mt-0.5 tabular-nums",
                  isCharging ? "text-matlab-blue" : "text-muted"
                )}
              >
                {isCharging ? `${power.toFixed(1)} kW` : "—"}
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-[11px] text-muted mb-1.5 font-mono">
              <span className="flex items-center gap-1">
                {isCharging && <Zap className="w-3 h-3 text-matlab-blue" />}
                Output
              </span>
              <span className="tabular-nums">{isCharging ? `${utilization.toFixed(0)}%` : "idle"}</span>
            </div>
            <div className="h-2 rounded-matlab bg-title-bar overflow-hidden border border-border shadow-inset">
              <div
                className={clsx(
                  "h-full rounded-matlab transition-all duration-500",
                  isCharging ? "bg-matlab-blue" : "bg-border w-0"
                )}
                style={{ width: isCharging ? `${Math.min(utilization, 100)}%` : "0%" }}
              />
            </div>
          </div>
        </div>

        <div className="px-4 py-2 border-t border-border-subtle bg-title-bar/50 flex items-center justify-between text-xs text-muted group-hover:text-matlab-blue transition-colors font-mono">
          <span>View details</span>
          <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
        </div>
      </article>
    </Link>
  );
}
