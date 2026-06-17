import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function DiagramPanel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="panel shadow-card overflow-x-auto">
      <div className="panel-header py-2">
        <div>
          <h3 className="section-label">{title}</h3>
          {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="panel-body p-0">{children}</div>
    </div>
  );
}

export function DiagramNode({
  icon: Icon,
  label,
  sublabel,
  iconClass,
  boxClass,
  className,
}: {
  icon: LucideIcon;
  label: string;
  sublabel?: string;
  iconClass?: string;
  boxClass?: string;
  className?: string;
}) {
  return (
    <div className={clsx("flex flex-col items-center gap-2 shrink-0", className)}>
      <div
        className={clsx(
          "w-[72px] h-[72px] rounded-xl flex items-center justify-center shadow-card border-2",
          boxClass ?? "bg-white border-border"
        )}
      >
        <Icon className={clsx("w-9 h-9", iconClass ?? "text-ink")} strokeWidth={1.5} />
      </div>
      <span className="text-xs font-semibold text-ink text-center leading-tight max-w-[110px]">
        {label}
      </span>
      {sublabel && (
        <span className="text-[10px] text-muted text-center font-mono leading-tight max-w-[120px]">
          {sublabel}
        </span>
      )}
    </div>
  );
}

export function BidirectionalArrow({
  label,
  vertical = false,
  className,
}: {
  label?: string;
  vertical?: boolean;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "flex items-center justify-center shrink-0",
        vertical ? "flex-col py-2" : "flex-col px-1",
        className
      )}
    >
      {label && (
        <span
          className={clsx(
            "text-[9px] font-mono text-muted whitespace-nowrap text-center",
            vertical ? "mb-1" : "mb-0.5"
          )}
        >
          {label}
        </span>
      )}
      {vertical ? (
        <svg width="24" height="40" viewBox="0 0 24 40" className="text-ink" aria-hidden>
          <line x1="12" y1="4" x2="12" y2="36" stroke="currentColor" strokeWidth="2.5" />
          <polygon points="12,4 8,10 16,10" fill="currentColor" />
          <polygon points="12,36 8,30 16,30" fill="currentColor" />
        </svg>
      ) : (
        <svg width="52" height="24" viewBox="0 0 52 24" className="text-ink" aria-hidden>
          <line x1="4" y1="12" x2="48" y2="12" stroke="currentColor" strokeWidth="2.5" />
          <polygon points="4,12 10,7 10,17" fill="currentColor" />
          <polygon points="48,12 42,7 42,17" fill="currentColor" />
        </svg>
      )}
    </div>
  );
}

export function FlowStep({
  step,
  title,
  description,
  active = false,
}: {
  step: number;
  title: string;
  description: string;
  active?: boolean;
}) {
  return (
    <div
      className={clsx(
        "flex gap-3 p-3 rounded-matlab border",
        active
          ? "bg-matlab-blue/8 border-matlab-blue/40"
          : "bg-white border-border"
      )}
    >
      <div
        className={clsx(
          "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
          active ? "bg-matlab-blue text-white" : "bg-title-bar text-muted"
        )}
      >
        {step}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-ink">{title}</p>
        <p className="text-xs text-muted mt-0.5 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export function FlowArrow({ className }: { className?: string }) {
  return (
    <div className={clsx("flex justify-center py-1", className)} aria-hidden>
      <svg width="20" height="28" viewBox="0 0 20 28" className="text-ink/60">
        <line x1="10" y1="2" x2="10" y2="22" stroke="currentColor" strokeWidth="2" />
        <polygon points="10,26 5,20 15,20" fill="currentColor" />
      </svg>
    </div>
  );
}
