"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import type { DocHeading } from "@/lib/docs/types";

const TOP_OFFSET = 64;

export function DocsTableOfContents({
  headings,
  variant = "auto",
}: {
  headings: DocHeading[];
  variant?: "mobile" | "desktop" | "auto";
}) {
  const [activeId, setActiveId] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: `-${TOP_OFFSET}px 0px -60% 0px`, threshold: 0 }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  function handleClick(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - TOP_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
    setMobileOpen(false);
  }

  const tocList = (
    <ul className="docs-toc-list space-y-1">
      {headings.map((h) => (
        <li
          key={h.id}
          className={clsx(h.level === 3 && "ml-3")}
        >
          <button
            type="button"
            onClick={() => handleClick(h.id)}
            className={clsx(
              "docs-toc-link w-full text-left text-[13px] leading-snug py-1 pl-4 relative transition-colors",
              activeId === h.id
                ? "text-lp-orange font-medium"
                : "text-lp-grey-600 hover:text-lp-grey-900"
            )}
          >
            <span
              className={clsx(
                "docs-toc-dot absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full transition-colors",
                activeId === h.id ? "bg-lp-orange" : "bg-lp-grey-300"
              )}
            />
            {h.text}
          </button>
        </li>
      ))}
    </ul>
  );

  const showMobile = variant === "mobile" || variant === "auto";
  const showDesktop = variant === "desktop" || variant === "auto";

  return (
    <>
      {showMobile && (
      <div className="xl:hidden mb-6">
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-lp-grey-300 bg-lp-surface text-sm font-medium text-lp-grey-900"
        >
          On this page
          <span className="text-lp-grey-600 text-xs">{mobileOpen ? "Hide" : "Show"}</span>
        </button>
        {mobileOpen && <div className="mt-3 px-2 border-l-2 border-lp-grey-300 ml-2">{tocList}</div>}
      </div>
      )}

      {showDesktop && (
      <aside className="docs-toc hidden xl:block w-60 shrink-0">
        <div className="sticky top-[calc(3rem+0.5rem)]">
          <p className="text-[11px] font-lp-display font-semibold uppercase tracking-wider text-lp-grey-600 mb-3">
            On this page
          </p>
          <div className="border-l-2 border-lp-grey-300 pl-0">{tocList}</div>
        </div>
      </aside>
      )}
    </>
  );
}
