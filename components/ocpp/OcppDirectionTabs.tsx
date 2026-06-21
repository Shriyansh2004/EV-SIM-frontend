import clsx from "clsx";

type DirectionFilter = "all" | "CP_TO_CSMS" | "CSMS_TO_CP";

interface OcppDirectionTabsProps {
  value: DirectionFilter;
  onChange: (value: DirectionFilter) => void;
  counts: { all: number; cpToCsms: number; csmsToCp: number };
}

const TABS: { value: DirectionFilter; label: string; accent?: string }[] = [
  { value: "all", label: "All" },
  { value: "CP_TO_CSMS", label: "CP → CSMS", accent: "text-matlab-green" },
  { value: "CSMS_TO_CP", label: "CSMS → CP", accent: "text-[#0088b8]" },
];

export function OcppDirectionTabs({ value, onChange, counts }: OcppDirectionTabsProps) {
  return (
    <div className="inline-flex rounded-matlab border border-border bg-surface-raised p-1 shadow-inset">
      {TABS.map((tab) => {
        const active = value === tab.value;
        const count =
          tab.value === "all" ? counts.all : tab.value === "CP_TO_CSMS" ? counts.cpToCsms : counts.csmsToCp;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={clsx(
              "inline-flex items-center gap-2 rounded-[4px] px-3 py-1.5 text-xs font-medium transition-all duration-150",
              active
                ? "bg-white text-ink shadow-matlab-btn"
                : "text-muted hover:text-ink hover:bg-white/60"
            )}
          >
            <span className={clsx(active && tab.accent)}>{tab.label}</span>
            <span
              className={clsx(
                "rounded px-1.5 py-0.5 font-mono text-[10px] tabular-nums",
                active ? "bg-title-bar text-ink" : "bg-transparent text-muted"
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
