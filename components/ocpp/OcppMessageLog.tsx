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
    <div className="matlab-cmd h-64">
      <div className="space-y-1.5">
        {filtered.length === 0 ? (
          <p className="text-muted text-sm text-center py-10 font-sans">No OCPP messages yet</p>
        ) : (
          filtered.map((m) => <OcppMessageCard key={m.id} message={m} />)
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
