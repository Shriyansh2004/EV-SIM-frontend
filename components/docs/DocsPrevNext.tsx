import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { DocPage } from "@/lib/docs/types";

export function DocsPrevNext({
  prev,
  next,
}: {
  prev: DocPage | null;
  next: DocPage | null;
}) {
  if (!prev && !next) return null;

  return (
    <nav className="docs-prev-next grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 pt-8 border-t border-lp-grey-300" aria-label="Page navigation">
      {prev ? (
        <Link href={prev.href} className="docs-nav-card group">
          <span className="flex items-center gap-1 text-xs text-lp-grey-600 mb-1">
            <ChevronLeft className="w-3.5 h-3.5" />
            Previous
          </span>
          <span className="text-sm font-lp-display font-semibold text-lp-grey-900 group-hover:text-lp-orange transition-colors">
            {prev.frontmatter.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link href={next.href} className="docs-nav-card group sm:text-right sm:ml-auto">
          <span className="flex items-center gap-1 text-xs text-lp-grey-600 mb-1 sm:justify-end">
            Next
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
          <span className="text-sm font-lp-display font-semibold text-lp-grey-900 group-hover:text-lp-orange transition-colors">
            {next.frontmatter.title}
          </span>
        </Link>
      ) : null}
    </nav>
  );
}
