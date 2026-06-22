"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { DOC_CATEGORIES } from "@/lib/docs/categories";
import type { DocNavCategory } from "@/lib/docs/types";

const STORAGE_KEY = "evsim-docs-sidebar";

function loadCollapsed(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function DocsSidebar({
  nav,
  onNavigate,
}: {
  nav: DocNavCategory[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setCollapsed(loadCollapsed());
  }, []);

  function toggleCategory(id: string) {
    setCollapsed((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  return (
    <nav className="docs-sidebar-nav" aria-label="Documentation">
      {nav.map((category) => {
        const catMeta = DOC_CATEGORIES.find((c) => c.id === category.id);
        const Icon = catMeta?.icon;
        const isCollapsed = collapsed[category.id] ?? false;
        const hasActive = category.items.some((item) => pathname === item.href);

        return (
          <div key={category.id} className="mb-1">
            <button
              type="button"
              onClick={() => toggleCategory(category.id)}
              className={clsx(
                "docs-sidebar-category w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors",
                hasActive ? "text-lp-grey-900" : "text-lp-grey-600 hover:text-lp-grey-900"
              )}
              aria-expanded={!isCollapsed}
            >
              {Icon && (
                <span className="docs-sidebar-icon">
                  <Icon className="w-4 h-4 text-lp-orange" strokeWidth={2} />
                </span>
              )}
              <span className="flex-1 text-[13px] font-lp-display font-semibold">
                {category.label}
              </span>
              {isCollapsed ? (
                <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-50" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 shrink-0 opacity-50" />
              )}
            </button>

            {!isCollapsed && (
              <ul className="mt-0.5 ml-2 pl-3 border-l border-lp-grey-300/80 space-y-0.5">
                {category.items.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <li key={item.slug}>
                      <Link
                        href={item.href}
                        onClick={onNavigate}
                        className={clsx(
                          "docs-sidebar-link block px-3 py-1.5 text-[13px] rounded-lg transition-colors border-l-2 -ml-[calc(0.75rem+1px)]",
                          active
                            ? "docs-sidebar-link-active border-lp-orange bg-lp-orange-soft/40 text-lp-grey-900 font-medium"
                            : "border-transparent text-lp-grey-600 hover:text-lp-grey-900 hover:bg-lp-grey-100/80"
                        )}
                      >
                        {item.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );
}
