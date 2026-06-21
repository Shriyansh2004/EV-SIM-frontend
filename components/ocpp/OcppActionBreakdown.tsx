import clsx from "clsx";

interface ActionCount {
  action: string;
  count: number;
}

interface OcppActionBreakdownProps {
  items: ActionCount[];
  activeAction?: string;
  onSelect: (action: string) => void;
}

export function OcppActionBreakdown({ items, activeAction, onSelect }: OcppActionBreakdownProps) {
  if (items.length === 0) return null;

  const max = Math.max(...items.map((i) => i.count), 1);

  return (
    <div className="space-y-2">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Top message types</p>
      <div className="space-y-1.5">
        {items.map(({ action, count }) => {
          const width = `${Math.max((count / max) * 100, 8)}%`;
          const active = activeAction === action;
          return (
            <button
              key={action}
              type="button"
              onClick={() => onSelect(active ? "" : action)}
              className={clsx(
                "group flex w-full items-center gap-3 rounded-matlab px-2 py-1.5 text-left transition-colors",
                active ? "bg-matlab-blue/[0.08]" : "hover:bg-surface-raised"
              )}
            >
              <span
                className={clsx(
                  "w-28 shrink-0 truncate font-mono text-[11px]",
                  active ? "text-matlab-blue font-semibold" : "text-ink"
                )}
              >
                {action}
              </span>
              <span className="relative h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-title-bar">
                <span
                  className={clsx(
                    "absolute inset-y-0 left-0 rounded-full transition-all",
                    active ? "bg-matlab-blue" : "bg-matlab-blue/45 group-hover:bg-matlab-blue/65"
                  )}
                  style={{ width }}
                />
              </span>
              <span className="w-8 shrink-0 text-right font-mono text-[11px] tabular-nums text-muted">
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
