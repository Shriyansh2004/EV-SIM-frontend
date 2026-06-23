"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import {
  ArrowDownUp,
  Download,
  Pause,
  Play,
  Radio,
  Search,
  Terminal,
  X,
} from "lucide-react";
import { useAppStore } from "@/store";
import { PageHeader } from "@/components/ui/PageHeader";
import { FilterSelect } from "@/components/ui/FilterSelect";
import { OcppMessageInspector } from "@/components/ocpp/OcppMessageInspector";
import { OcppExplorerMessageRow } from "@/components/ocpp/OcppExplorerMessageRow";
import { OcppTrafficTimeline } from "@/components/ocpp/OcppTrafficTimeline";
import { OcppActionBreakdown } from "@/components/ocpp/OcppActionBreakdown";
import { OcppDirectionTabs } from "@/components/ocpp/OcppDirectionTabs";
import { SequenceDiagram } from "@/components/ocpp/SequenceDiagram";
import type { OcppMessage } from "@/types";
import { content } from "@/lib/content";

type DirectionFilter = "all" | "CP_TO_CSMS" | "CSMS_TO_CP";

export default function OcppExplorerPage() {
  const page = content.appPages.ocppExplorer;
  const messages = useAppStore((s) => s.ocppMessages);
  const wsConnected = useAppStore((s) => s.wsConnected);
  const [selected, setSelected] = useState<OcppMessage | null>(null);
  const [filter, setFilter] = useState<DirectionFilter>("all");
  const [actionFilter, setActionFilter] = useState("");
  const [search, setSearch] = useState("");
  const [liveFollow, setLiveFollow] = useState(true);
  const logRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<OcppMessage | null>(null);

  selectedRef.current = selected;

  const actions = useMemo(
    () => Array.from(new Set(messages.map((m) => m.action))).sort(),
    [messages]
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return messages.filter((m) => {
      if (filter !== "all" && m.direction !== filter) return false;
      if (actionFilter && m.action !== actionFilter) return false;
      if (!query) return true;
      return (
        m.action.toLowerCase().includes(query) ||
        m.chargerId.toLowerCase().includes(query) ||
        m.messageType.toLowerCase().includes(query) ||
        JSON.stringify(m.payload).toLowerCase().includes(query)
      );
    });
  }, [messages, filter, actionFilter, search]);

  const displayMessages = useMemo(() => filtered.slice().reverse(), [filtered]);

  const stats = useMemo(() => {
    const cpToCsms = filtered.filter((m) => m.direction === "CP_TO_CSMS").length;
    const csmsToCp = filtered.filter((m) => m.direction === "CSMS_TO_CP").length;
    return { total: messages.length, showing: filtered.length, cpToCsms, csmsToCp };
  }, [filtered, messages.length]);

  const actionBreakdown = useMemo(() => {
    const counts = new Map<string, number>();
    for (const message of filtered) {
      counts.set(message.action, (counts.get(message.action) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([action, count]) => ({ action, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [filtered]);

  const liveActions = useMemo(() => messages.map((m) => m.action), [messages]);

  const relatedMessages = useMemo(() => {
    if (!selected?.correlationId) return [];
    return messages.filter(
      (m) => m.correlationId === selected.correlationId && m.id !== selected.id
    );
  }, [messages, selected]);

  const actionOptions = [
    { value: "", label: "All message types", hint: `${actions.length} unique actions` },
    ...actions.map((action) => ({ value: action, label: action })),
  ];

  const hasActiveFilters = filter !== "all" || actionFilter !== "" || search.trim() !== "";
  const latestMessageId = displayMessages[0]?.id ?? null;

  const selectMessage = useCallback((message: OcppMessage | null, manual = true) => {
    setSelected(message);
    if (manual) setLiveFollow(false);
  }, []);

  useEffect(() => {
    if (!liveFollow || displayMessages.length === 0) return;
    const newest = displayMessages[0];
    if (selectedRef.current?.id !== newest.id) {
      setSelected(newest);
    }
    logRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [liveFollow, latestMessageId, displayMessages]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }

      if (e.key === "Escape") {
        selectMessage(null, true);
        return;
      }

      if (displayMessages.length === 0) return;

      const currentIndex = selected
        ? displayMessages.findIndex((m) => m.id === selected.id)
        : -1;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = currentIndex < 0 ? 0 : Math.min(currentIndex + 1, displayMessages.length - 1);
        selectMessage(displayMessages[next], true);
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        const next = currentIndex <= 0 ? 0 : currentIndex - 1;
        selectMessage(displayMessages[next], true);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [displayMessages, selectMessage, selected]);

  function clearFilters() {
    setFilter("all");
    setActionFilter("");
    setSearch("");
  }

  function exportMessages() {
    const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `ocpp-log-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex min-h-[calc(100dvh-7.5rem)] flex-col gap-4">
      <PageHeader
        title={page.title}
        description={page.description}
      >
        <div
          className={clsx(
            "inline-flex items-center gap-2 rounded-matlab border px-3 py-1.5 text-xs font-medium shadow-matlab-btn",
            wsConnected
              ? "border-matlab-green/40 bg-matlab-green/10 text-matlab-green"
              : "border-border bg-white text-muted"
          )}
        >
          <span
            className={clsx(
              "h-2 w-2 rounded-full",
              wsConnected ? "bg-matlab-green animate-pulse-dot" : "bg-muted"
            )}
          />
          {wsConnected ? "Live stream" : "Offline"}
        </div>
      </PageHeader>

      <OcppTrafficTimeline
        messages={filtered}
        selectedId={selected?.id}
        onSelect={(message) => selectMessage(message, true)}
      />

      <section className="panel shadow-card overflow-visible">
        <div className="panel-header flex-wrap gap-3 py-3">
          <OcppDirectionTabs
            value={filter}
            onChange={setFilter}
            counts={{
              all: messages.length,
              cpToCsms: messages.filter((m) => m.direction === "CP_TO_CSMS").length,
              csmsToCp: messages.filter((m) => m.direction === "CSMS_TO_CP").length,
            }}
          />
          <div className="flex flex-wrap items-center gap-2">
            <StatPill label="Showing" value={stats.showing} accent="text-matlab-blue" />
            <StatPill label="Filtered CP→CSMS" value={stats.cpToCsms} accent="text-matlab-green" />
            <StatPill label="Filtered CSMS→CP" value={stats.csmsToCp} accent="text-[#0088b8]" />
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1 rounded-matlab border border-border bg-white px-2.5 py-1.5 text-xs font-medium text-muted shadow-matlab-btn transition-all hover:text-ink hover:shadow-card-hover"
              >
                <X className="h-3.5 w-3.5" />
                Clear filters
              </button>
            )}
          </div>
        </div>

        <div className="panel-body grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
              <FilterSelect
                label="Message type"
                value={actionFilter}
                options={actionOptions}
                onChange={setActionFilter}
                searchable
                searchPlaceholder="Search actions…"
                className="min-w-[220px] lg:min-w-[260px]"
              />
              <div className="min-w-0 flex-1">
                <label
                  htmlFor="ocpp-search"
                  className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-muted"
                >
                  Search payload
                </label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <input
                    id="ocpp-search"
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Action, charger ID, or payload text…"
                    className="matlab-input pl-9"
                  />
                </div>
              </div>
            </div>
          </div>

          <OcppActionBreakdown
            items={actionBreakdown}
            activeAction={actionFilter}
            onSelect={setActionFilter}
          />
        </div>
      </section>

      <SequenceDiagram liveActions={liveActions} />

      <section className="panel shadow-card flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="panel-header flex-wrap gap-3 border-b border-border py-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-matlab border border-border bg-white shadow-matlab-btn">
              <Terminal className="h-4 w-4 text-matlab-green" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-ink">Protocol Workspace</h2>
              <p className="text-xs text-muted truncate">Command window & message inspector</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setLiveFollow((prev) => !prev)}
              className={clsx(
                "inline-flex items-center gap-1.5 rounded-matlab border px-2.5 py-1.5 text-xs font-medium shadow-matlab-btn transition-all",
                liveFollow
                  ? "border-matlab-green/40 bg-matlab-green/10 text-matlab-green"
                  : "border-border bg-white text-muted hover:text-ink"
              )}
            >
              {liveFollow ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {liveFollow ? "Live follow" : "Paused"}
            </button>
            <button
              type="button"
              onClick={exportMessages}
              disabled={filtered.length === 0}
              className="inline-flex items-center gap-1.5 rounded-matlab border border-border bg-white px-2.5 py-1.5 text-xs font-medium text-ink shadow-matlab-btn transition-all hover:shadow-card-hover disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5" />
              Export
            </button>
            <div className="inline-flex items-center gap-1 text-xs text-muted">
              <ArrowDownUp className="h-3.5 w-3.5" />
              {filtered.length} entries
            </div>
          </div>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 xl:grid-cols-5">
          <div className="flex min-h-[440px] flex-col border-b border-border xl:col-span-2 xl:min-h-0 xl:border-b-0 xl:border-r">
            <div className="flex items-center justify-between gap-2 border-b border-border-subtle bg-surface-raised/50 px-4 py-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">Command Window</h3>
              <span className="text-[11px] text-muted">Newest first · ↑↓ navigate</span>
            </div>

            <div
              ref={logRef}
              className="min-h-0 flex-1 overflow-auto bg-[#f7f7f7] p-3"
              onClick={(e) => {
                const card = (e.target as HTMLElement).closest("[data-msg-id]");
                if (card) {
                  const id = card.getAttribute("data-msg-id");
                  const message = displayMessages.find((m) => m.id === id) || null;
                  selectMessage(message, true);
                }
              }}
            >
              {displayMessages.length === 0 ? (
                <div className="flex h-full min-h-[280px] flex-col items-center justify-center rounded-matlab border border-dashed border-border bg-white/70 p-8 text-center">
                  <Radio className="mb-3 h-8 w-8 text-muted/70" />
                  <p className="text-sm font-semibold text-ink">No messages match your filters</p>
                  <p className="mt-1 max-w-sm text-sm text-muted">
                    {messages.length === 0
                      ? "Start a simulation session to see live OCPP traffic here."
                      : "Try clearing filters or broadening your search."}
                  </p>
                  {hasActiveFilters && (
                    <button type="button" onClick={clearFilters} className="matlab-btn-primary mt-4 text-xs">
                      Reset filters
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {displayMessages.map((m, index) => (
                    <OcppExplorerMessageRow
                      key={m.id}
                      message={m}
                      selected={selected?.id === m.id}
                      index={displayMessages.length - index}
                      isLatest={index === 0}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex min-h-[440px] flex-col xl:col-span-3 xl:min-h-0">
            <div className="flex items-center justify-between gap-2 border-b border-border-subtle bg-surface-raised/50 px-4 py-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">Message Inspector</h3>
              {selected && (
                <span className="truncate font-mono text-[11px] text-muted">{selected.action}</span>
              )}
            </div>
            <div className="min-h-0 flex-1 p-3">
              <OcppMessageInspector
                message={selected}
                relatedMessages={relatedMessages}
                onSelectRelated={(message) => selectMessage(message, true)}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatPill({
  label,
  value,
  accent = "text-ink",
}: {
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-matlab border border-border bg-white px-2.5 py-1.5 shadow-matlab-btn">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">{label}</span>
      <span className={clsx("font-mono text-sm font-semibold tabular-nums", accent)}>{value}</span>
    </div>
  );
}
