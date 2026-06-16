import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { VirtualCharger } from "@/types";
import { Zap, Plug } from "lucide-react";

export function ChargerCard({ charger }: { charger: VirtualCharger }) {
  const power = charger.currentSession?.currentPowerKw ?? 0;

  return (
    <Link href={`/chargers/${charger.id}`}>
      <div className="bg-surface border border-border rounded-xl p-5 hover:border-accent/50 transition-colors cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-mono text-white font-medium">{charger.id}</h3>
            <p className="text-muted text-xs mt-0.5">
              {charger.connectorCount} connector{charger.connectorCount > 1 ? "s" : ""} ·{" "}
              {charger.maxPowerKw} kW
            </p>
          </div>
          <StatusBadge status={charger.status} />
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-muted">
            <Plug className={`w-4 h-4 ${charger.isConnected ? "text-accent" : ""}`} />
            {charger.isConnected ? "Connected" : "Offline"}
          </div>
          {power > 0 && (
            <div className="flex items-center gap-1.5 text-charging">
              <Zap className="w-4 h-4" />
              {power.toFixed(1)} kW
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
