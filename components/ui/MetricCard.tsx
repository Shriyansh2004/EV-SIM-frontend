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
    <div className="panel shadow-card">
      <div className="panel-header py-2">
        <p className="section-label">{label}</p>
      </div>
      <div className="p-4 flex items-center justify-between gap-3">
        <p className={clsx("text-2xl font-semibold tabular-nums font-mono", accent || "text-matlab-blue")}>
          {value}
        </p>
        {Icon && (
          <div
            className={clsx(
              "w-8 h-8 rounded-matlab flex items-center justify-center bg-title-bar border border-border shrink-0",
              accent || "text-matlab-blue"
            )}
          >
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  );
}
