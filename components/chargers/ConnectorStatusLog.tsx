"use client";

import { useEffect, useRef } from "react";
import { OcppMessageCard } from "@/components/ocpp/OcppMessageCard";
import type { OcppMessage } from "@/types";

interface ConnectorStatusLogProps {
  messages: OcppMessage[];
  limit?: number;
}

export function ConnectorStatusLog({ messages, limit = 15 }: ConnectorStatusLogProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const visible = messages.slice(-limit);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visible.length]);

  return (
    <div className="matlab-cmd h-48">
      <div className="space-y-1.5">
        {visible.length === 0 ? (
          <p className="text-muted text-xs text-center py-8 font-mono">
            No status messages for this connector yet
          </p>
        ) : (
          visible.map((message) => <OcppMessageCard key={message.id} message={message} />)
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
