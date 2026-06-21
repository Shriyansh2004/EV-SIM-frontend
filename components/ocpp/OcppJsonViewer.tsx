"use client";

import { useMemo, type ReactNode } from "react";

interface OcppJsonViewerProps {
  value: unknown;
  className?: string;
}

export function OcppJsonViewer({ value, className }: OcppJsonViewerProps) {
  const formatted = useMemo(() => JSON.stringify(value, null, 2), [value]);
  const lines = formatted.split("\n");

  return (
    <div className={className}>
      <div className="overflow-auto rounded-matlab border border-border bg-[#1e1e1e]">
        <div className="flex min-w-0">
          <div className="select-none border-r border-white/10 bg-[#252526] px-3 py-3 text-right font-mono text-[11px] leading-relaxed text-white/30">
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <pre className="min-w-0 flex-1 overflow-x-auto p-3 font-mono text-[12px] leading-relaxed">
            <code>{highlightJson(formatted)}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

function highlightJson(json: string) {
  const tokenPattern =
    /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g;

  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenPattern.exec(json)) !== null) {
    if (match.index > lastIndex) {
      parts.push(json.slice(lastIndex, match.index));
    }

    const [token, quoted, colon] = match;
    if (quoted && colon) {
      parts.push(
        <span key={match.index} className="text-[#9cdcfe]">
          {quoted}
        </span>,
        colon
      );
    } else if (quoted) {
      parts.push(
        <span key={match.index} className="text-[#ce9178]">
          {quoted}
        </span>
      );
    } else if (token === "true" || token === "false") {
      parts.push(
        <span key={match.index} className="text-[#569cd6]">
          {token}
        </span>
      );
    } else if (token === "null") {
      parts.push(
        <span key={match.index} className="text-[#569cd6]">
          {token}
        </span>
      );
    } else {
      parts.push(
        <span key={match.index} className="text-[#b5cea8]">
          {token}
        </span>
      );
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < json.length) {
    parts.push(json.slice(lastIndex));
  }

  return parts;
}
