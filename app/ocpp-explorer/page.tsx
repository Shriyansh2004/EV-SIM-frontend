"use client";

import { useState } from "react";
import { useAppStore } from "@/store";
import { OcppMessageLog } from "@/components/ocpp/OcppMessageLog";
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
      <div>
        <h1 className="text-2xl font-semibold text-white">OCPP Protocol Explorer</h1>
        <p className="text-muted mt-1">
          Inspect live OCPP 2.0.1 messages and understand the charging protocol
        </p>
      </div>

      <SequenceDiagram />

      <div className="flex flex-wrap gap-3">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-white"
        >
          <option value="all">All directions</option>
          <option value="CP_TO_CSMS">CP → CSMS</option>
          <option value="CSMS_TO_CP">CSMS → CP</option>
        </select>
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-white"
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
          <h3 className="text-sm text-muted mb-3">Message Log</h3>
          <div
            className="bg-background border border-border rounded-xl p-4 h-[500px] overflow-y-auto space-y-2"
            onClick={(e) => {
              const card = (e.target as HTMLElement).closest("[data-msg-id]");
              if (card) {
                const id = card.getAttribute("data-msg-id");
                setSelected(filtered.find((m) => m.id === id) || null);
              }
            }}
          >
            {filtered.length === 0 ? (
              <p className="text-muted text-sm text-center py-8">No messages match filters</p>
            ) : (
              filtered
                .slice()
                .reverse()
                .map((m) => (
                  <div
                    key={m.id}
                    data-msg-id={m.id}
                    className={`cursor-pointer rounded ${
                      selected?.id === m.id ? "ring-1 ring-accent" : ""
                    }`}
                  >
                    <div className="font-mono text-xs p-2 rounded border-l-2 border-l-green-500 bg-green-500/5">
                      <span className="text-muted">
                        {new Date(m.timestamp).toLocaleTimeString()}
                      </span>{" "}
                      <span
                        className={
                          m.direction === "CP_TO_CSMS" ? "text-green-400" : "text-cyan-400"
                        }
                      >
                        {m.direction === "CP_TO_CSMS" ? "CP→CSMS" : "CSMS→CP"}
                      </span>{" "}
                      <span className="text-white">{m.action}</span>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
        <div>
          <h3 className="text-sm text-muted mb-3">Message Inspector</h3>
          <OcppMessageInspector message={selected} />
        </div>
      </div>
    </div>
  );
}
