"use client";

import { Menu, Search } from "lucide-react";
import { useState } from "react";
import { DocsSidebar } from "./DocsSidebar";
import type { DocNavCategory } from "@/lib/docs/types";
import { content } from "@/lib/content";

export function DocsTopBar({
  nav,
  onOpenSearch,
}: {
  nav: DocNavCategory[];
  onOpenSearch: () => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const { learn } = content;

  return (
    <>
      <header className="docs-topbar sticky top-0 z-30 flex items-center gap-3 px-4 lg:px-5 h-12 shrink-0 border-b border-lp-grey-300 bg-lp-surface/95 backdrop-blur-sm">
        <button
          type="button"
          className="lg:hidden flex items-center justify-center w-8 h-8 rounded-matlab border border-lp-grey-300 text-lp-grey-600 hover:bg-lp-grey-100 transition-colors"
          onClick={() => setMobileOpen(true)}
          aria-label={learn.openNavLabel}
        >
          <Menu className="w-4 h-4" />
        </button>

        <span className="text-sm font-lp-display font-semibold text-lp-grey-900">
          {learn.docsLabel}
        </span>

        <button
          type="button"
          onClick={onOpenSearch}
          className="docs-search-trigger flex-1 max-w-sm ml-auto hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-lp-grey-300 bg-lp-primary text-sm text-lp-grey-600 hover:border-lp-grey-600/30 transition-colors"
        >
          <Search className="w-4 h-4 shrink-0 opacity-60" />
          <span className="flex-1 text-left">{learn.searchPlaceholder}</span>
          <kbd className="docs-kbd hidden md:inline-flex">{learn.searchShortcut}</kbd>
        </button>

        <button
          type="button"
          onClick={onOpenSearch}
          className="sm:hidden ml-auto flex items-center justify-center w-8 h-8 rounded-matlab border border-lp-grey-300 text-lp-grey-600"
          aria-label={learn.searchAriaLabel}
        >
          <Search className="w-4 h-4" />
        </button>
      </header>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-lp-grey-900/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside className="docs-mobile-drawer absolute inset-y-0 left-0 w-[min(300px,85vw)] bg-lp-surface border-r border-lp-grey-300 flex flex-col shadow-xl">
            <div className="flex items-center justify-between px-4 h-12 border-b border-lp-grey-300">
              <span className="text-sm font-lp-display font-semibold text-lp-grey-900">
                {learn.docsLabel}
              </span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="text-sm text-lp-grey-600 hover:text-lp-grey-900 px-2 py-1"
              >
                {learn.closeLabel}
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              <DocsSidebar nav={nav} onNavigate={() => setMobileOpen(false)} />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
