import clsx from "clsx";

interface StatCardProps {
  label: string;
  value: string | number;
  accent?: string;
}

export function StatCard({ label, value, accent }: StatCardProps) {
  return (
    <div className="stat-card">
      <p className={clsx("scope-readout", accent)}>{value}</p>
      <p className="scope-readout-label mt-1.5">{label}</p>
    </div>
  );
}
