"use client";

import { useState } from "react";
import { useAppStore } from "@/store";
import { SessionTable } from "@/components/sessions/SessionTable";
import { SessionDetailModal } from "@/components/sessions/SessionDetailModal";
import { EnergyBarChart } from "@/components/charts/EnergyBarChart";
import type { Session } from "@/types";

export default function SessionsPage() {
  const sessions = useAppStore((s) => s.sessions);
  const [selected, setSelected] = useState<Session | null>(null);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Session Monitor</h1>
        <p className="text-muted mt-1">Track all charging sessions and meter value history</p>
      </div>

      <EnergyBarChart sessions={sessions} />
      <SessionTable sessions={sessions} onSelect={setSelected} />

      {selected && (
        <SessionDetailModal session={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
