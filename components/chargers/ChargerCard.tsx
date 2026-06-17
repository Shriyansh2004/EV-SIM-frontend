import Link from "next/link";
import clsx from "clsx";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { VirtualCharger } from "@/types";
import { Zap, ChevronRight } from "lucide-react";

const STATUS_ACCENT: Record<string, string> = {
  Available: "border-l-accent",
  Charging: "border-l-charging",
  Preparing: "border-l-warning",
  SuspendedEV: "border-l-warning",
  SuspendedEVSE: "border-l-warning",
  Finishing: "border-l-finishing",
  Faulted: "border-l-error",
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
          "relative bg-surface-raised border border-border rounded-lg overflow-hidden shadow-card",
          "transition-all duration-200 hover:border-accent/30 hover:shadow-card-hover",
          "border-l-[3px]",
          STATUS_ACCENT[charger.status] ?? "border-l-muted"
        )}
      >
        <div className="p-4">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="min-w-0">
              <h3 className="font-mono text-[15px] text-white font-medium truncate">
                {charger.id}
              </h3>
              <p className="text-xs text-muted mt-1">
                {charger.connectorCount} connector{charger.connectorCount > 1 ? "s" : ""}
                <span className="mx-1.5 text-border">·</span>
                {charger.maxPowerKw} kW max
              </p>
            </div>
            <StatusBadge status={charger.status} />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-md bg-surface border border-border-subtle px-3 py-2">
              <p className="text-[10px] uppercase tracking-wide text-muted">Link</p>
              <p
                className={clsx(
                  "text-sm font-medium mt-0.5",
                  charger.isConnected ? "text-accent" : "text-muted"
                )}
              >
                {charger.isConnected ? "Online" : "Offline"}
              </p>
            </div>
            <div className="rounded-md bg-surface border border-border-subtle px-3 py-2">
              <p className="text-[10px] uppercase tracking-wide text-muted">Draw</p>
              <p
                className={clsx(
                  "text-sm font-medium mt-0.5 tabular-nums",
                  isCharging ? "text-charging" : "text-muted"
                )}
              >
                {isCharging ? `${power.toFixed(1)} kW` : "—"}
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-[11px] text-muted mb-1.5">
              <span className="flex items-center gap-1">
                {isCharging && <Zap className="w-3 h-3 text-charging" />}
                Output
              </span>
              <span className="tabular-nums">{isCharging ? `${utilization.toFixed(0)}%` : "idle"}</span>
            </div>
            <div className="h-1.5 rounded-full bg-surface overflow-hidden border border-border-subtle">
              <div
                className={clsx(
                  "h-full rounded-full transition-all duration-500",
                  isCharging ? "bg-charging" : "bg-border w-0"
                )}
                style={{ width: isCharging ? `${Math.min(utilization, 100)}%` : "0%" }}
              />
            </div>
          </div>
        </div>

        <div className="px-4 py-2.5 border-t border-border-subtle flex items-center justify-between text-xs text-muted group-hover:text-accent/80 transition-colors">
          <span>View details</span>
          <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
        </div>
      </article>
    </Link>
  );
}
