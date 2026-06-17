import { LucideIcon } from "lucide-react";
import clsx from "clsx";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  accent?: string;
}

export function MetricCard({ label, value, icon: Icon, accent }: MetricCardProps) {
  return (
    <div className="panel p-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="section-label">{label}</p>
          <p className="text-2xl font-semibold text-white mt-2 tabular-nums">{value}</p>
        </div>
        {Icon && (
          <div
            className={clsx(
              "w-9 h-9 rounded-md flex items-center justify-center bg-surface-raised border border-border-subtle shrink-0",
              accent || "text-accent"
            )}
          >
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  );
}
