"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import {
  ArrowRightLeft,
  Check,
  Copy,
  FileJson,
  Info,
  Link2,
  Layers,
  Braces,
} from "lucide-react";
import { OCPP_FIELD_DESCRIPTIONS } from "@/types";
import { OcppJsonViewer } from "@/components/ocpp/OcppJsonViewer";
import type { OcppMessage } from "@/types";

type InspectorTab = "overview" | "payload" | "wire";

interface OcppMessageInspectorProps {
  message: OcppMessage | null;
  relatedMessages?: OcppMessage[];
  onSelectRelated?: (message: OcppMessage) => void;
}

export function OcppMessageInspector({
  message,
  relatedMessages = [],
  onSelectRelated,
}: OcppMessageInspectorProps) {
  const [copied, setCopied] = useState<"json" | "wire" | null>(null);
  const [tab, setTab] = useState<InspectorTab>("overview");

  const payloadJson = useMemo(
    () => (message ? JSON.stringify(message.payload, null, 2) : ""),
    [message]
  );

  const wireFrame = useMemo(() => {
    if (!message) return null;
    const messageTypeId = message.messageType === "Request" ? 2 : message.messageType === "Response" ? 3 : 4;
    return [messageTypeId, message.correlationId ?? message.id, message.action, message.payload];
  }, [message]);

  const wireFormat = useMemo(
    () => (wireFrame ? JSON.stringify(wireFrame, null, 2) : ""),
    [wireFrame]
  );

  if (!message) {
    return (
      <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-matlab border border-dashed border-border bg-gradient-to-b from-white to-surface-raised/80 p-8 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-white shadow-card">
          <FileJson className="h-6 w-6 text-matlab-blue" />
        </div>
        <p className="text-base font-semibold text-ink">No message selected</p>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
          Pick a message from the command window or traffic timeline. Use ↑ ↓ keys to step through entries.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2 text-[11px] text-muted">
          <kbd className="rounded border border-border bg-white px-2 py-1 font-mono shadow-matlab-btn">↑</kbd>
          <kbd className="rounded border border-border bg-white px-2 py-1 font-mono shadow-matlab-btn">↓</kbd>
          <span>Navigate</span>
          <span className="text-border">·</span>
          <kbd className="rounded border border-border bg-white px-2 py-1 font-mono shadow-matlab-btn">Esc</kbd>
          <span>Clear selection</span>
        </div>
      </div>
    );
  }

  const description = OCPP_FIELD_DESCRIPTIONS[message.action];
  const isCpToCsms = message.direction === "CP_TO_CSMS";
  const payloadEntries = Object.entries(message.payload);

  async function copyText(text: string, kind: "json" | "wire") {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-matlab border border-border bg-white shadow-card">
      <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border bg-gradient-to-r from-title-bar to-white px-4 py-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Message Inspector</p>
          <h3 className="truncate font-mono text-base font-semibold text-ink">{message.action}</h3>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => copyText(payloadJson, "json")}
            className="inline-flex items-center gap-1.5 rounded-matlab border border-border bg-white px-2.5 py-1.5 text-xs font-medium text-ink shadow-matlab-btn transition-all hover:border-matlab-blue/40 hover:shadow-card-hover active:shadow-inset"
          >
            {copied === "json" ? (
              <Check className="h-3.5 w-3.5 text-matlab-green" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            {copied === "json" ? "Copied" : "Copy JSON"}
          </button>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap gap-2 border-b border-border-subtle bg-surface-raised/70 px-4 py-3">
        <MetaChip
          icon={ArrowRightLeft}
          label={isCpToCsms ? "Charge Point → CSMS" : "CSMS → Charge Point"}
          tone={isCpToCsms ? "green" : "cyan"}
        />
        <MetaChip label={message.messageType} />
        <MetaChip label={message.chargerId} mono />
        <MetaChip label={new Date(message.timestamp).toLocaleString()} mono />
        {message.correlationId && <MetaChip icon={Link2} label={`ID ${message.correlationId.slice(0, 8)}…`} mono />}
      </div>

      <div className="flex shrink-0 gap-1 border-b border-border bg-white px-3 pt-2">
        {(
          [
            { id: "overview", label: "Overview", icon: Layers },
            { id: "payload", label: "Payload", icon: Braces },
            { id: "wire", label: "Wire format", icon: FileJson },
          ] as const
        ).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={clsx(
              "inline-flex items-center gap-1.5 rounded-t-matlab px-3 py-2 text-xs font-medium transition-colors",
              tab === id
                ? "-mb-px border border-b-white border-border bg-white text-matlab-blue"
                : "text-muted hover:bg-surface-raised/80 hover:text-ink"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-auto bg-[#fafafa]">
        {tab === "overview" && (
          <div className="space-y-4 p-4">
            {description && (
              <div className="flex items-start gap-2 rounded-matlab border border-matlab-blue/20 bg-matlab-blue/[0.05] px-3 py-3">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-matlab-blue" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-matlab-blue">Protocol note</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{description}</p>
                </div>
              </div>
            )}

            {payloadEntries.length > 0 ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {payloadEntries.map(([key, value]) => (
                  <div
                    key={key}
                    className="rounded-matlab border border-border bg-white px-3 py-2.5 shadow-sm"
                  >
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-wide text-muted">{key}</p>
                    <p className="mt-1 break-all font-mono text-[12px] text-ink">
                      {typeof value === "object" ? JSON.stringify(value) : String(value)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">This message has an empty payload object.</p>
            )}

            {relatedMessages.length > 0 && onSelectRelated && (
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted">
                  Related messages
                </p>
                <div className="space-y-1.5">
                  {relatedMessages.map((related) => (
                    <button
                      key={related.id}
                      type="button"
                      onClick={() => onSelectRelated(related)}
                      className="flex w-full items-center justify-between gap-3 rounded-matlab border border-border bg-white px-3 py-2 text-left text-xs transition-colors hover:border-matlab-blue/40 hover:bg-matlab-blue/[0.04]"
                    >
                      <span className="truncate font-mono font-semibold text-ink">{related.action}</span>
                      <span className="shrink-0 text-muted">{related.messageType}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "payload" && (
          <div className="p-4">
            <OcppJsonViewer value={message.payload} />
          </div>
        )}

        {tab === "wire" && (
          <div className="space-y-3 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs text-muted">
                OCPP-J array frame: [MessageTypeId, UniqueId, Action, Payload]
              </p>
              <button
                type="button"
                onClick={() => copyText(wireFormat, "wire")}
                className="inline-flex items-center gap-1 rounded-matlab border border-border bg-white px-2 py-1 text-[11px] font-medium text-ink shadow-matlab-btn hover:shadow-card-hover"
              >
                {copied === "wire" ? (
                  <Check className="h-3 w-3 text-matlab-green" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
                Copy frame
              </button>
            </div>
            {wireFrame && <OcppJsonViewer value={wireFrame} />}
          </div>
        )}
      </div>
    </div>
  );
}

function MetaChip({
  label,
  icon: Icon,
  mono = false,
  tone,
}: {
  label: string;
  icon?: typeof ArrowRightLeft;
  mono?: boolean;
  tone?: "green" | "cyan";
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-matlab px-2.5 py-1 text-xs font-medium border border-border-subtle bg-white",
        mono && "font-mono",
        tone === "green" && "text-matlab-green bg-matlab-green/10 border-matlab-green/20",
        tone === "cyan" && "text-[#0088b8] bg-matlab-cyan/10 border-matlab-cyan/20",
        !tone && "text-muted"
      )}
    >
      {Icon && <Icon className="h-3 w-3" />}
      {label}
    </span>
  );
}
