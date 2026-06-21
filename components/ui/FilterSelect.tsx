"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { Check, ChevronDown, Search } from "lucide-react";

export interface FilterSelectOption {
  value: string;
  label: string;
  hint?: string;
}

interface FilterSelectProps {
  label: string;
  value: string;
  options: FilterSelectOption[];
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
}

interface MenuPosition {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
  openUp: boolean;
}

export function FilterSelect({
  label,
  value,
  options,
  onChange,
  className,
  disabled = false,
  searchable = false,
  searchPlaceholder = "Filter options…",
}: FilterSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const labelId = useId();

  const selected = options.find((o) => o.value === value) ?? options[0];

  const filteredOptions = useMemo(() => {
    if (!searchable || !query.trim()) return options;
    const q = query.trim().toLowerCase();
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(q) ||
        option.hint?.toLowerCase().includes(q) ||
        option.value.toLowerCase().includes(q)
    );
  }, [options, query, searchable]);

  const updateMenuPosition = useCallback(() => {
    const trigger = rootRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const gap = 6;
    const viewportPadding = 12;
    const spaceBelow = window.innerHeight - rect.bottom - viewportPadding;
    const spaceAbove = rect.top - viewportPadding;
    const preferredHeight = 320;
    const openUp = spaceBelow < 180 && spaceAbove > spaceBelow;
    const maxHeight = Math.max(160, Math.min(preferredHeight, openUp ? spaceAbove - gap : spaceBelow - gap));

    setMenuPosition({
      top: openUp ? rect.top - gap : rect.bottom + gap,
      left: rect.left,
      width: rect.width,
      maxHeight,
      openUp,
    });
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      setMenuPosition(null);
      return;
    }

    updateMenuPosition();

    function handleReposition() {
      updateMenuPosition();
    }

    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [open, updateMenuPosition, filteredOptions.length]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }

    const selectedIndex = filteredOptions.findIndex((option) => option.value === value);
    setHighlightIndex(selectedIndex >= 0 ? selectedIndex : 0);

    function handlePointerDown(e: PointerEvent) {
      const target = e.target as Node;
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }

      if (!menuRef.current?.contains(e.target as Node) && !rootRef.current?.contains(e.target as Node)) {
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightIndex((prev) => Math.min(prev + 1, filteredOptions.length - 1));
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightIndex((prev) => Math.max(prev - 1, 0));
      }

      if (e.key === "Enter" && filteredOptions[highlightIndex]) {
        e.preventDefault();
        onChange(filteredOptions[highlightIndex].value);
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    const focusTimer = window.setTimeout(() => {
      if (searchable && options.length > 1) {
        searchRef.current?.focus();
      } else {
        listRef.current?.focus();
      }
    }, 0);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.clearTimeout(focusTimer);
    };
  }, [open, filteredOptions, highlightIndex, onChange, options.length, searchable, value]);

  useEffect(() => {
    if (!open || !listRef.current) return;
    const highlighted = listRef.current.querySelector('[data-highlighted="true"]');
    highlighted?.scrollIntoView({ block: "nearest" });
  }, [open, highlightIndex]);

  function selectOption(optionValue: string) {
    onChange(optionValue);
    setOpen(false);
  }

  const menu =
    open && menuPosition && mounted
      ? createPortal(
          <div
            ref={menuRef}
            role="presentation"
            className="fixed z-[9999] animate-fade-in"
            style={{
              top: menuPosition.openUp ? undefined : menuPosition.top,
              bottom: menuPosition.openUp
                ? window.innerHeight - menuPosition.top
                : undefined,
              left: menuPosition.left,
              width: menuPosition.width,
            }}
          >
            <div className="overflow-hidden rounded-matlab border border-border bg-white shadow-card-hover">
              {searchable && options.length > 1 && (
                <div className="border-b border-border-subtle p-2">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
                    <input
                      ref={searchRef}
                      type="search"
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setHighlightIndex(0);
                      }}
                      placeholder={searchPlaceholder}
                      className="w-full rounded-matlab border border-border bg-surface-raised py-1.5 pl-8 pr-2 text-xs text-ink shadow-inset focus:border-matlab-blue focus:outline-none focus:ring-1 focus:ring-matlab-blue/20"
                    />
                  </div>
                </div>
              )}

              <ul
                ref={listRef}
                role="listbox"
                aria-labelledby={labelId}
                tabIndex={-1}
                className="overflow-auto py-1 outline-none"
                style={{ maxHeight: menuPosition.maxHeight }}
              >
                {filteredOptions.length === 0 ? (
                  <li className="px-3 py-4 text-center text-xs text-muted">No matching options</li>
                ) : (
                  filteredOptions.map((option, index) => {
                    const isSelected = option.value === value;
                    const isHighlighted = index === highlightIndex;
                    return (
                      <li key={option.value || "__all__"} role="none">
                        <button
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          data-highlighted={isHighlighted}
                          onMouseEnter={() => setHighlightIndex(index)}
                          onPointerDown={(e) => {
                            e.preventDefault();
                            selectOption(option.value);
                          }}
                          className={clsx(
                            "flex w-full items-start gap-2 px-3 py-2.5 text-left text-sm transition-colors duration-100",
                            isSelected && "bg-matlab-blue/[0.08] text-matlab-blue",
                            !isSelected && isHighlighted && "bg-surface-raised",
                            !isSelected && !isHighlighted && "text-ink hover:bg-surface-raised"
                          )}
                        >
                          <Check
                            className={clsx(
                              "mt-0.5 h-3.5 w-3.5 shrink-0 transition-opacity",
                              isSelected ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-medium">{option.label}</span>
                            {option.hint && (
                              <span className="mt-0.5 block truncate text-xs text-muted">{option.hint}</span>
                            )}
                          </span>
                        </button>
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <div ref={rootRef} className={clsx("relative min-w-[168px]", className)}>
        <button
          type="button"
          id={labelId}
          aria-haspopup="listbox"
          aria-expanded={open}
          disabled={disabled}
          onClick={() => setOpen((prev) => !prev)}
          className={clsx(
            "group flex w-full items-center gap-2 rounded-matlab border bg-white px-3 py-2 text-left text-sm shadow-matlab-btn transition-all duration-150",
            "hover:border-matlab-blue/40 hover:shadow-card-hover",
            open ? "border-matlab-blue ring-2 ring-matlab-blue/20" : "border-border",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          <span className="min-w-0 flex-1">
            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide leading-none text-muted">
              {label}
            </span>
            <span className="block truncate font-medium text-ink">{selected?.label}</span>
          </span>
          <ChevronDown
            className={clsx(
              "h-4 w-4 shrink-0 text-muted transition-transform duration-200",
              open && "rotate-180 text-matlab-blue"
            )}
          />
        </button>
      </div>
      {menu}
    </>
  );
}
