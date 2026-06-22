import clsx from "clsx";
import { Info, Lightbulb, AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";

type CalloutVariant = "info" | "tip" | "warning";

const VARIANTS: Record<
  CalloutVariant,
  { icon: typeof Info; className: string; iconClass: string }
> = {
  info: {
    icon: Info,
    className: "docs-callout-info",
    iconClass: "text-blue-600",
  },
  tip: {
    icon: Lightbulb,
    className: "docs-callout-tip",
    iconClass: "text-lp-orange",
  },
  warning: {
    icon: AlertTriangle,
    className: "docs-callout-warning",
    iconClass: "text-amber-600",
  },
};

export function Callout({
  variant = "info",
  title,
  children,
}: {
  variant?: CalloutVariant;
  title?: string;
  children: ReactNode;
}) {
  const config = VARIANTS[variant];
  const Icon = config.icon;

  return (
    <div className={clsx("docs-callout my-6", config.className)}>
      <div className="flex gap-3">
        <Icon className={clsx("w-5 h-5 shrink-0 mt-0.5", config.iconClass)} />
        <div className="min-w-0 flex-1">
          {title && (
            <p className="font-lp-display font-semibold text-sm text-lp-grey-900 mb-1">
              {title}
            </p>
          )}
          <div className="docs-callout-body text-sm text-lp-grey-600 leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
