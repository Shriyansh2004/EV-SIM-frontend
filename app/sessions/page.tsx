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
      <header>
        <h1 className="page-title">Session Monitor</h1>
        <p className="page-desc">Track all charging sessions and meter value history</p>
      </header>

      <EnergyBarChart sessions={sessions} />
      <SessionTable sessions={sessions} onSelect={setSelected} />

      {selected && (
        <SessionDetailModal session={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
