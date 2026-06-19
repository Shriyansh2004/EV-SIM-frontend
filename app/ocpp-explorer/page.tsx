"use client";

import { useState } from "react";
import { useAppStore } from "@/store";
import { PageHeader } from "@/components/ui/PageHeader";
import { OcppMessageInspector } from "@/components/ocpp/OcppMessageInspector";
import { SequenceDiagram } from "@/components/ocpp/SequenceDiagram";
import type { OcppMessage } from "@/types";

export default function OcppExplorerPage() {
  const messages = useAppStore((s) => s.ocppMessages);
  const [selected, setSelected] = useState<OcppMessage | null>(null);
  const [filter, setFilter] = useState<"all" | "CP_TO_CSMS" | "CSMS_TO_CP">("all");
  const [actionFilter, setActionFilter] = useState("");

  const filtered = messages.filter((m) => {
    if (filter !== "all" && m.direction !== filter) return false;
    if (actionFilter && !m.action.toLowerCase().includes(actionFilter.toLowerCase()))
      return false;
    return true;
  });

  const actions = Array.from(new Set(messages.map((m) => m.action)));

  return (
    <div className="space-y-8">
      <PageHeader
        title="OCPP Protocol Explorer"
        description="Inspect live OCPP 2.0.1 messages and understand the charging protocol"
      />

      <SequenceDiagram />

      <div className="flex flex-wrap gap-3">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="matlab-select"
        >
          <option value="all">All directions</option>
          <option value="CP_TO_CSMS">CP → CSMS</option>
          <option value="CSMS_TO_CP">CSMS → CP</option>
        </select>
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="matlab-select"
        >
          <option value="">All message types</option>
          {actions.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="section-label mb-3">Command Window: Message Log</h3>
          <div
            className="matlab-cmd h-[500px] space-y-1.5"
            onClick={(e) => {
              const card = (e.target as HTMLElement).closest("[data-msg-id]");
              if (card) {
                const id = card.getAttribute("data-msg-id");
                setSelected(filtered.find((m) => m.id === id) || null);
              }
            }}
          >
            {filtered.length === 0 ? (
              <p className="text-muted text-sm text-center py-8 font-sans">No messages match filters</p>
            ) : (
              filtered
                .slice()
                .reverse()
                .map((m) => (
                  <div
                    key={m.id}
                    data-msg-id={m.id}
                    className={`cursor-pointer rounded-matlab transition-shadow ${
                      selected?.id === m.id ? "ring-2 ring-matlab-blue shadow-card" : "hover:ring-1 hover:ring-border"
                    }`}
                  >
                    <div
                      className={`font-mono text-[11px] px-2 py-1 rounded-matlab border-l-[3px] ${
                        m.direction === "CP_TO_CSMS"
                          ? "border-l-matlab-green bg-matlab-green/5"
                          : "border-l-matlab-cyan bg-matlab-cyan/5"
                      }`}
                    >
                      <span className="text-muted">
                        {new Date(m.timestamp).toLocaleTimeString()}
                      </span>{" "}
                      <span
                        className={
                          m.direction === "CP_TO_CSMS"
                            ? "text-matlab-green font-semibold"
                            : "text-matlab-cyan font-semibold"
                        }
                      >
                        {m.direction === "CP_TO_CSMS" ? "CP→CSMS" : "CSMS→CP"}
                      </span>{" "}
                      <span className="text-ink font-semibold">{m.action}</span>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
        <div>
          <h3 className="section-label mb-3">Message Inspector</h3>
          <OcppMessageInspector message={selected} />
        </div>
      </div>
    </div>
  );
}
