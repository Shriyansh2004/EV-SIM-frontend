import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  accent?: string;
}

export function MetricCard({ label, value, icon: Icon, accent }: MetricCardProps) {
  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-muted text-sm">{label}</span>
        {Icon && <Icon className={`w-5 h-5 ${accent || "text-accent"}`} />}
      </div>
      <div className="text-2xl font-semibold text-white">{value}</div>
    </div>
  );
}
