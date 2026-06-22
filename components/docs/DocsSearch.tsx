"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import Fuse from "fuse.js";
import { FileText, Search } from "lucide-react";
import type { DocSearchEntry } from "@/lib/docs/types";

export function DocsSearch({
  entries,
  open,
  onOpenChange,
}: {
  entries: DocSearchEntry[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const fuse = useMemo(
    () =>
      new Fuse(entries, {
        keys: [
          { name: "title", weight: 3 },
          { name: "description", weight: 2 },
          { name: "headings", weight: 1.5 },
          { name: "body", weight: 0.5 },
          { name: "categoryLabel", weight: 1 },
        ],
        threshold: 0.4,
        includeScore: true,
      }),
    [entries]
  );

  const results = useMemo(() => {
    if (!query.trim()) return entries.slice(0, 8);
    return fuse.search(query).map((r) => r.item).slice(0, 12);
  }, [query, fuse, entries]);

  const handleSelect = useCallback(
    (href: string) => {
      onOpenChange(false);
      setQuery("");
      router.push(href);
    },
    [onOpenChange, router]
  );

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === "Escape") onOpenChange(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="docs-search-overlay fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
      <div
        className="absolute inset-0 bg-lp-grey-900/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
        aria-hidden
      />
      <Command
        className="docs-search-palette relative w-full max-w-lg rounded-xl border border-lp-grey-300 bg-lp-surface shadow-lp-card-hover overflow-hidden"
        shouldFilter={false}
      >
        <div className="flex items-center gap-3 px-4 border-b border-lp-grey-300">
          <Search className="w-4 h-4 text-lp-grey-600 shrink-0" />
          <Command.Input
            value={query}
            onValueChange={setQuery}
            placeholder="Search documentation…"
            className="flex-1 py-3.5 text-sm bg-transparent outline-none text-lp-grey-900 placeholder:text-lp-grey-600"
            autoFocus
          />
          <kbd className="docs-kbd">ESC</kbd>
        </div>
        <Command.List className="max-h-[min(400px,50vh)] overflow-y-auto p-2">
          {results.length === 0 ? (
            <Command.Empty className="py-8 text-center text-sm text-lp-grey-600">
              No results found.
            </Command.Empty>
          ) : (
            results.map((item) => (
              <Command.Item
                key={item.slug}
                value={item.slug}
                onSelect={() => handleSelect(item.href)}
                className="flex items-start gap-3 px-3 py-2.5 rounded-lg cursor-pointer data-[selected=true]:bg-lp-orange-soft/50 text-lp-grey-900"
              >
                <FileText className="w-4 h-4 mt-0.5 shrink-0 text-lp-grey-600" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  <p className="text-xs text-lp-grey-600 truncate">
                    {item.categoryLabel} · {item.description}
                  </p>
                </div>
              </Command.Item>
            ))
          )}
        </Command.List>
      </Command>
    </div>
  );
}
