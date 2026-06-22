"use client";

import { useState } from "react";
import { DocsTopBar } from "./DocsTopBar";
import { DocsSidebar } from "./DocsSidebar";
import { DocsSearch } from "./DocsSearch";
import type { DocNavCategory, DocSearchEntry } from "@/lib/docs/types";

export function DocsShell({
  nav,
  searchIndex,
  children,
}: {
  nav: DocNavCategory[];
  searchIndex: DocSearchEntry[];
  children: React.ReactNode;
}) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="docs-layout flex flex-col h-full min-h-[calc(100dvh-1.5rem)] bg-lp-primary font-lp-body">
      <DocsTopBar nav={nav} onOpenSearch={() => setSearchOpen(true)} />
      <DocsSearch entries={searchIndex} open={searchOpen} onOpenChange={setSearchOpen} />

      <div className="docs-body flex flex-1 min-h-0">
        <aside className="docs-sidebar hidden lg:block w-[260px] shrink-0 border-r border-lp-grey-300 bg-lp-surface overflow-y-auto">
          <div className="p-4">
            <DocsSidebar nav={nav} />
          </div>
        </aside>

        <div className="flex flex-1 min-w-0 min-h-0 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
