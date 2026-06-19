import { LucideIcon } from "lucide-react";
import clsx from "clsx";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  accent?: string;
}

const ACCENT_BG: Record<string, string> = {
  "text-matlab-blue": "bg-matlab-blue/10 border-matlab-blue/20",
  "text-matlab-green": "bg-matlab-green/10 border-matlab-green/20",
  "text-matlab-purple": "bg-matlab-purple/10 border-matlab-purple/20",
  "text-matlab-orange": "bg-matlab-orange/10 border-matlab-orange/20",
  "text-matlab-yellow": "bg-matlab-yellow/15 border-matlab-yellow/30",
};

export function MetricCard({ label, value, icon: Icon, accent }: MetricCardProps) {
  const colorClass = accent || "text-matlab-blue";
  const iconBg = ACCENT_BG[colorClass] || ACCENT_BG["text-matlab-blue"];

  return (
    <div className="panel shadow-card transition-all duration-200 hover:shadow-card-hover hover:border-matlab-blue/20 group">
      <div className="panel-header py-2">
        <p className="section-label">{label}</p>
      </div>
      <div className="p-4 flex items-center justify-between gap-3">
        <p className={clsx("text-2xl font-semibold tabular-nums font-mono", colorClass)}>
          {value}
        </p>
        {Icon && (
          <div
            className={clsx(
              "w-9 h-9 rounded-matlab flex items-center justify-center border shrink-0 transition-transform duration-200 group-hover:scale-105",
              iconBg,
              colorClass
            )}
          >
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  );
}
