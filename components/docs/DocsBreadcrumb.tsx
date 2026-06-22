import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function DocsBreadcrumb({
  crumbs,
}: {
  crumbs: { label: string; href?: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="docs-breadcrumb flex items-center flex-wrap gap-1 text-xs text-lp-grey-600 mb-4">
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="w-3 h-3 opacity-50" />}
          {crumb.href ? (
            <Link href={crumb.href} className="hover:text-lp-orange transition-colors">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-lp-grey-600">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
