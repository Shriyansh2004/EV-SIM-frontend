"use client";

import { useEffect, useRef } from "react";
import { OcppMessageCard } from "./OcppMessageCard";
import type { OcppMessage } from "@/types";

interface OcppMessageLogProps {
  messages: OcppMessage[];
  chargerId?: string;
  limit?: number;
}

export function OcppMessageLog({ messages, chargerId, limit = 10 }: OcppMessageLogProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const filtered = messages
    .filter((m) => !chargerId || m.chargerId === chargerId)
    .slice(-limit);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [filtered.length]);

  return (
    <div className="bg-background border border-border-subtle rounded-md p-3 h-64 overflow-y-auto font-mono text-[13px]">
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <p className="text-muted text-sm text-center py-10">No OCPP messages yet</p>
        ) : (
          filtered.map((m) => <OcppMessageCard key={m.id} message={m} />)
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
